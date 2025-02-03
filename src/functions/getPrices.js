import axios from "axios";

export const getPrices = async (id, days, priceType, setError) => {
  const API_BASE_URL = "http://localhost:5000/api";

  try {
    const response = await axios.get(`${API_BASE_URL}/prices/${id}`, {
      params: { days, priceType },
    });

    if (response.data) {
      return response.data;
    }

    return null; // Explicitly return null if no data is received
  } catch (error) {
    console.error("Error fetching prices:", error.message);

    if (setError) {
      setError(error.message || "An error occurred while fetching prices.");
    }

    return null;
  }
};
