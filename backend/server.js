const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const path = require("path");
const pool = require("./db");
const validateRegistration = require("./validation");
const validatePincode = require("./pincode");

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend")));

// Homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Test backend
app.get("/api/test", (req, res) => {

    res.json({
        success: true,
        message: "Backend is working!"
    });

});


// Test database connection
app.get("/api/db-test", async (req, res) => {

    try {

        const [rows] = await pool.query("SELECT 1 AS result");

        res.json({
            success: true,
            message: "Database connection is working!",
            databaseResult: rows[0].result
        });

    } catch (error) {

        console.error("Database error:", error);

        res.status(500).json({
            success: false,
            message: "Database connection failed."
        });

    }

});


// Register a new user
app.post("/api/users", async (req, res) => {

    try {

        const {
            firstName,
            lastName,
            email,
            phone,
            password,
            repeatPassword,
            pincode
        } = req.body;


        // -----------------------------------------
        // Validate registration data
        // -----------------------------------------

        const validationError = validateRegistration({
            firstName,
            lastName,
            email,
            phone,
            password,
            repeatPassword,
            pincode
        });


        if (validationError) {

            return res.status(400).json({
                success: false,
                message: validationError
            });

        }
        // -----------------------------------------
        // Validate pincode using external API
        // -----------------------------------------

        let pincodeResult;

        try {

            pincodeResult = await validatePincode(pincode);

        } catch (error) {

            console.error("Pincode API error:", error);

            return res.status(502).json({
                success: false,
                message: "Unable to verify pincode at the moment."
            });

        }


        if (!pincodeResult.valid) {

            return res.status(400).json({
                success: false,
                message: "Invalid pincode."
            });

        }


        // -----------------------------------------
        // Check for duplicate email
        // -----------------------------------------

        const [existingEmail] = await pool.execute(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );


        if (existingEmail.length > 0) {

            return res.status(409).json({
                success: false,
                message: "Email is already registered."
            });

        }


        // -----------------------------------------
        // Check for duplicate phone
        // -----------------------------------------

        const [existingPhone] = await pool.execute(
            "SELECT id FROM users WHERE phone = ?",
            [phone]
        );


        if (existingPhone.length > 0) {

            return res.status(409).json({
                success: false,
                message: "Phone number is already registered."
            });

        }


        // -----------------------------------------
        // Hash password
        // -----------------------------------------

        const hashedPassword = await bcrypt.hash(password, 10);


        // -----------------------------------------
        // Insert user into MySQL
        // -----------------------------------------

        const [result] = await pool.execute(
            `INSERT INTO users
            (first_name, last_name, email, phone, password_hash, pincode)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                firstName,
                lastName,
                email,
                phone,
                hashedPassword,
                pincode
            ]
        );


        // -----------------------------------------
        // Send success response
        // -----------------------------------------

        res.status(201).json({
            success: true,
            message: "User registered successfully.",
            userId: result.insertId
        });


    } catch (error) {

        console.error("Registration error:", error);

        res.status(500).json({
            success: false,
            message: "Something went wrong while registering the user."
        });

    }

});

// -----------------------------------------
// Login
// -----------------------------------------
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        // Find user by email
        const [rows] = await pool.execute(
            `SELECT
                id,
                first_name,
                last_name,
                email,
                phone,
                password_hash,
                pincode
             FROM users
             WHERE email = ?`,
            [email]
        );

        // User doesn't exist
        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const user = rows[0];

        // Compare entered password with stored bcrypt hash
        const passwordMatches = await bcrypt.compare(
            password,
            user.password_hash
        );

        // Wrong password
        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Successful login
        res.status(200).json({
            success: true,
            message: "Login successful.",
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone,
                pincode: user.pincode
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            success: false,
            message: "Something went wrong while logging in."
        });
    }
});

// -----------------------------------------
// Get user by ID
// -----------------------------------------

app.get("/api/users/:id", async (req, res) => {

    try {

        const userId = req.params.id;


        // Get user from MySQL

        const [rows] = await pool.execute(
            `SELECT
                id,
                first_name,
                last_name,
                email,
                phone,
                pincode,
                created_at
             FROM users
             WHERE id = ?`,
            [userId]
        );


        // User not found

        if (rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "User not found."
            });

        }


        // Send user details

        res.status(200).json({

            success: true,

            user: rows[0]

        });


    } catch (error) {

        console.error("Get user error:", error);

        res.status(500).json({

            success: false,

            message: "Something went wrong while retrieving the user."

        });

    }

});
// -----------------------------------------
// Login
// -----------------------------------------

app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check that email and password were provided
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        // Find user by email
        const [rows] = await pool.execute(
            `SELECT
                id,
                first_name,
                last_name,
                email,
                phone,
                password_hash,
                pincode,
                created_at
             FROM users
             WHERE email = ?`,
            [email]
        );

        // User does not exist
        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const user = rows[0];

        // Compare entered password with stored bcrypt hash
        const passwordMatches = await bcrypt.compare(
            password,
            user.password_hash
        );

        // Password is incorrect
        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Login successful
        res.status(200).json({
            success: true,
            message: "Login successful.",
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone,
                pincode: user.pincode,
                created_at: user.created_at
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            success: false,
            message: "Something went wrong while logging in."
        });
    }
});
// Start server
app.listen(PORT, () => {

    console.log(`Server running at http://localhost:${PORT}`);

});