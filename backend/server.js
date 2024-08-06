const express = require("express");
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });


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
  const sql = "SELECT * FROM users WHERE `email` = ? AND `password` = ?";
  db.query(sql, [req.body.email, req.body.password], (err, data) => {
    if (err) {
      return res.json({ status: "Error", message: err.message });
    }
    if (data.length > 0) {
      return res.json({ status: "Success", user: data[0] });
    } else {
      return res.json({ status: "Failed", message: "Invalid credentials" });
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


app.post('/auctions', upload.single('image'), (req, res) => {
  const { userId, title, description, startingBid, endDate } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
  const sql = "INSERT INTO auctions (userId, title, description, startingBid, endDate, imagePath) VALUES (?)";
  const values = [userId, title, description, startingBid, endDate, imagePath];

  db.query(sql, [values], (err, data) => {
    if (err) {
      console.error('Error during query execution:', err);
      return res.status(500).json("Error");
    }
    return res.json(data);
  });
});

app.get('/auctions/user/:userId', (req, res) => {
  const { userId } = req.params;
  const sql = "SELECT * FROM auctions WHERE userId = ?";
  db.query(sql, [userId], (err, data) => {
    if (err) {
      console.error('Error during query execution:', err);
      return res.status(500).json("Error");
    }
    return res.json(data);
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

app.post('/placeBid', (req, res) => {
  const { auctionId, bidAmount, email } = req.body;

  // Start a transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error('Error starting transaction:', err);
      return res.status(500).json({ status: "Error", message: "Error starting transaction" });
    }

    // Update the current bid and highest bidder in the auctions table
    const updateAuctionSql = "UPDATE auctions SET currentBid = ?, highestBidder = ? WHERE id = ? AND (currentBid IS NULL OR currentBid < ?)";
    db.query(updateAuctionSql, [bidAmount, email, auctionId, bidAmount], (err, result) => {
      if (err) {
        return db.rollback(() => {
          console.error('Error during auction update:', err);
          return res.status(500).json({ status: "Error", message: err.message });
        });
      }
      if (result.affectedRows === 0) {
        return db.rollback(() => {
          return res.status(400).json({ status: "Failed", message: "Bid must be higher than current bid" });
        });
      }

      // Fetch the auction details to insert into bidhistory
      const fetchAuctionSql = "SELECT title FROM auctions WHERE id = ?";
      db.query(fetchAuctionSql, [auctionId], (err, auctionResult) => {
        if (err) {
          return db.rollback(() => {
            console.error('Error fetching auction details:', err);
            return res.status(500).json({ status: "Error", message: err.message });
          });
        }

        const auctionTitle = auctionResult[0].title;
        const insertBidHistorySql = "INSERT INTO bidhistory (auctionId, title, bidAmount, email) VALUES (?, ?, ?, ?)";
        db.query(insertBidHistorySql, [auctionId, auctionTitle, bidAmount, email], (err, result) => {
          if (err) {
            return db.rollback(() => {
              console.error('Error inserting bid history:', err);
              return res.status(500).json({ status: "Error", message: err.message });
            });
          }

          // Commit the transaction
          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                console.error('Error committing transaction:', err);
                return res.status(500).json({ status: "Error", message: "Error committing transaction" });
              });
            }

            return res.json({ status: "Success", message: "Bid placed successfully" });
          });
        });
      });
    });
  });
});

// Fetch bid history
app.get('/bidHistory/:auctionId', (req, res) => {
  const auctionId = req.params.auctionId;
  const sql = "SELECT * FROM bidhistory WHERE auctionId = ?";
  db.query(sql, [auctionId], (err, result) => {
    if (err) {
      console.error('Error during query execution:', err);
      return res.status(500).json({ status: "Error", message: err.message });
    }
    res.json(result);
  });
});


// Endpoint to get user data by email
app.get('/getUserByEmail', (req, res) => {
  const email = req.query.email;
  const sql = "SELECT * FROM users WHERE email = ?";
  
  db.query(sql, [email], (err, data) => {
    if (err) {
      console.error('Error during query execution:', err);
      return res.status(500).json({ status: "Error", message: err.message });
    }
    if (data.length > 0) {
      return res.json(data[0]);
    } else {
      return res.status(404).json({ status: "Not Found", message: "User not found" });
    }
  });
});


// Endpoint to update user profile
app.post('/updateProfile', (req, res) => {
  const { name, email, password, securityQuestion, securityAnswer } = req.body;

  if (!name || !email || !password || !securityQuestion || !securityAnswer) {
    return res.status(400).json({ status: "Failed", message: "All fields are required" });
  }

  const sql = `UPDATE users 
               SET name = ?, password = ?, securityQuestion = ?, securityAnswer = ?
               WHERE email = ?`;

  db.query(sql, [name, password, securityQuestion, securityAnswer, email], (err, result) => {
    if (err) {
      console.error('Error during query execution:', err);
      return res.status(500).json({ status: "Error", message: err.message });
    }
    if (result.affectedRows > 0) {
      return res.json({ status: "Success", message: "Profile updated successfully" });
    } else {
      return res.status(404).json({ status: "Not Found", message: "User not found" });
    }
  });
});

app.listen(8081, () => {
  console.log("Server is running on port 8081");
});
