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
    const usersCollection = database.collection('users');
    const ordersCollection = database.collection('orders');
    const ratingsCollection = database.collection('ratings');
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

      const result = await usersCollection.insertOne(user);

      res.send(result);
    });

    //  Update For Google USers///
    app.post('/users', async (req, res) => {
      const user = req.body;

      const filter = { email: user.email };
      console.log(user);
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );

      res.json(result);
    });

    // POST order API
    app.post('/orders', async (req, res) => {
      const product = req.body;

      const result = await ordersCollection.insertOne(product);
      res.json(result);
    });

    //  GET all Products///
    app.get('/products', async (req, res) => {
      const cursor = productsCollection.find({});

      const result = await cursor.toArray();

      res.json(result);
    });

    // get all Orders //

    app.get('/orders', async (req, res) => {
      const cursor = ordersCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    //  Update For Google USers///
    app.post('/users', async (req, res) => {
      const user = req.body;

      const filter = { email: user.email };
      console.log(user);
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );

      res.json(result);
    });

    //  update Admin ROle ///

    app.put('/users', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };

      console.log(user.email);

      const updateDoc = {
        $set: {
          role: 'admin',
        },
      };

      const result = await usersCollection.updateOne(filter, updateDoc);

      res.json(result);
    });

    // Get All USers //

    app.get('/users', async (req, res) => {
      const cursor = usersCollection.find({});

      const result = await cursor.toArray();

      res.json(result);
    });

    //  Get Admins ///

    app.get('/user/admin/:email', async (req, res) => {
      const email = req.params.email;
      let isAdmin = false;
      const query = { email: email };
      const user = await usersCollection.findOne(query);

      if (user?.role === 'admin') {
        isAdmin = true;
      }

      res.json({ admin: isAdmin });
    });

    //  change pending to active //
    app.put('/orders/:id', async (req, res) => {
      const id = req.params.id;
      console.log('id ', id);

      const updateUser = req.body;
      console.log(updateUser);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: false };
      const updateDoc = {
        $set: {
          status: `shipped`,
        },
      };

      const result = await ordersCollection.updateMany(
        filter,
        updateDoc,
        options
      );

      res.json(result);
    });

    //  delete order as Admin ///

    app.delete('/orders/:id', async (req, res) => {
      const id = req.params.id;

      const query = { _id: ObjectId(id) };

      const result = await ordersCollection.deleteOne(query);

      res.send(result);
    });

    // Add New tool to Data base //
    app.post('/products', async (req, res) => {
      const product = req.body;

      const result = await productsCollection.insertOne(product);

      res.send(result);
    });

    // get all Orders //

    app.get('/orders', async (req, res) => {
      const cursor = ordersCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    //  Get User Orders //

    app.get('/order/:email', async (req, res) => {
      const userEmail = req.params.email;

      const query = { email: userEmail };
      const cursor = ordersCollection.find(query);
      const result = await cursor.toArray();
      res.json(result);
    });

    // get orders
    app.get('/orders', async (req, res) => {
      const cursor = ordersCollection.find({});
      const products = await cursor.toArray();
      res.json(products);
    });

    // // DELETE ORDERS
    // app.delete('/orders/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await ordersCollection.deleteOne(query);
    //   res.json(result);
    // });
    //  Delete User Purchase //

    app.delete('/order/:email', async (req, res) => {
      const id = req.params.email;

      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.send(result);
    });

    // get Ratings by users ///

    app.get('/reviews', async (req, res) => {
      const cursor = ratingsCollection.find({});

      const result = await cursor.toArray();
      res.json(result);
    });
    // POst Ratings By users //
    app.post('/reviews', async (req, res) => {
      const data = req.body;

      const result = await ratingsCollection.insertOne(data);

      res.send(result);
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
