const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const IMAGES_DIR = "images";
const META_DIR = "meta";

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
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Image save on upload
app.post("/save-image", upload.single("file"), (req, res) => {
  const tokenId = req.body.tokenId;

  // Rename image to token Id
  fs.rename(
    req.file.path,
    `${IMAGES_DIR}/token-id-${tokenId}${path.extname(req.file.originalname)}`,
    (err) => {
      if (err) {
        console.log(err);
      } else {
        return;
      }
    }
  );

  if (req.file) {
    res.json(req.file);
  }
});

app.post("/save-meta", (req, res) => {
  const data = req.body;
  const { tokenId } = data;
  fs.writeFileSync(
    `${META_DIR}/token-id-${tokenId}.json`,
    JSON.stringify(data)
  );
  res.send({ status: "successful", message: "Meta data saved" });
});

app.get("/token-meta/:id", (req, res) => {
  const tokenId = req.params.id;

  fs.readFile(`${META_DIR}/token-id-${tokenId}.json`, (err, json) => {
    let obj = JSON.parse(json);
    res.json(obj);
  });
});

app.get("/token-image/:id", (req, res) => {
  const tokenId = req.params.id;
  const filePath = `${IMAGES_DIR}/token-id-${tokenId}`;
  const absPath = path.resolve(filePath);
  try {
    res.sendFile(absPath);
  } catch (err) {
    console.log(err);
    res.send("There was an error");
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
