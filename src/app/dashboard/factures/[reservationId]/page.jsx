"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { getReservationsById } from "@/api/reservations/reservationApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Printer,
  User,
  Calendar,
  CreditCard,
  BedDouble,
  MessageSquare,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ReservationInvoicePage() {
  const { reservationId } = useParams();
  const [reservation, setReservation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const response = await getReservationsById(reservationId);
        setReservation(response.data);
      } catch (error) {
        console.error("Error fetching reservation:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservation();
  }, [reservationId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!reservation) {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Réservation non trouvée
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Aucune réservation trouvée avec l'ID : {reservationId}</p>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto p-4 min-h-screen print:p-0 print:min-h-0">
      <div className="flex justify-end mb-4 print:hidden max-w-4xl">
        <Button
          variant="outline"
          onClick={handlePrint}
          className="flex items-center gap-2"
        >
          <Printer className="h-4 w-4" />
          Imprimer la facture
        </Button>
      </div>
      <Card className="max-w-4xl mx-auto shadow-lg print:shadow-none print:max-w-full">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-red-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl font-bold">FACTURE</CardTitle>
              <p className="text-lg">#{reservation.id}</p>
            </div>
            <div className="text-right">
              <p>Date: {formatDate(new Date())}</p>
              <p>Numéro de facture: INV-{reservation.id}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold mb-2 flex items-center">
                <User className="mr-2 h-5 w-5 text-primary" /> Informations du
                Client
              </h2>
              <p>
                <strong>Nom:</strong> {reservation.client.nom}{" "}
                {reservation.client.prenom}
              </p>
              <p>
                <strong>Email:</strong>{" "}
                {reservation.client.email || "Non spécifié"}
              </p>
              <p>
                <strong>Contact:</strong>{" "}
                {reservation.client.contact || "Non spécifié"}
              </p>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold mb-2 flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary" /> Détails de la
                Réservation
              </h2>
              <p>
                <strong>Arrivée:</strong> {formatDate(reservation.date_arrivee)}
              </p>
              <p>
                <strong>Départ:</strong> {formatDate(reservation.date_depart)}
              </p>
              <p>
                <strong>Nombre de nuits:</strong> {reservation.nombre_nuits}
              </p>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NO.</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Qté</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>01</TableCell>
                <TableCell>
                  Chambre {reservation.chambre.numero_chambre} -{" "}
                  {reservation.chambre.categorie.nom}
                </TableCell>
                <TableCell>
                  {parseInt(reservation.chambre.categorie.tarif).toLocaleString(
                    "fr-FR"
                  )}{" "}
                  MGA
                </TableCell>
                <TableCell>{reservation.nombre_nuits}</TableCell>
                <TableCell>
                  {reservation.prix_total.toLocaleString("fr-FR")} MGA
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="mt-6 flex justify-between items-end">
            <div>
              <h3 className="font-semibold mb-2">Méthode de paiement</h3>
              <p>{reservation.mode_paiement || "Non spécifié"}</p>
              <p>
                Référence: {reservation.reference_paiement || "Non spécifié"}
              </p>
            </div>
            <div className="text-right">
              <p className="mb-2">
                <span className="font-semibold">Sous-total:</span>{" "}
                {reservation.prix_total.toLocaleString("fr-FR")} MGA
              </p>
              <p className="mb-2">
                <span className="font-semibold">Taxe:</span> 0 MGA
              </p>
              <p className="text-xl font-bold">
                <span>Total:</span>{" "}
                {reservation.prix_total.toLocaleString("fr-FR")} MGA
              </p>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t">
            <h3 className="font-semibold mb-2">Conditions générales</h3>
            <p className="text-sm text-gray-600">
              Paiement dû dans les 15 jours suivant la réception de la facture.
            </p>
          </div>
        </CardContent>

        <div className="bg-gradient-to-r from-purple-600 to-red-600 p-4 text-center text-white">
          <p className="text-sm">Merci d'avoir choisi notre établissement!</p>
        </div>
      </Card>
    </div>
  );
}
