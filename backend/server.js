const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");

// ✅ Load your Firebase service account key
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firestore Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ------------------- ROUTES ------------------- //

// Test route
app.get("/", (req, res) => {
  res.send("Backend with Firestore is running 🚀");
});

// Add data to Firestore
app.post("/addUser", async (req, res) => {
  try {
    const { name, email } = req.body;

    const docRef = await db.collection("users").add({
      name,
      email,
      createdAt: new Date()
    });

    res.json({ id: docRef.id, message: "User added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------------------------------------------------ //

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});