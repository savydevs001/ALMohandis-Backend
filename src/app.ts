// src/index.ts
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
// import userRoutes from './routes/userRoutes';
import courseRoutes from '../src/routes/course/course';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
// app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
