"use client";

import { useState } from "react";
import Link from "next/link";

// Sample data to simulate fetching existing user profile
const mockUserProfile = {
  fullName: "John Doe",
  email: "john.doe@example.com",
  gender: "male",
  imageUrl: "https://placehold.co/100x100/5C2E91/ffffff?text=Profile",
};

export default function Page() {
  const [fullName, setFullName] = useState(mockUserProfile.fullName);
  const [email, setEmail] = useState(mockUserProfile.email);
  const [password, setPassword] = useState(""); // Password is often not pre-filled for security
  const [gender, setGender] = useState(mockUserProfile.gender);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    mockUserProfile.imageUrl
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Logic to update user profile data
    console.log({ fullName, email, password, gender, image });
    alert("Profile has been updated!");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-fuchsia-400 via-purple-500 to-pink-500 p-4">
      <div className="bg-white/90 backdrop-blur-lg p-8 md:p-12 rounded-3xl shadow-2xl text-center max-w-lg w-full border border-white/80">
        {/* หัวข้อ */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-gray-800 drop-shadow-md">
          Edit Profile
        </h1>
        <p className="text-sm md:text-base mb-8 text-gray-600">
          Update your personal details
        </p>

        {/* ฟอร์มแก้ไขข้อมูล */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
          {/* ช่องป้อนชื่อ-สกุล */}
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
            required
          />

          {/* ช่องป้อนอีเมล์ */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
            required
          />

          {/* ช่องป้อนรหัสผ่าน */}
          <input
            type="password"
            placeholder="Password (Leave blank to keep current)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
          />

          {/* ช่องเลือกเพศ */}
          <div className="flex justify-center gap-6 mt-2">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={gender === "male"}
                onChange={(e) => setGender(e.target.value)}
                className="hidden"
              />
              <span
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all ${
                  gender === "male"
                    ? "bg-purple-600 border-purple-600 text-white"
                    : "bg-gray-200 border-gray-400 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {/* Icon or emoji for Male */}
                <span className="text-xl">👨</span>
              </span>
              <span className="ml-2 text-gray-700">Male</span>
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={gender === "female"}
                onChange={(e) => setGender(e.target.value)}
                className="hidden"
              />
              <span
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all ${
                  gender === "female"
                    ? "bg-purple-600 border-purple-600 text-white"
                    : "bg-gray-200 border-gray-400 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {/* Icon or emoji for Female */}
                <span className="text-xl">👩</span>
              </span>
              <span className="ml-2 text-gray-700">Female</span>
            </label>
          </div>

          {/* ปุ่มและ Image Preview สำหรับรูปภาพ */}
          <div className="flex flex-col items-center mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-purple-50 file:text-purple-700
              hover:file:bg-purple-100 cursor-pointer"
            />
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="w-32 h-32 object-cover rounded-full border-4 border-purple-500 shadow-md"
                />
              </div>
            )}
          </div>

          {/* ปุ่มบันทึก */}
          <button
            type="submit"
            className="mt-6 w-full bg-purple-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:bg-purple-700 focus:outline-none"
          >
            Save Changes
          </button>
        </form>

        {/* ปุ่มย้อนกลับ */}
        <div className="mt-4">
          <Link
            href="/dashboard"
            className="w-full inline-block bg-gray-400 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-500 focus:outline-none"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
