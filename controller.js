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

        // After sending a message, clear the input field
        chatInput.value = '';
    }
});

// Admin connects to the user
connectBtn.addEventListener("click", () => {
    statusMessage.textContent = "Connected"; // Change status to "Connected"
    notification.style.display = 'none'; // Hide the notification
});
