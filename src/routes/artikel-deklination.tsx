import { createRoute } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"

import ConjugationTable, { type ConjugationTableRow } from "../components/ConjugationTable"
import { Route as rootRoute } from "./__root"
import "../css/conjugation-table.css"

const declensions: ConjugationTableRow[] = [
    { pronoun: "Nominativ", forms: ["Wer? Was?", "der", "die", "das", "die"] },
    { pronoun: "Akkusativ", forms: ["Wen? Was?", "den", "die", "das", "die"] },
    { pronoun: "Dativ", forms: ["Wem?", "dem", "der", "dem", "den"] },
    { pronoun: "Genitiv", forms: ["Wessen?", "des", "der", "des", "der"] },
]

// oxlint-disable-next-line react/only-export-components
function ArtikelDeklinationPage() {
    const { t } = useTranslation()

    return (
        <main className="page">
            <section className="conjugation-page">
                <h1>{t("articleDeclension.title")}</h1>
                <p>{t("articleDeclension.description")}</p>
                <ConjugationTable
                    columns={[
                        t("articleDeclension.question"),
                        t("articleDeclension.masculine"),
                        t("articleDeclension.feminine"),
                        t("articleDeclension.neuter"),
                        t("articleDeclension.plural"),
                    ]}
                    rows={declensions}
                    rowHeading={t("articleDeclension.case")}
                />
            </section>
        </main>
    )
}

export const Route = createRoute({
    getParentRoute: () => rootRoute,
    path: "/artikel-deklination",
    component: ArtikelDeklinationPage,
})
