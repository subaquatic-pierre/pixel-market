const express = require("express");
const cors = require("cors");

const app = express();
const port = 8080;

//use cors to allow cross origin resource sharing
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Use public directory
app.use("/public", express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/public"));

// Set middle ware to handle body post request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/save-image", (req, res) => {
  console.log(req.body);
  res.send(JSON.stringify(req.body));
});

app.post("/save-meta", (req, res) => {
  console.log(req.body);
  res.send("Meta data saved");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
