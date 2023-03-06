package firebase

import kotlin.js.Promise

@JsModule("firebase/auth")
@JsNonModule
external object FirebaseAuth {
    interface Auth {
        fun useDeviceLanguage()
    }

    interface UserCredential

    class OAuthProvider(provider: String)

    fun getAuth(): Auth

    fun connectAuthEmulator(auth: Auth, url: String)
    fun signInWithRedirect(auth: Auth, provider: OAuthProvider): Promise<Nothing>
    fun signOut(auth: Auth): Promise<Unit>
    fun getRedirectResult(auth: Auth): Promise<UserCredential?>

    interface ParsedToken {
        val admin: Boolean?
    }
    interface IdTokenResult {
        val claims: ParsedToken
    }
    interface User {
        fun getIdTokenResult(forceRefresh: Boolean = definedExternally): Promise<IdTokenResult>
    }
    fun onAuthStateChanged(auth: Auth, nextOrObserver: (User?) -> Unit): () -> Unit
}