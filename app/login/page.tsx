"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Logic for login submission goes here.
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      alert("พบปัญหาในการล็อกอิน");
      console.log(error.message);
      return;
    } else {
      alert("ล็อกอินสำเร็จ");
      router.push("/profile");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-fuchsia-400 via-purple-500 to-pink-500 p-4">
      <div className="bg-white/70 backdrop-blur-lg p-8 md:p-12 rounded-3xl shadow-2xl text-center max-w-lg w-full border border-white/80">
        {/* หัวข้อ */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-gray-800 drop-shadow-md">
          Welcome Back
        </h1>
        <p className="text-sm md:text-base mb-8 text-gray-600">
          Log in to your account
        </p>

        {/* ฟอร์มล็อกอิน */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
          {/* ช่องป้อนอีเมล์ */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border-2 border-gray-500 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
            required
          />

          {/* ช่องป้อนรหัสผ่าน */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border-2 border-gray-500 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
            required
          />

          {/* ปุ่มล็อกอิน */}
          <button
            type="submit"
            className="mt-6 w-full bg-purple-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:bg-purple-700 focus:outline-none"
          >
            Login
          </button>
        </form>

        {/* ลิงก์ไปยังหน้าลงทะเบียน */}
        <p className="mt-8 text-sm text-gray-600">
          Don{"'"}t have an account?{" "}
          <Link
            href="/register"
            className="text-purple-600 font-bold hover:underline transition-colors"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
