const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// ================= MULTER (IMAGE UPLOAD) =================
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// static folder
app.use("/uploads", express.static("uploads"));


// ================= DB CONNECTION =================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "#Birbalraj12345",
  database: "realestate_db"
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL Connected Successfullys.....");
});


// ================= GET =================
app.get("/properties", (req, res) => {
  db.query("SELECT * FROM properties", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});


// ================= ADD (WITH IMAGE) =================
app.post("/add-property", upload.single("image"), (req, res) => {
  const { title, location, price, owner } = req.body;
  const image = req.file ? req.file.filename : null;

  const sql = `
    INSERT INTO properties (title, location, price, type, owner_id, image)
    VALUES (?, ?, ?, 'Flat', ?, ?)
  `;

  db.query(sql, [title, location, price, owner, image], (err) => {
    if (err) throw err;
    res.send("Inserted");
  });
});


// ================= DELETE =================
app.delete("/delete-property/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM bookings WHERE property_id=?", [id], (err) => {
    if (err) throw err;

    db.query("DELETE FROM properties WHERE property_id=?", [id], (err) => {
      if (err) throw err;
      res.send("Deleted");
    });
  });
});


// ================= UPDATE =================
app.put("/update-property/:id", (req, res) => {
  const id = req.params.id;
  const { title, location, price } = req.body;

  const sql = "UPDATE properties SET title=?, location=?, price=? WHERE property_id=?";

  db.query(sql, [title, location, price, id], (err) => {
    if (err) throw err;
    res.send("Updated");
  });
});


// ================= BOOKING =================
app.post("/book-property", (req, res) => {
  const { property_id, user_id } = req.body;

  const sql = `
    INSERT INTO bookings (property_id, user_id, booking_date)
    VALUES (?, ?, CURDATE())
  `;

  db.query(sql, [property_id, user_id], (err) => {
    if (err) throw err;
    res.send("Booked");
  });
});


// ================= LOGIN =================
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email=? AND password=?";
  db.query(sql, [email, password], (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      res.json({ success: true, user: result[0] });
    } else {
      res.json({ success: false });
    }
  });
});


// ================= SERVER =================
app.listen(3000, () => {
  console.log("Server running on port 3000 ");
});

// ---- For Message ----
// ================= SEND MESSAGE =================
app.post("/send-message", (req, res) => {
  const { property_id, sender_id, receiver_id, message } = req.body;

  const sql = `
    INSERT INTO messages (property_id, sender_id, receiver_id, message)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [property_id, sender_id, receiver_id, message], (err) => {
    if (err) throw err;
    res.send("Message sent");
  });
});

// ================= GET MESSAGES =================
app.get("/chat/:user1/:user2", (req, res) => {
  const { user1, user2 } = req.params;

  const sql = `
    SELECT * FROM messages
    WHERE (sender_id=? AND receiver_id=?)
       OR (sender_id=? AND receiver_id=?)
    ORDER BY message_id ASC
  `;

  db.query(sql, [user1, user2, user2, user1], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});


// ================= GET ALL MESSAGES (FOR SELLER) =================
app.get("/messages/:userId", (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT m.*, u.name, p.title
    FROM messages m
    JOIN users u ON m.sender_id = u.user_id
    JOIN properties p ON m.property_id = p.property_id
    WHERE m.receiver_id = ?
    ORDER BY m.message_id DESC
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.log(err);
      return res.send("Error");
    }
    res.json(result);
  });
});
