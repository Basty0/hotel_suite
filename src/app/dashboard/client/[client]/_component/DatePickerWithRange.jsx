"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getChambresDisponibles } from "@/api/chambres/chambreApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createReservation } from "@/api/reservations/reservationApi";

export function DatePickerWithRange({ client_id, feshReservation }) {
  const [date_arrivee, setDate_arrivee] = React.useState(new Date()); // New state for arrival date, default to today
  const [date_depart, setDate_depart] = React.useState(addDays(new Date(), 5)); // New state for departure date, default to 5 days from today

  const [chambre, setChambre] = React.useState([]);

  const handleSearch = async () => {
    const disponibles = await getChambresDisponibles({
      date_arrivee,
      date_depart,
    });
    setChambre(disponibles.data);
    console.log(disponibles);
  };
  const handleReservation = async (id, prix, client_id) => {
    const reservation = await createReservation({
      chambre_id: id,
      date_arrivee: format(date_arrivee, "yyyy-MM-dd HH:mm:ss"),
      date_depart: format(date_depart, "yyyy-MM-dd HH:mm:ss"),
      prix_total:
        prix *
        ((new Date(date_depart) - new Date(date_arrivee)) /
          (1000 * 60 * 60 * 24)), // Corrected price calculation
      client_id: client_id,
      statuts: "réserve",
    });
    if (reservation) {
      feshReservation();
    }
    handleSearch();
    if (
      reservation &&
      typeof reservation === "object" &&
      !Array.isArray(reservation)
    ) {
      console.error("Erreur: La réponse n'est pas un tableau", reservation);
    } else {
      console.log(reservation);
    }
  };
  return (
    <div className="">
      <div className="grid md:grid-cols-3 md:gap-2 mt-2 ">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date_arrivee && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date_arrivee ? (
                format(date_arrivee, "yyyy-MM-dd HH:mm:ss")
              ) : (
                <span>date arrivée </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date_arrivee}
              onSelect={setDate_arrivee}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date_depart && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date_depart ? (
                format(date_depart, "yyyy-MM-dd HH:mm:ss")
              ) : (
                <span>date départ </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date_depart}
              onSelect={setDate_depart}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Button onClick={() => handleSearch()}>Rechercher</Button>{" "}
        {/* New button to display selected dates */}
      </div>

      {/* afficher les chmbre libre trouver ici */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        {chambre.map((chambre) => (
          <div key={chambre.id}>
            <Card>
              <CardHeader>
                <CardTitle>{chambre.numero_chambre}</CardTitle>
                <CardDescription>{chambre.categorie.nom}</CardDescription>
                <CardDescription>
                  {chambre.caracteristiques.split(" ").slice(0, 3).join(" ")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() =>
                    handleReservation(
                      chambre.id,
                      chambre.categorie.tarif,
                      client_id
                    )
                  }
                >
                  Réserver
                </Button>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
