"use client";
import React, { useState, useEffect } from "react";
import { getAchatsByUser } from "@/api/achats/achatApi";
import { getProduitsGroupes } from "@/api/produits/produitApi";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useParams } from "next/navigation";
import { createAchat } from "@/api/achats/achatApi";

const AchatClient = () => {
  const [achats, setAchats] = useState([]);
  const [produits, setProduits] = useState([]);
  const [panier, setPanier] = useState([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const params = useParams();

  useEffect(() => {
    fetchAchats();
    fetchProduits();
  }, []);

  const fetchAchats = async () => {
    try {
      const response = await getAchatsByUser(params.client);
      setAchats(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des achats :", error);
    }
  };

  const fetchProduits = async () => {
    try {
      const response = await getProduitsGroupes();
      console.log("Réponse de l'API produits:", response);
      // Supposons que response.data est déjà groupé par type
      setProduits(response);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits :", error);
      setProduits({}); // Initialiser avec un objet vide en cas d'erreur
    }
  };

  const ajouterAuPanier = (produit) => {
    setPanier((prevPanier) => {
      const produitExistant = prevPanier.find((item) => item.id === produit.id);
      if (produitExistant) {
        return prevPanier.map((item) =>
          item.id === produit.id
            ? { ...item, quantite: item.quantite + 1 }
            : item
        );
      } else {
        return [...prevPanier, { ...produit, quantite: 1 }];
      }
    });
  };

  const modifierQuantite = (produitId, nouvelleQuantite) => {
    setPanier((prevPanier) =>
      prevPanier
        .map((item) =>
          item.id === produitId ? { ...item, quantite: nouvelleQuantite } : item
        )
        .filter((item) => item.quantite > 0)
    );
  };

  const viderPanier = () => {
    setPanier([]);
  };

  const calculerPrixTotal = () => {
    const total = panier.reduce(
      (sum, item) => sum + item.prix * item.quantite,
      0
    );
    setTotalPrice(total);
  };

  useEffect(() => {
    calculerPrixTotal();
  }, [panier]);

  const validerAchat = async () => {
    try {
      const produitsAchat = panier.map((item) => ({
        produit_id: item.id,
        prix: item.prix,
        quantite: item.quantite,
      }));

      const achatData = {
        prix_total: totalPrice,
        statut: "non payé",
        produits: produitsAchat,
      };

      await createAchat(achatData, params.client);
      alert("Achat validé avec succès!");
      viderPanier();
      fetchAchats(); // Refresh the purchases list
    } catch (error) {
      console.error("Erreur lors de la validation de l'achat:", error);
      alert("Une erreur est survenue lors de la validation de l'achat.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Achats du client</h2>
      <div className="mb-8">
        {achats.map((achat, index) => (
          <Card key={index} className="p-4 mb-2">
            <p>Date: {new Date(achat.date).toLocaleDateString()}</p>
            <p>Produit: {achat.produit.nom}</p>
            <p>Quantité: {achat.quantite}</p>
            <p>Prix total: {achat.prix_total} Ar</p>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-4">Produits disponibles</h2>
      {produits &&
      typeof produits === "object" &&
      Object.keys(produits).length > 0 ? (
        Object.entries(produits).map(([type, produitsGroup]) => (
          <div key={type} className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{type}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {produitsGroup.map((produit) => (
                <Card key={produit.id} className="p-4">
                  <h4 className="font-bold">{produit.nom}</h4>
                  <p>
                    Description:{" "}
                    {produit.description
                      ? produit.description
                      : "Non disponible"}
                  </p>
                  <p>Prix: {produit.prix} Ar</p>
                  <Button
                    onClick={() => ajouterAuPanier(produit)}
                    className="mt-2"
                  >
                    Ajouter au panier
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>Aucun produit disponible pour le moment.</p>
      )}

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button className="fixed bottom-4 right-4 rounded-full p-3">
            <ShoppingCart className="w-6 h-6" />
            <span className="ml-2">
              {panier.reduce((sum, item) => sum + item.quantite, 0)}
            </span>
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Votre panier</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            {panier.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center mb-2"
              >
                <span>{item.nom}</span>
                <div>
                  <Button
                    onClick={() => modifierQuantite(item.id, item.quantite - 1)}
                  >
                    -
                  </Button>
                  <span className="mx-2">{item.quantite}</span>
                  <Button
                    onClick={() => modifierQuantite(item.id, item.quantite + 1)}
                  >
                    +
                  </Button>
                </div>
                <span>{item.prix * item.quantite} Ar</span>
              </div>
            ))}
          </div>
          <div className="mt-4 font-bold">Prix total: {totalPrice} Ar</div>
          <div className="mt-4 flex justify-between">
            <Button onClick={viderPanier}>Vider le panier</Button>
            <Button
              onClick={validerAchat}
              className="bg-green-500 hover:bg-green-600"
            >
              Valider l'achat
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AchatClient;
