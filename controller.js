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
const chatBox = document.getElementById("chatBox");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const statusMessage = document.getElementById("statusMessage");
const notification = document.getElementById("notification");
const connectBtn = document.getElementById("connectBtn");

// Authentication state observer
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        const userName = user.displayName || user.email.split('@')[0];
        usernamePlaceholder.textContent = userName;

        // If the user is admin, show the notification for support request
        if (user.email === 'admin@gmail.com') {
            notification.style.display = 'block';
        }

        // Check the user's support status in the database
        const supportStatusRef = database.ref('supportStatus');
        supportStatusRef.on('value', snapshot => {
            const supportStatus = snapshot.val();
            if (supportStatus && supportStatus.userEmail === user.email) {
                // Show chat if it's the correct user or admin
                chatBox.style.display = 'flex';
                statusMessage.textContent = "Getting support...";
            } else if (supportStatus && supportStatus.isChatActive) {
                // Admin can see the chat if it's active
                chatBox.style.display = 'flex';
            } else {
                // Hide the chat if not the admin or the user needing support
                chatBox.style.display = 'none';
            }
        });
    } else {
        usernamePlaceholder.textContent = "Not logged in";
    }
});

// Open the chat box when the user clicks the chat bubble
document.getElementById("chatBubble").addEventListener("click", () => {
    chatBox.style.display = 'flex';
});

// Close the chat box when the user clicks the close button
document.getElementById("closeChat").addEventListener("click", () => {
    chatBox.style.display = 'none';
});

// Send a message when the send button is clicked
sendBtn.addEventListener("click", () => {
    const message = chatInput.value;
    if (message) {
        // Show "Getting support..." when the user sends a message
        statusMessage.textContent = "Getting support...";
        chatInput.value = '';

        // Update the Firebase database with the current support status
        const supportStatusRef = database.ref('supportStatus');
        supportStatusRef.set({
            userEmail: firebase.auth().currentUser.email,
            isChatActive: false // Not active yet for admin connection
        });
    }
});

// Admin connects to the user
connectBtn.addEventListener("click", () => {
    statusMessage.textContent = "Connected"; // Change status to "Connected"
    notification.style.display = 'none'; // Hide admin notification
    const supportStatusRef = database.ref('supportStatus');
    supportStatusRef.set({
        isChatActive: true,
        userEmail: 'supportUser@example.com' // This will be dynamic
    });
});

// Handle authentication
auth.signInAnonymously().catch(console.error);
