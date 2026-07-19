import React from "react";
import StudentBulkImport from "./StudentBulkImport";
import StudentProfileView from "./StudentProfileView";

const StudentManagement = () => {
  return (
    <div>
      <h1>Student Management</h1>
      <StudentBulkImport />
      <StudentProfileView />
    </div>
  );
};

export default StudentManagement;
