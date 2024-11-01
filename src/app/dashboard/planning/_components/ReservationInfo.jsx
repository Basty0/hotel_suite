import React, { useState } from "react";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  updateReservation,
  updateReservationStatus,
} from "@/api/reservations/reservationApi";
import Link from "next/link";

// Ajoutez cette fonction en haut du fichier, après les imports
const formatDateToFrench = (dateString) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  return new Date(dateString).toLocaleDateString("fr-FR", options);
};

const ReservationInfo = ({ reservation, onStatusUpdate, fetchReservation }) => {
  const [status, setStatus] = useState(reservation.statuts);

  if (!reservation) return null;

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);

    await updateReservation(reservation.id, { statuts: newStatus });
    fetchReservation();
    onStatusUpdate(newStatus);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "réserve":
        return "bg-blue-500 hover:bg-blue-600";
      case "validé":
        return "bg-green-500 hover:bg-green-600";
      case "occupé":
        return "bg-red-500 hover:bg-red-600";
      case "clôturé":
        return "bg-gray-500 hover:bg-gray-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const statusButtons = [
    { value: "réserve", label: "Réserve" },
    { value: "validé", label: "Validé" },
    { value: "occupé", label: "Occupé" },
    { value: "clôturé", label: "Clôturé" },
  ];

  return (
    <Card className="w-full max-w-2xl shadow-none border-none backdrop-blur-sm bg-white/30 ">
      <CardHeader className={`${getStatusColor(status)} rounded-xl text-white`}>
        <DialogTitle className="text-2xl font-bold">
          Détails de la réservation
        </DialogTitle>
        <DialogDescription className="text-white opacity-80">
          Informations sur la réservation de {reservation.client.nom}{" "}
          {reservation.client.prenom}
        </DialogDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">Chambre:</p>
            <p>CH {reservation.chambre.numero_chambre}</p>
          </div>
          <div>
            <p className="font-semibold">Prix total:</p>
            <p>{reservation.prix_total} Ar</p>
          </div>
          <div>
            <p className="font-semibold">Date d'arrivée:</p>
            <p>{formatDateToFrench(reservation.date_arrivee)}</p>
          </div>
          <div>
            <p className="font-semibold">Date de départ:</p>
            <p>{formatDateToFrench(reservation.date_depart)}</p>
          </div>
          <div>
            <p className="font-semibold">Client:</p>
            <p>
              {reservation.client.nom} {reservation.client.prenom}
            </p>
          </div>
          <div>
            <p className="font-semibold">Adresse du client:</p>
            <p>{reservation.client.adresse}</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="font-semibold">Statut:</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {statusButtons.map((statusOption) => (
              <Button
                key={statusOption.value}
                className={`${getStatusColor(statusOption.value)} text-white ${
                  status === statusOption.value
                    ? "ring-2 ring-offset-2 ring-offset-background ring-ring"
                    : ""
                }`}
                onClick={() => handleStatusChange(statusOption.value)}
                disabled={status === statusOption.value}
              >
                {statusOption.label}
              </Button>
            ))}
          </div>
        </div>
        <Button className="mt-4 w-full">
          <Link href={`/dashboard/client/${reservation.client.id}`}>
            Voir le profil complet du client
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ReservationInfo;
