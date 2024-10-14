"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const teacher_1 = __importDefault(require("./routes/admin/managment/teacher"));
const course_1 = __importDefault(require("../src/routes/course/course"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: "*",
    credentials: true,
}));
// Teacher Creates Course Routes
app.use('/api/courses', course_1.default);
// Admin User Management Routes -- teacher
app.use('/api/admin', teacher_1.default);
app.get("/", (req, res) => {
    res.send("All Systems are running");
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
