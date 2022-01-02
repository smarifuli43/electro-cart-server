const { MongoClient, Admin } = require("mongodb");
const ObjectId=require('mongodb').ObjectId;
const express=require('express');
const cors=require('cors');
require("dotenv").config();


const app=(express())




const port =process.env.PORT || 9000;


app.use(express.json())
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0qtlc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try {
    console.log('database connected');
    await client.connect();
    const database = client.db('Electro-cart-server');
    const productsCollection = database.collection('products');
              
      //  GET all Products///
    app.get('/products',async(req,res)=>{
        const cursor=productsCollection.find({});
        const result=await cursor.toArray()
    res.json(result)
      })
    
        // get specific product
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productsCollection.findOne(query);
      res.send(product);
    });

  } finally {
    // Ensures that the client will close when you finish/error
    
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Electro cart server running');
});

app.listen(port, () => {
  console.log(`port running at`, port);
});
