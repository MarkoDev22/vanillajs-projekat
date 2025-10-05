const express = require("express");
const jsonServer = require("json-server");
const auth = require("json-server-auth");
const path = require("path");

const app = express();
const router = jsonServer.router("db.json"); // JSON database
const middlewares = jsonServer.defaults();

// Serve static files (HTML, CSS, JS) from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Serve the landing page (index.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Setup JSON Server with authentication
app.db = router.db; // Connect JSON Server to the database
app.use(middlewares); // JSON Server defaults
app.use(auth); // JSON Server Auth
app.use("/api", router); // All JSON Server routes start with "/api"

// Start the server
const PORT = 3333;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
