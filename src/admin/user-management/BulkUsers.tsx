import React, { useState } from "react";
import { toast } from "react-toastify";

const BulkUsers = () => {
  const [loadingType, setLoadingType] = useState(null);

  const allowedTypes = [
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only CSV or Excel files allowed!");
      return;
    }

    setLoadingType(type);

    // simulate upload (replace with real API later)
    setTimeout(() => {
      setLoadingType(null);
      toast.success(type + " uploaded successfully!");
    }, 2000);
  };

  const fileTypes =
    ".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  return (
    <div className="">
      <h1 className="mb-4 font-bold text-[var(--accent-red)]">
        Import Users In Bulk
      </h1>

      <div className="flex gap-4 mb-8 flex-wrap">
        {/* Teachers */}
        <label className="cursor-pointer transition-all  hover:bg-blue-600 bg-[var(--royal-blue)] text-white px-4 py-2 rounded">
          {loadingType === "Teachers" ? "Uploading..." : "Upload Teachers"}
          <input
            type="file"
            hidden
            accept={fileTypes}
            onChange={(e) => handleFileChange(e, "Teachers")}
          />
        </label>

        {/* Parents */}
        <label className="cursor-pointer hover:bg-red-500 bg-[var(--accent-red-dark)] text-white px-4 py-2 rounded">
          {loadingType === "Parents" ? "Uploading..." : "Upload Parents"}
          <input
            type="file"
            hidden
            accept={fileTypes}
            onChange={(e) => handleFileChange(e, "Parents")}
          />
        </label>

        {/* Students */}
        <label className="cursor-pointer bg-purple-500 text-white px-4 py-2 rounded">
          {loadingType === "Students" ? "Uploading..." : "Upload Students"}
          <input
            type="file"
            hidden
            accept={fileTypes}
            onChange={(e) => handleFileChange(e, "Students")}
          />
        </label>
      </div>
    </div>
  );
};

export default BulkUsers;
