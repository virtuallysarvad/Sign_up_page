async function validatePincode(pincode) {

    const url = `https://api.postalpincode.in/pincode/${pincode}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Pincode API request failed.");
    }

    const data = await response.json();

    // API returns an array
    const result = data[0];

    // Check whether the API found the pincode
    if (
        result &&
        result.Status === "Success" &&
        Array.isArray(result.PostOffice) &&
        result.PostOffice.length > 0
    ) {
        return {
            valid: true,
            postOffices: result.PostOffice
        };
    }

    return {
        valid: false,
        postOffices: []
    };
}


module.exports = validatePincode;