DROP TABLE IF EXISTS words_translate CASCADE;
DROP TABLE IF EXISTS word_tags CASCADE;
DROP TABLE IF EXISTS verbs CASCADE;
DROP TABLE IF EXISTS nouns CASCADE;

-- 2. Удаляем основные таблицы (родительские)
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS words CASCADE;

-- 3. Удаляем кастомные типы данных (ENUM)
DROP TYPE IF EXISTS translation_code CASCADE;
DROP TYPE IF EXISTS gender_enum CASCADE;
DROP TYPE IF EXISTS part_of_speech_enum CASCADE;

CREATE TYPE part_of_speech_enum AS ENUM ('noun', 'verb', 'adjective', 'other');

CREATE TABLE words (
    id SERIAL PRIMARY KEY,
    word VARCHAR(255) NOT NULL, -- Базовая форма (инфинитив для глаголов, ед. ч. для сущ.)
    part_of_speech part_of_speech_enum NOT NULL -- 'noun', 'verb', 'adjective', 'other'
);

CREATE TYPE gender_enum AS ENUM ('m', 'f', 'n');

CREATE TABLE nouns (
    word_id INT PRIMARY KEY REFERENCES words(id) ON DELETE CASCADE,
    gender gender_enum NOT NULL, -- 'm' (der), 'f' (die), 'n' (das)
    plural_form VARCHAR(255), -- Форма множественного числа (например, 'Männer')
    genitive_form VARCHAR(255), -- Форма генитива (для сильного склонения, например, 'des Mannes')
    is_n_deklination BOOLEAN DEFAULT FALSE -- Флаг N-склонения
);

CREATE TABLE verbs (
    word_id INT PRIMARY KEY REFERENCES words(id) ON DELETE CASCADE,
    is_irregular BOOLEAN DEFAULT FALSE, -- Сильный/неправильный глагол
    presens_3sg VARCHAR(255), -- 3-е лицо ед. ч. (er/sie/es spricht)
    praeteritum_3sg VARCHAR(255), -- Präteritum (sprach)
    perfekt_form VARCHAR(255), -- Partizip II (gesprochen)
    auxiliary_verb VARCHAR(10) NOT NULL -- Вспомогательный глагол: 'haben' или 'sein'
);

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL -- 'Essen', 'Beruf', 'Goethe_B1'
);

CREATE TABLE word_tags (
    word_id INT REFERENCES words(id) ON DELETE CASCADE,
    tag_id INT REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (word_id, tag_id)
);

CREATE TYPE translation_code AS ENUM ('ua', 'en');

CREATE TABLE words_translate (
    id SERIAL PRIMARY KEY,
    word_id INT NOT NULL REFERENCES words(id) ON DELETE CASCADE,
    language_code VARCHAR(5) NOT NULL, -- Код языка, например: 'ua', 'en', 'es'
    translation_text VARCHAR(255) NOT NULL, -- Сам текст перевода

    -- Ограничение: защищает от добавления абсолютно одинаковых переводов для одного слова
    CONSTRAINT unique_word_lang_translation UNIQUE (word_id, language_code, translation_text)
);

-- Индекс для мгновенного поиска переводов по ID оригинального слова
CREATE INDEX idx_words_translate_word_id ON words_translate(word_id);