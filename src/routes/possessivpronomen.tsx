import { createRoute } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"

import ConjugationTable, { type ConjugationTableRow } from "../components/ConjugationTable"
import { Route as rootRoute } from "./__root"
import "../css/conjugation-table.css"

const declensions: ConjugationTableRow[] = [
    { pronoun: "Nominativ", forms: ["Wer? Was?", "mein", "meine", "mein", "meine"] },
    { pronoun: "Akkusativ", forms: ["Wen? Was?", "meinen", "meine", "mein", "meine"] },
    { pronoun: "Dativ", forms: ["Wem?", "meinem", "meiner", "meinem", "meinen"] },
    { pronoun: "Genitiv", forms: ["Wessen?", "meines", "meiner", "meines", "meiner"] },
]

// oxlint-disable-next-line react/only-export-components
function PossessivpronomenPage() {
    const { t } = useTranslation()

    return (
        <main className="page">
            <section className="conjugation-page">
                <h1>{t("possessiveDeclension.title")}</h1>
                <p>{t("possessiveDeclension.description")}</p>
                <ConjugationTable
                    columns={[
                        t("articleDeclension.question"),
                        t("possessiveDeclension.masculine"),
                        t("possessiveDeclension.feminine"),
                        t("possessiveDeclension.neuter"),
                        t("possessiveDeclension.plural"),
                    ]}
                    rows={declensions}
                    rowHeading={t("possessiveDeclension.case")}
                />
                <p>{t("possessiveDeclension.euerNote")}</p>
            </section>
        </main>
    )
}

export const Route = createRoute({
    getParentRoute: () => rootRoute,
    path: "/possessivpronomen",
    component: PossessivpronomenPage,
})
