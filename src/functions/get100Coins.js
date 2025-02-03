import axios from "axios";

export const get100Coins = async () => {
  const API_BASE_URL = "http://localhost:5000/api";

  try {
    const response = await axios.get(`${API_BASE_URL}/coins`);
    return response.data;
  } catch (error) {
    console.error("ERROR>>>", error.message);
    return null; // Return null explicitly when an error occurs
  }
};
