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

// Get DOM elements
const notification = document.getElementById("notification");
const connectBtn = document.getElementById("connectBtn");
const chatBox = document.getElementById("chatBox");
const messagesContainer = document.getElementById("messages");
const userMessageInput = document.getElementById("userMessage");
const sendMessageBtn = document.getElementById("sendMessage");

// Check if user is authenticated
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        // User is logged in, handle the user logic
        const userName = user.displayName || user.email.split('@')[0]; // Get the user name

        // If the user is not admin and sends a message, request support
        if (user.email !== 'admin@gmail.com') {
            sendSupportRequest(user.email);
        }
    } else {
        console.log("User not logged in");
    }
});

// Function to send a support request
function sendSupportRequest(userEmail) {
    const supportStatusRef = database.ref('supportStatus');
    supportStatusRef.set({
        isChatActive: false,
        userEmail: userEmail,
    });

    // Show the notification to the admin
    notification.style.display = 'block';
}

// Handle the "Connect" button click
connectBtn.addEventListener('click', () => {
    const supportStatusRef = database.ref('supportStatus');
    supportStatusRef.update({
        isChatActive: true,
    });

    // Hide the notification
    notification.style.display = 'none';

    // Show the chat box
    chatBox.style.display = 'block';

    // Load the previous chat messages (if any)
    loadMessages();
});

// Handle sending messages in the chat
sendMessageBtn.addEventListener('click', () => {
    const messageText = userMessageInput.value.trim();

    if (messageText === "") return; // Do not send empty messages

    const messageRef = database.ref('messages').push();
    messageRef.set({
        sender: 'user', // Change to 'admin' for admin messages
        text: messageText,
        timestamp: Date.now(),
    });

    // Clear the input field
    userMessageInput.value = "";

    // Load the updated messages
    loadMessages();
});

// Load the messages from Firebase
function loadMessages() {
    const messagesRef = database.ref('messages');
    messagesRef.on('value', snapshot => {
        const messages = snapshot.val();
        messagesContainer.innerHTML = ""; // Clear previous messages

        for (let messageId in messages) {
            const message = messages[messageId];
            const messageElement = document.createElement('p');
            messageElement.textContent = `${message.sender}: ${message.text}`;
            messagesContainer.appendChild(messageElement);
        }
    });
}

// Handle the end of the chat (Admin's control)
function endChat() {
    const supportStatusRef = database.ref('supportStatus');
    supportStatusRef.update({
        isChatActive: false,
    });

    // Hide the chat box
    chatBox.style.display = 'none';
}
