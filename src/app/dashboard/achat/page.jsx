"use client";
import React, { useState, useEffect } from "react";
import { getAchats, updateAchatStatus } from "@/api/achats/achatApi";
import { DataTable } from "./_component/DataTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Ellipsis } from "lucide-react";

const Page = () => {
  const [achats, setAchats] = useState([]);
  const [filteredAchats, setFilteredAchats] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchAchats();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [nameFilter, dateFilter, statusFilter]);

  const fetchAchats = async () => {
    const response = await getAchats();
    setAchats(response.data);
    console.log(response.data);
    setFilteredAchats(response.data);
  };

  const columns = [
    {
      accessorKey: "client.nom",
      header: "Nom du client",
    },
    {
      accessorKey: "client.prenom",
      header: "Prénom du client",
    },
    {
      accessorKey: "prix_total",
      header: "Prix total",
      cell: ({ row }) => `${row.original.prix_total} Ar`,
    },
    {
      accessorKey: "statut",
      header: "Statut",
      cell: ({ row }) => {
        const achat = row.original;
        return (
          <div className="flex items-center justify-between">
            <div
              className={`w-6 h-6 rounded-full ${
                achat.statut === "payé" ? "bg-green-500" : "bg-red-500"
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
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleUpdateAchat(
                        achat.id,
                        achat.statut === "payé" ? "non payé" : "payé"
                      )
                    }
                    disabled={isLoadingAction}
                  >
                    {achat.statut === "payé"
                      ? "Marquer comme non payé"
                      : "Marquer comme payé"}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        );
      },
    },
    {
      accessorKey: "mode_paiement",
      header: "Mode de paiement",
    },
    {
      accessorKey: "created_at",
      header: "Date d'achat",
      cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
    },
    {
      accessorKey: "total_produits",
      header: "Total produits",
      cell: ({ row }) => {
        return row.original.produit_achats
          ? row.original.produit_achats.length
          : 0;
      },
    },
  ];

  const handleUpdateAchat = async (achatId, newStatus) => {
    setIsLoadingAction(true);
    try {
      await updateAchatStatus(achatId, { statut: newStatus });
      await fetchAchats();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'achat:", error);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleFilter = () => {
    let filtered = achats;

    if (nameFilter) {
      filtered = filtered.filter(
        (achat) =>
          achat.client.nom.toLowerCase().includes(nameFilter.toLowerCase()) ||
          achat.client.prenom.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    if (dateFilter) {
      filtered = filtered.filter((achat) =>
        achat.created_at.includes(dateFilter)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((achat) => achat.statut === statusFilter);
    }

    setFilteredAchats(filtered);
  };

  const handleStatusClick = (status) => {
    if (statusFilter === status) {
      setStatusFilter("");
    } else {
      setStatusFilter(status);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAchats.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Achats</h1>

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
        {["payé", "non payé"].map((status) => (
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
                status === "payé" ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
          </Card>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={currentItems}
        rowClassName={(row) => {
          switch (row.statut) {
            case "payé":
              return "";
            case "non payé":
              return "";
            default:
              return "";
          }
        }}
      />

      {filteredAchats.length > itemsPerPage && (
        <div className="flex justify-center mt-4">
          {Array.from(
            { length: Math.ceil(filteredAchats.length / itemsPerPage) },
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
