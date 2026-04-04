// src/hiraganaData.js

const hiraganaData = [
  { kana: "あ", romaji: "a" },
  { kana: "い", romaji: "i" },
  { kana: "う", romaji: "u" },
  { kana: "え", romaji: "e" },
  { kana: "お", romaji: "o" },
  { kana: "か", romaji: "ka" },
  { kana: "き", romaji: "ki" },
  { kana: "く", romaji: "ku" },
  { kana: "け", romaji: "ke" },
  { kana: "こ", romaji: "ko" },
  { kana: "さ", romaji: "sa" },
  { kana: "し", romaji: "shi" },
  { kana: "す", romaji: "su" },
  { kana: "せ", romaji: "se" },
  { kana: "そ", romaji: "so" },
  { kana: "た", romaji: "ta" },
  { kana: "ち", romaji: "chi" },
  { kana: "つ", romaji: "tsu" },
  { kana: "て", romaji: "te" },
  { kana: "と", romaji: "to" }
  // Add more as needed
];

const katakanaData = [
  { kana: "ア", romaji: "a" },
  { kana: "イ", romaji: "i" },
  { kana: "ウ", romaji: "u" },
  { kana: "エ", romaji: "e" },
  { kana: "オ", romaji: "o" },
  { kana: "カ", romaji: "ka" },
  { kana: "キ", romaji: "ki" },
  { kana: "ク", romaji: "ku" },
  { kana: "ケ", romaji: "ke" },
  { kana: "コ", romaji: "ko" },
  { kana: "サ", romaji: "sa" },
  { kana: "シ", romaji: "shi" },
  { kana: "ス", romaji: "su" },
  { kana: "セ", romaji: "se" },
  { kana: "ソ", romaji: "so" },
  { kana: "タ", romaji: "ta" },
  { kana: "チ", romaji: "chi" },
  { kana: "ツ", romaji: "tsu" },
  { kana: "テ", romaji: "te" },
  { kana: "ト", romaji: "to" }
  // Add more as needed
];

const kanjiData = [
  // Numbers
  { kana: "一", romaji: "one" },
  { kana: "二", romaji: "two" },
  { kana: "三", romaji: "three" },
  { kana: "四", romaji: "four" },
  { kana: "五", romaji: "five" },
  { kana: "六", romaji: "six" },
  { kana: "七", romaji: "seven" },
  { kana: "八", romaji: "eight" },
  { kana: "九", romaji: "nine" },
  { kana: "十", romaji: "ten" },
  { kana: "百", romaji: "hundred" },
  { kana: "千", romaji: "thousand" },
  // Nature
  { kana: "山", romaji: "mountain" },
  { kana: "川", romaji: "river" },
  { kana: "木", romaji: "tree" },
  { kana: "火", romaji: "fire" },
  { kana: "水", romaji: "water" },
  { kana: "土", romaji: "earth" },
  { kana: "日", romaji: "sun" },
  { kana: "月", romaji: "moon" },
  // People
  { kana: "人", romaji: "person" },
  { kana: "口", romaji: "mouth" },
  { kana: "女", romaji: "woman" },
  { kana: "男", romaji: "man" },
  { kana: "子", romaji: "child" },
  { kana: "父", romaji: "father" },
  { kana: "母", romaji: "mother" }
];

const GROUP_CONFIG = {
  hiragana: {
    all:          { label: "All",          filter: null },
    basic_vowels: { label: "Basic vowels", filter: ["a","i","u","e","o"] },
    k_group:      { label: "K-group",      filter: ["ka","ki","ku","ke","ko"] },
    s_group:      { label: "S-group",      filter: ["sa","shi","su","se","so"] }
  },
  katakana: {
    all:          { label: "All",          filter: null },
    basic_vowels: { label: "Basic vowels", filter: ["a","i","u","e","o"] },
    k_group:      { label: "K-group",      filter: ["ka","ki","ku","ke","ko"] },
    s_group:      { label: "S-group",      filter: ["sa","shi","su","se","so"] }
  },
  kanji: {
    all:     { label: "All",     filter: null },
    numbers: { label: "Numbers", filter: ["one","two","three","four","five","six","seven","eight","nine","ten","hundred","thousand"] },
    nature:  { label: "Nature",  filter: ["mountain","river","tree","fire","water","earth","sun","moon"] },
    people:  { label: "People",  filter: ["person","mouth","woman","man","child","father","mother"] }
  }
};

const QUIZ_TYPE_CONFIG = {
  hiragana: { label: "Hiragana", data: hiraganaData },
  katakana:  { label: "Katakana",  data: katakanaData },
  kanji:     { label: "Kanji",     data: kanjiData }
};