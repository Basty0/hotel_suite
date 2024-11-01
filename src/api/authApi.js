import axios from "axios";
import Cookies from "js-cookie";

// Définir l'URL de base de votre API
const API_URL = "https://hotelsuite.inprogress.mg/public/api"; // Remplacez par l'URL de votre API
const getAuthToken = async () => {
  return Cookies.get("userToken"); //
};

// Fonction pour l'inscription d'un utilisateur
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.status;
  } catch (error) {
    console.error("Erreur lors de l'inscription de l'utilisateur:", error);
  }
};

// Fonction pour la connexion d'un utilisateur
export const loginUser = async (loginData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, loginData);
    // Créer un cookie qui expire dans 7 jours
    Cookies.set("userToken", response.data.token, { expires: 7 });
    // console.log(response.status);
    // console.log(response.data);
    const status = response.status;
    return status;
  } catch (error) {
    console.error("Erreur lors de la connexion:");
  }
};

// Fonction pour la déconnexion d'un utilisateur
export const logoutUser = async () => {
  const token = await getAuthToken();
  const response = await axios.post(
    `${API_URL}/logout`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  // Supprimer le cookie lors de la déconnexion
  Cookies.remove("userToken");
  return response.data;
};

export const getCurrentUser = async (token) => {
  return await axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getDashboardStats = async () => {
  try {
    const token = await getAuthToken(); // Get the token
    return await axios.get(`${API_URL}/dashboard-stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};
export const getAllUsers = async () => {
  try {
    const token = await getAuthToken();
    const response = await axios.get(`${API_URL}/getallusers`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
  }
};
