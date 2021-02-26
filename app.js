const express = require("express");
const mongoose = require("mongoose");
const authRouter = require('./routes/authRoutes')

const app = express();

const dbURL =
  "mongodb+srv://Maksim:Ebaloff1337228@auth.owkca.mongodb.net/Auth?retryWrites=true&w=majority";

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.json());

mongoose
  .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(3001))
  .catch((err) => console.log(err));

const block = [
  { img: "/images/premium/Offline.svg", name: "Offline mode.", description: "Save and listen anywhere." },
  { img: "/images/premium/HQ.svg", name: "High quality audio.", description: "Enjoy the full range of sound." },
  { img: "/images/premium/NoADS.svg", name: "No ads.", description: "Enjoy nonstop music." },
  { img: "/images/premium/UnlimSkips.svg", name: "Unlimited skips.", description: "Just tap skip." },
];

app.get("/", (req, res) => {
  res.render("pages/index", { block });
});

app.use(authRouter)
