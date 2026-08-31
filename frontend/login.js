const form = document.getElementById("loginForm");

const email = document.getElementById("email");

const password = document.getElementById("password");

const loginButton = document.getElementById("loginButton");

const formMessage = document.getElementById("formMessage");


// --------------------------------------------------
// Helper functions
// --------------------------------------------------

function showError(input, errorId, message) {

    input.classList.add("invalid");
    input.classList.remove("valid");

    document.getElementById(errorId).textContent = message;
}


function showSuccess(input, errorId) {

    input.classList.remove("invalid");
    input.classList.add("valid");

    document.getElementById(errorId).textContent = "";
}


function clearFormMessage() {

    formMessage.textContent = "";
}


// --------------------------------------------------
// Email validation
// --------------------------------------------------

function validateEmail() {

    const value = email.value.trim();

    if (value === "") {

        showError(
            email,
            "emailError",
            "Email is required."
        );

        return false;
    }

    if (!email.validity.valid) {

        showError(
            email,
            "emailError",
            "Please enter a valid email address."
        );

        return false;
    }

    showSuccess(email, "emailError");

    return true;
}


// --------------------------------------------------
// Password validation
// --------------------------------------------------

function validatePassword() {

    const value = password.value;

    if (value === "") {

        showError(
            password,
            "passwordError",
            "Password is required."
        );

        return false;
    }

    showSuccess(password, "passwordError");

    return true;
}


// --------------------------------------------------
// Login form submission
// --------------------------------------------------

form.addEventListener("submit", async function(event) {

    event.preventDefault();

    clearFormMessage();


    // -----------------------------------------
    // Frontend validation
    // -----------------------------------------

    const emailValid = validateEmail();

    const passwordValid = validatePassword();


    const formIsValid =
        emailValid &&
        passwordValid;


    if (!formIsValid) {

        formMessage.textContent =
            "Please correct the errors above.";

        return;
    }


    // -----------------------------------------
    // Prepare login data
    // -----------------------------------------

    const loginData = {

        email: email.value.trim(),

        password: password.value

    };


    // -----------------------------------------
    // Disable button
    // -----------------------------------------

    loginButton.disabled = true;

    loginButton.textContent = "Logging In...";


    try {

        // -----------------------------------------
        // Send login request to backend
        // -----------------------------------------

        const response = await fetch("/api/login", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(loginData)

        });


        // -----------------------------------------
        // Read backend response
        // -----------------------------------------

        const result = await response.json();


        // -----------------------------------------
        // Handle login error
        // -----------------------------------------

        if (!response.ok) {

            formMessage.textContent = result.message;

            return;
        }


        // -----------------------------------------
        // Login successful
        // -----------------------------------------

        console.log("Login successful:", result);


        // -----------------------------------------
        // Store logged-in user
        // -----------------------------------------

        localStorage.setItem(
            "loggedInUser",
            JSON.stringify(result.user)
        );


        // -----------------------------------------
        // Redirect after login
        // -----------------------------------------

        window.location.href =
            `confirmation.html?id=${result.user.id}`;


    } catch (error) {

        console.error("Login error:", error);

        formMessage.textContent =
            "Unable to connect to the server. Please try again.";

    } finally {

        // -----------------------------------------
        // Re-enable button
        // -----------------------------------------

        loginButton.disabled = false;

        loginButton.textContent = "Login";

    }

});