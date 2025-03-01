import axios from "axios";

const API_URL = "https://finance-management-b934.onrender.com/api/loan";

const getLoanStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/stats`,);
    return response.data;
  } catch (error) {
    console.error("Error fetching loan statistics:", error);
    throw error;
  }
};

export default { getLoanStats };
