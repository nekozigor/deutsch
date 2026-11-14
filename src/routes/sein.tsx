import { createRoute } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"

import ConjugationTable, { type ConjugationTableRow } from "../components/ConjugationTable"
import { Route as rootRoute } from "./__root"
import "../css/conjugation-table.css"

export const Route = createRoute({
    getParentRoute: () => rootRoute,
    path: "/sein",
    component: SeinPage,
})

const conjugations: ConjugationTableRow[] = [
    { pronoun: "ich", forms: ["bin", "war", "bin gewesen"] },
    { pronoun: "du", forms: ["bist", "warst", "bist gewesen"] },
    { pronoun: "er / sie / es", forms: ["ist", "war", "ist gewesen"] },
    { pronoun: "wir", forms: ["sind", "waren", "sind gewesen"] },
    { pronoun: "ihr", forms: ["seid", "wart", "seid gewesen"] },
    { pronoun: "sie / Sie", forms: ["sind", "waren", "sind gewesen"] },
]

// oxlint-disable-next-line react/only-export-components
function SeinPage() {
    const { t } = useTranslation()

    return (
        <main className="page">
            <section className="conjugation-page">
                <h1>{t("sein.title")}</h1>
                <p>{t("sein.description")}</p>
                <ConjugationTable
                    columns={["Präsens", "Präteritum", "Perfekt"]}
                    rows={conjugations}
                />
            </section>
        </main>
    )
}
