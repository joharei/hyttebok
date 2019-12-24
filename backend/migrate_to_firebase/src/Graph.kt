import com.microsoft.graph.logger.DefaultLogger
import com.microsoft.graph.logger.LoggerLevel
import com.microsoft.graph.models.extensions.IGraphServiceClient
import com.microsoft.graph.requests.extensions.GraphServiceClient
import java.util.*

object Graph {
    private var graphClient: IGraphServiceClient = GraphServiceClient.builder()
        .authenticationProvider(SimpleAuthProvider())
        .logger(DefaultLogger().apply { loggingLevel = LoggerLevel.ERROR })
        .buildClient()

    fun getThumbUrl(path: String): String {
        return graphClient
            .me()
            .drive()
            .root()
            .itemWithPath("hyttebok/$path")
            .buildRequest()
            .expand("thumbnails")
            .get()
            .thumbnails
            .currentPage
            .first()
            .large
            .url
    }

    fun getOriginalUrl(path: String): String {
        val sharingUrl = graphClient
            .me()
            .drive()
            .root()
            .itemWithPath("hyttebok/$path")
            .createLink("embed", "anonymous")
            .buildRequest()
            .post()
            .link
            .webUrl

        val base64Value = Base64.getEncoder().encode(sharingUrl.toByteArray()).toString(Charsets.UTF_8)
            .trimEnd('=')
            .replace('/','_')
            .replace('+','-')

        return "https://api.onedrive.com/v1.0/shares/u!$base64Value/root/content"
    }
}