import React, { useState, useEffect, useRef } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import CONSTANTS from "../constants.json";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";

const HeaderDropdown = ({ setModalOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { userRole } = useSelector((state) => state.userDetailsSlice.details);

  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Function to set userRole
  const setRole = (role) => {
    if (role === "1") {
      return "Verifier";
    } else if (role === "2") {
      return "Finance";
    } else if (role === "3") {
      return "DC Administration";
    } else {
      return "Inputer";
    }
  };

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        className="inline-flex items-center justify-center w-full rounded-md px-4 py-2 bg-white text-gray-500 text-sm font-medium hover:text-gray-700 focus:text-blue-500 focus:outline-none shadow-md"
      >
        <div className="flex gap-1 items-center">
          Options
          {isOpen ? <IoIosArrowUp size={18} /> : <IoIosArrowDown size={18} />}
        </div>
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 transition duration-200 ease-in-out transform">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <div className="px-4 py-2 text-md text-gray-700">
              Signed in as{" "}
              <span className="font-semibold text-blue-600">
                {setRole(userRole)}
              </span>
            </div>
            <hr className="my-1" />
            <div
              className="block cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition duration-150"
              role="menuitem"
              onClick={() => setModalOpen(true)}
            >
              {CONSTANTS.BUTTON.CHANGE_PASSWORD}
            </div>
            <div
              className="block cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition duration-150"
              role="menuitem"
              onClick={() => {
                Cookies.remove("accessToken");
                navigate("/");
              }}
            >
              {CONSTANTS.BUTTON.LOGOUT}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderDropdown;
