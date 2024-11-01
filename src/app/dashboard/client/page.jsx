import React from "react";
import PrePage from "./PrePage";

const Page = () => {
  return (
    <div className=" justify-center items-center">
      <div className="my-3">
        <h1 className="font-bold text-3xl">Clients</h1>
        <p className="md:max-w-[60%] text-zinc-400">
          Gérez les réservations en toute simplicité. Consultez, modifiez et
          annulez les réservations de vos clients directement depuis votre
          espace personnel.
        </p>
      </div>
      <div className="">
        <PrePage />
      </div>
    </div>
  );
};

export default Page;
