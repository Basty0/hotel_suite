import { Button } from "@/components/ui/button";

export function MainContent() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Inventory</h1>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            You have no products
          </h3>
          <p className="text-sm text-muted-foreground">
            You can start selling as soon as you add a product.
          </p>
          <Button className="mt-4">Add Product</Button>
          <p>
            Article labellisé du jour Ballad of Sir Frankie Crisp (Let It Roll)
            est une chanson écrite, composée, interprétée et co-produite par
            George Harrison, publiée sur son triple album All Things Must Pass
            en 1970. Elle rend hommage à Sir Frank Crisp, excentrique homme de
            loi britannique du XIXe siècle, bâtisseur et premier propriétaire de
            Friar Park, un manoir situé à Henley-on-Thames dans l'Oxfordshire,
            que George Harrison acquiert dans un état délabré au début de 1970.
            La chanson évoque une promenade dans cette propriété étonnante. Sur
            ce morceau, l'ex-Beatles est entouré, entre autres musiciens, de
            Pete Drake, Billy Preston, Gary Wright, Klaus Voormann et Alan
            White. Co-produit par Phil Spector, il est décrit par le critique
            musical Scott Janovitz comme « offrant un aperçu du véritable George
            Harrison — à la fois mystique, plein d'humour, solitaire, malicieux
            et sérieux ». Avec la photographie illustrant la pochette de All
            Things Must Pass, prise dans les jardins de Friar Park, Ballad of
            Sir Frankie Crisp identifie Harrison à sa propriété
            d'Henley-on-Thames, identification confirmée par d'autres titres
            comme Crackerbox Palace et qui perdure après son décès en novembre
            2001. Des aphorismes excentriques de Crisp, que le chanteur découvre
            inscrits à l'intérieur et autour du manoir, l'influencent et lui
            inspirent ultérieurement d'autres compositions comme Ding Dong, Ding
            Dong et The Answer's at The End. La chanson, qui donne lieu à de
            nombreuses interprétations, trouve une nouvelle notoriété en 2009
            quand elle est choisie comme titre de la compilation posthume Let It
            Roll. Peu reprise en raison de ses paroles qui en font une œuvre
            très personnelle, elle est toutefois réinterprétée par des artistes
            comme Jim James et Dhani Harrison, le fils de George.
          </p>
        </div>
      </div>
    </main>
  );
}
