import { createRoute } from "@tanstack/react-router"
import TranslationWordBankTest from "../components/test/TranslationWordBankTest"
import { Route as rootRoute } from "./__root"

export const Route = createRoute({
    getParentRoute: () => rootRoute,
    path: "/translate-to-german",
    component: TranslateToGermanPage,
})

// oxlint-disable-next-line react/only-export-components
function TranslateToGermanPage() {
    return (
        <main className="page">
            <TranslationWordBankTest />
        </main>
    )
}
