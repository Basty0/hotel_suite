"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
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

import CreateProductForm from "./CreateProductForm";
import CreateProductTypeForm from "./CreateProductTypeForm";
import UpdateProduitForm from "./UpdateProduitForm";

export default function ProduitList({
  produits,
  fetchProduits,
  typesProduits,
  fetchTypesProduits,
}) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedProduit, setSelectedProduit] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const productColumns = [
    {
      accessorKey: "nom",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nom
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("nom")}</div>
      ),
    },
    {
      accessorKey: "prix",
      header: "Prix",
      cell: ({ row }) => {
        const prix = parseFloat(row.getValue("prix"));
        const formatted = new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "EUR",
        }).format(prix);
        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <div>{row.getValue("description")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const produit = row.original;
        return (
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
                  navigator.clipboard.writeText(produit.id.toString())
                }
              >
                Copier l'ID du produit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => showProduitDetails(produit)}>
                Voir les détails
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UpdateProduitForm
                  produit={produit}
                  fetchProduits={fetchProduits}
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: "type_produit.nom",
      header: "Type de Produit",
      cell: ({ row }) => <div>{row.original.type_produit?.nom || "N/A"}</div>,
    },
  ];

  const typeColumns = [
    {
      accessorKey: "nom",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nom
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("nom")}</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <div>{row.getValue("description")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const type = row.original;
        return (
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
                  navigator.clipboard.writeText(type.id.toString())
                }
              >
                Copier l'ID du type
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Modifier le type</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const productTable = useReactTable({
    data: produits,
    columns: productColumns,
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

  const typeTable = useReactTable({
    data: typesProduits,
    columns: typeColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const showProduitDetails = (produit) => {
    setSelectedProduit(produit);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Types de Produits</h2>
          <CreateProductTypeForm fetchTypesProduits={fetchTypesProduits} />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {typeTable.getHeaderGroups().map((headerGroup) => (
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
              {typeTable.getRowModel().rows?.length ? (
                typeTable.getRowModel().rows.map((row) => (
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
                    colSpan={typeColumns.length}
                    className="h-24 text-center"
                  >
                    Aucun type de produit trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Produits</h2>
        <CreateProductForm
          fetchProduits={fetchProduits}
          typesProduits={typesProduits}
        />
      </div>

      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrer par nom..."
          value={productTable.getColumn("nom")?.getFilterValue() ?? ""}
          onChange={(event) =>
            productTable.getColumn("nom")?.setFilterValue(event.target.value)
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
            {productTable
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
            {productTable.getHeaderGroups().map((headerGroup) => (
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
            {productTable.getRowModel().rows?.length ? (
              productTable.getRowModel().rows.map((row) => (
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
                  colSpan={productColumns.length}
                  className="h-24 text-center"
                >
                  Aucun produit trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {productTable.getFilteredSelectedRowModel().rows.length} sur{" "}
          {productTable.getFilteredRowModel().rows.length} ligne(s)
          sélectionnée(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => productTable.previousPage()}
            disabled={!productTable.getCanPreviousPage()}
          >
            Précédent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => productTable.nextPage()}
            disabled={!productTable.getCanNextPage()}
          >
            Suivant
          </Button>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Détails du produit</DialogTitle>
            <DialogDescription>
              Informations détaillées sur le produit sélectionné.
            </DialogDescription>
          </DialogHeader>
          {selectedProduit && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right font-medium">Nom:</label>
                <span className="col-span-3">{selectedProduit.nom}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right font-medium">Prix:</label>
                <span className="col-span-3">
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  }).format(selectedProduit.prix)}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right font-medium">Description:</label>
                <span className="col-span-3">
                  {selectedProduit.description}
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right font-medium">Type:</label>
                <span className="col-span-3">
                  {selectedProduit.type_produit?.nom || "N/A"}
                </span>
              </div>
              {/* Ajoutez d'autres champs si nécessaire */}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
