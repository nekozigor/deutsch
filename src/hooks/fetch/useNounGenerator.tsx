import { useState, useCallback, useRef } from "react"
import { fetchNoun, type Noun } from "../../sql/artikels"

// Вспомогательная функция для перемешивания (Алгоритм Фишера-Йетса)
function shuffle(array: Noun[]): Noun[] {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
}

const batchSize = 100

export function useNounGenerator(selectedTagsIds: number[] | null) {
    const [wordsBuffer, setWordsBuffer] = useState<Noun[]>([])
    const [loading, setLoading] = useState(false)
    const [isEnded, setIsEnded] = useState(false)

    // Используем useRef, чтобы offset не сбрасывался при рендерах и не вызывал лишних эффектов
    const offsetRef = useRef(0)
    const hasMoreRef = useRef(true)

    // Функция для загрузки следующей пачки из базы
    const fetchNextBatch = useCallback(async () => {
        if (!hasMoreRef.current || loading) return []

        setLoading(true)
        try {
            const data = await fetchNoun(offsetRef.current, selectedTagsIds)

            if (!data || data.length === 0) {
                hasMoreRef.current = false
                setIsEnded(true)
                return []
            }

            // Если пришло меньше слов, чем просили, значит база данных закончилась
            if (data.length < batchSize) {
                hasMoreRef.current = false
            }

            // Увеличиваем offset для следующего запроса
            offsetRef.current += batchSize

            // Перемешиваем полученную пачку слов
            return shuffle(data)
        } catch (err) {
            console.error("Ошибка при загрузке слов:", err)
            return []
        } finally {
            setLoading(false)
        }
    }, [loading])

    // Главная функция: получить следующее слово
    const getNextWord = useCallback(async () => {
        // 1. Если в буфере уже есть слова, берем первое, а остальные сохраняем обратно
        if (wordsBuffer.length > 0) {
            const [nextWord, ...remainingWords] = wordsBuffer
            setWordsBuffer(remainingWords)
            return nextWord
        }

        // 2. Если буфер пуст, но слова в базе еще есть — загружаем новую пачку
        if (hasMoreRef.current) {
            const newBatch = await fetchNextBatch()

            if (newBatch.length > 0) {
                const [nextWord, ...remainingWords] = newBatch
                setWordsBuffer(remainingWords) // Сохраняем остаток пачки в буфер
                return nextWord
            }
        }

        // 3. Если и буфер пуст, и в базе ничего нет
        setIsEnded(true)
        return null
    }, [wordsBuffer, fetchNextBatch])

    return { getNextWord, loading, isEnded }
}
