"use client";
import React, { useEffect, useState } from "react";
import { getProduits } from "@/api/produits/produitApi"; // Assurez-vous que cette importation est correcte
import { getTypesProduits } from "@/api/typeProduit/typeProduitApi"; // Assurez-vous que cette importation est correcte
import { Card } from "@/components/ui/card"; // Assurez-vous que le composant Card est importé correctement
import { Button } from "@/components/ui/button"; // Importation du bouton si nécessaire

const ListeProduitsAvecTypes = () => {
  const [produits, setProduits] = useState([]);
  const [typesProduits, setTypesProduits] = useState([]);

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const response = await getProduits();
        setProduits(response.data); // Assurez-vous que la structure des données est correcte
      } catch (error) {
        console.error("Erreur lors de la récupération des produits:", error);
      }
    };

    const fetchTypesProduits = async () => {
      try {
        const response = await getTypesProduits();
        setTypesProduits(response.data); // Assurez-vous que la structure des données est correcte
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des types de produits:",
          error
        );
      }
    };

    // Appel des fonctions pour récupérer les produits et types de produits
    fetchProduits(); // Récupérer les produits
    fetchTypesProduits(); // Récupérer les types de produits
  }, []); // Dépendance vide pour exécuter une fois au montage

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {produits.map((produit) => {
        const typeProduit = typesProduits.find(
          (type) => type.id === produit.type_produit_id
        );
        return (
          <Card key={produit.id} className="p-4">
            <h2 className="text-lg font-bold">{produit.nom}</h2>
            <p>Prix: {produit.prix} €</p>
            <p>Type: {typeProduit ? typeProduit.nom : "Type inconnu"}</p>
            <Button variant="outline">Voir Détails</Button>
          </Card>
        );
      })}
    </div>
  );
};

export default ListeProduitsAvecTypes;
