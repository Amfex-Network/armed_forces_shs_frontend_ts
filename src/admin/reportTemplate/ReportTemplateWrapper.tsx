// admin/reportTemplate/ReportTemplateWrapper.jsx
import React from "react";
import { useStudents } from "../../context/StudentContext";
import StudentSelector from "./StudentSelector";
import ReportTemplate from "./ReportTemplate";

const ReportTemplateWrapper = () => {
  const { students, selectedStudent, setSelectedStudent, loading } =
    useStudents();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cadet records...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <StudentSelector
        students={students}
        onSelectStudent={setSelectedStudent}
        selectedStudent={selectedStudent}
      />

      {selectedStudent ? (
        <ReportTemplate selectedStudent={selectedStudent} />
      ) : (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg text-center">
          <p className="text-yellow-700 font-medium">
            Please select a cadet from the dropdown above to generate their
            report card.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReportTemplateWrapper;
