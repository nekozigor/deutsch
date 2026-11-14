import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createRouter, RouterProvider } from "@tanstack/react-router"
import "./App.css"
import { LanguageProvider } from "./providers/LanguageContext"
import LanguagePicker from "./layout/LanguagePicker"
import { Route as ArtikelRoute } from "./routes/artikel"
import { Route as AddWordRoute } from "./routes/AddWordForm"
import { Route as IndexRoute } from "./routes/index"
import { Route as ImportWordsRoute } from "./routes/ImportWords"
import { Route as RootRoute } from "./routes/__root"
import { Route as SeinRoute } from "./routes/sein"
import { Route as HabenRoute } from "./routes/haben"
import { Route as ArtikelDeklinationRoute } from "./routes/artikel-deklination"
import { Route as PossessivpronomenRoute } from "./routes/possessivpronomen"

const routeTree = RootRoute.addChildren([
    IndexRoute,
    ArtikelRoute,
    SeinRoute,
    HabenRoute,
    ArtikelDeklinationRoute,
    PossessivpronomenRoute,
    AddWordRoute,
    ImportWordsRoute,
])
const router = createRouter({ routeTree })
const queryClient = new QueryClient()

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router
    }
}

function App() {
    return (
        <LanguageProvider>
            <QueryClientProvider client={queryClient}>
                <LanguagePicker />
                <RouterProvider router={router} />
            </QueryClientProvider>
        </LanguageProvider>
    )
}

export default App
