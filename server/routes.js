const express = require("express");
const router = express.Router();
const { getConnectedClient } = require("./database");
const { ObjectId } = require("mongodb");

// Function to get the collection from the connected client
const getCollection = async () => {
  try {
    const client = await getConnectedClient();
    const collection = client.db("todosdb").collection("todos");
    return collection;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
};

// GET /todos
router.get("/todos", async (req, res) => {
  try {
    const collection = await getCollection(); // Corrected: Added await
    const todos = await collection.find({}).toArray();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /todos
router.post("/todos", async (req, res) => {
  try {
    const collection = await getCollection(); // Corrected: Added await
    let { todo } = req.body;

    if (!todo) {
      return res.status(400).json({ messg: "error no todo found" });
    }

    todo = typeof todo === "string" ? todo : JSON.stringify(todo);

    const newTodo = await collection.insertOne({ todo, status: false }); // Corrected: Added await
    res.status(201).json({ todo, status: false, _id: newTodo.insertedId });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /todos/:id
router.delete("/todos/:id", async (req, res) => {
  try {
    const collection = await getCollection();
    const id = new ObjectId(req.params.id);
    const deletedToDo = await collection.deleteOne({ _id: id });

    res.status(200).json(deletedToDo);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});


// PUT /todos/:id
router.put("/todos/:id", async (req, res) => {
  try {
    const collection = await getCollection();
    const id = new ObjectId(req.params.id);
    const { status } = req.body;

    if (typeof status !== "boolean") {
      return res.status(400).json({ messg: "Invalid status" });
    }

    const updatedTodo = await collection.updateOne(
      { id },
      { $set: { status: !status } }
    );

    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
