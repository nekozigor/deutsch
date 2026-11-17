import { createRoute, Link } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import { Route as rootRoute } from "./__root"

// oxlint-disable-next-line react/only-export-components
function HomePage() {
    const { t } = useTranslation()

    return (
        <main className="home">
            <h1 className="home__title">{t("home.title")}</h1>
            <nav className="home__menu" aria-label={t("home.menuLabel")}>
                <section className="home__group">
                    <h2>{t("home.tests")}</h2>
                    <Link to="/artikel">{t("home.articleTest")}</Link>
                    <Link to="/translate-to-german">{t("home.wordBankTest")}</Link>
                </section>
                <section className="home__group">
                    <h2>{t("home.grammar")}</h2>
                    <Link to="/sein">{t("home.sein")}</Link>
                    <Link to="/haben">{t("home.haben")}</Link>
                    <Link to="/artikel-deklination">{t("home.definiteArticleDeclension")}</Link>
                    <Link to="/possessivpronomen">{t("home.possessivePronouns")}</Link>
                </section>
                <section className="home__group">
                    <h2>{t("home.admin")}</h2>
                    <Link to="/add-word">{t("home.addWord")}</Link>
                    <Link to="/import-words">{t("home.importWords")}</Link>
                </section>
            </nav>
        </main>
    )
}

export const Route = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: HomePage,
})
