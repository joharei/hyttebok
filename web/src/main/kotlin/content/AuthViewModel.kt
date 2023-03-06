package content

import firebase.FirebaseAuth
import kotlinx.coroutines.await
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.*

class AuthViewModel {
    private val provider = FirebaseAuth.OAuthProvider("microsoft.com")

    fun signIn() {
        with(FirebaseAuth) {
            signInWithRedirect(getAuth(), provider)
        }
    }

    fun signOut() {
        with(FirebaseAuth) {
            signOut(getAuth())
        }
    }

    private val redirectHandler = flow {
        emit(Unit)
        val auth = FirebaseAuth.getAuth()
        FirebaseAuth.getRedirectResult(auth).await()
    }
        .catch {
            console.log(it)
        }

    private val authState = callbackFlow {
        val unsubscribe = FirebaseAuth.onAuthStateChanged(FirebaseAuth.getAuth()) {
            trySend(it)
        }
        awaitClose {
            unsubscribe()
        }
    }

    val loginState = combine(
        redirectHandler,
        authState,
    ) { _, user ->
        console.log("Auth state:", user)
        console.log(user?.getIdTokenResult()?.await()?.claims?.admin)
        user != null
    }
}