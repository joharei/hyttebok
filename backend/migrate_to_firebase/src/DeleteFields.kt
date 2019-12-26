import com.google.auth.oauth2.GoogleCredentials
import com.google.cloud.firestore.FieldValue
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.google.firebase.cloud.FirestoreClient

fun main() {
    FirebaseApp.initializeApp(
        FirebaseOptions.Builder()
            .setCredentials(GoogleCredentials.getApplicationDefault())
            .build()
    )

    val db = FirestoreClient.getFirestore()

    val batch = db.batch()

    db.collection("trips").listDocuments()
        .forEach {
            batch.update(it, mapOf("text" to FieldValue.delete(), "photos" to FieldValue.delete()))
        }

    batch.commit().get()
}