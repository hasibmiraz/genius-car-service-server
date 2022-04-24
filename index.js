// import dependencies
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import jwt from 'jsonwebtoken';

// call Express function
const app = express();

const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: 'Unauthorized access' });
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: 'Forbidden' });
    }
    console.log('decoded', decoded);
    req.decoded = decoded;
    next();
  });
};

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@node-mongo-crud.j9vef.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    await client.connect();
    const serviceCollection = client.db('geniusCar').collection('service');
    const orderCollection = client.db('geniusCar').collection('order');

    // AUTH
    app.post('/login', async (req, res) => {
      const user = req.body;
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1D',
      });
      res.send(accessToken);
    });

    // Get all services
    app.get('/services', async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    // Get single service
    app.get('/service/:serviceId', async (req, res) => {
      const id = req.params.serviceId;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });

    // POST Service
    app.post('/service', async (req, res) => {
      const newService = req.body;
      const result = await serviceCollection.insertOne(newService);
      res.send(result);
    });

    // Delete service
    app.delete('/service/:serviceId', async (req, res) => {
      const id = req.params.serviceId;
      const query = { _id: ObjectId(id) };
      const result = await serviceCollection.deleteOne(query);
      res.send(result);
    });

    // Get users order
    app.get('/order', verifyJWT, async (req, res) => {
      const decodedEmail = req.decoded.email;
      const { email } = req.query;
      if (decodedEmail === email) {
        const query = { email };
        const cursor = orderCollection.find(query);
        const orders = await cursor.toArray();
        res.send(orders);
      }
    });
    // Insert an order
    app.post('/order', async (req, res) => {
      const order = req.body;
      const result = orderCollection.insertOne(order);
      res.send(order);
    });
  } finally {
  }
};

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Running server');
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
