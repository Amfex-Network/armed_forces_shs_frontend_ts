import React from "react";
import Navbar from "./common/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "./common/Footer";

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;
