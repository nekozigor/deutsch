import { supabase } from "../supabaseClient"
import { type Database } from "../types/supabase"

export type Noun = {
    id: number
    word: string
    nouns: {
        gender: Database["public"]["Enums"]["gender_enum"]
    }
    words_translate: {
        language_code: string
        translation_text: string
    }[]
}

export async function fetchNoun(offset: number, topicIds: number[] | null): Promise<Noun[]> {
    if (topicIds === null) {
        const { data, error } = await supabase
            .from("words")
            .select(
                "id, word, nouns!inner(gender), words_translate(language_code, translation_text)",
            )
            .eq("part_of_speech", "noun")
            .range(offset, offset + 999)

        if (error) {
            throw error
        }

        return data
    }

    const { data, error } = await supabase
        .from("words")
        .select(
            "id, word, nouns!inner(gender), word_tags!inner(tag_id), words_translate(language_code, translation_text)",
        )
        .eq("part_of_speech", "noun")
        .in("word_tags.tag_id", topicIds)
        .order("id")
        .range(offset, offset + 999)

    if (error) {
        throw error
    }

    return data.map(({ id, word, nouns, words_translate }) => ({
        id,
        word,
        nouns,
        words_translate,
    }))
}
