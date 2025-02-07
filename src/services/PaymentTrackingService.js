import axios from "axios";

const API_URL = "http://localhost:8081/api/paymentsTracking";  // Adjust if your API URL is different

// Service to handle fetching payment tracking data
const getPayments = async () => {
  try {
    const response = await axios.get(`${API_URL}/getAll`);
    return response.data;
  } catch (error) {
    console.error("Error fetching payment tracking data:", error);
    throw error;  // Rethrow error to be handled in UI component
  }
};

export default {
  getPayments,
};
