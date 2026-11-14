import React, { useState } from "react"
import { createRoute } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import { supabase } from "../supabaseClient"
import { type Database } from "../types/supabase"
import { Route as rootRoute } from "./__root"

type PartOfSpeech = Database["public"]["Tables"]["words"]["Row"]["part_of_speech"]

export const Route = createRoute({
    getParentRoute: () => rootRoute,
    path: "/add-word",
    component: AddWordForm,
})

// oxlint-disable-next-line react/only-export-components
function AddWordForm() {
    const { t } = useTranslation()
    const [word, setWord] = useState<string>("")

    // Явно типизируем стейт нашим типом из ENUM
    const [partOfSpeech, setPartOfSpeech] = useState<PartOfSpeech>("noun")
    const [status, setStatus] = useState<string>("")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setStatus(t("addWord.saving"))

        const { error } = await supabase
            .from("words")
            .insert([
                {
                    word: word,
                    part_of_speech: partOfSpeech,
                } as never,
            ])
            .select()

        if (error) {
            setStatus(t("addWord.error", { message: error.message }))
        } else {
            setStatus(t("addWord.success", { word }))
            setWord("")
        }
    }

    // Обработчик изменения селекта с правильной типизацией события
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPartOfSpeech(e.target.value as PartOfSpeech)
    }

    return (
        <div style={{ padding: "20px", maxWidth: "400px" }}>
            <h2>{t("addWord.title")}</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block" }}>{t("addWord.word")}</label>
                    <input
                        type="text"
                        value={word}
                        onChange={(e) => setWord(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block" }}>{t("addWord.partOfSpeech")}</label>
                    <select
                        value={partOfSpeech}
                        onChange={handleSelectChange}
                        style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                    >
                        <option value="noun">{t("wordType.noun")}</option>
                        <option value="verb">{t("wordType.verb")}</option>
                        <option value="adjective">{t("wordType.adjective")}</option>
                        <option value="other">{t("wordType.other")}</option>
                    </select>
                </div>

                <button type="submit" style={{ padding: "10px 15px", cursor: "pointer" }}>
                    {t("addWord.submit")}
                </button>
            </form>

            {status && <p style={{ marginTop: "15px", fontWeight: "bold" }}>{status}</p>}
        </div>
    )
}
