import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { fetchAllTags } from "../../sql/tags"

type ChooseThemesProps = {
    startQuiz: (selectedTagsIds: number[] | null) => void
}

export default function ChooseThemes({ startQuiz }: ChooseThemesProps) {
    const { t } = useTranslation()
    const [selectedTopicIds, setSelectedTopicIds] = useState<number[] | null>(null)
    const [loading, setLoading] = useState(false)
    const {
        data: articles = [],
        error,
        isError,
        isPending,
        refetch,
    } = useQuery({
        queryKey: ["tags"],
        queryFn: fetchAllTags,
    })

    const handleStartQuiz = () => {
        setLoading(true)
        startQuiz(selectedTopicIds)
    }

    if (isPending) {
        return <p>{t("artikelQuiz.loadingTopics")}</p>
    }

    return (
        <div className="artikel-quiz__setup">
            <fieldset className="artikel-quiz__topics">
                <legend>{t("artikelQuiz.topics")}</legend>
                <label>
                    <input
                        type="checkbox"
                        checked={selectedTopicIds === null}
                        onChange={() => setSelectedTopicIds(null)}
                        disabled={loading}
                    />
                    {t("artikelQuiz.allWords")}
                </label>
                {articles.map((topic) => (
                    <label key={topic.id}>
                        <input
                            type="checkbox"
                            checked={selectedTopicIds?.includes(topic.id) ?? false}
                            onChange={() =>
                                setSelectedTopicIds((selected) => {
                                    const current = selected ?? []
                                    return current.includes(topic.id)
                                        ? current.filter((id) => id !== topic.id)
                                        : [...current, topic.id]
                                })
                            }
                            disabled={loading}
                        />
                        {topic.name}
                    </label>
                ))}
            </fieldset>
            {isError && (
                <div role="alert">
                    <p>{t("artikelQuiz.loadTopicsError", { message: error.message })}</p>
                    <button type="button" onClick={() => refetch()}>
                        {t("artikelQuiz.retry")}
                    </button>
                </div>
            )}
            <button
                type="button"
                onClick={handleStartQuiz}
                disabled={loading || isError || selectedTopicIds?.length === 0}
            >
                {loading || isPending ? t("artikelQuiz.loading") : t("artikelQuiz.start")}
            </button>
        </div>
    )
}
