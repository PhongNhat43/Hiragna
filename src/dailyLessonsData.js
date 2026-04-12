// src/dailyLessonsData.js
// Daily Lesson V1 dataset.
// Day 1–3 are seeded with actual beginner content.
// Day 4+ remain placeholders until content is filled.

const DAILY_LESSON_SEEDS = {
  day01: {
    minnaLesson: 1,
    vocab: [
      { id: 'day01-vocab-1', type: 'vocab', jp: 'わたし', reading: 'わたし', meaning: 'tôi' },
      { id: 'day01-vocab-2', type: 'vocab', jp: 'あなた', reading: 'あなた', meaning: 'bạn / anh / chị' },
      { id: 'day01-vocab-3', type: 'vocab', jp: 'がくせい', reading: 'がくせい', meaning: 'học sinh / sinh viên' },
      { id: 'day01-vocab-4', type: 'vocab', jp: 'かいしゃいん', reading: 'かいしゃいん', meaning: 'nhân viên công ty' },
      { id: 'day01-vocab-5', type: 'vocab', jp: 'せんせい', reading: 'せんせい', meaning: 'giáo viên / thầy cô' }
    ],
    kanji: [
      { id: 'day01-kanji-1', type: 'kanji', kanji: '私', reading: 'わたし', meaning: 'tôi' },
      { id: 'day01-kanji-2', type: 'kanji', kanji: '学', reading: 'がく', meaning: 'học' },
      { id: 'day01-kanji-3', type: 'kanji', kanji: '生', reading: 'せい', meaning: 'sống / học sinh' }
    ]
  },
  day02: {
    minnaLesson: 2,
    vocab: [
      { id: 'day02-vocab-1', type: 'vocab', jp: 'これ', reading: 'これ', meaning: 'cái này' },
      { id: 'day02-vocab-2', type: 'vocab', jp: 'それ', reading: 'それ', meaning: 'cái đó' },
      { id: 'day02-vocab-3', type: 'vocab', jp: 'あれ', reading: 'あれ', meaning: 'cái kia' },
      { id: 'day02-vocab-4', type: 'vocab', jp: 'ほん', reading: 'ほん', meaning: 'sách' },
      { id: 'day02-vocab-5', type: 'vocab', jp: 'じしょ', reading: 'じしょ', meaning: 'từ điển' }
    ],
    kanji: [
      { id: 'day02-kanji-1', type: 'kanji', kanji: '本', reading: 'ほん', meaning: 'sách / gốc' },
      { id: 'day02-kanji-2', type: 'kanji', kanji: '時', reading: 'じ', meaning: 'thời gian / giờ' },
      { id: 'day02-kanji-3', type: 'kanji', kanji: '何', reading: 'なに', meaning: 'gì / cái gì' }
    ]
  },
  day03: {
    minnaLesson: 3,
    vocab: [
      { id: 'day03-vocab-1', type: 'vocab', jp: 'ここ', reading: 'ここ', meaning: 'ở đây' },
      { id: 'day03-vocab-2', type: 'vocab', jp: 'そこ', reading: 'そこ', meaning: 'ở đó' },
      { id: 'day03-vocab-3', type: 'vocab', jp: 'あそこ', reading: 'あそこ', meaning: 'ở đằng kia' },
      { id: 'day03-vocab-4', type: 'vocab', jp: 'どこ', reading: 'どこ', meaning: 'ở đâu' },
      { id: 'day03-vocab-5', type: 'vocab', jp: 'きょうしつ', reading: 'きょうしつ', meaning: 'phòng học' }
    ],
    kanji: [
      { id: 'day03-kanji-1', type: 'kanji', kanji: '教', reading: 'きょう', meaning: 'dạy / giáo' },
      { id: 'day03-kanji-2', type: 'kanji', kanji: '室', reading: 'しつ', meaning: 'phòng' },
      { id: 'day03-kanji-3', type: 'kanji', kanji: '食', reading: 'しょく', meaning: 'ăn / thực' }
    ]
  }
};

function buildDailyLessonVocabulary(dayNumber) {
  return Array.from({ length: 5 }, function(_, index) {
    var itemNumber = index + 1;
    return {
      id: 'day' + String(dayNumber).padStart(2, '0') + '-vocab-' + itemNumber,
      type: 'vocab',
      jp: '単語' + dayNumber + '-' + itemNumber,
      reading: 'たんご' + dayNumber + '-' + itemNumber,
      meaning: 'Minna lesson ' + dayNumber + ' vocab ' + itemNumber
    };
  });
}

function buildDailyLessonKanji(dayNumber) {
  return Array.from({ length: 3 }, function(_, index) {
    var itemNumber = index + 1;
    return {
      id: 'day' + String(dayNumber).padStart(2, '0') + '-kanji-' + itemNumber,
      type: 'kanji',
      kanji: '漢字' + dayNumber + '-' + itemNumber,
      reading: 'かんじ' + dayNumber + '-' + itemNumber,
      meaning: 'Minna lesson ' + dayNumber + ' kanji ' + itemNumber
    };
  });
}

function buildDailyLessons() {
  return Array.from({ length: 25 }, function(_, index) {
    var dayNumber = index + 1;
    var dayId = 'day' + String(dayNumber).padStart(2, '0');
    var seed = DAILY_LESSON_SEEDS[dayId];
    return {
      id: dayId,
      minnaLesson: seed ? seed.minnaLesson : dayNumber,
      label: 'Ngày ' + dayNumber,
      vocab: seed ? seed.vocab : buildDailyLessonVocabulary(dayNumber),
      kanji: seed ? seed.kanji : buildDailyLessonKanji(dayNumber)
    };
  });
}

const DAILY_LESSONS = buildDailyLessons();
