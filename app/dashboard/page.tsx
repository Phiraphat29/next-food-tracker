"use client";

import React, { useMemo, useState } from "react";

const mockFoods = [
  {
    id: 1,
    date: "2023-10-27",
    foodName: "ข้าวผัดกะเพราไก่",
    meal: "มื้อกลางวัน",
    imageUrl: "https://placehold.co/100x100/A020F0/ffffff?text=Food+1",
  },
  {
    id: 2,
    date: "2023-10-27",
    foodName: "ส้มตำ",
    meal: "มื้อเย็น",
    imageUrl: "https://placehold.co/100x100/A020F0/ffffff?text=Food+2",
  },
  {
    id: 3,
    date: "2023-10-26",
    foodName: "ผัดไทย",
    meal: "มื้อกลางวัน",
    imageUrl: "https://placehold.co/100x100/A020F0/ffffff?text=Food+3",
  },
  {
    id: 4,
    date: "2023-10-26",
    foodName: "ก๋วยเตี๋ยวเรือ",
    meal: "มื้อกลางวัน",
    imageUrl: "https://placehold.co/100x100/A020F0/ffffff?text=Food+4",
  },
  {
    id: 5,
    date: "2023-10-25",
    foodName: "ข้าวขาหมู",
    meal: "มื้อกลางวัน",
    imageUrl: "https://placehold.co/100x100/A020F0/ffffff?text=Food+5",
  },
  {
    id: 6,
    date: "2023-10-25",
    foodName: "แกงเขียวหวาน",
    meal: "มื้อเย็น",
    imageUrl: "https://placehold.co/100x100/A020F0/ffffff?text=Food+6",
  },
  {
    id: 7,
    date: "2023-10-24",
    foodName: "ต้มยำกุ้ง",
    meal: "มื้อกลางวัน",
    imageUrl: "https://placehold.co/100x100/A020F0/ffffff?text=Food+7",
  },
  {
    id: 8,
    date: "2023-10-24",
    foodName: "ข้าวเหนียวมะม่วง",
    meal: "มื้อเย็น",
    imageUrl: "https://placehold.co/100x100/A020F0/ffffff?text=Food+8",
  },
  {
    id: 9,
    date: "2023-10-23",
    foodName: "ผัดซีอิ๊ว",
    meal: "มื้อเช้า",
    imageUrl: "https://placehold.co/100x100/A020F0/ffffff?text=Food+9",
  },
  {
    id: 10,
    date: "2023-10-23",
    foodName: "ข้าวไข่เจียว",
    meal: "มื้อกลางวัน",
    imageUrl: "https://placehold.co/100x100/A020F0/ffffff?text=Food+10",
  },
];

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredFoods = useMemo(() => {
    return mockFoods.filter((food) =>
      food.foodName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredFoods.length / itemsPerPage);
  const currentFoods = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredFoods.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredFoods]);

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleDelete = (id: number) => {
    console.log(`Deleting food with ID: ${id}`);
    // Implement delete logic here
  };

  const handleEdit = (id: number) => {
    console.log(`Editing food with ID: ${id}`);
    // Implement edit logic here, e.g., redirect to /editfood/:id
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-400 via-purple-500 to-pink-500 p-4">
      <div className="container mx-auto max-w-7xl bg-white/90 backdrop-blur-lg p-8 md:p-12 rounded-3xl shadow-2xl text-gray-800 border border-white/80">
        {/* Header และ Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-center md:text-left drop-shadow-md">
            Dashboard
          </h1>
          <div className="flex w-full md:w-auto gap-2">
            <input
              type="text"
              placeholder="Search food name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors w-full"
            />
            <button
              onClick={handleSearch}
              className="bg-purple-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:bg-purple-700 focus:outline-none"
            >
              Search
            </button>
          </div>
          <a
            href="/addfood"
            className="bg-purple-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:bg-purple-700 focus:outline-none"
          >
            Add Food
          </a>
        </div>

        {/* ตารางแสดงข้อมูล */}
        <div className="overflow-x-auto rounded-2xl shadow-lg">
          <table className="min-w-full bg-white rounded-2xl">
            <thead>
              <tr className="bg-purple-600 text-white text-left text-sm md:text-base">
                <th className="py-4 px-6 rounded-tl-2xl">รูปอาหาร</th>
                <th className="py-4 px-6">วันที่</th>
                <th className="py-4 px-6">ชื่ออาหาร</th>
                <th className="py-4 px-6">มื้ออาหาร</th>
                <th className="py-4 px-6 rounded-tr-2xl">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentFoods.length > 0 ? (
                currentFoods.map((food) => (
                  <tr
                    key={food.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <img
                        src={food.imageUrl}
                        alt={food.foodName}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    </td>
                    <td className="py-4 px-6">{food.date}</td>
                    <td className="py-4 px-6">{food.foodName}</td>
                    <td className="py-4 px-6">{food.meal}</td>
                    <td className="py-4 px-6 flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleEdit(food.id)}
                        className="bg-yellow-500 text-white font-semibold py-2 px-4 rounded-xl hover:bg-yellow-600 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(food.id)}
                        className="bg-red-500 text-white font-semibold py-2 px-4 rounded-xl hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    ไม่พบข้อมูลอาหารที่ตรงกับการค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-purple-500 text-white font-bold py-2 px-4 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-lg font-semibold text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="bg-purple-500 text-white font-bold py-2 px-4 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
