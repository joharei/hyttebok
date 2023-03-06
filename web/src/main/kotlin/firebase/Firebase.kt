package firebase

@JsModule("firebase/app")
@JsNonModule
external object FirebaseApp {
    fun initializeApp(config: Any?)
}

