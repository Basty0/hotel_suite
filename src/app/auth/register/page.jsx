import React from "react";
import Header from "@/components/Header/Header";
import RegisterForme from "./_components/registerForme";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import IsLogin from "@/components/IsLogin";

const Page = () => {
  return (
    <div>
      <IsLogin>
        <Header />
        <div className="flex justify-center items-center mx-auto my-20 xl:w-2/4 md:w-2/3">
          <Card>
            <CardHeader>
              <CardTitle>Inscription</CardTitle>
              <CardDescription>
                Entrez vos informations pour vous inscrire
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RegisterForme />
            </CardContent>
            <CardFooter>
              <p>Vous avez déjà un compte ?</p>
              <Link href="/auth/login">Connectez-vous</Link>
            </CardFooter>
          </Card>
        </div>
      </IsLogin>
    </div>
  );
};

export default Page;
