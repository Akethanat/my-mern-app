const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// --- 1. ต้องมีการเรียกใช้ Model (พิมพ์เขียว) ---
// (เช็คให้ชัวร์นะว่าคุณสร้างไฟล์ models/User.js ไว้แล้ว)
const UserModel = require('./models/User');

const app = express();
const PORT = process.env.PORT | 3001;
const bcrypt = require('bcryptjs');

app.use(cors());
app.use(express.json());

// เชื่อมต่อ MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB successfully!"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));


// --- 2. โซน API (ที่ผมลืมใส่ให้คุณตะกี้) ---

// API ดึงรายชื่อทั้งหมด (GET)
app.get("/getUsers", async (req, res) => {
    try {
        // ไปค้นหา (find) ใน Database มาให้หมดเลย ({})
        const users = await UserModel.find({});
        res.json(users);
    } catch (err) {
        res.json(err);
    }
});

// API สร้างสมาชิกใหม่ (POST)
app.post("/createUser", async (req, res) => {
    try {
        const user = req.body;
        const newUser = new UserModel(user);
        await newUser.save(); // บันทึกลง MongoDB

        res.json(user);
    } catch (err) {
        res.json(err);
    }
});

// API ลบข้อมูล (DELETE)
// :id คือตัวแปรที่เราจะรับเข้ามา (เช่น /deleteUser/654abc...)
app.delete("/deleteUser/:id", async (req, res) => {
    try {
        const id = req.params.id; // รับค่า id จาก URL
        await UserModel.findByIdAndDelete(id); // สั่ง MongoDB ให้ลบคนที่มี id นี้
        res.send("Deleted successfully");
    } catch (err) {
        res.json(err);
    }
});

// API แก้ไขข้อมูล (PUT)
app.put("/updateUser", async (req, res) => {
    const id = req.body.id;           // รับ ID ว่าจะแก้คนไหน
    const newAge = req.body.newAge; // รับชื่อใหม่ที่จะเปลี่ยน

    try {
        // คำสั่ง Mongoose: หา ID นี้ แล้วแก้ name ให้เป็นค่าใหม่
        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            { age: newAge },
            { new: true } // option นี้บอกว่า "แก้เสร็จแล้วส่งค่าใหม่กลับมาให้ดูด้วยนะ"
        );

        res.json(updatedUser);
    } catch (err) {
        res.json(err);
    }
});

// API สมัครสมาชิก (Register)
app.post("/register", async (req, res) => {
    try {
        // 1. รับค่าจากหน้าบ้าน
        // (รับ username, password, name, age, email, job มาให้ครบ)
        const { username, password, name, age, email, job } = req.body;

        // 2. เข้ารหัสรหัสผ่าน
        // 10 คือความยากในการถอดรหัส (Salt Rounds)
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. สร้าง User ใหม่เพื่อบันทึกลง DB
        // (ระวัง! ตรงช่อง password ต้องส่ง hashedPassword ไปเก็บนะ ห้ามส่ง password ดิบๆ)
        const newUser = new UserModel({
            username: username,
            password: hashedPassword, // ✅ ใช้รหัสที่แปลงร่างแล้ว
            name: name,
            age: age,
            email: email,
            job: job
        });

        // 4. สั่งบันทึก
        await newUser.save();

        res.json("User Registered Successfully");

    } catch (err) {
        res.status(500).json(err);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});