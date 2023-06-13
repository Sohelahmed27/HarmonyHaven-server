const express = require('express');
const app = express();
const cors = require('cors')
require("dotenv").config();
const port = process.env.PORT || 5000;


// Midleware 
app.use(express.json());
app.use(cors())

//mongodb start

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri =`mongodb+srv://${process.env.DB_user}:${process.env.DB_password}@cluster0.fbfgu.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    const classCollection = client.db("havenDb").collection("classes")
    const instructorCollection = client.db("havenDb").collection("instructors")
    const cartCollection = client.db("havenDb").collection("carts")


    //api post cart 
    app.post('/carts', async(req, res) => {
      const item = req.body;
      const result = await cartCollection.insertOne(item);
      res.send(result);
    })

    //api with limit
    app.get("/classes", async (req, res) => {
      const result = await classCollection.find().sort({ numberOfStudents: -1 }).limit(6).toArray()
      res.send(result)
    })

    
    //API with all instructor and classes
    app.get("/allClasses", async (req, res) => {
      const result = await classCollection.find().toArray()
      res.send(result)
    })
   

    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
//mongodb end


app.get('/', async (req, res) => {
  res.send('Boss is running')
})

app.listen(port, ()=>{
  console.log(`listening on port ${port}`)
})
