const firebaseConfig = {
  // Your Firebase configuration here
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
const userEmailDisplay = document.getElementById('user-email');

// Handle user authentication
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in, display email
    userEmailDisplay.textContent = user.email;
    sendButton.disabled = false; // Enable send button
  } else {
    // User is signed out, clear email display and disable button
    userEmailDisplay.textContent = "";
    sendButton.disabled = true;
  }
});

sendButton.addEventListener('click', () => {
  const message = messageInput.value.trim();
  if (message) {
    const senderEmail = userEmailDisplay.textContent;
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
  messageElement.innerHTML = `<span class="sender-name">${messageData.sender}:</span> ${messageData.text}`;
  messagesDiv.appendChild(messageElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});
