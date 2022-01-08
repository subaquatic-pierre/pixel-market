const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const IMAGES_DIR = "images/";

// Configure multer

const storage = multer.diskStorage({
  destination: IMAGES_DIR,
});

const upload = multer({ storage: storage });

const app = express();
const port = 8080;

//use cors to allow cross origin resource sharing
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Set middle ware to handle body post request
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// Image save on upload
app.post("/save-image", upload.single("file"), (req, res) => {
  const tokenId = req.body.tokenId;

  // Rename image to token Id
  fs.rename(
    req.file.path,
    `${IMAGES_DIR}token-id-${tokenId}${path.extname(req.file.originalname)}`
  );

  if (req.file) {
    res.json(req.file);
  }
});

app.post("/save-meta", (req, res) => {
  console.log(req.body);
  res.send("Meta data saved");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
