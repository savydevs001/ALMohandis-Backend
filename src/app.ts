import path from 'path';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 5000;



app.listen(PORT, () =>
  console.log(`server running in http://localhost:${PORT}`)
);
