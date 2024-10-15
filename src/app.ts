import express from 'express';
import cors from 'cors';
import AdminControlTeacher from "./routes/admin/managment/teacher"
import courseRoutes from './routes/course/course';
import authRoutes from "./routes/auth/auth"
import cookieParser from "cookie-parser";


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
); 

// Teacher Creates Course Routes
app.use('/api/courses', courseRoutes);

app.use('/api/auth',authRoutes);

// Admin User Management Routes -- teacher
 app.use('/api/admin', AdminControlTeacher);

 // Teachers Route
  // app.use('/api/teachers', teachersRoute);

app.get("/", (req, res) => {
  res.send("All Systems are running");
} );


 app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

