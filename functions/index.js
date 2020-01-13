const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();

// On sign up.
exports.processSignUp = functions
  .region("europe-west1")
  .auth.user().onCreate((user) => {
    return admin.firestore()
      .collection("admins")
      .where("email", "==", user.email)
      .limit(1)
      .get()
      .then(snapshot => {
        // Check if user meets role criteria.
        if (user.email &&
          user.emailVerified &&
          !snapshot.empty) {
          const customClaims = {
            admin: true
          };
          // Set custom user claims on this newly created user.
          return admin.auth().setCustomUserClaims(user.uid, customClaims)
            .then(() => {
              console.log(`Successfully set admin claims for ${user.email}. Notifying client.`);
              // Update real-time database to notify client to force refresh.
              const metadataRef = admin.firestore().doc(`metadata/${user.uid}`);
              // Set the refresh time to the current UTC timestamp.
              // This will be captured on the client to force a token refresh.
              return metadataRef.set({ refreshTime: admin.firestore.Timestamp.now() });
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          console.log(`User doesn't meet criteria: ${user.email}`);
          return admin.auth().deleteUser(user.uid)
            .catch(error => {
              console.log(error);
            });
        }
      })
      .catch(error => {
        console.log(error);
      });
  });
