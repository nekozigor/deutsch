import { createRoute } from "@tanstack/react-router"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Route as rootRoute } from "./__root"
import Quiz from "../pages/artikel/Quiz"
import ChooseThemes from "../pages/artikel/ChooseThemes"

export const Route = createRoute({
    getParentRoute: () => rootRoute,
    path: "/artikel",
    component: ArtikelPage,
})

// oxlint-disable-next-line react/only-export-components
function ArtikelPage() {
    const { t } = useTranslation()
    const [selectedTagsIds, setSelectedTagsIds] = useState<number[] | null | undefined>(undefined)

    return (
        <main className="page">
            <section className="artikel-quiz">
                <h1>{t("artikelQuiz.title")}</h1>
                {selectedTagsIds === undefined && <ChooseThemes startQuiz={setSelectedTagsIds} />}
                {selectedTagsIds !== undefined && <Quiz selectedTagsIds={selectedTagsIds} />}
            </section>
        </main>
    )
}
