// Firebase Configuration (Replace with your Firebase configuration)
const firebaseConfig = {
 apiKey: "AIzaSyCph4r--7O-g0dRQhqmn7wNPTOR4OYfguc",
  authDomain: "fir-46d9c.firebaseapp.com",
  databaseURL: "https://fir-46d9c-default-rtdb.firebaseio.com",
  projectId: "fir-46d9c",
  storageBucket: "fir-46d9c.firebasestorage.app",
  messagingSenderId: "162679514419",
  appId: "1:162679514419:web:cb5e5848d4d9cc4d424a46"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database(app);

// DOM Elements
const chatButton = document.getElementById("chatButton");
const chatWindow = document.getElementById("chatWindow");
const chatContent = document.getElementById("chatContent");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");

// Firebase reference for messages
const messagesRef = firebase.database().ref('messages');

// Toggle chat window visibility
function toggleChat() {
  if (chatWindow.style.display === "none" || chatWindow.style.display === "") {
    chatWindow.style.display = "block";
    chatWindow.style.transform = "translateY(0)";
    chatButton.style.display = "none";

    // Send welcome message when chat opens
    sendMessageToFirebase('Bot', 'Welcome to Customer Service! How can I assist you today?');
  } else {
    chatWindow.style.transform = "translateY(100%)";
    setTimeout(() => {
      chatWindow.style.display = "none";
      chatButton.style.display = "flex";
    }, 400);
  }
}

// Send message to Firebase
function sendMessage() {
  const messageText = userInput.value.trim();
  if (messageText) {
    // Send user message
    sendMessageToFirebase('User', messageText);

    // Clear input field
    userInput.value = '';

    // Show typing indicator for bot response
    showTypingIndicator();

    // Simulate bot response
    setTimeout(() => {
      sendMessageToFirebase('Bot', "Sure, help is on the way...");
      
      // Simulate system message: Connecting to expert
      setTimeout(() => {
        sendMessageToFirebase('System', "Connecting to an expert...");
        
        // Wait for 5 seconds, then update system message
        setTimeout(() => {
          sendMessageToFirebase('System', "Connected");
          sendMessageToFirebase('Bot', "Hi! You're talking to an Expert!");
        }, 5000);
      }, 3000);
    }, 2000);
  }
}

// Send message to Firebase function
function sendMessageToFirebase(sender, message) {
  const newMessage = {
    sender: sender,
    message: message,
    timestamp: Date.now()
  };

  // Push message to Firebase
  messagesRef.push(newMessage);
}

// Listen for new messages in real-time from Firebase
messagesRef.on('child_added', function(snapshot) {
  const messageData = snapshot.val();
  const messageElement = document.createElement('p');
  
  // Differentiate message types (user, bot, system)
  if (messageData.sender === 'Bot') {
    messageElement.classList.add('bot-message');
  } else if (messageData.sender === 'User') {
    messageElement.classList.add('user-message');
  } else {
    messageElement.classList.add('system-message');
  }

  messageElement.textContent = messageData.message;
  chatContent.appendChild(messageElement);

  // Scroll chat to the bottom
  chatContent.scrollTop = chatContent.scrollHeight;

  // Hide typing indicator after response is sent
  if (messageData.sender === 'Bot') {
    hideTypingIndicator();
  }
}

// Display typing indicator for bot
function showTypingIndicator() {
  const typingElement = document.createElement('p');
  typingElement.classList.add('typing-indicator');
  typingElement.textContent = 'Bot is typing...';
  chatContent.appendChild(typingElement);
  chatContent.scrollTop = chatContent.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
  const typingElement = document.querySelector('.typing-indicator');
  if (typingElement) {
    typingElement.remove();
  }
}
