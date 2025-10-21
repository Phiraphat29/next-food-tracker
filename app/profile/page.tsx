"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  gender?: string;
  avatar_url?: string;
}

export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch user session data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Get current session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Error getting session:", sessionError);
          alert("เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้: " + sessionError.message);
          router.push("/login");
          return;
        }

        if (!session?.user) {
          alert("กรุณาเข้าสู่ระบบก่อน");
          router.push("/login");
          return;
        }

        // Try to get user profile data from profiles table (if it exists)
        let profileData = null;
        try {
          const { data, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (!profileError) {
            profileData = data;
          }
        } catch {
          console.log(
            "Profiles table doesn't exist or no profile found, using session data"
          );
        }

        // Create user profile from available data
        const userProfile = {
          id: session.user.id,
          email: session.user.email || "",
          full_name:
            profileData?.full_name ||
            session.user.user_metadata?.full_name ||
            "",
          gender:
            profileData?.gender || session.user.user_metadata?.gender || "",
          avatar_url:
            profileData?.avatar_url ||
            session.user.user_metadata?.avatar_url ||
            null,
        };

        setUser(userProfile);
        setFullName(userProfile.full_name);
        setEmail(userProfile.email);
        setGender(userProfile.gender);
        setImagePreview(userProfile.avatar_url);
      } catch (error) {
        console.error("Error:", error);
        alert("เกิดข้อผิดพลาดในการโหลดข้อมูล");
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      if (!user) {
        alert("ไม่พบข้อมูลผู้ใช้");
        return;
      }

      // Upload new image if selected
      let avatar_url = imagePreview;
      if (image) {
        const new_image_file_name = `${Date.now()}-${image.name}`;
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(new_image_file_name, image);

        if (uploadError) {
          alert("พบปัญหาในการอัปโหลดรูปภาพ");
          console.log(uploadError.message);
          return;
        } else {
          const { data } = await supabase.storage
            .from("avatars")
            .getPublicUrl(new_image_file_name);
          avatar_url = data.publicUrl;
        }
      }

      // Update password if provided
      if (password) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: password,
        });
        if (passwordError) {
          alert("พบปัญหาในการอัปเดตรหัสผ่าน");
          console.log(passwordError.message);
          return;
        }
      }

      // Try to update profile data (if profiles table exists)
      try {
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: user.id,
          full_name: fullName,
          gender: gender,
          avatar_url: avatar_url,
          updated_at: new Date().toISOString(),
        });

        if (profileError) {
          console.log(
            "Profiles table doesn't exist or update failed:",
            profileError.message
          );
          // Continue without profile update - just update auth metadata
        }
      } catch {
        console.log("Profiles table doesn't exist, skipping profile update");
      }

      alert("อัปเดตข้อมูลโปรไฟล์สำเร็จ");
    } catch (error) {
      console.error("Update profile error:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดตข้อมูลโปรไฟล์");
    } finally {
      setIsUpdating(false);
    }
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
          {isLoading ? (
            <div className="py-8 text-center text-gray-500">
              กำลังโหลดข้อมูลโปรไฟล์...
            </div>
          ) : (
            <>
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
                    <Image
                      src={imagePreview}
                      alt="Image Preview"
                      width={128}
                      height={128}
                      className="w-32 h-32 object-cover rounded-full border-4 border-purple-500 shadow-md"
                      unoptimized={true}
                    />
                  </div>
                )}
              </div>

              {/* ปุ่มบันทึก */}
              <button
                type="submit"
                disabled={isUpdating}
                className={`mt-6 w-full font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform focus:outline-none ${
                  isUpdating
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple-600 hover:scale-105 hover:bg-purple-700"
                } text-white`}
              >
                {isUpdating ? "กำลังอัปเดต..." : "Save Changes"}
              </button>
            </>
          )}
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
