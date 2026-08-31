// ==================================================
// API CONFIGURATION
// ==================================================

const API_BASE_URL =
    "https://65-0-236-206.nip.io";


// ==================================================
// DOM ELEMENTS
// ==================================================

const form = document.getElementById("signupForm");

const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const password = document.getElementById("password");
const repeatPassword = document.getElementById("repeatPassword");
const pincode = document.getElementById("pincode");

const submitButton = document.getElementById("submitButton");
const formMessage = document.getElementById("formMessage");


// ==================================================
// HELPER FUNCTIONS
// ==================================================

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


// ==================================================
// FIRST NAME VALIDATION
// ==================================================

function validateFirstName() {

    const value = firstName.value.trim();

    if (value === "") {
        showError(
            firstName,
            "firstNameError",
            "First name is required."
        );

        return false;
    }

    if (!/^[A-Za-z]+$/.test(value)) {
        showError(
            firstName,
            "firstNameError",
            "First name can contain alphabets only."
        );

        return false;
    }

    showSuccess(firstName, "firstNameError");

    return true;
}


// ==================================================
// LAST NAME VALIDATION
// ==================================================

function validateLastName() {

    const value = lastName.value.trim();

    if (value === "") {
        showError(
            lastName,
            "lastNameError",
            "Last name is required."
        );

        return false;
    }

    if (!/^[A-Za-z]+$/.test(value)) {
        showError(
            lastName,
            "lastNameError",
            "Last name can contain alphabets only."
        );

        return false;
    }

    showSuccess(lastName, "lastNameError");

    return true;
}


// ==================================================
// EMAIL VALIDATION
// ==================================================

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


// ==================================================
// PHONE VALIDATION
// ==================================================

function validatePhone() {

    const value = phone.value.trim();

    if (value === "") {
        showError(
            phone,
            "phoneError",
            "Phone number is required."
        );

        return false;
    }


    // ------------------------------------------------
    // CASE 1: Phone starts with +
    // ------------------------------------------------

    if (value.startsWith("+")) {

        const digitsAfterPlus = value.substring(1);


        // Only numbers after +

        if (!/^\d+$/.test(digitsAfterPlus)) {
            showError(
                phone,
                "phoneError",
                "Only + and numbers are allowed."
            );

            return false;
        }


        // Exactly 13 digits after +

        if (digitsAfterPlus.length !== 13) {
            showError(
                phone,
                "phoneError",
                "When using +, exactly 13 digits are required."
            );

            return false;
        }


        // First digit cannot be 0

        if (digitsAfterPlus.startsWith("0")) {
            showError(
                phone,
                "phoneError",
                "Phone number should not start with 0."
            );

            return false;
        }
    }


    // ------------------------------------------------
    // CASE 2: Phone does NOT start with +
    // ------------------------------------------------

    else {

        // Only numbers

        if (!/^\d+$/.test(value)) {
            showError(
                phone,
                "phoneError",
                "Only numbers are allowed when + is not used."
            );

            return false;
        }


        // Exactly 10 digits

        if (value.length !== 10) {
            showError(
                phone,
                "phoneError",
                "Phone number must contain exactly 10 digits."
            );

            return false;
        }


        // First digit cannot be 0

        if (value.startsWith("0")) {
            showError(
                phone,
                "phoneError",
                "Phone number should not start with 0."
            );

            return false;
        }
    }


    showSuccess(phone, "phoneError");

    return true;
}


// ==================================================
// PASSWORD VALIDATION
// ==================================================

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


    if (value.length < 6) {
        showError(
            password,
            "passwordError",
            "Password must be at least 6 characters long."
        );

        return false;
    }


    if (!/[A-Za-z]/.test(value)) {
        showError(
            password,
            "passwordError",
            "Password must contain at least one alphabet."
        );

        return false;
    }


    if (!/[0-9]/.test(value)) {
        showError(
            password,
            "passwordError",
            "Password must contain at least one number."
        );

        return false;
    }


    if (!/[@#$&!]/.test(value)) {
        showError(
            password,
            "passwordError",
            "Password must contain at least one of @ # $ & !."
        );

        return false;
    }


    showSuccess(password, "passwordError");

    return true;
}


// ==================================================
// REPEAT PASSWORD VALIDATION
// ==================================================

function validateRepeatPassword() {

    const value = repeatPassword.value;


    if (value === "") {
        showError(
            repeatPassword,
            "repeatPasswordError",
            "Please repeat your password."
        );

        return false;
    }


    if (value !== password.value) {
        showError(
            repeatPassword,
            "repeatPasswordError",
            "Passwords do not match."
        );

        return false;
    }


    showSuccess(
        repeatPassword,
        "repeatPasswordError"
    );

    return true;
}


