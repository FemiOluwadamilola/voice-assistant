const express = require("express");
const http = require("http");
// const socket = require("socket.io");
const path = require("path");
require("dotenv").config();
// ROUTES CALL
const indexRoute = require("./src/routes/index");
// SOCKET AND SERVER SETUP
const app = express();
const server = http.createServer(app);
// const io = socket(server);

// EXPRESS MIDDLEWARE SETUP;
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ROUTES SETUP
app.use("/", indexRoute);

// PORT AND SERVER CALL
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`running on port ${PORT}`));
