// Firebase configuration
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
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// Get DOM elements
const emailDisplay = document.getElementById('email-display');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatBox = document.getElementById('chat-box');

// Sign in a test user (you can replace this with a sign-in form in a real app)
auth.signInWithEmailAndPassword("testuser@gmail.com", "testpassword")
    .then(userCredential => {
        const user = userCredential.user;
        emailDisplay.textContent = user.email; // Display the user's email
    })
    .catch(error => {
        console.error("Error signing in:", error.message);
    });

// Listen for authentication state changes
auth.onAuthStateChanged(user => {
    if (user) {
        emailDisplay.textContent = user.email; // Display email when logged in
    } else {
        emailDisplay.textContent = "user@gmail.com"; // Placeholder if not logged in
    }
});

// Add message to the database on send
sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message) {
        db.ref('messages').push({
            user: auth.currentUser ? auth.currentUser.email : "Anonymous",
            message: message,
            timestamp: Date.now()
        });
        messageInput.value = ""; // Clear input
    }
});

// Display messages from the database in real-time
db.ref('messages').on('child_added', snapshot => {
    const msg = snapshot.val();
    const messageElement = document.createElement('div');
    messageElement.className = msg.user === auth.currentUser.email ? 'message user' : 'message bot';
    messageElement.textContent = `${msg.user}: ${msg.message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to bottom
});
