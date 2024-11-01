import axios from "axios";
import Cookies from "js-cookie"; // Importing Cookies

const API_URL = "https://hotelsuite.inprogress.mg/public/api/reservations";

const getAuthToken = async () => {
  return Cookies.get("userToken"); //
};

export const getReservations = async () => {
  try {
    const token = await getAuthToken(); // Get the token
    return await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    throw error;
  }
};
export const getReservationsParDate = async (date) => {
  try {
    const token = await getAuthToken(); // Get the token
    return await axios.get(`${API_URL}/date/${date}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    throw error;
  }
};

// Similar try...catch for other functions
export const createReservation = async (data) => {
  try {
    const token = await getAuthToken(); // Get the token
    return await axios.post(API_URL, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error creating reservation:", error);
    throw error;
  }
};
export const createReservationFromForm = async (data) => {
  try {
    const token = await getAuthToken(); // Get the token
    return await axios.post(`${API_URL}/with-client`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error creating reservation:", error);
    throw error;
  }
};
// ... existing code ...

export const getReservationsByClient = async (clientId) => {
  try {
    const token = await getAuthToken(); // Get the token
    return await axios.get(`${API_URL}/client/${clientId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error fetching reservations by client:", error);
    throw error;
  }
};
export const getReservationsById = async (reservationId) => {
  try {
    const token = await getAuthToken(); // Get the token
    return await axios.get(`${API_URL}/amicale/${reservationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error fetching reservations by client:", error);
    throw error;
  }
};

export const updateReservationStatus = async (id, data) => {
  try {
    const token = await getAuthToken(); // Get the token
    return await axios.put(`${API_URL}/${id}/status`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error updating reservation status:", error);
    throw error;
  }
};

export const updateReservation = async (id, data) => {
  try {
    const token = await getAuthToken(); // Get the token
    return await axios.put(`${API_URL}/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error updating reservation:", error);
    throw error;
  }
};

export const deleteReservation = async (id) => {
  try {
    const token = await getAuthToken(); // Get the token
    return await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    throw error;
  }
};

// ... existing code ...
