"use client";
import { getAchatsByUser } from "@/api/achats/achatApi";
import { getChambres } from "@/api/chambres/chambreApi";
import { getClientById } from "@/api/clients/clientApi";
import { getProduits } from "@/api/produits/produitApi";
import {
  getReservations,
  getReservationsByClient,
  updateReservation,
} from "@/api/reservations/reservationApi";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, Loader2, BedSingle, Ellipsis } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import ChambreLibre from "./_component/ChambreLibre";
import { DatePickerWithRange } from "./_component/DatePickerWithRange";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const PrePage = () => {
  const params = useParams(); // Correction de 'param' en 'params'
  const [client, setClient] = useState(null); // Initialisation correcte de l'état
  const [reservation, setReservation] = useState([]);
  const [achat, setAchat] = useState([]);
  const [produit, setProduit] = useState([]);
  const [chambre, setChambre] = useState([]);
  const [loading, setLoading] = useState(true); // Ajout de l'état de chargement
  const [isLoadingAction, setIsLoadingAction] = useState(false); // État pour le chargement des actions

  const fetchClient = async () => {
    try {
      const response = await getClientById(params.client); // Utilisation correcte de params
      console.log(response);
      setClient(response.data); // Mise à jour de l'état client
    } catch (error) {
      console.error("Erreur lors de la récupération du client :", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAchatClient = async () => {
    try {
      const response = await getAchatsByUser(params.client);
      console.log(response);
      setAchat(response); // Mise à jour de l'état achat
    } catch (error) {
      console.error("Erreur lors de la récupération des achats :", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReservationClient = async () => {
    try {
      const response = await getReservationsByClient(params.client);
      console.log(response);
      setReservation(response.data); // Mise à jour de l'état reservation
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations :", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProduit = async () => {
    try {
      const response = await getProduits();
      console.log(response);
      setProduit(response); // Mise à jour de l'état produit
    } catch (error) {
      console.error("Erreur lors de la récupération des produits :", error);
    } finally {
      setLoading(false);
    }
  };

  const afficherA = () => {
    console.log("a");
  };

  const fetchChambre = async () => {
    try {
      const response = await getChambres();
      console.log(response);
      setChambre(response); // Mise à jour de l'état chambre
    } catch (error) {
      console.error("Erreur lors de la récupération des chambres :", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateReservation = async (reservationId, newStatus) => {
    setIsLoadingAction(true); // Démarrer le chargement
    await updateReservation(reservationId, { statuts: newStatus });
    // Recharger les données après la mise à jour
    fetchReservationClient();
    setIsLoadingAction(false); // Arrêter le chargement
  };

  useEffect(() => {
    // Appeler toutes les fonctions de récupération de données
    fetchClient();
    fetchAchatClient();
    fetchReservationClient();
    fetchProduit();
    fetchChambre();
  }, [params.client]);

  return (
    <div>
      {loading && ( // Afficher le loader pendant le chargement
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="animate-spin w-10 h-10" />
        </div>
      )}
      {!loading && ( // Afficher le contenu seulement si le chargement est terminé
        <>
          <div className="fixed bottom-0 right-0 m-4">
            <div className="bg-secondary rounded-full p-3 flex flex-row items-center gap-2">
              <ShoppingCart className="w-6 h-6" />
              <span className="text-sm font-bold">{achat.length}</span>
            </div>
          </div>

          <div className="my-3">
            <h1 className="font-bold text-3xl">Reservations</h1>
            <p className="md:max-w-[60%] text-zinc-400">
              Rechercher une chambre libre et faire une réservation.
            </p>
            <div>
              <DatePickerWithRange
                client_id={params.client}
                feshReservation={fetchReservationClient}
              />
            </div>
            <h2 className="font-bold text-2xl my-3">Liste des réservations</h2>
            <div className="flex flex-row gap-3 my-3">
              <Card className="flex flex-row justify-between items-center gap-3 p-3 shadow-none">
                <p>réserve</p>
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              </Card>
              <Card className="flex flex-row justify-between items-center gap-3 p-3 shadow-none">
                <p>validé</p>
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
              </Card>
              <Card className="flex flex-row justify-between items-center gap-3 p-3 shadow-none">
                <p>occupé</p>
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
              </Card>
              <Card className="flex flex-row justify-between items-center gap-3 p-3 shadow-none">
                <p>clôturé</p>
                <div className="w-4 h-4 rounded-full bg-gray-500"></div>
              </Card>
            </div>
            <div className="flex flex-col gap-3">
              <Card className="flex flex-row justify-between items-center gap-3 p-3 shadow-none">
                <p className="font-semibold">Chambres</p>
                <p className="font-semibold">Date d'arrivée</p>
                <p className="font-semibold">Date de départ</p>
                <p className="font-semibold">Prix total</p>
                <p className="font-semibold">Status</p>
              </Card>
              {reservation.map((reservation) => (
                <div key={reservation.id}>
                  <Card
                    className={`flex flex-row justify-between items-center gap-3 p-3 shadow-none ${
                      reservation.statuts === "clôturé" ? "bg-secondary" : ""
                    }`}
                  >
                    <p>CH {reservation.chambre.numero_chambre}</p>
                    <p>{reservation.date_arrivee}</p>
                    <p>{reservation.date_depart}</p>
                    <p>{reservation.prix_total} Ar</p>
                    <div className="flex flex-row items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full p-2 border-2 ${
                          reservation.statuts === "réserve"
                            ? "bg-blue-500"
                            : reservation.statuts === "validé"
                            ? "bg-green-500"
                            : reservation.statuts === "occupé"
                            ? "bg-red-500"
                            : "bg-gray-500"
                        }`}
                      />
                      <Popover>
                        <PopoverTrigger asChild>
                          <Ellipsis className="w-4 h-4" />
                        </PopoverTrigger>
                        <PopoverContent>
                          <div className="flex flex-col gap-2">
                            {reservation.statuts === "réserve" && ( // Afficher les boutons si le statut est "réserve"
                              <>
                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    handleUpdateReservation(
                                      reservation.id,
                                      "validé"
                                    )
                                  }
                                  disabled={isLoadingAction} // Désactiver si en chargement
                                >
                                  Valider
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    handleUpdateReservation(
                                      reservation.id,
                                      "occupé"
                                    )
                                  }
                                  disabled={isLoadingAction} // Désactiver si en chargement
                                >
                                  Occuper
                                </Button>
                              </>
                            )}
                            {reservation.statuts === "validé" && ( // Afficher les boutons si le statut est "validé"
                              <>
                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    handleUpdateReservation(
                                      reservation.id,
                                      "occupé"
                                    )
                                  }
                                  disabled={isLoadingAction} // Désactiver si en chargement
                                >
                                  Occuper
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    handleUpdateReservation(
                                      reservation.id,
                                      "clôturé"
                                    )
                                  }
                                  disabled={isLoadingAction} // Désactiver si en chargement
                                >
                                  Clôturer
                                </Button>
                              </>
                            )}
                            {reservation.statuts === "occupé" && ( // Afficher le bouton si le statut est "occupé"
                              <Button
                                variant="outline"
                                onClick={() =>
                                  handleUpdateReservation(
                                    reservation.id,
                                    "clôturé"
                                  )
                                }
                                disabled={isLoadingAction} // Désactiver si en chargement
                              >
                                Clôturer
                              </Button>
                            )}
                            <Button variant="destructive">Supprimer</Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PrePage;
