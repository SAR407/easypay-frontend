import React from "react";

function PayrollRow({ payroll, index, user, onVerify, onProcess }) {
  return (
    <tr
      style={{
        background: index % 2 === 0 ? "#f9f9f9" : "#fff",
        textAlign: "center",
      }}
    >
      <td style={tdStyle}>{index + 1}</td>
      <td style={tdStyle}>{payroll.employeeName || "—"}</td>
      <td style={tdStyle}>{payroll.payrollDate?.split("T")[0]}</td>
      <td style={tdStyle}>{payroll.grossSalary.toFixed(2)}</td>
      <td style={tdStyle}>{payroll.taxAmount.toFixed(2)}</td>
      <td style={tdStyle}>{payroll.netSalary.toFixed(2)}</td>
      <td style={tdStyle}>{payroll.isProcessed ? "Processed" : "Pending"}</td>

      {["Admin", "HR", "Finance"].includes(user?.role) && (
        <td style={tdStyle}>
          {["Admin", "HR"].includes(user?.role) && !payroll.isProcessed && (
            <button onClick={() => onVerify(payroll.payrollId)} style={actionBtnStyle}>
              Verify
            </button>
          )}
          {["Admin", "Finance"].includes(user?.role) && !payroll.isProcessed && (
            <button onClick={() => onProcess(payroll.payrollId)} style={actionBtnStyle}>
              Process
            </button>
          )}
        </td>
      )}
    </tr>
  );
}

const tdStyle = {
  padding: "12px",
  border: "1px solid #ddd",
};

const actionBtnStyle = {
  padding: "5px 10px",
  margin: "2px",
  background: "#2980b9",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default PayrollRow;
