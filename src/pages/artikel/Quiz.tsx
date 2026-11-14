import { useNounGenerator } from "../../hooks/fetch/useNounGenerator"
import ArtikelTest from "../../components/tests/ArtikelTest"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import type { Noun } from "../../sql/artikels"

export default function Quiz({ selectedTagsIds }: { selectedTagsIds: number[] | null }) {
    const { t } = useTranslation()
    const [currentWord, setCurrentWord] = useState<Noun | null>(null)
    const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const { getNextWord, isEnded, loading } = useNounGenerator(selectedTagsIds)
    const [wrongAnswers, setWrongAnswers] = useState<number>(0)
    const [answersCount, setAnswersCount] = useState<number>(0)

    const checkAnswer = async (answer: boolean) => {
        if (answer) {
            setAnswersCount((count) => count + 1)
            const word = await getNextWord()
            advanceTimer.current = setTimeout(() => {
                setCurrentWord(word)
                advanceTimer.current = null
            }, 200)
        } else {
            setWrongAnswers((count) => count + 1)
        }
    }

    useEffect(() => {
        const fetchInitialWord = async () => {
            const word = await getNextWord()
            setCurrentWord(word)
        }
        fetchInitialWord()
    }, [])

    if (isEnded) {
        return <p>{t("artikelQuiz.finished")}</p>
    }

    if (loading || !currentWord) {
        return <p>{t("artikelQuiz.loadingWords")}</p>
    }

    return (
        <>
            <div>
                {t("artikelQuiz.wrong")}: {wrongAnswers}
            </div>
            <div>
                {t("artikelQuiz.correct")}: {answersCount}
            </div>
            {currentWord && (
                <ArtikelTest
                    checkAnswer={checkAnswer}
                    currentWord={currentWord}
                    key={currentWord.id}
                />
            )}
        </>
    )
}
