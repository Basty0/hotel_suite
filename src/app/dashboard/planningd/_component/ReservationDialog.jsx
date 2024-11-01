"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export function ReservationDialog({ reservation, isOpen, setIsOpen }) {
  if (!reservation) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Détails de la réservation #{reservation.id}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-span-4 space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Client</h3>
                <p className="text-sm">{`${reservation.client.nom} ${reservation.client.prenom}`}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Chambre</h3>
                <p className="text-sm">{`Chambre ${reservation.chambre.numero_chambre}`}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Dates</h3>
                <p className="text-sm">
                  Arrivée:{" "}
                  {format(new Date(reservation.date_arrivee), "Pp", {
                    locale: fr,
                  })}
                </p>
                <p className="text-sm">
                  Départ:{" "}
                  {format(new Date(reservation.date_depart), "Pp", {
                    locale: fr,
                  })}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Statut</h3>
                <p className="text-sm capitalize">{reservation.statuts}</p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
