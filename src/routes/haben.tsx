import { createRoute } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"

import ConjugationTable, { type ConjugationTableRow } from "../components/ConjugationTable"
import { Route as rootRoute } from "./__root"
import "../css/conjugation-table.css"

const conjugations: ConjugationTableRow[] = [
    { pronoun: "ich", forms: ["habe", "hatte", "habe gehabt"] },
    { pronoun: "du", forms: ["hast", "hattest", "hast gehabt"] },
    { pronoun: "er / sie / es", forms: ["hat", "hatte", "hat gehabt"] },
    { pronoun: "wir", forms: ["haben", "hatten", "haben gehabt"] },
    { pronoun: "ihr", forms: ["habt", "hattet", "habt gehabt"] },
    { pronoun: "sie / Sie", forms: ["haben", "hatten", "haben gehabt"] },
]

// oxlint-disable-next-line react/only-export-components
function HabenPage() {
    const { t } = useTranslation()

    return (
        <main className="page">
            <section className="conjugation-page">
                <h1>{t("haben.title")}</h1>
                <p>{t("haben.description")}</p>
                <ConjugationTable
                    columns={["Präsens", "Präteritum", "Perfekt"]}
                    rows={conjugations}
                />
            </section>
        </main>
    )
}

export const Route = createRoute({
    getParentRoute: () => rootRoute,
    path: "/haben",
    component: HabenPage,
})
