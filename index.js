// import dependencies
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';

// call Express function
const app = express();

const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

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
