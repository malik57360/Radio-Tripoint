import { redirect } from "next/navigation"

/** Les messages ont leur propre messagerie : les anciens liens y mènent. */
export default function AncienneBoite() {
  redirect("/messages")
}
