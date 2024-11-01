import axios from "axios";
import Cookies from "js-cookie"; // Importing Cookies

const API_URL = "https://hotelsuite.inprogress.mg/public/api/achats";

const getAuthToken = async () => {
  return Cookies.get("userToken"); //
};

export const getAchats = async () => {
  try {
    const token = await getAuthToken(); // Get the token
    return await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error fetching achats:", error);
    throw error;
  }
};

export const getAchatsByUser = async (userId) => {
  const token = await getAuthToken(); // Get the token
  return await axios.get(`${API_URL}/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createAchat = async (data, clientId) => {
  try {
    const token = await getAuthToken(); // Get the token
    const response = await axios.post(`${API_URL}/${clientId}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating achat:", error);
    throw error;
  }
};

export const updateAchat = async (id, data) => {
  const token = await getAuthToken(); // Get the token
  return await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateAchatStatut = async (id, statut) => {
  const token = await getAuthToken(); // Get the token
  return await axios.put(
    `${API_URL}/${id}/statut`,
    { statut },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const deleteAchat = async (id) => {
  const token = await getAuthToken(); // Get the token
  return await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateAchatStatus = async (achatId, data) => {
  try {
    const response = await axios.put(
      `${API_URL}/achats/${achatId}/status`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
