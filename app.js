const express = require("express");
const path = require("path");
const app = express();
const port = 800;
const bodyparser = require("body-parser");

const mongoose = require("mongoose"); //Mongoose Specific Stuff
mongoose.connect("mongodb://localhost/registrations", {
  useNewUrlParser: true,
});

//Express specific stuff
app.use("/static", express.static("static")); //Serving static files
app.use(express.urlencoded());

//PUG specific stuff
app.set("view engine", "pug"); //set template engine as PUG
app.set("views", path.join(__dirname, "views")); //set views directory

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Mongoose
var registerSchema = new mongoose.Schema({
  reg_username: { type: String, required: true, unique: true },
  reg_name: { type: String, required: true },
  reg_number: { type: Number, required: true, unique: true },
  reg_email: { type: String, required: true, unique: true },
  reg_pass: { type: String, required: true, unique: true },
});
var Register = mongoose.model("Register", registerSchema);

//End Points
app.get("/", (req, res) => {
  const params = {};
  res.status(200).render("home.pug", params);
});

// page get requests
app.get("/loginPage", (req, res) => {
  const params = {};
  res.status(200).render("login.pug", params);
});

app.get("/registerPage", (req, res) => {
  const params = {};
  res.status(201).render("register.pug", params);
});

// Form post requests
app.post("/loginForm", async (req, res) => {
    try {
        const loginEmail = req.body.log_email;
        const loginPassword = req.body.log_pass;

        const emailCheck = await Register.findOne({reg_email:loginEmail});
        if (emailCheck.reg_pass === loginPassword){
            res.status(201).render("home.pug");

        } else{
            res.send("Incorrect password")
        }

    } catch (error) {
        res.send("Email does not exist")
    }
});

app.post("/registerForm", (req, res) => {
  var myData = new Register(req.body);
  myData
    .save()
    .then(() => {
      res.send();
      res.status(400).send("Registered Successfully");
    })
    .catch(() => {
      res.status(400).send("Registration failed");
    });
});

//Starting the Server
app.listen(port, () => {
  console.log(`The Server has been started successfully at port ${port}`);
});
