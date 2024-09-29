import React from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import CONSTANTS from "../constants.json";

const Header = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center gap-5 px-8 py-3 bg-slate-800">
      <div className="flex">
        <div className="bg-white rounded-lg p-2 flex justify-center items-center">
          <img src="/logo02.png" alt="logo" width="80" />
        </div>
        <div className="text-gray-300 font-semibold text-md max-w-[350px] flex justify-center items-center text-center">
          {CONSTANTS.PROJECT_NAME}
        </div>
      </div>
      <button
        className="bg-white text-red-500 rounded-md px-4 hover:bg-red-500 hover:text-white py-1 shadow-lg font-semibold transition duration-200 border border-red-500"
        onClick={() => {
          Cookies.remove("accessToken");
          navigate("/");
        }}
      >
        {CONSTANTS.BUTTON.LOGOUT}
      </button>
    </div>
  );
};

export default Header;
