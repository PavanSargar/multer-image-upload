const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

mongoose.connect("mongodb://localhost:27017/Multertest", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, (err) => {
    if (err) return console.log(err);
    app.listen(3000, () => {
        console.log("MongoDB Server listening on 3000");
    });
});

app.get("/",  (req, res) => {
    ImageModel.find({}, (err, images) => {
      if (err) {
          console.log(err);
          res.status(500).send("An error occurred", err);
      } else {
          res.render("index", {images: images});
      }
    });
  });


const imageSchema = new mongoose.Schema({
    image: {
        data: Buffer,
        contentType: String
    }
});

const ImageModel = mongoose.model("Image", imageSchema);

app.post("/uploadPhoto", upload.single("myImage"), (req, res) => {
    const obj = {
        img: {
            data: fs.readFileSync(path.join(__dirname + "/uploads/" + req.file.filename)),
            contentType: "image/png"
        }
    }
    const newImage = new ImageModel({
        image: obj.img
    });

    newImage.save((err) => {
        err ? console.log(err) : res.redirect("/");
    });
});



app.listen(5000, () => {
  console.log("Server is listening on Port 5000");
});
