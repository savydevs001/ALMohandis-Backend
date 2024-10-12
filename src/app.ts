import path from 'path';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/health", (req, res) => {
  res.send("All System is running");
});

app.listen(PORT, () =>
  console.log(`server running in http://localhost:${PORT}`)
);
