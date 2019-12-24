import app.reitan.hyttebok.DBService
import com.google.auth.oauth2.GoogleCredentials
import com.google.cloud.Timestamp
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.google.firebase.cloud.FirestoreClient
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import org.jetbrains.exposed.sql.Database


fun main() {
    Database.connect(System.getenv("JDBC_DATABASE_URL"), driver = "org.postgresql.Driver")

    FirebaseApp.initializeApp(
        FirebaseOptions.Builder()
            .setCredentials(GoogleCredentials.getApplicationDefault())
            .build()
    )

    val db = FirestoreClient.getFirestore()

    runBlocking {
        launch {
            val batch = db.batch()
            for (trip in db.collection("trips").listDocuments()) {
                batch.delete(trip)
            }

            val allTrips = DBService().getAllTrips().withIndex()
            for ((index, trip) in allTrips) {
                println("Migrating ${index + 1}/${allTrips.count()}: ${trip.title}...")

                val text = Regex("""http://MEDIA_URL(.+?)\)]\(http://MEDIA_URL(.+?)\)""")
                    .replace(trip.text) { matchResult ->
                        val mediaUrl = matchResult.groups[2]?.value ?: throw RuntimeException("Missing match")
                        "${Graph.getThumbUrl(mediaUrl)})](${Graph.getOriginalUrl(mediaUrl)})"
                    }
                val photosPath = trip.photos.replace("/var/ftp/website/hyttebok/app/media/", "")
                val photoUrls = Graph.getAllPhotosUrls(photosPath)

                val document = db.collection("trips").document()
                batch.set(
                    document,
                    mapOf(
                        "title" to trip.title,
                        "slug" to trip.slug,
                        "text" to text,
                        "startDate" to Timestamp.of(trip.startDate.toDate()),
                        "endDate" to Timestamp.of(trip.endDate.toDate()),
                        "photos" to photoUrls.map { mapOf("thumbUrl" to it.thumbUrl, "originalUrl" to it.originalUrl) }
                    )
                )

                println("Done")
            }

            batch.commit().get()

            println("Done with all")
        }
    }
}