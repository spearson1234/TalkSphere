// Firebase configuration and initialization
const firebaseConfig = {
     apiKey: "AIzaSyAHSW4ettEHj3Y562zYSI_n0Z1OwFaGsgw",
    authDomain: "login-71866.firebaseapp.com",
    databaseURL: "https://login-71866-default-rtdb.firebaseio.com",
    projectId: "login-71866",
    storageBucket: "login-71866.appspot.com",
    messagingSenderId: "434042354282",
    appId: "1:434042354282:web:fbc98eaefe2ef6513a2813"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// Elements
const usernamePlaceholder = document.getElementById("username-placeholder");

// Auth state observer
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        // If the user is signed in, display the username
        const userName = user.displayName || user.email.split('@')[0];  // Display name or email prefix
        usernamePlaceholder.textContent = userName;

        // Store user data in the Realtime Database (if it's the first time)
        const userRef = database.ref('users/' + user.uid);
        userRef.once('value', snapshot => {
            if (!snapshot.exists()) {
                userRef.set({
                    username: userName,
                    email: user.email
                });
            }
        });
    } else {
        // If not signed in, show "Not logged in"
        usernamePlaceholder.textContent = "Not logged in";
    }
});
