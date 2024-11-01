import React from "react";
import PrePage from "./_component/PrePage";

const Page = () => {
  return (
    <div className=" justify-center items-center">
      <div className="my-3">
        <h1 className="font-bold text-3xl">Utilisateurs</h1>
        <p className="md:max-w-[60%] text-zinc-400">
          Ajoutez un nouveau membre à votre équipe.Modifiez, supprimez ou
          consultez les informations des employés.
        </p>
      </div>
      <div className="">
        <PrePage />
      </div>
    </div>
  );
};

export default Page;
