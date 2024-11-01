import React from "react";

const CardPrepage = () => {
  return (
    <div>
      <div>
        <div className=" flex justify-between items-center mt-4">
          <h2 className="text-xl font-semibold">Catégorie des chambres </h2>
          <CreateCategorieForm fetcCategorie={fetcCategorie} />
        </div>
        <div className="mt-5">
          {loading ? (
            <div className="flex justify-center mt-4">
              <Loader2 className="animate-spin w-6 h-6" />
            </div>
          ) : (
            <div className=" grid md:grid-cols-4 grid-cols-2 gap-4">
              {categorie.map((cat) => (
                <Card key={cat.id}>
                  <CardHeader>
                    <CardTitle>
                      <h3 className="text-lg font-medium">{cat.nom}</h3>
                    </CardTitle>
                    <CardDescription className="md:flex justify-between items-center">
                      <p>{cat.tarif} Ar</p>
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <UpdateCategorieForm
                      categorie={cat}
                      fetchCategorie={fetcCategorie}
                    />
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className=" flex justify-between items-center mt-10">
          <h2 className="text-xl font-semibold">Chambres et salle </h2>

          <CreateChambreForm
            fetchChambre={fetchChambre}
            categorie={categorie}
          />
        </div>

        <div className="mt-2">
          {Object.keys(chambre).map((categorieNom) => (
            <div key={categorieNom}>
              <Badge variant="secondary" className="my-3">
                <h2 className="text-xl font-semibold ">{categorieNom}</h2>
              </Badge>
              <div className="grid md:grid-cols-4 grid-cols-2 gap-4">
                {chambre[categorieNom].map((ch) => (
                  <div className="relative">
                    <Card className="m-2" key={ch.id}>
                      <CardHeader>
                        <CardTitle>
                          <h3 className="text-lg font-medium">
                            Chambre {ch.numero_chambre}
                          </h3>
                        </CardTitle>
                        <CardDescription>
                          <p>
                            {ch.caracteristiques.slice(0, 100)}
                            {ch.caracteristiques.length > 100 ? "..." : ""}
                          </p>
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className=" ">
                        <div className="items-center justify-between absolute right-0 top-0">
                          <img
                            src={`http://127.0.0.1:8000/${ch.image}`}
                            alt={`Chambre ${ch.numero_chambre}`}
                            className="w-20 h-full rounded-full border-2 border-primary "
                          />
                        </div>
                        <UpdateChambreForm
                          fetchChambre={fetchChambre}
                          chambre={ch}
                          categorie={categorie}
                        />
                      </CardFooter>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardPrepage;
