"use client";
import React, { useState, useEffect } from "react";
import { getClients } from "@/api/clients/clientApi";
import { DataTable } from "./DataTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ListeClient = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [nameFilter, clients]);

  const fetchClients = async () => {
    try {
      const response = await getClients();
      setClients(response.data);
      setFilteredClients(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des clients:", error);
    }
  };

  const handleFilter = () => {
    const filtered = clients.filter(
      (client) =>
        client.nom.toLowerCase().includes(nameFilter.toLowerCase()) ||
        client.prenom.toLowerCase().includes(nameFilter.toLowerCase())
    );
    setFilteredClients(filtered);
  };

  const columns = [
    {
      accessorKey: "nom",
      header: "Nom",
    },
    {
      accessorKey: "prenom",
      header: "Prénom",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "telephone",
      header: "Téléphone",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Link href={`/dashboard/client/${row.original.id}`}>
          <Button variant="outline">Voir détails</Button>
        </Link>
      ),
    },
  ];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClients.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Liste des Clients</h1>

      <div className="mb-4">
        <Input
          placeholder="Rechercher par nom ou prénom"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
      </div>

      <DataTable columns={columns} data={currentItems} />

      {filteredClients.length > itemsPerPage && (
        <div className="flex justify-center mt-4">
          {Array.from(
            { length: Math.ceil(filteredClients.length / itemsPerPage) },
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

export default ListeClient;
