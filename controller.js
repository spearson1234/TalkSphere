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
const database = firebase.database();
const messagesRef = database.ref('messages');

// DOM Elements
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const messagesDiv = document.querySelector('.chat-messages');
const userEmailDisplay = document.getElementById('user-email');

// Handle user authentication
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    userEmailDisplay.textContent = user.email;
    sendButton.disabled = false; // Enable send button
  } else {
    userEmailDisplay.textContent = "Please sign in";
    sendButton.disabled = true;
  }
});

// Send message function
const sendMessage = () => {
  const message = messageInput.value.trim();
  if (message && firebase.auth().currentUser) {
    const senderEmail = firebase.auth().currentUser.email;
    messagesRef.push({
      text: message,
      sender: senderEmail
    });
    messageInput.value = ''; // Clear the input box
  }
};

// Send message on button click or Enter key
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

// Display messages in real-time
messagesRef.on('child_added', (snapshot) => {
  const messageData = snapshot.val();
  const messageElement = document.createElement('div');
  messageElement.classList.add('chat-message', 'message-bubble');

  // Check if the message is from the current user for alignment
  if (messageData.sender === userEmailDisplay.textContent) {
    messageElement.classList.add('my-message'); // Right-align
  } else {
    messageElement.classList.add('other-message'); // Left-align
  }

  messageElement.innerHTML = `<span class="sender-name">${messageData.sender}:</span> ${messageData.text}`;
  messagesDiv.appendChild(messageElement);

  // Scroll to the bottom
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});
