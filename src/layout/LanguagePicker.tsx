import { useTranslationLanguage } from "../providers/LanguageContext"
import { useTranslation } from "react-i18next"

export default function LanguagePicker() {
    const { language, setLanguage } = useTranslationLanguage()
    const { t } = useTranslation()
    const selectedFlag = language === "en" ? "/flags/gb.png" : "/flags/ua.png"
    const selectedLanguageName =
        language === "en" ? t("languagePicker.english") : t("languagePicker.ukrainian")

    return (
        <details className="language-picker">
            <summary aria-label={t("languagePicker.ariaLabel", { language: selectedLanguageName })}>
                <img className="language-picker__flag" src={selectedFlag} alt="" />
                <span className="language-picker__chevron" aria-hidden="true">
                    ▾
                </span>
            </summary>
            <div
                className="language-picker__menu"
                role="group"
                aria-label={t("languagePicker.menuLabel")}
            >
                <button
                    type="button"
                    aria-pressed={language === "en"}
                    onClick={(event) => {
                        setLanguage("en")
                        event.currentTarget.closest("details")?.removeAttribute("open")
                    }}
                >
                    <img className="language-picker__flag" src="/flags/gb.png" alt="" />
                    {t("languagePicker.english")}
                </button>
                <button
                    type="button"
                    aria-pressed={language === "uk"}
                    onClick={(event) => {
                        setLanguage("uk")
                        event.currentTarget.closest("details")?.removeAttribute("open")
                    }}
                >
                    <img className="language-picker__flag" src="/flags/ua.png" alt="" />
                    {t("languagePicker.ukrainian")}
                </button>
            </div>
        </details>
    )
}
