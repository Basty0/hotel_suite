import React from "react";

const ProduitCard = () => {
  return (
    <div>
      <div>
        <div className="flex justify-between items-center mt-4">
          <h2 className="text-xl font-semibold">Types des produits</h2>
          <CreateProductTypeForm fetchData={fetchData} />
        </div>

        {/* Render product types */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {typesProduits.map((type) => (
            <Card key={type.id} className="p-4">
              <h2 className="text-lg font-bold">{type.nom}</h2>
              <p>{type.description}</p>
              <div className="flex justify-between mt-4">
                <UpdateProductTypeForm
                  initialData={type}
                  fetchData={fetchData}
                />
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-between items-center mt-4">
          <h2 className="text-xl font-semibold">Produits</h2>
          <CreateProductForm
            typesProduits={typesProduits}
            fetchData={fetchData}
          />
        </div>

        {/* Render grouped products */}
        {Object.entries(groupedProduits).map(([typeName, produits]) => (
          <div key={typeName}>
            <h3 className="text-lg font-semibold mt-6 mb-3">{typeName}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {produits.map((produit) => (
                <Card key={produit.id} className="p-4">
                  <h2 className="text-lg font-bold">{produit.nom}</h2>
                  <p>{produit.description}</p>
                  <div className="flex justify-between mt-4">
                    <UpdateProduitForm
                      initialData={produit}
                      fetchData={fetchData}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProduitCard;
