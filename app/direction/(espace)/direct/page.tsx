import { Direct } from "@/components/direction/Direct"
import { AActiver, EnTetePage } from "@/components/direction/ui"
import { chargerDirect } from "@/lib/direction/alertes"

export const metadata = { title: "En direct — Direction Radio Tripoint" }

export default async function PageDirect() {
  const dir = await chargerDirect()
  return (
    <div>
      <EnTetePage
        titre="En direct"
        source="Compteur du site, anonyme et sans cookie · une personne compte tant que sa page envoie un signe de vie (70 s)"
      />
      {dir ? (
        <Direct initial={dir} />
      ) : (
        <AActiver titre="Compteur « en ligne maintenant » à activer">
          Il faut une base Redis gratuite reliée au projet sur Vercel : Storage → Create Database →
          Upstash Redis → relier à « radio-tripoint », puis redéployer.
        </AActiver>
      )}
    </div>
  )
}
