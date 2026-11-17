import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useTranslationLanguage } from "../../providers/LanguageContext"

type WordTile = {
    id: string
    word: string
}

type Exercise = {
    source: Record<"en" | "uk", string>
    answer: string[]
    tiles: WordTile[]
}

const exercises: Exercise[] = [
    {
        source: {
            en: "The goalkeeper catches the ball.",
            uk: "Воротар ловить м’яч.",
        },
        answer: ["Der", "Torwart", "fängt", "den", "Ball."],
        tiles: [
            { id: "1-den", word: "den" },
            { id: "1-torwart", word: "Torwart" },
            { id: "1-ball", word: "Ball." },
            { id: "1-faengt", word: "fängt" },
            { id: "1-der", word: "Der" },
            { id: "1-spielt", word: "spielt" },
            { id: "1-die", word: "Die" },
            { id: "1-spieler", word: "Spieler" },
            { id: "1-ein", word: "ein" },
            { id: "1-tor", word: "Tor." },
            { id: "1-geht", word: "geht" },
            { id: "1-heute", word: "heute" },
        ],
    },
    {
        source: {
            en: "We are going to the stadium.",
            uk: "Ми йдемо на стадіон.",
        },
        answer: ["Wir", "gehen", "zum", "Stadion."],
        tiles: [
            { id: "2-zum", word: "zum" },
            { id: "2-gehen", word: "gehen" },
            { id: "2-stadion", word: "Stadion." },
            { id: "2-wir", word: "Wir" },
            { id: "2-ball", word: "Ball" },
            { id: "2-der", word: "Der" },
            { id: "2-spielt", word: "spielt" },
            { id: "2-faengt", word: "fängt" },
            { id: "2-die", word: "Die" },
            { id: "2-fussball", word: "Fußball." },
            { id: "2-geht", word: "geht" },
            { id: "2-spieler", word: "Spieler" },
        ],
    },
    {
        source: {
            en: "The player plays football.",
            uk: "Гравець грає у футбол.",
        },
        answer: ["Der", "Spieler", "spielt", "Fußball."],
        tiles: [
            { id: "3-fussball", word: "Fußball." },
            { id: "3-spieler", word: "Spieler" },
            { id: "3-der", word: "Der" },
            { id: "3-spielt", word: "spielt" },
            { id: "3-den", word: "den" },
            { id: "3-torwart", word: "Torwart" },
            { id: "3-wir", word: "Wir" },
            { id: "3-faengt", word: "fängt" },
            { id: "3-ball", word: "Ball." },
            { id: "3-zum", word: "zum" },
            { id: "3-gehen", word: "gehen" },
            { id: "3-stadion", word: "Stadion." },
        ],
    },
    {
        source: {
            en: "The team scores a goal.",
            uk: "Команда забиває гол.",
        },
        answer: ["Das", "Team", "erzielt", "ein", "Tor."],
        tiles: [
            { id: "4-das", word: "Das" },
            { id: "4-team", word: "Team" },
            { id: "4-erzielt", word: "erzielt" },
            { id: "4-ein", word: "ein" },
            { id: "4-tor", word: "Tor." },
            { id: "4-der", word: "Der" },
            { id: "4-spieler", word: "Spieler" },
            { id: "4-schiesst", word: "schießt" },
            { id: "4-ball", word: "Ball" },
            { id: "4-ballpunkt", word: "Ball." },
        ],
    },
    {
        source: {
            en: "The fans cheer loudly.",
            uk: "Вболівальники голосно кричать.",
        },
        answer: ["Die", "Fans", "jubeln", "laut."],
        tiles: [
            { id: "5-die", word: "Die" },
            { id: "5-fans", word: "Fans" },
            { id: "5-jubeln", word: "jubeln" },
            { id: "5-laut", word: "laut." },
            { id: "5-der", word: "Der" },
            { id: "5-trainer", word: "Trainer" },
            { id: "5-ruhig", word: "ruhig" },
            { id: "5-spiel", word: "Spiel" },
            { id: "5-laufen", word: "laufen" },
            { id: "5-fussball", word: "Fußball" },
        ],
    },
    {
        source: {
            en: "The match starts now.",
            uk: "Матч починається зараз.",
        },
        answer: ["Das", "Spiel", "beginnt", "jetzt."],
        tiles: [
            { id: "6-das", word: "Das" },
            { id: "6-spiel", word: "Spiel" },
            { id: "6-beginnt", word: "beginnt" },
            { id: "6-jetzt", word: "jetzt." },
            { id: "6-der", word: "Der" },
            { id: "6-torwart", word: "Torwart" },
            { id: "6-fingt", word: "fängt" },
            { id: "6-bald", word: "bald" },
            { id: "6-heim", word: "Heim" },
            { id: "6-mannschaft", word: "Mannschaft" },
        ],
    },
    {
        source: {
            en: "The coach gives instructions.",
            uk: "Тренер дає інструкції.",
        },
        answer: ["Der", "Trainer", "gibt", "Anweisungen."],
        tiles: [
            { id: "7-der", word: "Der" },
            { id: "7-trainer", word: "Trainer" },
            { id: "7-gibt", word: "gibt" },
            { id: "7-anweisungen", word: "Anweisungen." },
            { id: "7-sport", word: "Sport" },
            { id: "7-spieler", word: "Spieler" },
            { id: "7-lernen", word: "lernen" },
            { id: "7-fussball", word: "Fußball" },
            { id: "7-gehen", word: "gehen" },
            { id: "7-bald", word: "bald" },
        ],
    },
    {
        source: {
            en: "The children watch the match.",
            uk: "Діти дивляться матч.",
        },
        answer: ["Die", "Kinder", "schauen", "sich", "das", "Spiel", "an."],
        tiles: [
            { id: "8-die", word: "Die" },
            { id: "8-kinder", word: "Kinder" },
            { id: "8-schauen", word: "schauen" },
            { id: "8-sich", word: "sich" },
            { id: "8-das", word: "das" },
            { id: "8-spiel", word: "Spiel" },
            { id: "8-an", word: "an." },
            { id: "8-der", word: "Der" },
            { id: "8-ball", word: "Ball" },
            { id: "8-gehen", word: "gehen" },
        ],
    },
    {
        source: {
            en: "We travel by train to Berlin.",
            uk: "Ми їдемо потягом до Берліна.",
        },
        answer: ["Wir", "fahren", "mit", "dem", "Zug", "nach", "Berlin."],
        tiles: [
            { id: "9-wir", word: "Wir" },
            { id: "9-fahren", word: "fahren" },
            { id: "9-mit", word: "mit" },
            { id: "9-dem", word: "dem" },
            { id: "9-zug", word: "Zug" },
            { id: "9-nach", word: "nach" },
            { id: "9-berlin", word: "Berlin." },
            { id: "9-spieler", word: "Spieler" },
            { id: "9-ball", word: "Ball" },
            { id: "9-gehen", word: "gehen" },
        ],
    },
    {
        source: {
            en: "They are tired after the game.",
            uk: "Вони втомлені після гри.",
        },
        answer: ["Sie", "sind", "nach", "dem", "Spiel", "müde."],
        tiles: [
            { id: "10-sie", word: "Sie" },
            { id: "10-sind", word: "sind" },
            { id: "10-nach", word: "nach" },
            { id: "10-dem", word: "dem" },
            { id: "10-spiel", word: "Spiel" },
            { id: "10-muede", word: "müde." },
            { id: "10-fans", word: "Fans" },
            { id: "10-ruhig", word: "ruhig" },
            { id: "10-laut", word: "laut" },
            { id: "10-tor", word: "Tor" },
        ],
    },
]

