const firebaseConfig = {
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

sendButton.addEventListener('click', () => {
  const message = messageInput.value;
  if (message) {
    messagesRef.push({
      text: message,
      sender: 'me'
    });
    messageInput.value = '';
  }
});

messagesRef.on('child_added', (snapshot) => {
  const messageData = snapshot.val();
  const messageElement = document.createElement('div');
  messageElement.classList.add('chat-message');
  if (messageData.sender === 'me') {
    messageElement.classList.add('my-message');
  } else {
    messageElement.classList.add('other-message');
  }
  messageElement.textContent = messageData.text;
  messagesDiv.appendChild(messageElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});
