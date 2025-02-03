import axios from "axios";

export const getCoinData = async (id, setError) => {
  const API_BASE_URL = "http://localhost:5000/api";

  try {
    const response = await axios.get(`${API_BASE_URL}/coin/${id}`);

    if (response.data) {
      return response.data;
    }

    return null; // Return null explicitly if no data is received
  } catch (error) {
    console.error("Error fetching coin data:", error.message);

    if (setError) {
      setError(error.message || "An error occurred while fetching coin data.");
    }

    return null;
  }
};

// export const getCoinData = async (id, setError, retries = 3, delay = 2000) => {
//   const API_BASE_URL = "http://localhost:5000/api";

//   for (let i = 0; i < retries; i++) {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/coin/${id}`);

//       if (response.data) {
//         console.log("Coin Data:", response.data);
//         return response.data;
//       }

//       return null; // Return null explicitly if no data is received
//     } catch (error) {
//       console.error(
//         `Attempt ${i + 1}: Error fetching coin data for ${id}`,
//         error.message
//       );

//       if (error.response?.status === 429 && i < retries - 1) {
//         // If rate-limited, retry after a delay
//         console.warn(`Rate limit hit. Retrying in ${delay}ms...`);
//         await new Promise((resolve) => setTimeout(resolve, delay));
//       } else {
//         // If other errors or max retries reached, handle the error
//         if (setError) {
//           setError(
//             error.message || "An error occurred while fetching coin data."
//           );
//         }
//         return null;
//       }
//     }
//   }
// };
