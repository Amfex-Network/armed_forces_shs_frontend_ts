import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-[var(--royal-blue)] to-[var(--royal-blue-dark)] border-b-4 border-red-700 shadow-lg">
      <div className="px-4 md:px-8 lg:px-24 mx-auto  py-4 flex items-center justify-between">
        {/* Logo + Title */}
        <Link to="/">
          <div className="flex items-center gap-4">
            <div className="bg-white p-1 rounded-lg shadow-md">
              <img src={logo} alt="Logo" className=" w-9 h-9" />
            </div>

            <div className="leading-tight">
              <h1 className="text-white text-lg font-extrabold tracking-wide">
                ARMED FORCES SHTS
              </h1>
            </div>
          </div>
        </Link>

        <p className="text-white/90 text-xl md:text-xl lg:text-2xl font-medium">
          Terminal Report Management System
        </p>

        {/* Navigation */}
        <ul className="hidden md:flex items-center gap-10">
          <li>
            <NavLink
              to="/features"
              className={({ isActive }) =>
                `text-white font-medium transition duration-200 ${
                  isActive ? "text-blue-200" : "hover:text-blue-200"
                }`
              }
            >
              Features
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-white font-medium transition duration-200 ${
                  isActive ? "text-blue-200" : "hover:text-blue-200"
                }`
              }
            >
              About
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `text-white font-medium transition duration-200 ${
                  isActive ? "text-blue-200" : "hover:text-blue-200"
                }`
              }
            >
              Contact
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
