"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import CreateCategorieForm from "./CreateCategorieForm";
import CreateChambreForm from "./CreateChambreForm";
import UpdateCategorieForm from "./UpdateCategorieForm";
import UpdateChambreForm from "./UpdateChambreForm";

export default function RoomList({
  categorie,
  chambre,
  fetcCategorie,
  fetchChambre,
}) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedRoom, setSelectedRoom] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Déplacer la définition de categoryColumns ici
  const categoryColumns = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div>{row.getValue("id")}</div>,
    },
    {
      accessorKey: "nom",
      header: "Nom de la catégorie",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("nom")}</div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <UpdateCategorieForm
          categorie={row.original}
          fetchCategorie={fetcCategorie}
        />
      ),
    },
  ];

  // Define roomColumns inside the component to access the categorie prop
  const roomColumns = [
    {
      accessorKey: "numero_chambre",
      header: "Chambre",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("numero_chambre")}</div>
      ),
    },
    {
      accessorKey: "categorie_id",
      header: "Tarif",
      cell: ({ row }) => {
        const categoryId = row.getValue("categorie_id");
        const category = categorie.find((cat) => cat.id === categoryId);
        const tarif = category ? category.tarif : 0;
        const formatted = new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "MGA",
        }).format(tarif);
        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "caracteristiques",
      header: "Caractéristiques",
      cell: ({ row }) => {
        const caracteristiques = row.getValue("caracteristiques");
        // Tronquer le texte à 50 caractères et ajouter "..." si plus long
        return (
          <div className="max-w-[200px] truncate" title={caracteristiques}>
            {caracteristiques.length > 50
              ? `${caracteristiques.substring(0, 50)}...`
              : caracteristiques}
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const room = row.original;
        return (
          <div className="flex space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() =>
                    navigator.clipboard.writeText(room.id.toString())
                  }
                >
                  Copier l'ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => showRoomDetails(room)}>
                  Voir les détails
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <UpdateChambreForm
              chambre={room}
              categorie={categorie}
              fetchChambre={fetchChambre}
            />
          </div>
        );
      },
    },
  ];

  const roomTable = useReactTable({
    data: chambre,
    columns: roomColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const categoryTable = useReactTable({
    data: categorie,
    columns: categoryColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const showRoomDetails = (room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Catégories de chambres</h2>
          <CreateCategorieForm fetcCategorie={fetcCategorie} />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {categoryTable.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {categoryTable.getRowModel().rows?.length ? (
                categoryTable.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={categoryColumns.length}
                    className="h-24 text-center"
                  >
                    Aucune catégorie trouvée.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Chambres</h2>
        <CreateChambreForm categorie={categorie} fetchChambre={fetchChambre} />
      </div>

      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrer par numéro de chambre..."
          value={roomTable.getColumn("numero_chambre")?.getFilterValue() ?? ""}
          onChange={(event) =>
            roomTable
              .getColumn("numero_chambre")
              ?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Colonnes <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {roomTable
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {roomTable.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {roomTable.getRowModel().rows?.length ? (
              roomTable.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={roomColumns.length}
                  className="h-24 text-center"
                >
                  Aucune chambre trouvée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {roomTable.getFilteredSelectedRowModel().rows.length} sur{" "}
          {roomTable.getFilteredRowModel().rows.length} ligne(s)
          sélectionnée(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => roomTable.previousPage()}
            disabled={!roomTable.getCanPreviousPage()}
          >
            Précédent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => roomTable.nextPage()}
            disabled={!roomTable.getCanNextPage()}
          >
            Suivant
          </Button>
        </div>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary">
              Détails de la chambre
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Informations détaillées sur la chambre sélectionnée.
            </DialogDescription>
          </DialogHeader>
          {selectedRoom && (
            <div className="grid gap-6 py-4">
              <div className="flex justify-center">
                <img
                  src={`http://127.0.0.1:8000/${selectedRoom.image}`}
                  alt={`Chambre ${selectedRoom.numero_chambre}`}
                  className="w-64 h-48 object-cover rounded-lg shadow-lg border-2 border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <label className="font-semibold text-primary mb-1">
                      Numéro de chambre
                    </label>
                    <span className="text-lg">
                      {selectedRoom.numero_chambre}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <label className="font-semibold text-primary mb-1">
                      Catégorie
                    </label>
                    <span className="text-lg">
                      {categorie.find(
                        (cat) => cat.id === selectedRoom.categorie_id
                      )?.nom || "Inconnu"}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <label className="font-semibold text-primary mb-1">
                      Tarif
                    </label>
                    <span className="text-lg font-medium">
                      {new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: "MGA",
                      }).format(
                        categorie.find(
                          (cat) => cat.id === selectedRoom.categorie_id
                        )?.tarif || 0
                      )}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col">
                    <label className="font-semibold text-primary mb-1">
                      Caractéristiques
                    </label>
                    <p className="text-lg">{selectedRoom.caracteristiques}</p>
                  </div>

                  <div className="flex flex-col">
                    <label className="font-semibold text-primary mb-1">
                      Date de création
                    </label>
                    <span className="text-lg">
                      {new Date(selectedRoom.created_at).toLocaleString(
                        "fr-FR"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
