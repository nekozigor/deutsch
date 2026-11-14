import { createRoute } from "@tanstack/react-router"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import familie from "../../inserts/familie.json"
import haus from "../../inserts/haus.json"
import essen from "../../inserts/essen.json"
import { supabase } from "../supabaseClient"
import { type Database } from "../types/supabase"
import { Route as rootRoute } from "./__root"

type Gender = Database["public"]["Enums"]["gender_enum"]
type TranslationSet = Record<Database["public"]["Enums"]["translation_code"], string>
type WordEntry = {
    word: string
    translations: TranslationSet
}
type VerbEntry = {
    word: string
    translations: TranslationSet
    auxiliary_verb: "haben" | "sein"
    is_irregular?: boolean
    presens_3sg?: string
    praeteritum_3sg?: string
    perfekt_form?: string
}
type InsertFile = {
    topic: string
    words: (WordEntry & { gender: Gender })[]
    verbs: VerbEntry[]
}

function validateInsertFile(file: {
    topic: string
    words: (WordEntry & { gender: string })[]
    verbs: {
        word: string
        translations: TranslationSet
        auxiliary_verb: string
        is_irregular?: boolean
        presens_3sg?: string
        praeteritum_3sg?: string
        perfekt_form?: string
    }[]
}): InsertFile {
    const validateTranslations = (word: string, translations: TranslationSet) => {
        for (const language of ["ua", "en"] as const) {
            if (!translations[language].trim()) {
                throw new Error(`Missing ${language} translation for "${word}".`)
            }
        }

        return translations
    }

    return {
        topic: file.topic,
        words: file.words.map(({ word, gender, translations }) => {
            if (gender !== "m" && gender !== "f" && gender !== "n") {
                throw new Error(`Invalid gender for "${word}".`)
            }

            return { word, gender, translations: validateTranslations(word, translations) }
        }),
        verbs: file.verbs.map((verb) => {
            if (verb.auxiliary_verb !== "haben" && verb.auxiliary_verb !== "sein") {
                throw new Error(`Invalid auxiliary verb for "${verb.word}".`)
            }

            return {
                ...verb,
                translations: validateTranslations(verb.word, verb.translations),
                auxiliary_verb: verb.auxiliary_verb,
            }
        }),
    }
}

const insertFiles = [
    validateInsertFile(familie),
    validateInsertFile(haus),
    validateInsertFile(essen),
]

