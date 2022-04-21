// import dependencies
import express from 'express';
import cors from 'cors';
import 'dotenv/config';

// call Express function
const app = express();

const port = process.env.PORT;

app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
