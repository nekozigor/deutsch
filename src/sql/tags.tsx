import { supabase } from "../supabaseClient"

export type Tag = {
    id: number
    name: string
}

export async function fetchAllTags(): Promise<Tag[]> {
    const { data, error } = await supabase.from("tags").select("id, name").order("name")

    if (error) {
        throw error
    }

    return data
}
