CREATE OR REPLACE VIEW random_words AS
SELECT id, word, part_of_speech
FROM words
ORDER BY random();