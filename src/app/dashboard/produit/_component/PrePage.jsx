"use client";
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getProduits } from "@/api/produits/produitApi";
import { getTypesProduits } from "@/api/typeProduit/typeProduitApi"; // Assurez-vous d'avoir cette fonction
import ProduitList from "./ProduitList";

const PrePage = () => {
  const [produits, setProduits] = useState([]);
  const [typesProduits, setTypesProduits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProduits = async () => {
    const res = await getProduits();
    setProduits(res.data);
  };

  const fetchTypesProduits = async () => {
    const res = await getTypesProduits();
    setTypesProduits(res.data);
  };

  const fetchDataAndSetLoading = async () => {
    await Promise.all([fetchProduits(), fetchTypesProduits()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchDataAndSetLoading();
  }, []);

  return (
    <div className="">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <ProduitList
          fetchProduits={fetchProduits}
          produits={produits}
          typesProduits={typesProduits}
          fetchTypesProduits={fetchTypesProduits}
        />
      )}
    </div>
  );
};

export default PrePage;
