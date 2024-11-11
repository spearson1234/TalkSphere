const firebaseConfig = {
  // Your Firebase configuration (replace with your own)
  apiKey: "AIzaSyAHSW4ettEHj3Y562zYSI_n0Z1OwFaGsgw",
  authDomain: "login-71866.firebaseapp.com",
  databaseURL: "https://login-71866-default-rtdb.firebaseio.com",
  projectId: "login-71866",
  storageBucket: "login-71866.appspot.com",
  messagingSenderId: "434042354282",
  appId: "1:434042354282:web:fbc98eaefe2ef6513a2813"
};

firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const messagesRef = database.ref('messages');

const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const messagesDiv = document.querySelector('.chat-messages');
const userDisplay = document.getElementById('user-email'); // Assuming this element exists

// Handle user authentication (replace with your actual logic)
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is logged in
    userDisplay.textContent = user.email; // Update email display
    sendButton.disabled = false; // Enable send button
  } else {
    // User is not logged in
    userDisplay.textContent = ""; // Clear email display
    sendButton.disabled = true; // Disable send button
  }
});

sendButton.addEventListener('click', () => {
  const message = messageInput.value.trim();
  if (message) {
    const senderEmail = userDisplay.textContent; // Get email from display
    messagesRef.push({
      text: message,
      sender: senderEmail
    });
    messageInput.value = '';
  }
});

messagesRef.on('child_added', (snapshot) => {
  const messageData = snapshot.val();
  const messageElement = document.createElement('div');
  messageElement.classList.add('chat-message');
  messageElement.innerHTML = `<strong>${messageData.sender}:</strong> ${messageData.text}`;
  messagesDiv.appendChild(messageElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});
