const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
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
    const productsCollections = electicty.collection("productsCollections");

    app.post('/products', async (req, res) => {
        const newProduct = req.body;
        const result = await productsCollections.insertOne(newProduct);
        res.send(result);
    });

    await client.connect();

    await client.db("admin").command({ ping: 1 });
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
