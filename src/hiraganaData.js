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
  { kana: "と", romaji: "to" },
  // な行
  { kana: "な", romaji: "na" },
  { kana: "に", romaji: "ni" },
  { kana: "ぬ", romaji: "nu" },
  { kana: "ね", romaji: "ne" },
  { kana: "の", romaji: "no" },
  // は行
  { kana: "は", romaji: "ha" },
  { kana: "ひ", romaji: "hi" },
  { kana: "ふ", romaji: "fu" },
  { kana: "へ", romaji: "he" },
  { kana: "ほ", romaji: "ho" },
  // ま行
  { kana: "ま", romaji: "ma" },
  { kana: "み", romaji: "mi" },
  { kana: "む", romaji: "mu" },
  { kana: "め", romaji: "me" },
  { kana: "も", romaji: "mo" },
  // や行
  { kana: "や", romaji: "ya" },
  { kana: "ゆ", romaji: "yu" },
  { kana: "よ", romaji: "yo" },
  // ら行
  { kana: "ら", romaji: "ra" },
  { kana: "り", romaji: "ri" },
  { kana: "る", romaji: "ru" },
  { kana: "れ", romaji: "re" },
  { kana: "ろ", romaji: "ro" },
  // わ行 + ん
  { kana: "わ", romaji: "wa" },
  { kana: "を", romaji: "wo" },
  { kana: "ん", romaji: "n" },
  // が行 (dakuten)
  { kana: "が", romaji: "ga" },
  { kana: "ぎ", romaji: "gi" },
  { kana: "ぐ", romaji: "gu" },
  { kana: "げ", romaji: "ge" },
  { kana: "ご", romaji: "go" },
  // ざ行 (dakuten)
  { kana: "ざ", romaji: "za" },
  { kana: "じ", romaji: "ji" },
  { kana: "ず", romaji: "zu" },
  { kana: "ぜ", romaji: "ze" },
  { kana: "ぞ", romaji: "zo" },
  // だ行 (dakuten)
  { kana: "だ", romaji: "da" },
  { kana: "ぢ", romaji: "di" },
  { kana: "づ", romaji: "du" },
  { kana: "で", romaji: "de" },
  { kana: "ど", romaji: "do" },
  // ば行 (dakuten)
  { kana: "ば", romaji: "ba" },
  { kana: "び", romaji: "bi" },
  { kana: "ぶ", romaji: "bu" },
  { kana: "べ", romaji: "be" },
  { kana: "ぼ", romaji: "bo" },
  // ぱ行 (handakuten)
  { kana: "ぱ", romaji: "pa" },
  { kana: "ぴ", romaji: "pi" },
  { kana: "ぷ", romaji: "pu" },
  { kana: "ぺ", romaji: "pe" },
  { kana: "ぽ", romaji: "po" },
  // yoon — き行
  { kana: "きゃ", romaji: "kya" },
  { kana: "きゅ", romaji: "kyu" },
  { kana: "きょ", romaji: "kyo" },
  // yoon — し行
  { kana: "しゃ", romaji: "sha" },
  { kana: "しゅ", romaji: "shu" },
  { kana: "しょ", romaji: "sho" },
  // yoon — ち行
  { kana: "ちゃ", romaji: "cha" },
  { kana: "ちゅ", romaji: "chu" },
  { kana: "ちょ", romaji: "cho" },
  // yoon — に行
  { kana: "にゃ", romaji: "nya" },
  { kana: "にゅ", romaji: "nyu" },
  { kana: "にょ", romaji: "nyo" },
  // yoon — ひ行
  { kana: "ひゃ", romaji: "hya" },
  { kana: "ひゅ", romaji: "hyu" },
  { kana: "ひょ", romaji: "hyo" },
  // yoon — み行
  { kana: "みゃ", romaji: "mya" },
  { kana: "みゅ", romaji: "myu" },
  { kana: "みょ", romaji: "myo" },
  // yoon — り行
  { kana: "りゃ", romaji: "rya" },
  { kana: "りゅ", romaji: "ryu" },
  { kana: "りょ", romaji: "ryo" },
  // yoon dakuten — ぎ行
  { kana: "ぎゃ", romaji: "gya" },
  { kana: "ぎゅ", romaji: "gyu" },
  { kana: "ぎょ", romaji: "gyo" },
  // yoon dakuten — じ行
  { kana: "じゃ", romaji: "ja" },
  { kana: "じゅ", romaji: "ju" },
  { kana: "じょ", romaji: "jo" }
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
  { kana: "ト", romaji: "to" },
  // ナ行
  { kana: "ナ", romaji: "na" },
  { kana: "ニ", romaji: "ni" },
  { kana: "ヌ", romaji: "nu" },
  { kana: "ネ", romaji: "ne" },
  { kana: "ノ", romaji: "no" },
  // ハ行
  { kana: "ハ", romaji: "ha" },
  { kana: "ヒ", romaji: "hi" },
  { kana: "フ", romaji: "fu" },
  { kana: "ヘ", romaji: "he" },
  { kana: "ホ", romaji: "ho" },
  // マ行
  { kana: "マ", romaji: "ma" },
  { kana: "ミ", romaji: "mi" },
  { kana: "ム", romaji: "mu" },
  { kana: "メ", romaji: "me" },
  { kana: "モ", romaji: "mo" },
  // ヤ行
  { kana: "ヤ", romaji: "ya" },
  { kana: "ユ", romaji: "yu" },
  { kana: "ヨ", romaji: "yo" },
  // ラ行
  { kana: "ラ", romaji: "ra" },
  { kana: "リ", romaji: "ri" },
  { kana: "ル", romaji: "ru" },
  { kana: "レ", romaji: "re" },
  { kana: "ロ", romaji: "ro" },
  // ワ行 + ン
  { kana: "ワ", romaji: "wa" },
  { kana: "ヲ", romaji: "wo" },
  { kana: "ン", romaji: "n" },
  // ガ行 (dakuten)
  { kana: "ガ", romaji: "ga" },
  { kana: "ギ", romaji: "gi" },
  { kana: "グ", romaji: "gu" },
  { kana: "ゲ", romaji: "ge" },
  { kana: "ゴ", romaji: "go" },
  // ザ行 (dakuten)
  { kana: "ザ", romaji: "za" },
  { kana: "ジ", romaji: "ji" },
  { kana: "ズ", romaji: "zu" },
  { kana: "ゼ", romaji: "ze" },
  { kana: "ゾ", romaji: "zo" },
  // ダ行 (dakuten)
  { kana: "ダ", romaji: "da" },
  { kana: "ヂ", romaji: "di" },
  { kana: "ヅ", romaji: "du" },
  { kana: "デ", romaji: "de" },
  { kana: "ド", romaji: "do" },
  // バ行 (dakuten)
  { kana: "バ", romaji: "ba" },
  { kana: "ビ", romaji: "bi" },
  { kana: "ブ", romaji: "bu" },
  { kana: "ベ", romaji: "be" },
  { kana: "ボ", romaji: "bo" },
  // パ行 (handakuten)
  { kana: "パ", romaji: "pa" },
  { kana: "ピ", romaji: "pi" },
  { kana: "プ", romaji: "pu" },
  { kana: "ペ", romaji: "pe" },
  { kana: "ポ", romaji: "po" },
  // yoon — キ行
  { kana: "キャ", romaji: "kya" },
  { kana: "キュ", romaji: "kyu" },
  { kana: "キョ", romaji: "kyo" },
  // yoon — シ行
  { kana: "シャ", romaji: "sha" },
  { kana: "シュ", romaji: "shu" },
  { kana: "ショ", romaji: "sho" },
  // yoon — チ行
  { kana: "チャ", romaji: "cha" },
  { kana: "チュ", romaji: "chu" },
  { kana: "チョ", romaji: "cho" },
  // yoon — ニ行
  { kana: "ニャ", romaji: "nya" },
  { kana: "ニュ", romaji: "nyu" },
  { kana: "ニョ", romaji: "nyo" },
  // yoon — ヒ行
  { kana: "ヒャ", romaji: "hya" },
  { kana: "ヒュ", romaji: "hyu" },
  { kana: "ヒョ", romaji: "hyo" },
  // yoon — ミ行
  { kana: "ミャ", romaji: "mya" },
  { kana: "ミュ", romaji: "myu" },
  { kana: "ミョ", romaji: "myo" },
  // yoon — リ行
  { kana: "リャ", romaji: "rya" },
  { kana: "リュ", romaji: "ryu" },
  { kana: "リョ", romaji: "ryo" },
  // yoon dakuten — ギ行
  { kana: "ギャ", romaji: "gya" },
  { kana: "ギュ", romaji: "gyu" },
  { kana: "ギョ", romaji: "gyo" },
  // yoon dakuten — ジ行
  { kana: "ジャ", romaji: "ja" },
  { kana: "ジュ", romaji: "ju" },
  { kana: "ジョ", romaji: "jo" }
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
    s_group:      { label: "S-group",      filter: ["sa","shi","su","se","so"] },
    ta_group:     { label: "T-group",      filter: ["ta","chi","tsu","te","to"] },
    na_group:     { label: "N-group",      filter: ["na","ni","nu","ne","no"] },
    ha_group:     { label: "H-group",      filter: ["ha","hi","fu","he","ho"] },
    ma_group:     { label: "M-group",      filter: ["ma","mi","mu","me","mo"] },
    ya_group:     { label: "Y-group",      filter: ["ya","yu","yo"] },
    ra_group:     { label: "R-group",      filter: ["ra","ri","ru","re","ro"] },
    wa_group:     { label: "W-group + N",  filter: ["wa","wo","n"] },
    ga_group:     { label: "GA-group",     filter: ["ga","gi","gu","ge","go"] },
    za_group:     { label: "ZA-group",     filter: ["za","ji","zu","ze","zo"] },
    da_group:     { label: "DA-group",     filter: ["da","di","du","de","do"] },
    ba_group:     { label: "BA-group",     filter: ["ba","bi","bu","be","bo"] },
    pa_group:     { label: "PA-group",     filter: ["pa","pi","pu","pe","po"] },
    yoon_basic:   { label: "Yoon (basic)", filter: ["kya","kyu","kyo","sha","shu","sho","cha","chu","cho","nya","nyu","nyo","hya","hyu","hyo","mya","myu","myo","rya","ryu","ryo"] },
    yoon_dakuten: { label: "Yoon (voiced)",filter: ["gya","gyu","gyo","ja","ju","jo"] }
  },
  katakana: {
    all:          { label: "All",          filter: null },
    basic_vowels: { label: "Basic vowels", filter: ["a","i","u","e","o"] },
    k_group:      { label: "K-group",      filter: ["ka","ki","ku","ke","ko"] },
    s_group:      { label: "S-group",      filter: ["sa","shi","su","se","so"] },
    ta_group:     { label: "T-group",      filter: ["ta","chi","tsu","te","to"] },
    na_group:     { label: "N-group",      filter: ["na","ni","nu","ne","no"] },
    ha_group:     { label: "H-group",      filter: ["ha","hi","fu","he","ho"] },
    ma_group:     { label: "M-group",      filter: ["ma","mi","mu","me","mo"] },
    ya_group:     { label: "Y-group",      filter: ["ya","yu","yo"] },
    ra_group:     { label: "R-group",      filter: ["ra","ri","ru","re","ro"] },
    wa_group:     { label: "W-group + N",  filter: ["wa","wo","n"] },
    ga_group:     { label: "GA-group",     filter: ["ga","gi","gu","ge","go"] },
    za_group:     { label: "ZA-group",     filter: ["za","ji","zu","ze","zo"] },
    da_group:     { label: "DA-group",     filter: ["da","di","du","de","do"] },
    ba_group:     { label: "BA-group",     filter: ["ba","bi","bu","be","bo"] },
    pa_group:     { label: "PA-group",     filter: ["pa","pi","pu","pe","po"] },
    yoon_basic:   { label: "Yoon (basic)", filter: ["kya","kyu","kyo","sha","shu","sho","cha","chu","cho","nya","nyu","nyo","hya","hyu","hyo","mya","myu","myo","rya","ryu","ryo"] },
    yoon_dakuten: { label: "Yoon (voiced)",filter: ["gya","gyu","gyo","ja","ju","jo"] }
  },
  kanji: {
    all:     { label: "All",     filter: null },
    numbers: { label: "Numbers", filter: ["one","two","three","four","five","six","seven","eight","nine","ten","hundred","thousand"] },
    nature:  { label: "Nature",  filter: ["mountain","river","tree","fire","water","earth","sun","moon"] },
    people:  { label: "People",  filter: ["person","mouth","woman","man","child","father","mother"] }
  },
  mixed: {
    all: { label: "Tất Cả", filter: null }
  }
};

