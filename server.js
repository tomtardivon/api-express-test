const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { text } = require("body-parser");

const app = express();
const Schema = mongoose.Schema;
const router = express.Router();

app.use(bodyParser.json());
app.listen(4000, () => {
  console.log("Server is up and running on port 4000");
});

const db = "mongodb+srv://tom-admin:azertyuiop@cluster0.f8q0r.mongodb.net/test";

mongoose.connect(db, { useNewUrlParser: true })
  .then(() => console.log("Bien connecté à la bdd"))
  .catch((err) => console.log(err));

let todoSchema = new Schema({
  text: String,
  isCompleted: Boolean,
});

let Todo = mongoose.model("Todo", todoSchema);

//Routes
app.use("/todos", router);

//get all documents from DB
router.route("/").get(function (req, res) {
  Todo.find(function (err, items) {
    if (err) {
      console.log(err);
    } else {
      res.json(items);
    }
  });
});

//add new document to DB
router.route("/add").post(function (req, res) {
  let note = new Todo(req.body);
  note
    .save()
    .then(() => {
      console.log("todo saved successfully");
      res.status(200).json("todo saved successfully");
    })
    .catch((err) => {
      res.status(400).send("adding to todos failed");
    });
});

/* //to add to dv
router.route("/add").post((req, res) => {
    let todo = new Todo({ text: "text 2", isCompleted: false });
    todo.save()
      .then(() => {
        console.log("todo successfully create");
        res.status(200).json("todo successfully create");
      })
      .catch((err) => {
        res.status(400).json(err);
        console.log(err);
      });
  }); */

//update todo
router.route("/:id").put(function (req, res) {
  console.log(req.params.id);
  Todo.findById(req.params.id, function (err, todo) {
    if (err) {
      res.send(err);
    }
    todo.text = req.body.text;
    todo.isCompleted = req.body.isCompleted;
    todo.save(function (err) {
      if (err) {
        res.send(err);
      }
      console.log("todo updated successfully");
      res.json({ message: "Bravo, mise à jour des données OK" });
    });
  });
});

//remove from DB
router.route("/:id").delete(function (req, res) {
  Todo.findByIdAndRemove(req.params.id, function (err, todo) {
    if (err) {
      res.send(err);
    }
    todo.save(function (err) {
      if (err) {
        res.send(err);
      }
      console.log("todo updated successfully");
      res.json({ message: "todo deleted successfully" });
    });
  });
});






