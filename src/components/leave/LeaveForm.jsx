import React, { useState } from "react";

function LeaveForm({ onSubmit }) {
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.startDate || !form.endDate) {
      alert("Please select start and end date.");
      return;
    }
    onSubmit({
      startDate: form.startDate,
      endDate: form.endDate,
      reason: form.reason,
    });
    setForm({ startDate: "", endDate: "", reason: "" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "#fdfdfd",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        maxWidth: "700px",
        marginBottom: "20px",
      }}
    >
      

      <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          style={inputStyle}
          required
        />
        <input
          type="date"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
          style={inputStyle}
          required
        />
        <input
          type="text"
          name="reason"
          placeholder="Reason"
          value={form.reason}
          onChange={handleChange}
          style={{ ...inputStyle, flex: "1 1 100%" }}
        />
      </div>

      <button type="submit" style={submitBtnStyle}>
        Submit
      </button>
    </form>
  );
}

// Styles
const inputStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  flex: "1 1 200px",
};

const submitBtnStyle = {
  marginTop: "15px",
  padding: "10px 20px",
  background: "#3498db",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  transition: "background 0.2s ease",
};

export default LeaveForm;
