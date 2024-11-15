// Initialize Firebase
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id",
    measurementId: "your-measurement-id"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const storage = firebase.storage();
const db = firebase.firestore();

// Handle profile picture upload
function updateProfilePic() {
    const fileInput = document.getElementById("profile-pic-upload");
    const profilePic = document.getElementById("profile-pic");

    const file = fileInput.files[0];
    if (file) {
        const user = auth.currentUser;
        const storageRef = storage.ref(`profile_pics/${user.uid}`);

        // Upload the file to Firebase storage
        const uploadTask = storageRef.put(file);
        uploadTask.on('state_changed', 
            (snapshot) => {},
            (error) => { console.error(error); },
            () => {
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    profilePic.src = downloadURL;
                    // Update profile picture URL in Firestore
                    db.collection("users").doc(user.uid).update({ profilePic: downloadURL });
                });
            }
        );
    }
}

// Update the username in Firebase Firestore
function updateUsername() {
    const usernameInput = document.getElementById("username");
    const username = usernameInput.value;
    
    const user = auth.currentUser;
    db.collection("users").doc(user.uid).update({ username: username })
        .then(() => {
            console.log("Username updated!");
        })
        .catch((error) => {
            console.error("Error updating username: ", error);
        });
}

// Monitor the authentication state
auth.onAuthStateChanged(user => {
    if (user) {
        // If user is logged in, populate the profile data
        const usernameInput = document.getElementById("username");
        const profilePic = document.getElementById("profile-pic");

        db.collection("users").doc(user.uid).get().then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                usernameInput.value = userData.username || 'Username';
                profilePic.src = userData.profilePic || 'default-avatar.png';
            }
        });
    } else {
        // Redirect to login page if not logged in
        window.location.href = '/login.html';
    }
});

// Function to switch between pages (Home, Chat, Settings)
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.style.display = 'none'); // Hide all pages
    document.getElementById(pageId).style.display = 'block'; // Show selected page
}

// Initialize page to show 'home' on load
window.onload = function() {
    showPage('home'); // Show home page by default
};

// Function to update the app's theme (light/dark mode)
function updateTheme() {
    const themeSelect = document.getElementById("theme");
    const theme = themeSelect.value;
    document.body.className = theme;
}

// Function to toggle notifications
function toggleNotifications() {
    const notificationsCheckbox = document.getElementById("notifications");
    const notificationsEnabled = notificationsCheckbox.checked;
    console.log("Notifications enabled:", notificationsEnabled);
    // Handle enabling/disabling notifications (you can link it to your backend)
}
