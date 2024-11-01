import axios from "axios";
import Cookies from "js-cookie"; // Importing Cookies

const API_URL = "https://hotelsuite.inprogress.mg/public/api/clients";

const getAuthToken = async () => {
  return Cookies.get("userToken"); //
};
export const getClients = async () => {
  try {
    const token = await getAuthToken(); // Get the token
    return await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
};
export const getClientFormated = async () => {
  try {
    const token = await getAuthToken(); // Get the token
    return await axios.get(`${API_URL}/formatted`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
};

export const getClientById = async (id) => {
  const token = await getAuthToken(); // Get the token
  return await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const searchClient = async (query) => {
  const token = await getAuthToken(); // Get the token
  return await axios.get(`${API_URL}/search`, {
    params: { query },
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createClient = async (data) => {
  try {
    const token = await getAuthToken(); // Get the token
    return await axios.post(API_URL, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error creating client:", error);
    throw error;
  }
};

export const updateClient = async (id, data) => {
  const token = await getAuthToken(); // Get the token
  return await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteClient = async (id) => {
  const token = await getAuthToken(); // Get the token
  return await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
