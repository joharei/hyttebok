import app.reitan.hyttebok.DBService
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import org.jetbrains.exposed.sql.Database


fun main() {
    Database.connect(System.getenv("JDBC_DATABASE_URL"), driver = "org.postgresql.Driver")

    runBlocking {
        launch {
            Regex("""http://MEDIA_URL(.+?)\)]\(http://MEDIA_URL(.+?)\)""")
                .replace(
                    DBService().getTrip("1-hostferie-2006").text
                ) { matchResult ->
                    val mediaUrl = matchResult.groups[2]?.value ?: throw RuntimeException("Missing match")
                    "${Graph.getThumbUrl(mediaUrl)})](${Graph.getOriginalUrl(mediaUrl)})"
                }
                .also { println(it) }
        }
    }
}