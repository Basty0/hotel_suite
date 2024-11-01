"use client";
import React, { useEffect, useState } from "react";
import FormeUser from "./FormeUser";
import ListeUtilisateurs from "./ListeUtilisateurs";
import { getAllUsers } from "@/api/authApi";
const PrePage = () => {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true); // État pour le chargement

  const fetchUtilisateurs = async () => {
    try {
      const response = await getAllUsers();
      console.log(response);
      setUtilisateurs(response);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUtilisateurs();
  }, []);
  return (
    <div>
      <div className=" flex justify-between items-center mt-4">
        <h2 className="text-xl font-semibold">Lyste des utilisateurs </h2>
        <FormeUser fetchUtilisateurs={fetchUtilisateurs} />
      </div>
      {loading ? ( // Afficher un message de chargement
        <p>Chargement des utilisateurs...</p>
      ) : (
        <ListeUtilisateurs utilisateurs={utilisateurs} />
      )}
    </div>
  );
};

export default PrePage;
