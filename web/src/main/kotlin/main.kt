import androidx.compose.runtime.*
import components.Layout
import content.Header
import firebase.FirebaseApp
import firebase.FirebaseAuth
import kotlinx.browser.window
import kotlinx.coroutines.await
import org.jetbrains.compose.web.css.Style
import org.jetbrains.compose.web.dom.Button
import org.jetbrains.compose.web.dom.Div
import org.jetbrains.compose.web.dom.Text
import org.jetbrains.compose.web.renderComposable
import style.AppStylesheet

fun main() {
    renderComposable(rootElementId = "root") {
        Style(AppStylesheet)

        var firebaseInitialized by remember { mutableStateOf(false) }
        LaunchedEffect(Unit) {
            runCatching {
                val config: dynamic = window.fetch("/__/firebase/init.json").await().json().await()
                console.log(config)
                FirebaseApp.initializeApp(config)
                val auth = FirebaseAuth.getAuth()
                auth.useDeviceLanguage()
//                val firestore = getFirestore()
                if (window.location.hostname == "localhost") {
                    FirebaseAuth.connectAuthEmulator(auth, "http://localhost:9099")
//                    connectFirestoreEmulator(firestore, '127.0.0.1', 8080)
                }
                firebaseInitialized = true
            }.onFailure {
                console.log("Init Firebase failed", it)
            }
        }
        if (firebaseInitialized) {
            Layout {
                Header()

                Body()
            }
        }
    }
}

@Composable
fun Body() {
    var counter by remember { mutableStateOf(0) }
    Div {
        Text("You Clicked: ${counter}")
    }
    Button(
        attrs = {
            onClick { _ ->
                counter++
            }
        }
    ) {
        Text("Click")
    }
}
