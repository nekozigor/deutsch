import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import i18n from "../i18n"

export type TranslationLanguage = "en" | "uk"

const LanguageContext = createContext<{
    language: TranslationLanguage
    setLanguage: (language: TranslationLanguage) => void
} | null>(null)

function getInitialLanguage(): TranslationLanguage {
    const storedLanguage = localStorage.getItem("translation-language")
    return storedLanguage === "uk" || storedLanguage === "ua" ? "uk" : "en"
}

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<TranslationLanguage>(getInitialLanguage)

    useEffect(() => {
        document.documentElement.lang = language
    }, [language])

    const setLanguage = (nextLanguage: TranslationLanguage) => {
        localStorage.setItem("translation-language", nextLanguage)
        void i18n.changeLanguage(nextLanguage)
        setLanguageState(nextLanguage)
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    )
}

// oxlint-disable-next-line react/only-export-components
export function useTranslationLanguage() {
    const context = useContext(LanguageContext)

    if (!context) {
        throw new Error("useTranslationLanguage must be used within a LanguageProvider")
    }

    return context
}
