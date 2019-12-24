import com.microsoft.aad.msal4j.*
import com.microsoft.graph.authentication.IAuthenticationProvider
import com.microsoft.graph.http.IHttpRequest
import java.io.File
import java.io.IOException
import java.util.*
import java.util.function.Consumer

private val oAuthProperties = Properties().apply {
    try {
        load(Class.forName("MainKt").getResourceAsStream("oAuth.properties"))
    } catch (e: IOException) {
        throw RuntimeException("Unable to read OAuth configuration. Make sure you have a properly formatted oAuth.properties file. See README for details.")
    }
}
private val appId = oAuthProperties.getProperty("app.id")
private val appScopes = oAuthProperties.getProperty("app.scopes").split(",").toSet()
private const val authority = "https://login.microsoftonline.com/common/"

fun getUserAccessToken(): String {
    val app = PublicClientApplication.builder(appId)
        .authority(authority)
        .setTokenCacheAccessAspect(TokenPersistence())
        .build()

    val accounts = app.accounts.join()
    val token = if (accounts.isEmpty()) {
        acquireTokenInteractive(app)
    } else {
        app.acquireTokenSilently(
            SilentParameters.builder(appScopes, app.accounts.join().first())
                .forceRefresh(true)
                .build()
        ).exceptionally {
            acquireTokenInteractive(app)
        }.join()
    }

    return token.accessToken()
}

private fun acquireTokenInteractive(app: PublicClientApplication): IAuthenticationResult {
    // Create consumer to receive the DeviceCode object
    // This method gets executed during the flow and provides
    // the URL the user logs into and the device code to enter
    val deviceCodeConsumer =
        Consumer { deviceCode: DeviceCode ->
            // Print the login information to the console
            println(deviceCode.message())
        }
    // Request a token, passing the requested permission scopes
    return app.acquireToken(
        DeviceCodeFlowParameters
            .builder(appScopes, deviceCodeConsumer)
            .build()
    ).exceptionally { ex: Throwable ->
        throw RuntimeException("Unable to authenticate", ex)
    }.join()
}

class SimpleAuthProvider : IAuthenticationProvider {
    override fun authenticateRequest(request: IHttpRequest) {
        request.addHeader("Authorization", "Bearer ${getUserAccessToken()}")
    }
}

class TokenPersistence : ITokenCacheAccessAspect {
    override fun beforeCacheAccess(iTokenCacheAccessContext: ITokenCacheAccessContext) {
        iTokenCacheAccessContext.tokenCache().deserialize(File("tokenCache").let {
            if (it.isFile) it.readText() else return
        })
    }

    override fun afterCacheAccess(iTokenCacheAccessContext: ITokenCacheAccessContext) {
        File("tokenCache").writeText(iTokenCacheAccessContext.tokenCache().serialize())
    }
}