import app.reitan.hyttebok.DBService
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import org.jetbrains.exposed.sql.Database


fun main() {
    Database.connect(System.getenv("JDBC_DATABASE_URL"), driver = "org.postgresql.Driver")

    runBlocking {
        launch {
            for (trip in DBService().getAllTrips().take(1)) {
                val text = Regex("""http://MEDIA_URL(.+?)\)]\(http://MEDIA_URL(.+?)\)""")
                    .replace(trip.text) { matchResult ->
                        val mediaUrl = matchResult.groups[2]?.value ?: throw RuntimeException("Missing match")
                        "${Graph.getThumbUrl(mediaUrl)})](${Graph.getOriginalUrl(mediaUrl)})"
                    }
                    .also { println(it) }
                val photosPath = trip.photos.replace("/var/ftp/website/hyttebok/app/media/", "")
                val photoUrls = Graph.getAllPhotosUrls(photosPath)
            }
        }
    }
}