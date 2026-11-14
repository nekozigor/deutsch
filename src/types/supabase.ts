export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
    graphql_public: {
        Tables: {
            [_ in never]: never
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            graphql: {
                Args: {
                    extensions?: Json
                    operationName?: string
                    query?: string
                    variables?: Json
                }
                Returns: Json
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
    public: {
        Tables: {
            nouns: {
                Row: {
                    gender: Database["public"]["Enums"]["gender_enum"]
                    genitive_form: string | null
                    is_n_deklination: boolean | null
                    plural_form: string | null
                    word_id: number
                }
                ComputedFields: never
                Insert: {
                    gender: Database["public"]["Enums"]["gender_enum"]
                    genitive_form?: string | null
                    is_n_deklination?: boolean | null
                    plural_form?: string | null
                    word_id: number
                }
                Update: {
                    gender?: Database["public"]["Enums"]["gender_enum"]
                    genitive_form?: string | null
                    is_n_deklination?: boolean | null
                    plural_form?: string | null
                    word_id?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "nouns_word_id_fkey"
                        columns: ["word_id"]
                        isOneToOne: true
                        referencedRelation: "words"
                        referencedColumns: ["id"]
                    },
                ]
            }
            tags: {
                Row: {
                    id: number
                    name: string
                }
                ComputedFields: never
                Insert: {
                    id?: number
                    name: string
                }
                Update: {
                    id?: number
                    name?: string
                }
                Relationships: []
            }
            verbs: {
                Row: {
                    auxiliary_verb: string
                    is_irregular: boolean | null
                    perfekt_form: string | null
                    praeteritum_3sg: string | null
                    presens_3sg: string | null
                    word_id: number
                }
                ComputedFields: never
                Insert: {
                    auxiliary_verb: string
                    is_irregular?: boolean | null
                    perfekt_form?: string | null
                    praeteritum_3sg?: string | null
                    presens_3sg?: string | null
                    word_id: number
                }
                Update: {
                    auxiliary_verb?: string
                    is_irregular?: boolean | null
                    perfekt_form?: string | null
                    praeteritum_3sg?: string | null
                    presens_3sg?: string | null
                    word_id?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "verbs_word_id_fkey"
                        columns: ["word_id"]
                        isOneToOne: true
                        referencedRelation: "words"
                        referencedColumns: ["id"]
                    },
                ]
            }
            word_tags: {
                Row: {
                    tag_id: number
                    word_id: number
                }
                ComputedFields: never
                Insert: {
                    tag_id: number
                    word_id: number
                }
                Update: {
                    tag_id?: number
                    word_id?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "word_tags_tag_id_fkey"
                        columns: ["tag_id"]
                        isOneToOne: false
                        referencedRelation: "tags"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "word_tags_word_id_fkey"
                        columns: ["word_id"]
                        isOneToOne: false
                        referencedRelation: "words"
                        referencedColumns: ["id"]
                    },
                ]
            }
            words: {
                Row: {
                    id: number
                    part_of_speech: Database["public"]["Enums"]["part_of_speech_enum"]
                    word: string
                }
                ComputedFields: never
                Insert: {
                    id?: number
                    part_of_speech: Database["public"]["Enums"]["part_of_speech_enum"]
                    word: string
                }
                Update: {
                    id?: number
                    part_of_speech?: Database["public"]["Enums"]["part_of_speech_enum"]
                    word?: string
                }
                Relationships: []
            }
            words_translate: {
                Row: {
                    id: number
                    language_code: string
                    translation_text: string
                    word_id: number
                }
                ComputedFields: never
                Insert: {
                    id?: number
                    language_code: string
                    translation_text: string
                    word_id: number
                }
                Update: {
                    id?: number
                    language_code?: string
                    translation_text?: string
                    word_id?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "words_translate_word_id_fkey"
                        columns: ["word_id"]
                        isOneToOne: false
                        referencedRelation: "words"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            gender_enum: "m" | "f" | "n"
            part_of_speech_enum: "noun" | "verb" | "adjective" | "other"
            translation_code: "ua" | "en"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
    DefaultSchemaTableNameOrOptions extends
        | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
        | { schema: keyof DatabaseWithoutInternals },
    TableName extends (DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
        ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
              DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
        : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
          DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
          Row: infer R
      }
        ? R
        : never
    : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
            DefaultSchema["Views"])
      ? (DefaultSchema["Tables"] &
            DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
            Row: infer R
        }
          ? R
          : never
      : never

export type TablesInsert<
    DefaultSchemaTableNameOrOptions extends
        | keyof DefaultSchema["Tables"]
        | { schema: keyof DatabaseWithoutInternals },
    TableName extends (DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
        ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Insert: infer I
      }
        ? I
        : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
      ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
            Insert: infer I
        }
          ? I
          : never
      : never

export type TablesUpdate<
    DefaultSchemaTableNameOrOptions extends
        | keyof DefaultSchema["Tables"]
        | { schema: keyof DatabaseWithoutInternals },
    TableName extends (DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
        ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
        : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Update: infer U
      }
        ? U
        : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
      ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
            Update: infer U
        }
          ? U
          : never
      : never

export type Enums<
    DefaultSchemaEnumNameOrOptions extends
        | keyof DefaultSchema["Enums"]
        | { schema: keyof DatabaseWithoutInternals },
    EnumName extends (DefaultSchemaEnumNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
        ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
        : never) = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
      ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
      : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
        | keyof DefaultSchema["CompositeTypes"]
        | { schema: keyof DatabaseWithoutInternals },
    CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
        ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
        : never) = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
      ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
      : never

export const Constants = {
    graphql_public: {
        Enums: {},
    },
    public: {
        Enums: {
            gender_enum: ["m", "f", "n"],
            part_of_speech_enum: ["noun", "verb", "adjective", "other"],
            translation_code: ["ua", "en"],
        },
    },
} as const
