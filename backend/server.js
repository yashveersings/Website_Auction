const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

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

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Swagger setup
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Auction Website API",
      version: "1.0.0",
      description: "API documentation for the Auction Website",
    },
    servers: [
      {
        url: "http://localhost:8081",
      },
    ],
  },
  apis: [path.join(__dirname, 'server.js')], // Adjust the path if necessary
};

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Debug log to ensure middleware is set up
console.log('Swagger UI set up at /api-docs');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - securityQuestion
 *         - securityAnswer
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         securityQuestion:
 *           type: string
 *         securityAnswer:
 *           type: string
 *       example:
 *         id: 1
 *         name: John Doe
 *         email: johndoe@example.com
 *         password: mysecretpassword
 *         securityQuestion: What is your pet's name?
 *         securityAnswer: Fluffy
 *     Auction:
 *       type: object
 *       required:
 *         - userId
 *         - title
 *         - description
 *         - startingBid
 *         - endDate
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the auction
 *         userId:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         startingBid:
 *           type: number
 *         endDate:
 *           type: string
 *           format: date-time
 *         imagePath:
 *           type: string
 *         currentBid:
 *           type: number
 *       example:
 *         id: 1
 *         userId: 1
 *         title: "Vintage Painting"
 *         description: "A beautiful vintage painting."
 *         startingBid: 100.00
 *         endDate: "2024-12-31T23:59:59Z"
 *         imagePath: "/uploads/image.jpg"
 *         currentBid: 150.00
 *     Bid:
 *       type: object
 *       required:
 *         - auctionId
 *         - userId
 *         - bidAmount
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the bid
 *         auctionId:
 *           type: integer
 *         userId:
 *           type: integer
 *         bidAmount:
 *           type: number
 *       example:
 *         id: 1
 *         auctionId: 1
 *         userId: 2
 *         bidAmount: 200.00
 */

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Sign up a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */
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

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: The user was successfully logged in
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Some server error
 */
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

/**
 * @swagger
 * /reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               securityQuestion:
 *                 type: string
 *               securityAnswer:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Incorrect security question or answer
 *       500:
 *         description: Some server error
 */
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

/**
 * @swagger
 * /auctions:
 *   get:
 *     summary: Get all auctions
 *     tags: [Auctions]
 *     responses:
 *       200:
 *         description: List of auctions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Auction'
 *       500:
 *         description: Some server error
 */
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

/**
 * @swagger
 * /auctions:
 *   post:
 *     summary: Create a new auction
 *     tags: [Auctions]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               startingBid:
 *                 type: number
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: The auction was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auction'
 *       500:
 *         description: Some server error
 */
app.post('/auctions', upload.single('image'), (req, res) => {
  const { userId, title, description, startingBid, endDate } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
  const sql = "INSERT INTO auctions (`userId`, `title`, `description`, `startingBid`, `endDate`, `imagePath`) VALUES (?)";
  const values = [userId, title, description, startingBid, endDate, imagePath];

  db.query(sql, [values], (err, data) => {
    if (err) {
      console.error('Error during query execution:', err);
      return res.status(500).json("Error");
    }
    return res.json(data);
  });
});

/**
 * @swagger
 * /auctions/user/{userId}:
 *   get:
 *     summary: Get auctions by user
 *     tags: [Auctions]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of auctions for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Auction'
 *       500:
 *         description: Some server error
 */
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

/**
 * @swagger
 * /auctions/{id}:
 *   put:
 *     summary: Update an auction
 *     tags: [Auctions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auction'
 *     responses:
 *       200:
 *         description: The auction was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auction'
 *       500:
 *         description: Some server error
 */
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

/**
 * @swagger
 * /auctions/{id}:
 *   delete:
 *     summary: Delete an auction
 *     tags: [Auctions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The auction was successfully deleted
 *       500:
 *         description: Some server error
 */
app.delete('/auctions/:id', (req, res) => {
  const { id } = req.params;

  // First delete related bids
  const deleteBidsSql = "DELETE FROM bidhistory WHERE auctionId = ?";
  db.query(deleteBidsSql, [id], (err, bidData) => {
    if (err) {
      console.error('Error during query execution:', err);
      return res.status(500).json({ status: "Error", message: "Failed to delete related bids" });
    }

    // Then delete the auction
    const deleteAuctionSql = "DELETE FROM auctions WHERE id = ?";
    db.query(deleteAuctionSql, [id], (err, auctionData) => {
      if (err) {
        console.error('Error during query execution:', err);
        return res.status(500).json({ status: "Error", message: "Failed to delete auction" });
      }
      return res.json({ status: "Success", message: "Auction and related bids deleted successfully" });
    });
  });
});

/**
 * @swagger
 * /auctions/{id}/bid:
 *   post:
 *     summary: Place a bid on an auction
 *     tags: [Bids]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bid'
 *     responses:
 *       200:
 *         description: The bid was successfully placed
 *       500:
 *         description: Some server error
 */
app.post('/auctions/:id/bid', (req, res) => {
  const { id } = req.params;
  const { userId, bid } = req.body;
  const sql = "INSERT INTO bids (`auctionId`, `userId`, `bidAmount`) VALUES (?)";
  const values = [id, userId, bid];

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

/**
 * @swagger
 * /placeBid:
 *   post:
 *     summary: Place a bid on an auction
 *     tags: [Bids]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               auctionId:
 *                 type: integer
 *               bidAmount:
 *                 type: number
 *     responses:
 *       200:
 *         description: The bid was successfully placed
 *       400:
 *         description: Bid must be higher than current bid
 *       500:
 *         description: Some server error
 */
// Place Bid Endpoint
app.post('/placeBid', (req, res) => {
  const { auctionId, bidAmount, email } = req.body;

  // Start a transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error('Error starting transaction:', err);
      return res.status(500).json({ status: "Error", message: "Error starting transaction" });
    }

    // Update the current bid and highest bidder in the auctions table
    const updateAuctionSql = `
      UPDATE auctions 
      SET currentBid = ?, highestBidder = ? 
      WHERE id = ? 
        AND (currentBid IS NULL OR currentBid < ?)`;

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
        const insertBidHistorySql = `
          INSERT INTO bidhistory (auctionId, title, bidAmount, email, bidTime) 
          VALUES (?, ?, ?, ?, NOW())`;

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



/**
 * @swagger
 * /getUserByEmail:
 *   get:
 *     summary: Get user by email
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The user was successfully found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Some server error
 */
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

/**
 * @swagger
 * /updateProfile:
 *   post:
 *     summary: Update user profile
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               securityQuestion:
 *                 type: string
 *               securityAnswer:
 *                 type: string
 *     responses:
 *       200:
 *         description: The profile was successfully updated
 *       400:
 *         description: All fields are required
 *       404:
 *         description: User not found
 *       500:
 *         description: Some server error
 */
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


app.listen(8081, () => {
  console.log("Server is running on port 8081");
});
