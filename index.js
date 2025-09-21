const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;
//middleware
app.use(cors({
  origin:[
    "http://localhost:5173",
  ],
  credentials:true
}))
app.use(express.json())
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ejjba9r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
  //  await client.connect();
    // Send a ping to confirm a successful connection
    const cartcolloection=client.db('lenskart').collection('carts')
    const ordercolloection=client.db('lenskart').collection('orders')
    app.get('/allitems',async(req,res)=>{
      const result=await cartcolloection.find().toArray()
      res.send(result)
    })
    app.get('/allitems/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)}
      const result=await cartcolloection.findOne(query)
      res.send(result)
    })
    app.post('/allorders',async(req,res)=>{
      const order=req.body;
      const result=await ordercolloection.insertOne(order);
      res.send(result)
    })
    app.get('/allorders',async(req,res)=>{
      const email=req.query.email;
      const query={email:email}
      const result=await ordercolloection.find(query).toArray();
      res.send(result)
    })
    app.delete('/allorders/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)}
      const result=await ordercolloection.deleteOne(query);
      res.send(result)
    })
    app.patch('/allorders/:id',async(req,res)=>{
      const id =req.params.id
      const quantity=req.body;
      const filter={_id:new ObjectId(id)}
      const updatedoc={
        $set: {
        orderqty:quantity.orderqty,
        availableqty:quantity.availableqty,
      },
      }
      const result=await ordercolloection.updateOne(filter,updatedoc)
      res.send(result)
    })
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  //  await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