function shuffleTiles(tiles: WordTile[]) {
    const shuffled = [...tiles]

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1))
        ;[shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]]
    }

    return shuffled
}

export default function TranslationWordBankTest() {
    const { t } = useTranslation()
    const { language } = useTranslationLanguage()
    const [questionIndex, setQuestionIndex] = useState(0)
    const [bankTiles, setBankTiles] = useState(() => shuffleTiles(exercises[0].tiles))
    const [selectedTiles, setSelectedTiles] = useState<WordTile[]>([])
    const [answerStatus, setAnswerStatus] = useState<"correct" | "incorrect" | null>(null)
    const [isFinished, setIsFinished] = useState(false)
    const exercise = exercises[questionIndex]

    const selectTile = (tile: WordTile) => {
        if (answerStatus === "correct" || selectedTiles.some(({ id }) => id === tile.id)) {
            return
        }

        setSelectedTiles((tiles) => [...tiles, tile])
        setAnswerStatus(null)
    }

    const removeTile = (tile: WordTile) => {
        if (answerStatus === "correct") {
            return
        }

        setSelectedTiles((tiles) => tiles.filter(({ id }) => id !== tile.id))
        setAnswerStatus(null)
    }

    const checkAnswer = () => {
        const answer = selectedTiles.map(({ word }) => word).join(" ")
        const correctAnswer = exercise.answer.join(" ")
        setAnswerStatus(answer === correctAnswer ? "correct" : "incorrect")
    }

    const advance = () => {
        if (questionIndex === exercises.length - 1) {
            setIsFinished(true)
            return
        }

        const nextIndex = questionIndex + 1
        setQuestionIndex(nextIndex)
        setBankTiles(shuffleTiles(exercises[nextIndex].tiles))
        setSelectedTiles([])
        setAnswerStatus(null)
    }

    const restart = () => {
        setQuestionIndex(0)
        setBankTiles(shuffleTiles(exercises[0].tiles))
        setSelectedTiles([])
        setAnswerStatus(null)
        setIsFinished(false)
    }

    return (
        <section className="word-bank-test">
            <h1>{t("wordBankTest.title")}</h1>
            <p>{t("wordBankTest.description")}</p>

            {isFinished ? (
                <div className="word-bank-test__finished" role="status">
                    <p>{t("wordBankTest.finished")}</p>
                    <button type="button" onClick={restart}>
                        {t("wordBankTest.restart")}
                    </button>
                </div>
            ) : (
                <>
                    <div className="word-bank-test__progress">
                        <span>
                            {t("wordBankTest.progress", {
                                current: questionIndex + 1,
                                total: exercises.length,
                            })}
                        </span>
                        <div
                            className="word-bank-test__progress-track"
                            role="progressbar"
                            aria-valuemin={1}
                            aria-valuemax={exercises.length}
                            aria-valuenow={questionIndex + 1}
                        >
                            <div
                                style={{
                                    width: `${((questionIndex + 1) / exercises.length) * 100}%`,
                                }}
                            />
                        </div>
                    </div>

                    <div className="word-bank-test__prompt">
                        <span aria-hidden="true">↗</span>
                        <p>{exercise.source[language]}</p>
                    </div>

                    <p className="word-bank-test__instruction">{t("wordBankTest.instruction")}</p>

                    <div
                        className="word-bank-test__answer"
                        aria-label={t("wordBankTest.answerLabel")}
                    >
                        {selectedTiles.length === 0 ? (
                            <span className="word-bank-test__placeholder">
                                {t("wordBankTest.placeholder")}
                            </span>
                        ) : (
                            selectedTiles.map((tile, index) => {
                                const positionClass =
                                    answerStatus === null
                                        ? ""
                                        : tile.word === exercise.answer[index]
                                          ? " word-bank-test__tile--correct"
                                          : " word-bank-test__tile--incorrect"

                                return (
                                    <button
                                        key={tile.id}
                                        className={`word-bank-test__tile${positionClass}`}
                                        type="button"
                                        aria-label={t("wordBankTest.removeWord", {
                                            word: tile.word,
                                        })}
                                        disabled={answerStatus === "correct"}
                                        onClick={() => removeTile(tile)}
                                    >
                                        {tile.word}
                                    </button>
                                )
                            })
                        )}
                    </div>

                    <div
                        className="word-bank-test__tiles"
                        aria-label={t("wordBankTest.wordBankLabel")}
                    >
                        {bankTiles.map((tile) => {
                            const isSelected = selectedTiles.some(({ id }) => id === tile.id)

                            return (
                                <button
                                    key={tile.id}
                                    className={`word-bank-test__tile${isSelected ? " word-bank-test__tile--selected" : ""}`}
                                    type="button"
                                    aria-pressed={isSelected}
                                    disabled={isSelected || answerStatus === "correct"}
                                    onClick={() => selectTile(tile)}
                                >
                                    {tile.word}
                                </button>
                            )
                        })}
                    </div>

                    <div className="word-bank-test__actions">
                        {answerStatus === "correct" ? (
                            <button type="button" onClick={advance}>
                                {t(
                                    questionIndex === exercises.length - 1
                                        ? "wordBankTest.finish"
                                        : "wordBankTest.continue",
                                )}
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={checkAnswer}
                                disabled={selectedTiles.length === 0}
                            >
                                {t("wordBankTest.check")}
                            </button>
                        )}
                        <button
                            type="button"
                            className="word-bank-test__clear"
                            onClick={() => {
                                setSelectedTiles([])
                                setAnswerStatus(null)
                            }}
                            disabled={selectedTiles.length === 0 || answerStatus === "correct"}
                        >
                            {t("wordBankTest.clear")}
                        </button>
                    </div>

                    {answerStatus && (
                        <p
                            className={`word-bank-test__feedback word-bank-test__feedback--${answerStatus}`}
                            role="status"
                            aria-live="polite"
                        >
                            {t(`wordBankTest.${answerStatus}`)}
                        </p>
                    )}
                </>
            )}
        </section>
    )
}
