import axios from "axios";
import Cookies from "js-cookie"; // Importing Cookies

const API_URL = "https://hotelsuite.inprogress.mg/public/api/produits";
const getAuthToken = async () => {
  return Cookies.get("userToken"); //
};

export const getProduits = async () => {
  try {
    const token = await getAuthToken(); // Get the token
    return await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error fetching produits:", error);
    throw error; // Rethrow the error after logging
  }
};

export const createProduit = async (produitData) => {
  try {
    const response = await axios.post(`${API_URL}/produits`, produitData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création du produit:", error);
    throw error;
  }
};

export const updateProduit = async (id, data) => {
  try {
    const token = await getAuthToken(); // Get the token
    return await axios.put(`${API_URL}/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error updating produit:", error);
    throw error;
  }
};

export const getProduitsGroupes = async () => {
  try {
    const response = await axios.get(`${API_URL}/groupByType`);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des produits groupés :",
      error
    );
    throw error;
  }
};

export const deleteProduit = async (id) => {
  try {
    const token = await getAuthToken(); // Get the token
    return await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error deleting produit:", error);
    throw error;
  }
};
