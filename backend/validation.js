function validateRegistration(data) {

    const {
        firstName,
        lastName,
        email,
        phone,
        password,
        repeatPassword,
        pincode
    } = data;


    // -----------------------------------------
    // Check required fields
    // -----------------------------------------

    if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !password ||
        !repeatPassword ||
        !pincode
    ) {
        return "All fields are required.";
    }


    // -----------------------------------------
    // First Name
    // -----------------------------------------

    if (!/^[A-Za-z]+$/.test(firstName)) {
        return "First name can contain alphabets only.";
    }


    // -----------------------------------------
    // Last Name
    // -----------------------------------------

    if (!/^[A-Za-z]+$/.test(lastName)) {
        return "Last name can contain alphabets only.";
    }


    // -----------------------------------------
    // Email
    // -----------------------------------------

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return "Please enter a valid email address.";
    }


    // -----------------------------------------
    // Phone Number
    // -----------------------------------------

    if (phone.startsWith("+")) {

        const digitsAfterPlus = phone.substring(1);

        // Only numbers after +
        if (!/^\d+$/.test(digitsAfterPlus)) {
            return "Phone number can contain only + and numbers.";
        }

        // Exactly 13 digits excluding +
        if (digitsAfterPlus.length !== 13) {
            return "Phone number must contain exactly 13 digits after +.";
        }

        // Cannot start with 0
        if (digitsAfterPlus.startsWith("0")) {
            return "Phone number should not start with 0.";
        }

    } else {

        // Only numbers
        if (!/^\d+$/.test(phone)) {
            return "Phone number can contain only numbers.";
        }

        // Exactly 10 digits
        if (phone.length !== 10) {
            return "Phone number must contain exactly 10 digits.";
        }

        // Cannot start with 0
        if (phone.startsWith("0")) {
            return "Phone number should not start with 0.";
        }
    }


    // -----------------------------------------
    // Password
    // -----------------------------------------

    if (password.length < 6) {
        return "Password must be at least 6 characters long.";
    }

    if (!/[A-Za-z]/.test(password)) {
        return "Password must contain at least one alphabet.";
    }

    if (!/[0-9]/.test(password)) {
        return "Password must contain at least one number.";
    }

    if (!/[@#$&!]/.test(password)) {
        return "Password must contain at least one of @ # $ & !.";
    }


    // -----------------------------------------
    // Repeat Password
    // -----------------------------------------

    if (password !== repeatPassword) {
        return "Passwords do not match.";
    }


    // -----------------------------------------
    // Pincode format
    // -----------------------------------------

    if (!/^\d{6}$/.test(pincode)) {
        return "Pincode must contain exactly 6 digits.";
    }


    // Everything passed
    return null;
}


module.exports = validateRegistration;