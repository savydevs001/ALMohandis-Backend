import express from 'express';
import cors from 'cors';
import AdminControlTeacher from "./routes/admin/managment/teacher"
import courseRoutes from '../src/routes/course/course';
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

// Admin User Management Routes -- teacher
 app.use('/api/admin', AdminControlTeacher);

app.get("/", (req, res) => {
  res.send("All Systems are running");
} );


 app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

