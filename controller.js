// Firebase configuration object (replace with your actual config)
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
const database = firebase.database();

document.addEventListener('DOMContentLoaded', () => {
    // Select DOM elements
    const userMenu = document.getElementById('user-menu');
    const dropdown = document.getElementById('dropdown');
    const settingsPanel = document.getElementById('settings-panel');
    const settingsBtn = document.getElementById('settings-btn');
    const closeSettings = document.getElementById('close-settings');
    const messagesContainer = document.getElementById('messages');
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    const userEmailDisplay = document.getElementById('user-email');
    const periodTrackerBtn = document.getElementById('period-tracker-btn');
    const periodTrackerModal = document.getElementById('period-tracker-modal');
    const closeModalBtn = document.getElementById('close-period-tracker-modal');
    const savePeriodBtn = document.getElementById('save-period-btn');
    const countdownDisplay = document.getElementById('countdown-display');
    const datePicker = document.getElementById('date-picker');
    const chipsDisplay = document.getElementById('chips-display'); // Added element for chips display
    const logoutBtn = document.getElementById('logout-btn'); // Logout button

    let messagesListener = null;

    // Function to format large numbers with suffixes
    function formatNumber(amount) {
        if (amount >= 1e12) {
            return (amount / 1e12).toFixed(2) + 'T'; // Trillion
        } else if (amount >= 1e9) {
            return (amount / 1e9).toFixed(2) + 'B'; // Billion
        } else if (amount >= 1e6) {
            return (amount / 1e6).toFixed(2) + 'M'; // Million
        } else if (amount >= 1e3) {
            return (amount / 1e3).toFixed(2) + 'K'; // Thousand
        } else {
            return amount.toString(); // Less than a thousand
        }
    }

    // Update chips display
    function updateChipsDisplay() {
        const user = auth.currentUser;
        if (user) {
            const sanitizedEmail = sanitizeEmail(user.email);
            database.ref(`users/${sanitizedEmail}/chips`).once('value').then(snapshot => {
                const chipsAmount = snapshot.val() || 0;
                if (chipsDisplay) {
                    chipsDisplay.textContent = `Chips: ${formatNumber(chipsAmount)}`;
                }
            }).catch(error => {
                console.error('Error fetching chips amount:', error);
            });
        }
    }

    // Function to sanitize email for Firebase path
    function sanitizeEmail(email) {
        return email.replace(/\./g, ','); // Replace '.' with ',' for Firebase path
    }

    // Function to update chip amount for a specific user
    function updateChips(email, amount) {
        const sanitizedEmail = sanitizeEmail(email);
        database.ref(`users/${sanitizedEmail}/chips`).set(amount)
            .then(() => {
                console.log(`Chips updated successfully for ${email}.`);
                updateChipsDisplay(); // Update chips display after setting the new value
            })
            .catch(error => {
                console.error('Error updating chips:', error);
            });
    }

    // Handle user authentication state changes
    auth.onAuthStateChanged(user => {
        if (user) {
            // Always display the email as `user@gmail.com` on the top banner
            userEmailDisplay.textContent = user.email;
            updateChipsDisplay(); // Update chips display when user is authenticated
            if (messagesListener) {
                messagesListener.off(); // Remove previous listener if it exists
            }
            loadMessages(); // Load messages
            updateChips('admin@gmail.com', 1000000); // Give admin@gmail.com 1M Chips
        } else {
            userEmailDisplay.textContent = 'Not signed in';
        }
    });

    // Load and display messages
    function loadMessages() {
        messagesListener = database.ref('messages').on('child_added', snapshot => {
            const msg = snapshot.val();
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message';            // Extract the part of the email before the '@' symbol
            const userName = msg.user.split('@')[0];

            messageDiv.innerHTML = `<strong>${userName}:</strong> ${msg.text}`;
            messagesContainer.appendChild(messageDiv);
        });
    }

    // Toggle dropdown menu
    if (userMenu && dropdown) {
        userMenu.addEventListener('click', () => {
            const isVisible = dropdown.style.display === 'block';
            dropdown.style.display = isVisible ? 'none' : 'block';
        });
    }

    // Show settings panel
    if (settingsBtn && settingsPanel) {
        settingsBtn.addEventListener('click', () => {
            settingsPanel.classList.add('open');
        });
    }

    // Close settings panel
    if (closeSettings && settingsPanel) {
        closeSettings.addEventListener('click', () => {
            settingsPanel.classList.remove('open');
        });
    }

    // Handle form submission
    if (messageForm && messageInput && messagesContainer) {
        messageForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const newMessage = messageInput.value;
            if (newMessage.trim() === '') return;

            // Add new message to the database
            const user = auth.currentUser;
            if (user) {
                database.ref('messages').push({
                    user: user.email,
                    text: newMessage
                });
            }

            messageInput.value = '';
            messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to bottom
        });
    }

    // Period Tracker Modal
    if (periodTrackerBtn && periodTrackerModal && closeModalBtn && savePeriodBtn && countdownDisplay && datePicker) {
        periodTrackerBtn.addEventListener('click', () => {
            periodTrackerModal.classList.add('active');
        });

        closeModalBtn.addEventListener('click', () => {
            periodTrackerModal.classList.remove('active');
        });

        savePeriodBtn.addEventListener('click', () => {
            const selectedDate = new Date(datePicker.value);
            if (selectedDate.toString() === 'Invalid Date') {
                alert('Please select a valid date.');
                return;
            }

            const now = new Date();
            const timeLeft = selectedDate - now;
            if (timeLeft <= 0) {
                countdownDisplay.textContent = 'The selected date has already passed!';
                return;
            }

            const updateCountdown = () => {
                const now = new Date();
                const timeLeft = selectedDate - now;
                if (timeLeft <= 0) {
                    countdownDisplay.textContent = 'Time is up!';
                    clearInterval(countdownInterval);
                } else {
                    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                    countdownDisplay.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
                }
            };

            updateCountdown();
            const countdownInterval = setInterval(updateCountdown, 1000);
            periodTrackerModal.classList.remove('active');
        });
    } else {
        console.error('Required DOM elements for period tracker are missing');
    }

    // Handle logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            auth.signOut().then(() => {
                // Redirect to Main.html after successful logout
                window.location.href = 'Main.html';
            }).catch(error => {
                console.error('Error signing out:', error);
            });
        });
    }
});
