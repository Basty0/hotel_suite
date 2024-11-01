"use client";
import React, { useEffect, useState } from "react";
import CreateCategorieForm from "./CreateCategorieForm";
import CreateChambreForm from "./CreateChambreForm";
import { getCategories } from "@/api/categories/categorieApi";
import { EllipsisVertical, Loader2 } from "lucide-react"; // Import the loading icon
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getChambresListe } from "@/api/chambres/chambreApi";
import { Badge } from "@/components/ui/badge";
import UpdateChambreForm from "./UpdateChambreForm";
import UpdateCategorieForm from "./UpdateCategorieForm";
import RoomList from "./RoomList";

const PrePage = () => {
  const [categorie, setCategorie] = useState([]);
  const [chambre, setChambre] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchdata = async () => {
    fetchChambre();
    fetcCategorie();
  };
  const fetcCategorie = async () => {
    const res = await getCategories();
    setCategorie(res.data);

    console.log(res.data);
  };
  const fetchChambre = async () => {
    const res = await getChambresListe();
    setChambre(res.data); // Mettre à jour l'état avec les chambres groupées
  };
  const fetchDataAndSetLoading = async () => {
    await fetchdata();
    setLoading(false);
  };

  useEffect(() => {
    fetchDataAndSetLoading();
  }, []);
  console.log("chambre", chambre);
  console.log("categorie", categorie);
  return (
    <div className="">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <RoomList
          fetcCategorie={fetcCategorie}
          fetchChambre={fetchChambre}
          chambre={chambre}
          categorie={categorie}
        />
      )}
    </div>
  );
};

export default PrePage;
