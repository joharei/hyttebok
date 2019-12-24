import com.microsoft.graph.logger.DefaultLogger
import com.microsoft.graph.logger.LoggerLevel
import com.microsoft.graph.models.extensions.DriveItem
import com.microsoft.graph.models.extensions.IGraphServiceClient
import com.microsoft.graph.requests.extensions.GraphServiceClient
import com.microsoft.graph.requests.extensions.IDriveItemCollectionPage
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

    private val originalUrlCache = mutableMapOf<String, String>()

    fun getOriginalUrl(path: String): String {
        if (path in originalUrlCache) return originalUrlCache.getValue(path)

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
            .replace('/', '_')
            .replace('+', '-')

        return "https://api.onedrive.com/v1.0/shares/u!$base64Value/root/content"
            .also { originalUrlCache[path] = it }
    }

    data class AllPhotosUrls(val thumbUrl: String, val originalUrl: String)

    fun getAllPhotosUrls(path: String): List<AllPhotosUrls> {
        return graphClient
            .me()
            .drive()
            .root()
            .itemWithPath("hyttebok/$path")
            .children()
            .buildRequest()
            .expand("thumbnails")
            .get()
            .let { concatThumbsFromPages(it) }
            .map { AllPhotosUrls(it.thumbnails.currentPage.first().large.url, getOriginalUrl("$path/${it.name}")) }
    }

    private fun concatThumbsFromPages(page: IDriveItemCollectionPage): List<DriveItem> {
        if (page.currentPage.isEmpty()) return emptyList()
        if (page.nextPage == null) return page.currentPage

        return page.currentPage + concatThumbsFromPages(page.nextPage.buildRequest().expand("thumbnails").get())
    }
}