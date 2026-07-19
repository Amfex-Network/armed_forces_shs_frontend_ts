import React from "react";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import { RiAdminFill } from "react-icons/ri";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import { GrDocumentPerformance } from "react-icons/gr";
import { BiSolidReport } from "react-icons/bi";

const SystemFeatures = () => {
  return (
    <div className="flex flex-col items-center text-center justify-center w-full h-auto px-4 md:px-8 lg:px-24 py-8">
      {/* Header */}
      <div className="flex gap-2 mb-8 text-[var(--royal-blue)]">
        <span className="features-spin">
          {" "}
          <SettingsSuggestIcon sx={{ fontSize: 40 }} />
        </span>
        <h1 className="text-3xl font-bold mt-2">System Features</h1>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {/* Card 1 */}
        <div className="bg-gray-100 py-6 px-6 flex items-center justify-center flex-col rounded-xl shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-105 cursor-pointer">
          <div className="bg-gradient-to-b to-[var(--danger)] via-[var(--accent-red)] from-[var(--accent-dark-red)] w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <RiAdminFill size={28} className="text-white" />
          </div>
          <h1 className="font-semibold text-lg mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 text-sm">
            Complete control center for system management and configuration
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-gray-100 py-6 px-6 flex items-center justify-center flex-col rounded-xl shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-105 cursor-pointer">
          <div className="bg-gradient-to-b to-[var(--success-dark)] from-[var(--success)] w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <CreditScoreIcon
              sx={{
                fontSize: 40,
                color: "white",
              }}
            />
          </div>
          <h1 className="font-semibold text-lg mb-2">Score Entry</h1>
          <p className="text-gray-600 text-sm">
            Streamlined grade input with spreadsheet-like interface
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-gray-100 py-6 px-6 flex items-center justify-center flex-col rounded-xl shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-105 cursor-pointer">
          <div className="bg-gradient-to-b to-[var(--royal-blue-dark)] from-[var(--info)] w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <GrDocumentPerformance size={28} className="text-white font-bold" />
          </div>
          <h1 className="font-semibold text-lg mb-2">Performance Analytics</h1>
          <p className="text-gray-600 text-sm">
            Visual grade trends and performance insights
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-gray-100 py-6 px-6 flex items-center justify-center flex-col rounded-xl shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-105 cursor-pointer">
          <div className="bg-gradient-to-b to-purple-700 from-purple-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <BiSolidReport size={28} className="text-white font-bold" />
          </div>
          <h1 className="font-semibold text-lg mb-2">Digital Report Cards</h1>
          <p className="text-gray-600 text-sm">
            Downloadable PDF reports with professional templates
          </p>
        </div>
      </div>
    </div>
  );
};

export default SystemFeatures;
