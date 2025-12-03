import { useState, useEffect } from 'react';
// import './App.css' (ลบอันนี้ออกได้เลย เราใช้ Tailwind แล้ว)

function App() {
  // 1. สร้างตัวแปร state
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [email, setEmail] = useState("");
  const [job, setJob] = useState("");
  const [userList, setUserList] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // 2. เพิ่ม State สำหรับสลับหน้า (เริ่มที่หน้า home ก่อน)
  const [page, setPage] = useState("home");

  const API_URL = "https://akethana-mern-app.onrender.com"
  const Local_URL = "http://localhost:3001"

  const createUser = async () => {
    try {
      // ใช้ fetch ส่งข้อมูล
      const response = await fetch(`${API_URL}/createUser`, {
        method: "POST", // 1. บอกว่าเป็น POST (ส่งของ)
        headers: {
          "Content-Type": "application/json", // 2. บอกว่าเนื้อหาที่ส่งคือ JSON
        },
        body: JSON.stringify({ // 3. แปลง Object ให้เป็น String JSON
          name: name,
          age: age,
          email: email,
          job: job,
        }),
      });

      // รอรับคำตอบจาก Server
      if (response.ok) {
        const result = await response.json(); // แปลงคำตอบกลับมาเป็น Object
        alert("บันทึกข้อมูลสำเร็จ!");
        console.log("Server ตอบกลับ:", result);
      } else {
        alert("บันทึกไม่สำเร็จ T_T");
      }

    } catch (error) {
      console.error("Error:", error);
      alert("ติดต่อ Server ไม่ได้");
    }
  };

  const registerUser = async () => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          password: password,
          name: name,
          age: age,
          email: email,
          job: job
        }),
      });

      if (response.ok) {
        alert("สมัครสมาชิกสำเร็จ!");
        setPage("home"); // สมัครเสร็จ เด้งกลับไปหน้าหลัก
        // ล้างค่าในฟอร์มหน่อย
        setUsername(""); setPassword(""); setName(""); setAge(0); setEmail(""); setJob("");
      } else {
        alert("สมัครไม่ผ่าน (Username อาจซ้ำ)");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // ทำงาน 1 ครั้ง ตอนเปิดเว็บ
  useEffect(() => {
    const getUsers = async () => {
      try {
        // ยิงไปขอข้อมูล (Method default คือ GET อยู่แล้ว ไม่ต้องใส่ options ก็ได้)
        const response = await fetch(`${API_URL}/getUsers`);

        if (response.ok) {
          const data = await response.json(); // แปลง JSON เป็น Object Array
          setUserList(data); // เอาของใส่ตะกร้า userList
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    getUsers(); // เรียกใช้ฟังก์ชันทันที
  }, []); // [] ว่างๆ แปลว่าทำแค่รอบเดียวตอนเริ่ม

  const deleteUser = async (id) => {
    try {
      // ส่งคำสั่ง DELETE ไปที่ Server พร้อมแนบ ID ไปด้านหลัง URL
      const response = await fetch(`${API_URL}/deleteUser/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // ถ้าลบสำเร็จ ให้กรองเอาคนที่ถูกลบออกจากรายชื่อในหน้าจอ (จะได้ไม่ต้องกด F5)
        setUserList(userList.filter((user) => user._id !== id));
        alert("ลบเรียบร้อย!");
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const updateUser = async (id) => {
    // 1. เด้งถามชื่อใหม่ (ไม่ต้องสร้าง UI ให้เสียเวลา)
    const newAge = prompt("กรอกชื่อใหม่ที่ต้องการแก้ไข:");

    // ถ้าเขากด Cancel หรือไม่กรอก ก็จบกัน ไม่ทำต่อ
    if (!newAge) return;

    try {
      // 2. ยิงไปหลังบ้าน
      const response = await fetch(`${API_URL}/updateUser`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: id,         // ส่ง ID ไปบอก
          newAge: newAge // ส่งชื่อใหม่ไปบอก
        }),
      });

      if (response.ok) {
        alert("แก้ไขอายุเรียบร้อย!");

        // 3. อัปเดตหน้าจอโดยไม่ต้องกด F5 (Advance นิดนึง ดูผ่านๆ ได้ครับ)
        setUserList(userList.map(user => {
          // ถ้าเจอคนที่มี id ตรงกัน ให้แก้ชื่อ เป็นชื่อใหม่
          return user._id === id ? { ...user, age: newAge } : user;
        }));
      }
    } catch (error) {
      console.error("Error updating:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
      <div className="min-h-screen bg-slate-900 text-white p-4 font-sans">

        {/* --- 1. เมนูสลับหน้า (Navbar) --- */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setPage("home")}
            className={`px-4 py-2 rounded font-bold ${page === "home" ? "bg-blue-600" : "bg-slate-700"}`}
          >
            หน้าหลัก (CRUD)
          </button>
          <button
            onClick={() => setPage("register")}
            className={`px-4 py-2 rounded font-bold ${page === "register" ? "bg-blue-600" : "bg-slate-700"}`}
          >
            สมัครสมาชิก
          </button>
        </div>

        {/* --- 2. หน้าหลัก (CRUD เดิม) --- */}
        {page === "home" && (
          <div className="flex flex-col items-center">
            {/* ... (เอาโค้ดแสดงรายชื่อ userList เดิมของคุณมาวางตรงนี้) ... */}
            {/* --- ส่วนแสดงรายชื่อ (Zone นี้เพิ่มใหม่) --- */}
            <div className="w-full max-w-md mt-10">
              <h2 className="text-xl font-bold mb-4 text-green-400 border-b border-gray-600 pb-2">
                รายชื่อสมาชิก ({userList.length} คน)
              </h2>

              {/* วนลูป userList ออกมาโชว์ */}
              <div className="space-y-3">
                {userList.map((user) => (
                  <div
                    key={user._id}
                    className="bg-slate-700 p-4 rounded flex justify-between items-center hover:bg-slate-600 transition"
                  >
                    {/* ส่วนแสดงข้อมูล (ของเดิม) */}
                    <div>
                      <h3 className="font-bold text-lg text-white">{user.name}</h3>
                      <p className="text-sm text-gray-400">อายุ: {user.age} | {user.email} | {user.job}</p>
                    </div>

                    <button
                      onClick={() => updateUser(user._id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded ml-2 font-bold"
                    >
                      แก้ไขอายุ
                    </button>

                    {/* ปุ่มลบ (เพิ่มใหม่) */}
                    <button
                      onClick={() => deleteUser(user._id)} // ส่ง ID ของคนนี้ไปให้ฟังก์ชันลบ
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded ml-4 font-bold"
                    >
                      ลบ
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* ... (และเอาฟอร์ม "ลงทะเบียนสมาชิก" อันเดิม มาวางต่อท้ายตรงนี้) ... */}
            {/* กล่องแบบฟอร์ม */}
            <div className="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-md border border-slate-700">
              <h1 className="text-2xl font-bold mb-4 text-center text-blue-400">
                ลงทะเบียนสมาชิก
              </h1>

              {/* --- ส่วนที่เราจะเขียน Input ต่อไปนี้ --- */}
              <div className="space-y-4">

                {/* ช่องกรอกชื่อ */}
                <input
                  type="text"
                  placeholder="ชื่อ-นามสกุล"
                  className="w-full p-2 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:border-blue-500"
                  // เชื่อมตัวแปร: เมื่อพิมพ์ ให้เอาค่าไปใส่ในตัวแปร name
                  onChange={(event) => setName(event.target.value)}
                />

                {/* ช่องกรอกอายุ */}
                <input
                  type="number"
                  placeholder="อายุ"
                  className="w-full p-2 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:border-blue-500"
                  onChange={(event) => setAge(event.target.value)}
                />

                {/* ช่องกรอกอีเมล */}
                <input
                  type="text"
                  placeholder="อีเมล"
                  className="w-full p-2 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:border-blue-500"
                  onChange={(event) => setEmail(event.target.value)}
                />

                <input
                  type='text'
                  placeholder='งาน'
                  className='w-full p-2 rounded bg-slate-700 border border-slate-600 focus:outline-none focus:border-blue-500'
                  onChange={(event) => setJob(event.target.value)}
                />

                <button onClick={createUser} className="w-full bg-blue-600 hover:bg-blue-500 p-2 rounded font-bold transition">
                  บันทึกข้อมูล
                </button>

              </div>
            </div>

            {/* ⚠️ หมายเหตุ: ก๊อปของเดิมมาวางได้เลยครับ แค่เอามาใส่ในวงเล็บปีกกานี้ */}
            <p className="text-gray-400 mt-4">--- ส่วนนี้คือหน้า Home เดิม ---</p>
          </div>
        )}

        {/* --- 3. หน้าสมัครสมาชิก (ของใหม่) --- */}
        {page === "register" && (
          <div className="flex justify-center">
            <div className="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-slate-700">
              <h1 className="text-3xl font-bold mb-6 text-center text-green-400">สร้างบัญชีใหม่</h1>

              <div className="space-y-4">
                {/* Username & Password */}
                <input type="text" placeholder="Username (ห้ามซ้ำ)"
                  className="w-full p-3 rounded bg-slate-900 border border-slate-600"
                  onChange={(e) => setUsername(e.target.value)} value={username} />

                <input type="password" placeholder="Password"
                  className="w-full p-3 rounded bg-slate-900 border border-slate-600"
                  onChange={(e) => setPassword(e.target.value)} value={password} />

                <div className="border-t border-slate-600 my-4"></div>

                {/* ข้อมูลส่วนตัว (ใช้ State ชุดเดิมได้เลย) */}
                <input type="text" placeholder="ชื่อ-นามสกุล" className="w-full p-3 rounded bg-slate-900 border border-slate-600"
                  onChange={(e) => setName(e.target.value)} />
                <input type="number" placeholder="อายุ" className="w-full p-3 rounded bg-slate-900 border border-slate-600"
                  onChange={(e) => setAge(e.target.value)} />
                <input type="text" placeholder="อีเมล" className="w-full p-3 rounded bg-slate-900 border border-slate-600"
                  onChange={(e) => setEmail(e.target.value)} />
                <input type="text" placeholder="อาชีพ" className="w-full p-3 rounded bg-slate-900 border border-slate-600"
                  onChange={(e) => setJob(e.target.value)} />

                <button onClick={registerUser} className="w-full bg-green-600 hover:bg-green-500 p-3 rounded font-bold text-lg mt-4">
                  ยืนยันการสมัคร
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;