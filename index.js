const { MongoClient, Admin } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 9000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0qtlc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    console.log('database connected');
    await client.connect();
    const database = client.db('Electro-cart-server');
    const productsCollection = database.collection('products');
    const UsersCollection = database.collection('users');
    const ordersCollection = database.collection('orders');

    //  GET all Products///
    app.get('/products', async (req, res) => {
      const cursor = productsCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    // get specific product
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productsCollection.findOne(query);
      res.send(product);
    });

    // POST ALL USERS ///
    app.post('/users', async (req, res) => {
      console.log('user Post api hit');
      const user = req.body;

      const result = await UsersCollection.insertOne(user);

      res.send(result);
    });

    //  Update For Google USers///
    app.post('/users', async (req, res) => {
      const user = req.body;

      const filter = { email: user.email };
      console.log(user);
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await UsersCollection.updateOne(
        filter,
        updateDoc,
        options
      );

      res.json(result);
    });

    // Get All USers //

    app.get('/users', async (req, res) => {
      const cursor = UsersCollection.find({});

      const result = await cursor.toArray();
    });

    // POST order API
    app.post('/orders', async (req, res) => {
      const product = req.body;

      const result = await ordersCollection.insertOne(product);
      res.json(result);
    });

    // get orders
    app.get('/orders', async (req, res) => {
      const cursor = ordersCollection.find({});
      const products = await cursor.toArray();
      res.json(products);
    });

    // UPDATE status API
    app.put('/orders/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          status: 'shifted',
        },
      };
      const result = await ordersCollection.updateOne(filter, updateDoc);
      console.log(result);
      res.send(result);
    });

    // DELETE ORDERS
    app.delete('/orders/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.json(result);
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
