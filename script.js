// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAHSW4ettEHj3Y562zYSI_n0Z1OwFaGsgw",
    authDomain: "login-71866.firebaseapp.com",
    databaseURL: "https://login-71866-default-rtdb.firebaseio.com",
    projectId: "login-71866",
    storageBucket: "login-71866.appspot.com",
    messagingSenderId: "434042354282",
    appId: "1:434042354282:web:fbc98eaefe2ef6513a2813"
};

// Initialize Firebase app
firebase.initializeApp(firebaseConfig);

// Get references to Firebase services
const database = firebase.database();
const auth = firebase.auth();
const messagesRef = database.ref('messages');

// DOM elements
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const chatWindow = document.getElementById('chat-window');
const username = document.getElementById('username');
const logoutBtn = document.getElementById('logout-btn');

const ADMIN_EMAIL = "admin@gmail.com";
let currentUserEmail = "";

// Firebase Authentication - On Auth State Changed
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is logged in, update banner with full email and use username for messages
        currentUserEmail = user.email;
        username.innerText = currentUserEmail; // Display full email in the banner
    } else {
        // Redirect to main.html if not logged in
        window.location.href = 'main.html';
    }
});

// Add new message to Firebase with the sender's email
sendBtn.addEventListener('click', () => {
    const message = messageInput.value;
    if (message.trim() !== "" && currentUserEmail !== "") {
        const displayEmail = currentUserEmail.split('@')[0]; // Use only username part
        messagesRef.push({ message, email: displayEmail });
        messageInput.value = ''; // Clear input
    }
});

// Display messages from Firebase in real-time
messagesRef.on('child_added', (snapshot) => {
    const data = snapshot.val();
    const message = data.message;
    const email = data.email;
    displayMessage(message, email);
});

// Function to display a new message with sender's email
function displayMessage(message, email) {
    const messageElem = document.createElement('div');
    messageElem.classList.add('message');
    
    // Determine if the message is sent or received
    const isSent = email === currentUserEmail.split('@')[0];
    const isAdmin = email === ADMIN_EMAIL.split('@')[0];
    
    messageElem.innerHTML = `
        <strong>${email}:</strong> ${message}
        ${isAdmin ? '<span class="official">(Official)</span>' : ''}
    `;
    messageElem.classList.add(isSent ? 'sent' : 'received');
    chatWindow.appendChild(messageElem);
    chatWindow.scrollTop = chatWindow.scrollHeight; // Scroll to the bottom
}

// Toggle dropdown menu when clicking the username
username.addEventListener('click', () => {
    const userMenu = username.parentElement;
    userMenu.classList.toggle('active');
});

// Redirect to main.html on logout
logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        window.location.href = 'main.html';
    }).catch((error) => {
        console.error('Logout error:', error);
    });
});

// Simulate blur effect on chat window
function applyBlurEffect() {
    chatWindow.classList.add('blurred');
}

function removeBlurEffect() {
    chatWindow.classList.remove('blurred');
}

// Apply blur effect when window loses focus
window.addEventListener('blur', applyBlurEffect);
window.addEventListener('focus', removeBlurEffect);
