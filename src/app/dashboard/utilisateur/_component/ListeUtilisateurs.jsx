import { UserDataTable } from "./UserDataTable";
import { Button } from "@/components/ui/button";

const ListeUtilisateurs = ({ utilisateurs }) => {
  const columns = [
    {
      accessorKey: "name",
      header: "Nom",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button variant="outline" onClick={() => console.log(row.original)}>
          Voir Détails
        </Button>
      ),
    },
  ];

  return <UserDataTable columns={columns} data={utilisateurs} />;
};

export default ListeUtilisateurs;
