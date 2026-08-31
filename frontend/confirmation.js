// -----------------------------------------
// Get user ID from URL
// -----------------------------------------

const urlParams = new URLSearchParams(
    window.location.search
);

const userId = urlParams.get("id");


// -----------------------------------------
// Check whether user ID exists
// -----------------------------------------

if (!userId) {

    document.getElementById("welcomeMessage").textContent =
        "Invalid registration link.";

} else {

    loadUserDetails(userId);

}


// -----------------------------------------
// Get user details from backend
// -----------------------------------------

async function loadUserDetails(userId) {

    try {

        const response = await fetch(`/api/users/${userId}`
        );


        const result = await response.json();


        // -----------------------------------------
        // Handle API error
        // -----------------------------------------

        if (!response.ok) {

            document.getElementById("welcomeMessage").textContent =
                result.message;

            return;

        }


        // -----------------------------------------
        // Get user object
        // -----------------------------------------

        const user = result.user;


        // -----------------------------------------
        // Display welcome message
        // -----------------------------------------

        document.getElementById("welcomeMessage").textContent =
            `Welcome ${user.first_name}`;


        // -----------------------------------------
        // Display user details
        // -----------------------------------------

        document.getElementById("displayFirstName").textContent =
            user.first_name;

        document.getElementById("displayLastName").textContent =
            user.last_name;

        document.getElementById("displayEmail").textContent =
            user.email;

        document.getElementById("displayPhone").textContent =
            user.phone;

        document.getElementById("displayPincode").textContent =
            user.pincode;


    } catch (error) {

        console.error(
            "Error loading user details:",
            error
        );

        document.getElementById("welcomeMessage").textContent =
            "Unable to load registration details.";

    }

}