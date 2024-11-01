import React from "react";
import CreateProductForm from "./_component/CreateProductForm";
import CreateProductTypeForm from "./_component/CreateProductTypeForm";
import PrePage from "./_component/PrePage";

const Page = () => {
  return (
    <div>
      <h1 className=" font-bold text-3xl">Produits</h1>
      <p>
        La gestion de produit permet de gérer les produits de manière efficace.
      </p>
      <div className="">
        <PrePage />
      </div>
    </div>
  );
};

export default Page;
