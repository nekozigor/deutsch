import { useRef } from "react"
import { useTranslation } from "react-i18next"

import "./GenderExplanationModal.css"

export default function GenderExplanationModal() {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const { t } = useTranslation()

    return (
        <>
            <button
                className="artikel-gender-help__trigger"
                type="button"
                onClick={() => dialogRef.current?.showModal()}
            >
                {t("genderHelp.trigger")}
            </button>
            <dialog
                className="artikel-gender-help"
                ref={dialogRef}
                aria-labelledby="artikel-gender-help-title"
            >
                <div className="artikel-gender-help__header">
                    <h2 id="artikel-gender-help-title">{t("genderHelp.title")}</h2>
                    <form method="dialog">
                        <button
                            className="artikel-gender-help__close"
                            type="submit"
                            aria-label={t("genderHelp.close")}
                        >
                            ×
                        </button>
                    </form>
                </div>
                <p>{t("genderHelp.intro")}</p>
                <ul>
                    <li>{t("genderHelp.der")}</li>
                    <li>{t("genderHelp.die")}</li>
                    <li>{t("genderHelp.das")}</li>
                    <li>{t("genderHelp.compound")}</li>
                </ul>
                <p>{t("genderHelp.outro")}</p>
            </dialog>
        </>
    )
}
