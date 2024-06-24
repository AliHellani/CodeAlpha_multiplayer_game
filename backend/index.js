const express = require("express");
const http = require("http");
const ws = require("ws");
const db = require("./configuration/db");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");

const userController = require("./controllers/user_controller");
const puzzleController = require("./controllers/puzzle_controller");
const loginUserController = require("./controllers/login_controller");

const authenticatedToken = require("./auth/auth");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3002;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dest = path.join(__dirname, "../frontend/images/image_game/");
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, "../frontend")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/images/image_game", express.static("../frontend/images/image_game/"));

// WebSocket server setup
const wsServer = new ws.Server({ noServer: true });

wsServer.on("connection", (socket) => {
  socket.on("message", (message) => {
    console.log(`Received message from client: ${message}`);
  });
});

server.on("upgrade", (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (socket) => {
    wsServer.emit("connection", socket, request);
  });
});

// User
app.post("/register", upload.none(), userController.register);
app.get("/findAllUsers", authenticatedToken, userController.findAllUsers);
app.get("/findUserById/:id", authenticatedToken, userController.findUserById);

// Puzzle
app.post(
  "/createPuzzle",
  authenticatedToken,
  upload.single("puzzleImage"),
  puzzleController.createPuzzle
);
app.get("/findAllPuzzles", authenticatedToken, puzzleController.findAllPuzzles);
app.get(
  "/findPuzzleById/:id",
  authenticatedToken,
  puzzleController.findPuzzleById
);

// Login User with JWT
app.post("/login", loginUserController.loginUser);

app.get("/test", async (req, res) => {
  try {
    await db.connect();
    res.status(200).json({ message: "Database connection is Active!" });
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    db.close();
  }
});

// Start the HTTP server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unexpected errors
process.on("unhandledRejection", (err, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", err);
});
