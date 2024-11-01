"use client";
import React, { useState, useEffect } from "react";
import {
  getReservations,
  updateReservationStatus,
} from "@/api/reservations/reservationApi";
import { DataTable } from "./_component/DataTable";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Ellipsis } from "lucide-react";

const Page = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [nameFilter, dateFilter, statusFilter]);

  const fetchReservations = async () => {
    const response = await getReservations();
    setReservations(response.data);
    setFilteredReservations(response.data);
  };

  const columns = [
    {
      accessorKey: "chambre.numero_chambre",
      header: "Numéro de chambre",
      cell: ({ row }) => {
        return `CH ${row.original.chambre.numero_chambre}`;
      },
    },
    {
      accessorKey: "client.nom",
      header: "Nom du client",
    },
    {
      accessorKey: "client.prenom",
      header: "Prénom du client",
    },
    {
      accessorKey: "date_arrivee",
      header: "Date d'arrivée",
    },
    {
      accessorKey: "date_depart",
      header: "Date de départ",
    },
    {
      accessorKey: "prix_total",
      header: "Prix total",
    },
    {
      accessorKey: "statuts",
      header: "Statut",
      cell: ({ row }) => {
        const reservation = row.original;
        return (
          <div className="flex items-center justify-between">
            <div
              className={`w-6 h-6 rounded-full ${
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
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <Ellipsis className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <div className="flex flex-col space-y-1">
                  {reservation.statuts !== "clôturé" && (
                    <>
                      {reservation.statuts !== "validé" && (
                        <Button
                          variant="outline"
                          onClick={() =>
                            handleUpdateReservation(reservation.id, "validé")
                          }
                          disabled={isLoadingAction}
                        >
                          Valider
                        </Button>
                      )}
                      {reservation.statuts !== "occupé" && (
                        <Button
                          variant="outline"
                          onClick={() =>
                            handleUpdateReservation(reservation.id, "occupé")
                          }
                          disabled={isLoadingAction}
                        >
                          Occuper
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        onClick={() =>
                          handleUpdateReservation(reservation.id, "clôturé")
                        }
                        disabled={isLoadingAction}
                      >
                        Clôturer
                      </Button>
                    </>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        );
      },
    },
  ];

  const handleUpdateReservation = async (reservationId, newStatus) => {
    setIsLoadingAction(true);
    try {
      await updateReservationStatus(reservationId, { statuts: newStatus });
      await fetchReservations();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la réservation:", error);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleFilter = () => {
    let filtered = reservations;

    if (nameFilter) {
      filtered = filtered.filter(
        (res) =>
          res.client.nom.toLowerCase().includes(nameFilter.toLowerCase()) ||
          res.client.prenom.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    if (dateFilter) {
      filtered = filtered.filter(
        (res) =>
          res.date_arrivee.includes(dateFilter) ||
          res.date_depart.includes(dateFilter)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((res) => res.statuts === statusFilter);
    }

    setFilteredReservations(filtered);
  };

  const handleStatusClick = (status) => {
    if (statusFilter === status) {
      setStatusFilter(""); // Désélectionner si déjà sélectionné
    } else {
      setStatusFilter(status);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReservations.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Réservations</h1>

      <div className="flex space-x-4 mb-4">
        <Input
          placeholder="Filtrer par nom ou prénom"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
        <Input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      <div className="flex flex-row gap-3 my-3">
        <Card
          className={`flex flex-row justify-between items-center gap-3 p-3 shadow-none cursor-pointer ${
            statusFilter === "" ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => handleStatusClick("")}
        >
          <p>Tout afficher</p>
          <div className="w-4 h-4 rounded-full bg-purple-500"></div>
        </Card>
        {["réserve", "validé", "occupé", "clôturé"].map((status) => (
          <Card
            key={status}
            className={`flex flex-row justify-between items-center gap-3 p-3 shadow-none cursor-pointer ${
              statusFilter === status ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => handleStatusClick(status)}
          >
            <p>{status}</p>
            <div
              className={`w-4 h-4 rounded-full ${
                status === "réserve"
                  ? "bg-blue-500"
                  : status === "validé"
                  ? "bg-green-500"
                  : status === "occupé"
                  ? "bg-red-500"
                  : "bg-gray-500"
              }`}
            ></div>
          </Card>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={currentItems}
        rowClassName={(row) => {
          switch (row.statuts) {
            case "réserve":
              return "bg-blue-500/10";
            case "validé":
              return "bg-green-500/10";
            case "occupé":
              return "bg-red-500/10";
            case "clôturé":
              return "bg-gray-500/10";
            default:
              return "";
          }
        }}
      />

      {filteredReservations.length > itemsPerPage && (
        <div className="flex justify-center mt-4">
          {Array.from(
            { length: Math.ceil(filteredReservations.length / itemsPerPage) },
            (_, i) => (
              <Button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`mx-1 ${
                  currentPage === i + 1
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary"
                }`}
              >
                {i + 1}
              </Button>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
