const { MongoClient, Admin } = require("mongodb");
const Objectid=require('mongodb').ObjectId;
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
    await client.connect();
    const database = client.db('Electro-cart-server');
    const productsCollection = database.collection('products');
    const UsersCollection=database.collection('users');
    // Query for a movie that has the title 'Back to the Future'
              
      //  GET all Products///
      app.get('/products',async(req,res)=>{
        const cursor=productsCollection.find({});

        const result=await cursor.toArray()

    res.json(result)
  })
            

  // POST ALL USERS ///
          
  app.post('/users',async (req,res)=>{
    console.log('user Post api hit');
   const user=req.body;

   const result=await UsersCollection.insertOne(user);

   res.send(result)
  
  });

   //  Update For Google USers///
   app.post('/users',async(req,res)=>{

    const user=req.body;

    const filter = { email:user.email};
    console.log(user);
    const options = { upsert: true };
    const updateDoc = {$set:user};
  const result= await  UsersCollection.updateOne(filter,updateDoc,options);

   res.json(result)
  })

   //  update Admin ROle ///

   app.put('/users',async(req,res)=>{

    const user=req.body;
    const filter={email:user.email}
   

    console.log(user.email);

    const updateDoc = {
      $set: {
        role: "admin"
      },
    };

    const result=await UsersCollection.updateOne(filter,updateDoc);

  res.json(result)
   
  })
  

   // Get All USers //

   app.get('/users',async(req,res)=>{

    const cursor =UsersCollection.find({});

      const result=await cursor.toArray()

      res.json(result)
  })

   //  Get Admins ///

   app.get('/user/admin/:email', async(req,res)=>{

    const email= req.params.email;
     let isAdmin=false
    const query={email:email}
    const user=await UsersCollection.findOne(query);

    if(user?.role==="admin"){
      isAdmin=true

    }

    res.json({admin : isAdmin})
 })
 

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/',async(req,res)=>{
           
    res.send("server Running")
          
 
   })

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })