import { type Noun } from "../../sql/artikels"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useTranslationLanguage } from "../../providers/LanguageContext"
import GenderExplanationModal from "../modal/GenderExplanationModal"
import "../../css/word_translate.css"

const articles = {
    m: "der",
    f: "die",
    n: "das",
} as const

export default function ArtikelTest({
    currentWord,
    checkAnswer,
}: {
    currentWord: Noun
    checkAnswer: (answer: boolean) => void
}) {
    const { language } = useTranslationLanguage()
    const { t } = useTranslation()
    const translationLanguage = language === "uk" ? "ua" : language
    const [selectedArticle, setSelectedArticle] = useState<
        (typeof articles)[keyof typeof articles] | null
    >(null)
    const [flip, setFlip] = useState<boolean>(false)

    const checkAnswerHandler = (article: (typeof articles)[keyof typeof articles]): void => {
        checkAnswer(article === articles[currentWord.nouns.gender])
        setSelectedArticle(article)
    }

    return (
        <>
            <div className="artikel-quiz">
                <div className="artikel-quiz__word-card">
                    <div
                        className={flip ? "flip-card active" : "flip-card"}
                        onClick={() => setFlip(!flip)}
                    >
                        <div className="flip-card-inner">
                            <div className="flip-card-front">{currentWord.word}</div>
                            <div className="flip-card-back">
                                {
                                    currentWord.words_translate.find(
                                        (translation) =>
                                            translation.language_code === translationLanguage,
                                    )?.translation_text
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="artikel-quiz__answers">
                    {Object.values(articles).map((article) => (
                        <button
                            key={article}
                            type="button"
                            onClick={() => checkAnswerHandler(article)}
                            disabled={selectedArticle === articles[currentWord.nouns.gender]}
                            className={
                                selectedArticle === article
                                    ? article === articles[currentWord.nouns.gender]
                                        ? "artikel-quiz__answer--correct"
                                        : "artikel-quiz__answer--incorrect"
                                    : undefined
                            }
                        >
                            {article}
                        </button>
                    ))}
                </div>
                {selectedArticle !== null && (
                    <div aria-live="polite">
                        <p>
                            {selectedArticle === articles[currentWord.nouns.gender]
                                ? t("artikelQuiz.answerCorrect")
                                : t("artikelQuiz.answerIncorrect")}
                        </p>
                    </div>
                )}
                <GenderExplanationModal />
            </div>
        </>
    )
}