const QUIZ_TYPE_CONFIG = {
  hiragana: { label: "Hiragana",  data: hiraganaData },
  katakana:  { label: "Katakana",  data: katakanaData },
  kanji:     { label: "Kanji",     data: kanjiData },
  mixed:     { label: "Hỗn Hợp",  data: [] }
};

// Content scope presets — kana only (hiragana/katakana)
// filter: mảng romaji giống GROUP_CONFIG; null = toàn bộ dataset
const CONTENT_SCOPE_CONFIG = {
  basic_only: {
    label: "Basic only",
    filter: ["a","i","u","e","o","ka","ki","ku","ke","ko","sa","shi","su","se","so","ta","chi","tsu","te","to","na","ni","nu","ne","no","ha","hi","fu","he","ho","ma","mi","mu","me","mo","ya","yu","yo","ra","ri","ru","re","ro","wa","wo","n"]
  },
  basic_plus_daku: {
    label: "Basic + Dakuten",
    filter: ["a","i","u","e","o","ka","ki","ku","ke","ko","sa","shi","su","se","so","ta","chi","tsu","te","to","na","ni","nu","ne","no","ha","hi","fu","he","ho","ma","mi","mu","me","mo","ya","yu","yo","ra","ri","ru","re","ro","wa","wo","n","ga","gi","gu","ge","go","za","ji","zu","ze","zo","da","di","du","de","do","ba","bi","bu","be","bo","pa","pi","pu","pe","po"]
  },
  full: {
    label: "Full kana",
    filter: null
  },
  focus_daku: {
    label: "Focus: Dakuten",
    filter: ["ga","gi","gu","ge","go","za","ji","zu","ze","zo","da","di","du","de","do","ba","bi","bu","be","bo","pa","pi","pu","pe","po"]
  },
  focus_yoon: {
    label: "Focus: Yoon",
    filter: ["kya","kyu","kyo","sha","shu","sho","cha","chu","cho","nya","nyu","nyo","hya","hyu","hyo","mya","myu","myo","rya","ryu","ryo","gya","gyu","gyo","ja","ju","jo"]
  }
};