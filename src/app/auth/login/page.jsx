//"use client";
import React from "react";
import LoginForme from "./_components/LoginForme";
import {
  Card,
  CardDescription,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header/Header";
import IsLogin from "@/components/IsLogin";
const Page = () => {
  return (
    <div>
      <IsLogin>
        <Header />
        <div className="flex justify-center items-center mx-auto my-20 xl:w-2/4 md:w-2/3">
          <Card>
            <CardHeader>
              <CardTitle>Connexion</CardTitle>
              <CardDescription>
                Entrez votre email et votre mot de passe pour vous connecter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForme />
            </CardContent>
            <CardFooter className="flex flex-col justify-center items-center">
              <p>Vous n'avez pas de compte ?</p>
              <Link href="/auth/register">Inscrivez-vous</Link>
            </CardFooter>
          </Card>
        </div>
      </IsLogin>
    </div>
  );
};

export default Page;
