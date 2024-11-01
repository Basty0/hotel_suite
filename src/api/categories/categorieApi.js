import axios from "axios";
import Cookies from "js-cookie"; // Importing Cookies

const API_URL = "https://hotelsuite.inprogress.mg/public/api/categories";

const getAuthToken = async () => {
  return Cookies.get("userToken"); //
};

export const getCategories = async () => {
  try {
    const token = await getAuthToken(); // Get the token
    return await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
export const getCategorieWithTarifs = async () => {
  try {
    const token = await getAuthToken(); // Get the token
    return await axios.get(`${API_URL}/with-tarifs`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Similar try...catch for other functions
export const createCategorie = async (data) => {
  try {
    const token = await getAuthToken(); // Get the token
    const response = await axios.post(API_URL, data, {
      // Store the response
      headers: { Authorization: `Bearer ${token}` },
    });
    return response; // Return the response
  } catch (error) {
    console.error("Error creating categorie:", error);
    throw error;
  }
};

// ... Repeat for other functions

export const updateCategorie = async (id, data) => {
  try {
    const token = await getAuthToken(); // Get the token
    const response = await axios.put(`${API_URL}/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response; // Return the response
  } catch (error) {
    console.error("Error updating categorie:", error);
    throw error;
  }
};

export const deleteCategorie = async (id) => {
  try {
    const token = await getAuthToken(); // Get the token
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response; // Return the response
  } catch (error) {
    console.error("Error deleting categorie:", error);
    throw error;
  }
};

// ... existing code ...
