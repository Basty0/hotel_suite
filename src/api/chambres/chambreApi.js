import axios from "axios";
import Cookies from "js-cookie"; // Importing Cookies

const API_URL = "https://hotelsuite.inprogress.mg/public/api/chambres";

const getAuthToken = async () => {
  return Cookies.get("userToken"); //
};
export const getChambreSimple = async () => {
  try {
    const token = await getAuthToken(); // Get the token
    return await axios.get(`${API_URL}/simplified-list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error fetching chambres:", error);
    throw error;
  }
};

export const getChambres = async () => {
  try {
    const token = await getAuthToken(); // Get the token
    return await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error fetching chambres:", error);
    throw error;
  }
};
export const getChambresListe = async () => {
  try {
    const token = await getAuthToken(); // Get the token
    return await axios.get(`${API_URL}/liste`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error fetching chambres:", error);
    throw error;
  }
};

export const getChambresDisponibles = async (params) => {
  const token = await getAuthToken(); // Get the token
  return await axios.get(`${API_URL}/disponibles`, {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createChambre = async (data) => {
  try {
    const token = await getAuthToken(); // Get the token
    return await axios.post(API_URL, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error creating chambre:", error);
    throw error;
  }
};

export const updateChambre = async (id, data) => {
  const token = await getAuthToken(); // Get the token
  return await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteChambre = async (id) => {
  const token = await getAuthToken(); // Get the token
  return await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
