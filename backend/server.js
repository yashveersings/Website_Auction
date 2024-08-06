const express = require("express");
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "auctionwebsite"
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

app.post('/signup', (req, res) => {
  const sql = "INSERT INTO users (`name`, `email`, `password`, `securityQuestion`, `securityAnswer`) VALUES (?)";
  const values = [
    req.body.name,
    req.body.email,
    req.body.password,
    req.body.securityQuestion,
    req.body.securityAnswer
  ];

  db.query(sql, [values], (err, data) => {
    if (err) {
      console.error('Error during query execution:', err);
      return res.json("Error");
    }
    return res.json(data);
  });
});

app.post('/login', (req, res) => {
  const sql = "SELECT * FROM users WHERE `email` = ? AND password = ?";
  db.query(sql, [req.body.email, req.body.password], (err, data) => {
    if (err) {
      return res.json("Error");
    }
    if(data.length > 0) {
      return res.json({ status: "Success", user: data[0] });
    } else {
      return res.json({ status: "Failed" });
    }
  });
});

app.post('/reset-password', (req, res) => {
  const { email, securityQuestion, securityAnswer, newPassword } = req.body;
  
  const checkSql = "SELECT * FROM users WHERE email = ? AND securityQuestion = ? AND securityAnswer = ?";
  db.query(checkSql, [email, securityQuestion, securityAnswer], (err, results) => {
    if (err) {
      console.error('Error during query execution:', err);
      return res.status(500).json("Error");
    }
    
    if (results.length > 0) {
      const updateSql = "UPDATE users SET password = ? WHERE email = ?";
      db.query(updateSql, [newPassword, email], (err, data) => {
        if (err) {
          console.error('Error during query execution:', err);
          return res.status(500).json("Error");
        }
        return res.json("Password has been reset successfully.");
      });
    } else {
      return res.status(400).json("Incorrect security question or answer.");
    }
  });
});

app.get('/auctions', (req, res) => {
  const sql = "SELECT * FROM auctions";
  db.query(sql, (err, data) => {
    if (err) {
      console.error('Error during query execution:', err);
      return res.status(500).json("Error");
    }
    return res.json(data);
  });
});

app.post('/auctions', (req, res) => {
  const { userId, title, description, startingBid, endDate } = req.body;
  const sql = "INSERT INTO auctions (`userId`, `title`, `description`, `startingBid`, `endDate`) VALUES (?)";
  const values = [
    userId,
    title,
    description,
    startingBid,
    endDate
  ];

  db.query(sql, [values], (err, data) => {
    if (err) {
      console.error('Error during query execution:', err);
      return res.status(500).json("Error");
    }
    return res.json(data);
  });
});

app.get('/auctions/:id', (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM auctions WHERE id = ?";
  db.query(sql, [id], (err, data) => {
    if (err) {
      console.error('Error during query execution:', err);
      return res.status(500).json("Error");
    }
    return res.json(data[0]);
  });
});

app.put('/auctions/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, startingBid, endDate } = req.body;
  const sql = "UPDATE auctions SET title = ?, description = ?, startingBid = ?, endDate = ? WHERE id = ?";
  db.query(sql, [title, description, startingBid, endDate, id], (err, data) => {
    if (err) {
      console.error('Error during query execution:', err);
      return res.status(500).json("Error");
    }
    return res.json(data);
  });
});

app.delete('/auctions/:id', (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM auctions WHERE id = ?";
  db.query(sql, [id], (err, data) => {
    if (err) {
      console.error('Error during query execution:', err);
      return res.status(500).json("Error");
    }
    return res.json(data);
  });
});

app.post('/auctions/:id/bid', (req, res) => {
  const { id } = req.params;
  const { userId, bid } = req.body;
  const sql = "INSERT INTO bids (`auctionId`, `userId`, `bidAmount`) VALUES (?)";
  const values = [
    id,
    userId,
    bid
  ];

  db.query(sql, [values], (err, data) => {
    if (err) {
      console.error('Error during query execution:', err);
      return res.status(500).json("Error");
    }
    const updateSql = "UPDATE auctions SET currentBid = ? WHERE id = ? AND currentBid < ?";
    db.query(updateSql, [bid, id, bid], (err, data) => {
      if (err) {
        console.error('Error during query execution:', err);
        return res.status(500).json("Error");
      }
      return res.json("Bid placed successfully.");
    });
  });
});

app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, password, securityQuestion, securityAnswer } = req.body;
  const sql = "UPDATE users SET name = ?, email = ?, password = ?, securityQuestion = ?, securityAnswer = ? WHERE id = ?";
  db.query(sql, [name, email, password, securityQuestion, securityAnswer, id], (err, data) => {
    if (err) {
      console.error('Error during query execution:', err);
      return res.status(500).json("Error");
    }
    return res.json("Profile updated successfully.");
  });
});

app.listen(8081, () => {
  console.log("Server is running on port 8081");
});
