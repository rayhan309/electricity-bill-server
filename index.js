const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = 3000;

// Midlear
app.use(cors());
app.use(express.json());

// MongoDB
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.sr4duj3.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const run = async () => {
  try {
    // clinet
    const electicty = client.db("electicty");
    const slidesCollections = electicty.collection("slides");
    const categoryCollections = electicty.collection("category");
    const pyBillsColections = electicty.collection("pyBills");
    const aiColections = electicty.collection("aiMonthly");
    const analyticsColections = electicty.collection("analytics");

    app.post("/slides", async (req, res) => {
      const newProduct = req.body;
      const result = await slidesCollections.insertOne(newProduct);
      res.send(result);
    });

    app.get("/slides", async (req, res) => {
      console.log("ok console");
      const query = slidesCollections.find();
      const result = await query.toArray();
      res.send(result);
    });

    // category
    app.post("/category", async (req, res) => {
      const newProduct = req.body;
      // console.log("ok console");
      newProduct.date = new Date(newProduct.date);
      const result = await categoryCollections.insertOne(newProduct);
      res.send(result);
    });

    app.get("/category", async (req, res) => {
      const query = categoryCollections.find();
      const result = await query.toArray();
      res.send(result);
    });

    app.get("/category/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await categoryCollections.findOne(query);
      res.send(result);
    });

    app.get("/categories/limit", async (req, res) => {
      const query = categoryCollections.find().limit(6);
      const result = await query.toArray();
      res.send(result);
    });

    // py biill
    app.post("/pyBills", async (req, res) => {
      const newPyBill = req.body;
      const result = await pyBillsColections.insertOne(newPyBill);
      res.send(result);
    });

    app.get("/pyBills", async (req, res) => {
      const userEmail = req.query.email;
      const query = {};
      if (userEmail) {
        console.log(userEmail);
        query.email = userEmail;
      }
      const allPyBills = pyBillsColections.find(query);
      const result = await allPyBills.toArray();
      res.send(result);
    });

    // puct
    app.patch("/pyBills/:id", async (req, res) => {
      const id = req.params.id;
      const updatePyBill = req.body;
      const query = { _id: new ObjectId(id) };
      const updateBill = { $set: {
        name: updatePyBill.name,
        date: updatePyBill.date,
        phone: updatePyBill.phone,
        address: updatePyBill.address
      }}
      const result = await pyBillsColections.updateOne(query, updateBill);
      res.send(result);
    });

    app.delete("/pyBills/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await pyBillsColections.deleteOne(query);
      res.send(result);
    });

    app.post("/aiMonthly", async (req, res) => {
      const newProduct = req.body;
      const result = await aiColections.insertOne(newProduct);
      res.send(result);
    });

    app.get("/aiMonthly", async (req, res) => {
      console.log("ok console");
      const query = aiColections.find();
      const result = await query.toArray();
      res.send(result);
    });

    app.post("/analytics", async (req, res) => {
      const newProduct = req.body;
      const result = await analyticsColections.insertOne(newProduct);
      res.send(result);
    });

    app.get("/analytics", async (req, res) => {
      console.log("ok console");
      const query = analyticsColections.find();
      const result = await query.toArray();
      res.send(result);
    });

    await client.connect();

    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
};
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("This Server Is Running!");
});

app.listen(port, () => {
  console.log(`This Server Is Running! ${port}`);
});
