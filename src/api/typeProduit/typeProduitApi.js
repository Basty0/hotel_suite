import axios from "axios";
import Cookies from "js-cookie"; // Importing Cookies

const API_URL = "https://hotelsuite.inprogress.mg/public/api/types-produits";

const getAuthToken = () => {
  return Cookies.get("userToken"); // Adjust the cookie name as necessary
};

export const getTypesProduits = async () => {
  const token = getAuthToken();
  try {
    return await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error fetching types produits:", error);
    throw error; // Rethrow the error for further handling
  }
};

export const createTypeProduit = async (data) => {
  const token = getAuthToken();
  try {
    return await axios.post(API_URL, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error creating type produit:", error);
    throw error; // Rethrow the error for further handling
  }
};

export const updateTypeProduit = async (id, data) => {
  const token = getAuthToken();
  try {
    return await axios.put(`${API_URL}/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error updating type produit:", error);
    throw error; // Rethrow the error for further handling
  }
};

export const deleteTypeProduit = async (id) => {
  const token = getAuthToken();
  try {
    return await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error deleting type produit:", error);
    throw error; // Rethrow the error for further handling
  }
};