// oxlint-disable-next-line react/only-export-components
function ImportWordsPage() {
    const { t } = useTranslation()
    const [loadingTopic, setLoadingTopic] = useState<string | null>(null)
    const [status, setStatus] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const importTopic = async (file: InsertFile) => {
        setLoadingTopic(file.topic)
        setStatus(null)
        setError(null)

        try {
            const entries = [
                ...file.words.map(({ word }) => ({
                    word,
                    part_of_speech: "noun" as const,
                })),
                ...file.verbs.map(({ word }) => ({
                    word,
                    part_of_speech: "verb" as const,
                })),
            ]
            const names = entries.map(({ word }) => word)
            const { data: existingWords, error: existingWordsError } = await supabase
                .from("words")
                .select("id, word, part_of_speech")
                .in("part_of_speech", ["noun", "verb"])
                .in("word", names)

            if (existingWordsError) {
                throw existingWordsError
            }

            const getWordKey = (
                partOfSpeech: Database["public"]["Enums"]["part_of_speech_enum"],
                word: string,
            ) => `${partOfSpeech}:${word}`
            const wordIds = new Map(
                existingWords.map(({ id, word, part_of_speech }) => [
                    getWordKey(part_of_speech, word),
                    id,
                ]),
            )
            const newEntries = entries.filter(
                ({ word, part_of_speech }) => !wordIds.has(getWordKey(part_of_speech, word)),
            )

            if (newEntries.length > 0) {
                const { data: insertedWords, error: insertWordsError } = await supabase
                    .from("words")
                    .insert(newEntries)
                    .select("id, word, part_of_speech")

                if (insertWordsError) {
                    throw insertWordsError
                }

                for (const { id, word, part_of_speech } of insertedWords) {
                    wordIds.set(getWordKey(part_of_speech, word), id)
                }
            }

            const nouns = file.words.map(({ word, gender }) => {
                const wordId = wordIds.get(getWordKey("noun", word))
                if (wordId === undefined) {
                    throw new Error(t("importWords.missingWordId", { word }))
                }
                return { word_id: wordId, gender }
            })

            const { error: nounsError } = await supabase
                .from("nouns")
                .upsert(nouns, { onConflict: "word_id" })

            if (nounsError) {
                throw nounsError
            }

            const verbs = file.verbs.map(({ word, translations: _translations, ...verb }) => {
                const wordId = wordIds.get(getWordKey("verb", word))
                if (wordId === undefined) {
                    throw new Error(t("importWords.missingVerbId", { word }))
                }
                return { word_id: wordId, ...verb }
            })

            const { error: verbsError } = await supabase
                .from("verbs")
                .upsert(verbs, { onConflict: "word_id" })

            if (verbsError) {
                throw verbsError
            }

            const wordTranslations = [
                ...file.words.map(({ word, translations }) => ({
                    wordId: wordIds.get(getWordKey("noun", word)),
                    word,
                    translations,
                })),
                ...file.verbs.map(({ word, translations }) => ({
                    wordId: wordIds.get(getWordKey("verb", word)),
                    word,
                    translations,
                })),
            ].flatMap(({ wordId, word, translations }) => {
                if (wordId === undefined) {
                    throw new Error(t("importWords.missingTranslationWordId", { word }))
                }

                return (["ua", "en"] as const).map((language_code) => ({
                    word_id: wordId,
                    language_code,
                    translation_text: translations[language_code],
                }))
            })

            const { error: translationsError } = await supabase
                .from("words_translate")
                .upsert(wordTranslations, {
                    onConflict: "word_id,language_code,translation_text",
                    ignoreDuplicates: true,
                })

            if (translationsError) {
                throw translationsError
            }

            const { data: tag, error: tagError } = await supabase
                .from("tags")
                .upsert({ name: file.topic }, { onConflict: "name" })
                .select("id")
                .single()

            if (tagError) {
                throw tagError
            }

            const wordTags = [...nouns, ...verbs].map(({ word_id }) => ({
                word_id,
                tag_id: tag.id,
            }))
            const { error: wordTagsError } = await supabase
                .from("word_tags")
                .upsert(wordTags, { onConflict: "word_id,tag_id" })

            if (wordTagsError) {
                throw wordTagsError
            }

            setStatus(
                t("importWords.success", {
                    topic: file.topic,
                    nouns: nouns.length,
                    verbs: verbs.length,
                }),
            )
        } catch (importError) {
            setError(
                importError instanceof Error ? importError.message : t("importWords.fallbackError"),
            )
        } finally {
            setLoadingTopic(null)
        }
    }

    return (
        <main className="page">
            <section className="word-import">
                <h1>{t("importWords.title")}</h1>
                <p>{t("importWords.description")}</p>

                <div className="word-import__topics">
                    {insertFiles.map((file) => (
                        <button
                            key={file.topic}
                            type="button"
                            onClick={() => importTopic(file)}
                            disabled={loadingTopic !== null}
                        >
                            {loadingTopic === file.topic
                                ? t("importWords.loading")
                                : t("importWords.load", {
                                      topic: file.topic,
                                      nouns: file.words.length,
                                      verbs: file.verbs.length,
                                  })}
                        </button>
                    ))}
                </div>

                {status && <p role="status">{status}</p>}
                {error && <p role="alert">{t("importWords.error", { message: error })}</p>}
            </section>
        </main>
    )
}

export const Route = createRoute({
    getParentRoute: () => rootRoute,
    path: "/import-words",
    component: ImportWordsPage,
})
