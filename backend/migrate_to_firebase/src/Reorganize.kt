import com.google.auth.oauth2.GoogleCredentials
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
            val doc = it.get().get()
            batch.set(
                db.collection("tripTexts").document(doc.id),
                mapOf("text" to doc.get("text"))
            )
            batch.set(
                db.collection("tripPhotos").document(doc.id),
                mapOf("photos" to doc.get("photos"))
            )

            batch.update(it, mapOf("text" to null, "photos" to null))
        }

    batch.commit().get()
}