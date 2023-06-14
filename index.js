const express = require('express');
const { v4: uuidv4 } = require('uuid');
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


    //api related to  carts 
    app.get('/carts', async (req, res) => {
      const email = req.query.email;
      console.log(email);
      if (!email) {
        res.send ([]);
      }
      const query = { email: email };
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    });

    app.post('/carts', async(req, res) => {
      const item = req.body;
      const result = await cartCollection.insertOne(item);
      res.send(result);
    })

    //test
    // app.post('/carts', (req, res) => {
    //   const item = req.body;
    
    //   // Generate a new unique identifier using uuid
    //   const uniqueId = uuidv4();
    
    //   // Check if the generated _id value is unique
    //   havenDb.findOne({ _id: uniqueId })
    //     .then((existinghavenDb) => {
    //       if (existinghavenDb) {
    //         // If a document with the same _id exists, generate a new unique identifier
    //         return res.status(400).json({ success: false, message: 'Duplicate _id value' });
    //       }
    
    //       // Create the new document with the unique _id value
    //       const newCart = new Product({
    //         _id: uniqueId
           
    //       });
    
    //       // Save the new document to the MongoDB collection
    //       newCart.save()
    //         .then(() => {
    //           res.status(201).json({ success: true, message: 'cart created successfully' });
    //         })
    //         .catch((error) => {
    //           res.status(500).json({ success: false, error: error.message });
    //         });
    //     })
    //     .catch((error) => {
    //       res.status(500).json({ success: false, error: error.message });
    //     });
    // });
    

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
