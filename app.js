import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

/* BodyParser Middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* Enable CORS */
app.use(cors());

const PORT = process.env.PORT || 3000;

/* Set the PORT and Start Web Server */
app.set('port', PORT || 3000);
const server = app.listen(PORT, () => {
  console.log('Server: ' + PORT);
});

/* MongoDB Connection */
mongoose.set('useCreateIndex', true);

try {
  mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    (err, res) => {
      if (err) throw err;

      console.log('DB online');
    }
  );
} catch (err) {
  console.log(err);
}
