const firebaseConfig = {
    apiKey: "AIzaSyAHSW4ettEHj3Y562zYSI_n0Z1OwFaGsgw",
    authDomain: "login-71866.firebaseapp.com",
    projectId: "login-71866",
    storageBucket: "login-71866.appspot.com",
    messagingSenderId: "434042354282",
    appId: "1:434042354282:web:fbc98eaefe2ef6513a2813"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

document.getElementById('toggle-form').addEventListener('click', function (event) {
    event.preventDefault();
    
    const formTitle = document.getElementById('form-title');
    const confirmPasswordContainer = document.getElementById('confirm-password-container');
    const submitBtn = document.getElementById('submit-btn');
    const toggleFormText = document.getElementById('toggle-form');

    if (formTitle.innerText === "Login") {
        formTitle.innerText = "Sign Up";
        confirmPasswordContainer.style.display = "block";
        submitBtn.innerText = "Sign Up";
        toggleFormText.innerHTML = 'Already have an account? <a href="#">Login</a>';
    } else {
        formTitle.innerText = "Login";
        confirmPasswordContainer.style.display = "none";
        submitBtn.innerText = "Login";
        toggleFormText.innerHTML = 'Don\'t have an account? <a href="#">Sign Up</a>';
    }
});

document.getElementById('auth-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const formTitle = document.getElementById('form-title').innerText;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (formTitle === "Sign Up") {
        const confirmPassword = document.getElementById('confirm-password').value;
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        // Firebase Sign Up
        auth.createUserWithEmailAndPassword(username, password)
            .then((userCredential) => {
                const user = userCredential.user;
                // Add user data to Firestore
                return db.collection("users").doc(user.uid).set({
                    email: username,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            })
            .then(() => {
                // Redirect to welcome page after successful sign-up
                window.location.href = "Home.html";
            })
            .catch((error) => {
                alert('Error: ' + error.message);
            });
    } else {
        // Firebase Login
        auth.signInWithEmailAndPassword(username, password)
            .then((userCredential) => {
                // Redirect to dashboard page immediately upon successful login
                window.location.href = "Home.html";
            })
            .catch((error) => {
                alert('Error: ' + error.message);
            });
    }
});