import axios from "axios";
import Cookies from "js-cookie";

// Définir l'URL de base de votre API
const API_URL = "https://hotelsuite.inprogress.mg/public/api"; // Remplacez par l'URL de votre API

// Fonction pour récupérer le token stocké
const getAuthToken = () => {
  return Cookies.get("userToken");
};
export const getAuth = () => {
  return Cookies.get("userToken");
};

export const getDailyTransactions = async (year) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await axios.get(`${API_URL}/transactions/daily`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { year },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des transactions par jour:",
      error
    );
    throw error;
  }
};

export const getMonthlyTransactions = async (year) => {
  try {
    const token = await getAuthToken();
    const response = await axios.get(
      `${API_URL}/transactions/monthly/${year}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des transactions par mois:",
      error
    );
    throw error;
  }
};

export const getTransactionsByMonthAndYear = async (month, year) => {
  try {
    const token = await getAuthToken();
    const response = await axios.get(
      `${API_URL}/transactions/monthl/${month}/${year}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des transactions par mois et annee:",
      error
    );
    throw error;
  }
};

export const getOperateurs = async () => {
  try {
    const token = await getAuthToken();
    const response = await axios.get(`${API_URL}/operateurs`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des opérateurs:", error);
    throw error;
  }
};
export const getCompleteTransactions = async () => {
  try {
    const token = await getAuthToken();
    const response = await axios.get(`${API_URL}/complete/trasactions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des Trasactions:", error);
    throw error;
  }
};

export const searchTransactionByTel = async (tel) => {
  try {
    const token = await getAuthToken();
    const response = await axios.get(`${API_URL}/transactions/search-by-tel`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { tel: tel },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la recherche de la transaction:", error);
    throw error;
  }
};

// Récupérer l'utilisateur connecté

export const getAuthenticatedUser = async () => {
  try {
    const token = await getAuthToken();
    const response = await axios.get(`${API_URL}/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    // Gérer l'erreur de manière appropriée, par exemple en affichant un message d'erreul'utilisateur
    throw error;
  }
};

// Exemple d'utilisation
// getOperateurs().then(data => console.log(data)).catch(err => console.error(err));

// Fonction pour lister les transactions par date et user
export const getTransactionsByDateAndUser = async (
  date,
  selectedOperateur = null,
  selectedType = null
) => {
  console.log("Operator:", selectedOperateur, "Type:", selectedType);

  const token = await getAuthToken();
  const response = await axios.get(`${API_URL}/transactions`, {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      date: date,
      selectedOperateur: selectedOperateur, // Utiliser les noms tels que définis côté Laravel
      selectedType: selectedType, // Utiliser les noms tels que définis côté Laravel
    },
  });
  return response.data;
};

// Fonction pour créer une transaction pour l'utilisateur connecté
export const createTransaction = async (transactionData) => {
  const token = await getAuthToken();
  const response = await axios.post(
    `${API_URL}/transactions`,
    transactionData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response;
};

// Fonction pour modifier une transaction existante
export const updateTransaction = async (transactionId, updatedData) => {
  const token = await getAuthToken();
  const response = await axios.put(
    `${API_URL}/transactions/${transactionId}`,
    updatedData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// Fonction pour lister les transactions groupées par opérateur selon une date et un user donné
export const getTransactionsGroupedByOperator = async (userId, date) => {
  const token = await getAuthToken();
  const response = await axios.get(`${API_URL}/transactions/grouped`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { user_id: userId, date: date },
  });
  return response.data;
};

// Fonction pour obtenir un récapitulatif des transactions par type pour une date et un user donné
export const getTransactionRecapByType = async (userId, date) => {
  const token = await getAuthToken();
  const response = await axios.get(`${API_URL}/transactions/recap-by-type`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { user_id: userId, date: date },
  });
  return response.data;
};

// Fonction pour l'inscription d'un utilisateur
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    Cookies.set("userToken", response.data.token, { expires: 7 });
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
