import axios from "axios";
import Cookies from "js-cookie"; // Importing Cookies

const API_URL = "https://hotelsuite.inprogress.mg/public/api/utilisateurs";

const getAuthToken = async () => {
  return Cookies.get("authToken"); // Adjust the cookie name as necessary
};

export const getUtilisateurs = async () => {
  try {
    const token = await getAuthToken(); // Get the token
    return await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` }, // Pass the token in headers
    });
  } catch (error) {
    console.error("Error fetching utilisateurs:", error);
    throw error;
  }
};

// Similar try...catch for other functions
export const createUtilisateur = async (data) => {
  try {
    const token = await getAuthToken(); // Get the token
    return await axios.post(API_URL, data, {
      headers: { Authorization: `Bearer ${token}` }, // Pass the token in headers
    });
  } catch (error) {
    console.error("Error creating utilisateur:", error);
    throw error;
  }
};

// ... Repeat for other functions

export const getAllUsers = async () => {
  const token = getAuthToken();
  try {
    return await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    throw error; // Rethrow the error for further handling
  }
};
