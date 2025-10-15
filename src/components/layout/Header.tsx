"use client";

import { useRouter } from "next/navigation";
import { UserOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useUserByID } from "@/hooks/useUserByID";

const Header = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) setCurrentUser(JSON.parse(user));
  }, []);
  useEffect(() => {
    console.log(currentUser);
  }, [currentUser]);
  const { data: user, error, isLoading } = useUserByID(currentUser?.userId);
  const handleLogOut = () => {
    if (confirm("Bạn có muốn đăng xuất không?")) {
      localStorage.removeItem("currentUser");
      setCurrentUser(null);
      router.push("/auth/login");
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full p-4 flex items-center justify-between bg-white shadow-md z-50">
      <h1
        className="text-2xl font-bold bg-clip-text text-transparent cursor-pointer 
                   bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 via-purple-500 to-pink-500"
        onClick={() => router.push("/")}
      >
        Explore Gallery
      </h1>

      <div className="flex items-center space-x-4">
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition cursor-pointer"
        >
          Home
        </button>
        <button
          onClick={() => {
            if (!currentUser) {
              alert("Cần đăng nhập để dùng tính năng này");
              return;
            }
            router.push("/create");
          }}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition cursor-pointer"
        >
          Upload
        </button>

        {currentUser && (
          <div className="flex items-center space-x-2">
            <UserOutlined className="text-2xl text-gray-700" />
            <select
              onChange={(e) => {
                if (e.target.value === "logout") handleLogOut();
                e.target.value = ""; // reset select
              }}
              className=" px-3 py-2 rounded-md cursor-pointer"
              defaultValue=""
            >
              <option value="" disabled>
                {user?.name || "User"}
              </option>
              <option value="logout">Đăng xuất</option>
            </select>
          </div>
        )}

        {!currentUser && (
          <button
            onClick={() => router.push("/auth/login")}
            className="px-4 py-2 border text-black rounded transition cursor-pointer"
          >
            Đăng nhập
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
