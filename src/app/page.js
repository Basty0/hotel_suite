import Header from "@/components/Header/Header";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container max-w-4xl mx-auto p-4 justify-center">
      <Card className="mt-8  items-center justify-centerstify-center">
        <CardContent className="pt-6">
          <h1 className="text-4xl font-bold">Nom de l'Hôtel</h1>
        </CardContent>
        <CardFooter>
          <Link href="/dashboard">
            <Button>Aller au Dashboard</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
