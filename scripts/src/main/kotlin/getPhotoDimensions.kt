import com.google.auth.oauth2.GoogleCredentials
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.google.firebase.cloud.FirestoreClient
import io.ktor.client.HttpClient
import io.ktor.client.engine.okhttp.OkHttp
import io.ktor.client.features.json.JsonFeature
import io.ktor.client.features.json.serializer.KotlinxSerializer
import io.ktor.client.request.get
import io.ktor.client.request.url
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

@Serializable
data class Image(val width: Int, val height: Int)

@Serializable
data class File(val image: Image)

data class ImageDetails(val original: String, val thumbnail: String, val alt: String?, val title: String?)

fun main() {
    val client = HttpClient(OkHttp) {
        install(JsonFeature) {
            serializer = KotlinxSerializer(Json {
                ignoreUnknownKeys = true
            })
        }
    }

    val options = FirebaseOptions.Builder()
        .setCredentials(GoogleCredentials.getApplicationDefault())
        .setDatabaseUrl("https://hyttebok-1ac54.firebaseio.com")
        .build()
    FirebaseApp.initializeApp(options)

    val db = FirestoreClient.getFirestore()
    val batch = db.batch()

    db.collection("tripTexts")
        .get().get()
        .forEachIndexed { index, snapshot ->
            println("Processing trip ${snapshot.id} (no. ${index + 1})")

            val imageDetails =
                Regex("""\[\[?(?:!)\[([^]\[]*\[?[^]\[]*]?[^]\[]*)]\(([^\s]+?)(\s+(["'])(.*?)\4)?\)]\(([^ ]+?)(?: "(.+)")?\)""")
                    .findAll(snapshot["text"] as String)
                    .map { match ->
                        ImageDetails(
                            match.groups[6]!!.value,
                            match.groups[2]!!.value,
                            match.groups[1]?.value,
                            match.groups[5]?.value
                        )
                    }
                    .toList()

            println("No. of images: ${imageDetails.count()}")

            val dimensions = runBlocking {
                imageDetails
                    .map {
                        async {
                            client.get<File> {
                                url(it.original.replace("/content", "?\$select=image,file"))
                            }
                        }
                    }
                    .awaitAll()
            }

            val photos = imageDetails.zip(dimensions).associate { (details, dimensions) ->
                details.original to hashMapOf(
                    "thumbnail" to details.thumbnail,
                    "width" to dimensions.image.width,
                    "height" to dimensions.image.height
                ).also {
                    if (!details.alt.isNullOrBlank()) {
                        it["alt"] = details.alt
                    }
                    if (!details.title.isNullOrBlank()) {
                        it["title"] = details.title
                    }
                }
            }

            batch.set(
                db.collection("tripPhotos").document(snapshot.id),
                photos
            )

            println()
        }

    println("Finished processing. Committing to Firestore...")
    batch.commit().get()
    client.close()

    println("Done.")
}
