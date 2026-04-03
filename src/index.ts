import express, { Request as req, Response as res } from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  	res.send('Alive and kicking!');
});

app.listen(PORT, () => {
  	console.log(`Server is running on http://localhost:${PORT}`);
});
