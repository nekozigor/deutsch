CREATE TYPE gender_enum AS ENUM ('m', 'f', 'n');

CREATE TABLE nouns (
    word_id INT PRIMARY KEY REFERENCES words(id) ON DELETE CASCADE,
    gender gender_enum NOT NULL,
    plural_form VARCHAR(255), -- Форма множественного числа (например, 'Männer')
    genitive_form VARCHAR(255), -- Форма генитива (для сильного склонения, например, 'des Mannes')
    is_n_deklination BOOLEAN DEFAULT FALSE -- Флаг N-склонения
);