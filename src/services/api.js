import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5244/api", // backend URL
});

// Add JWT token to every request if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ---------------- AUTH ----------------
export const login = (username, password) =>
  API.post("/Authentication/Login", { Username: username, Password: password });

export const register = (data) =>
  API.post("/Authentication/Register", data);

// ---------------- EMPLOYEES ----------------
export const getAllEmployees = async () => {
  try {
    const res = await API.get("/Employee/all");
    return res.data;
  } catch (err) {
    console.error("Error:", err.response ? err.response.data : err.message);
    throw err;
  }
};

export const getEmployeeById = (id) => API.get(`/Employee/${id}`);
export const createEmployee = (data) => API.post("/Employee", data);
export const updateEmployee = (id, data) => API.put(`/Employee/${id}`, data);
export const deleteEmployee = (id) => API.delete(`/Employee/${id}`);

// ---------------- USERS ----------------
export const getAllUsers = () => API.get("/User");
export const getUserById = (id) => API.get(`/User/${id}`);
export const createUser = (data) => API.post("/User", data);
export const updateUser = (id, data) => API.put(`/User/${id}`, data);
export const deleteUser = (id) => API.delete(`/User/${id}`);

// ---------------- TIMESHEETS ----------------
export const addTimesheet = (data) => API.post("/Timesheet/add", data);
export const getTimesheetsByEmployee = (employeeId) =>
  API.get(`/Timesheet/byEmployee/${employeeId}`);
export const approveTimesheet = (id, managerId) =>
  API.put(`/Timesheet/approve/${id}?managerId=${managerId}`);

// ---------------- LEAVES ----------------
export const getAllLeaves = () => API.get("/LeaveRequest/all");

export const submitLeave = (data) => API.post("/LeaveRequest/submit", data);
export const getLeavesByEmployee = (id) =>
  API.get(`/LeaveRequest/employee/${id}`);
export const approveLeave = (id, managerId) =>
  API.put(`/LeaveRequest/approve/${id}?managerId=${managerId}`);
export const rejectLeave = (id, managerId) =>
  API.put(`/LeaveRequest/reject/${id}?managerId=${managerId}`);

// ---------------- PAYROLL ----------------
export const calculatePayroll = (employeeId, payrollDate) =>
  API.post(`/Payroll/calculate?employeeId=${employeeId}&payrollDate=${payrollDate}`);
export const verifyPayroll = (id) => API.get(`/Payroll/verify/${id}`);
export const processPayroll = (id) => API.post(`/Payroll/process/${id}`);
export const payrollHistory = (employeeId) =>
  API.get(`/Payroll/history/${employeeId}`);
export const getAllPayrolls = () => API.get("/Payroll/all");

// ---------------- BENEFITS ----------------
export const addBenefit = (data) => API.post("/Benefit", data);
export const getBenefitsByEmployee = (id) =>
  API.get(`/Benefit/employee/${id}`);
export const getAllBenefits = () => API.get("/Benefit/all");
export const updateBenefit = (id, data) =>
  API.put(`/Benefit/${id}`, data);

export default API;
