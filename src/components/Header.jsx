import React, { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import CONSTANTS from "../constants.json";
import ChangePassword from "./ChangePassword";

const Header = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center gap-5 px-8 py-3 bg-slate-800">
      <div className="flex">
        <div className="bg-white rounded-lg p-2 flex justify-center items-center">
          <img src="/logo02.png" alt="logo" width="80" />
        </div>
        <div className="text-gray-200 font-[cursive] font-semibold text-md max-w-[350px] flex justify-center items-center text-center">
          {CONSTANTS.PROJECT_NAME}
        </div>
      </div>
      <div className="flex gap-3 flex-wrap-reverse justify-end">
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md"
        >
          {CONSTANTS.BUTTON.CHANGE_PASSWORD}
        </button>
        <button
          className="bg-white text-red-500 rounded-md px-4 py-1 shadow-lg font-semibold transition duration-200"
          onClick={() => {
            Cookies.remove("accessToken");
            navigate("/");
          }}
        >
          {CONSTANTS.BUTTON.LOGOUT}
        </button>
      </div>
      {isModalOpen && <ChangePassword closeModal={() => setModalOpen(false)} />}
    </div>
  );
};

export default Header;