// ==================================================
// PINCODE VALIDATION
// ==================================================

function validatePincode() {

    const value = pincode.value.trim();


    if (value === "") {
        showError(
            pincode,
            "pincodeError",
            "Pincode is required."
        );

        return false;
    }


    // Exactly 6 digits

    if (!/^\d{6}$/.test(value)) {
        showError(
            pincode,
            "pincodeError",
            "Pincode must contain exactly 6 digits."
        );

        return false;
    }


    showSuccess(
        pincode,
        "pincodeError"
    );

    return true;
}


// ==================================================
// FORM SUBMISSION
// ==================================================

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    clearFormMessage();


    // ==================================================
    // FRONTEND VALIDATION
    // ==================================================

    const firstNameValid =
        validateFirstName();

    const lastNameValid =
        validateLastName();

    const emailValid =
        validateEmail();

    const phoneValid =
        validatePhone();

    const passwordValid =
        validatePassword();

    const repeatPasswordValid =
        validateRepeatPassword();

    const pincodeValid =
        validatePincode();


    const formIsValid =
        firstNameValid &&
        lastNameValid &&
        emailValid &&
        phoneValid &&
        passwordValid &&
        repeatPasswordValid &&
        pincodeValid;


    // Stop if validation failed

    if (!formIsValid) {

        formMessage.textContent =
            "Please correct the errors above.";

        return;
    }


    // ==================================================
    // PREPARE USER DATA
    // ==================================================

    const userData = {

        firstName:
            firstName.value.trim(),

        lastName:
            lastName.value.trim(),

        email:
            email.value.trim(),

        phone:
            phone.value.trim(),

        password:
            password.value,

        repeatPassword:
            repeatPassword.value,

        pincode:
            pincode.value.trim()
    };


    // ==================================================
    // API ENDPOINT
    // ==================================================

    const API_ENDPOINT =
        `${API_BASE_URL}/api/users`;


    // Helpful debugging information

    console.log(
        "=========================================="
    );

    console.log(
        "Registration request"
    );

    console.log(
        "API Endpoint:",
        API_ENDPOINT
    );

    console.log(
        "Method:",
        "POST"
    );

    console.log(
        "=========================================="
    );


    // ==================================================
    // DISABLE SUBMIT BUTTON
    // ==================================================

    submitButton.disabled = true;

    submitButton.textContent =
        "Creating Account...";


    // ==================================================
    // SEND REQUEST
    // ==================================================

    try {

        const response = await fetch(
            API_ENDPOINT,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(userData)
            }
        );


        // ==================================================
        // READ RESPONSE SAFELY
        // ==================================================

        const responseText =
            await response.text();


        console.log(
            "API Response Status:",
            response.status
        );

        console.log(
            "API Response:",
            responseText
        );


        // ==================================================
        // PARSE JSON RESPONSE
        // ==================================================

        let result = {};

        if (responseText) {

            try {

                result =
                    JSON.parse(responseText);

            } catch (parseError) {

                console.error(
                    "Backend returned non-JSON response:",
                    responseText
                );

                formMessage.textContent =
                    `Server returned an unexpected response (${response.status}).`;

                return;
            }
        }


        // ==================================================
        // HANDLE BACKEND ERROR
        // ==================================================

        if (!response.ok) {

            console.error(
                "Backend error:",
                response.status,
                result
            );

            formMessage.textContent =
                result.message ||
                result.error ||
                `Registration failed (${response.status}).`;

            return;
        }


        // ==================================================
        // REGISTRATION SUCCESSFUL
        // ==================================================

        console.log(
            "Registration successful:",
            result
        );


        // ==================================================
        // CHECK USER ID
        // ==================================================

        if (!result.userId) {

            console.error(
                "Backend did not return userId:",
                result
            );

            formMessage.textContent =
                "Account was created, but the confirmation page could not be opened.";

            return;
        }


        // ==================================================
        // GO TO CONFIRMATION PAGE
        // ==================================================

        window.location.href =
            `confirmation.html?id=${encodeURIComponent(result.userId)}`;
    }


    // ==================================================
    // NETWORK / CONNECTION ERROR
    // ==================================================

    catch (error) {

        console.error(
            "Registration error:",
            error
        );

        formMessage.textContent =
            "Unable to connect to the server. Please try again.";
    }


    // ==================================================
    // RE-ENABLE SUBMIT BUTTON
    // ==================================================

    finally {

        submitButton.disabled = false;

        submitButton.textContent =
            "Create Account";
    }

});