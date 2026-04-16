// src/dailyLessonsData.js
// Daily Lesson V1 dataset.
// Day 1–4 are mapped with actual seed content.
// Day 5+ remain placeholders, but follow the same expanded schema.

function makeDailyVocab(dayId, index, category, jp, reading, meaning, note, audioOrOptions) {
  var options = {};
  if (typeof audioOrOptions === 'string') {
    options.audioText = audioOrOptions;
  } else if (audioOrOptions && typeof audioOrOptions === 'object') {
    options = audioOrOptions;
  }

  return {
    id: dayId + '-vocab-' + String(index).padStart(2, '0'),
    type: 'vocab',
    category: category,
    jp: jp,
    reading: reading,
    pronunciationVi: options.pronunciationVi || '',
    meaning: meaning,
    note: note,
    audioText: options.audioText || reading,
    example: options.example || null
  };
}

function makeDailyKanji(dayId, index, kanji, reading, meaning, note, audioText) {
  return {
    id: dayId + '-kanji-' + String(index).padStart(2, '0'),
    type: 'kanji',
    category: 'kanji',
    kanji: kanji,
    reading: reading,
    meaning: meaning,
    note: note,
    audioText: audioText || reading.split(' / ')[0]
  };
}

const DAILY_LESSON_SEEDS = {
  day01: {
    minnaLesson: 1,
    topic: 'Đại từ và Danh xưng',
    vocab: [
      makeDailyVocab('day01', 1, 'vocab', 'わたし', 'わたし', 'tôi', 'Đại từ ngôi thứ nhất, dùng để giới thiệu bản thân.', {
        pronunciationVi: 'watashi',
        example: { jp: 'わたし は マイ です。', meaning: 'Tôi là Mai.' }
      }),
      makeDailyVocab('day01', 2, 'vocab', 'あなた', 'あなた', 'bạn', 'Dùng để gọi đối phương, nhưng trong hội thoại thật không dùng quá nhiều.', {
        pronunciationVi: 'anata',
        example: { jp: 'あなた は がくせい です か。', meaning: 'Bạn có phải là học sinh không?' }
      }),
      makeDailyVocab('day01', 3, 'vocab', 'あのひと', 'あのひと', 'người kia', 'Cách nói trung tính để chỉ người ở xa người nói và người nghe.', {
        pronunciationVi: 'ano hito',
        example: { jp: 'あのひと は せんせい です。', meaning: 'Người kia là giáo viên.' }
      }),
      makeDailyVocab('day01', 4, 'greeting', 'あのかた', 'あのかた', 'vị kia (lịch sự)', 'Cách nói lịch sự hơn của あのひと.', {
        pronunciationVi: 'ano kata',
        example: { jp: 'あのかた は どなた です か。', meaning: 'Vị kia là ai vậy ạ?' }
      }),
      makeDailyVocab('day01', 5, 'suffix', '〜さん', '〜さん', 'anh/chị/ông/bà', 'Hậu tố lịch sự gắn sau tên người.', {
        audioText: 'さん',
        pronunciationVi: 'san',
        example: { jp: 'たなかさん は かいしゃいん です。', highlight: 'さん', meaning: 'Anh Tanaka là nhân viên công ty.' }
      }),
      makeDailyVocab('day01', 6, 'suffix', '〜ちゃん', '〜ちゃん', 'bé (gái)', 'Hậu tố thân mật, thường dùng cho trẻ em gái hoặc người thân.', {
        audioText: 'ちゃん',
        pronunciationVi: 'chan',
        example: { jp: 'はなちゃん は げんき です。', highlight: 'ちゃん', meaning: 'Bé Hana khỏe.' }
      }),
      makeDailyVocab('day01', 7, 'suffix', '〜くん', '〜くん', 'bé (trai)', 'Hậu tố thân mật, hay dùng cho bé trai hoặc nam giới nhỏ tuổi hơn.', {
        audioText: 'くん',
        pronunciationVi: 'kun',
        example: { jp: 'たろうくん は がくせい です。', highlight: 'くん', meaning: 'Bé Taro là học sinh.' }
      }),
      makeDailyVocab('day01', 8, 'suffix', '〜じん', '〜じん', 'người nước...', 'Hậu tố chỉ quốc tịch, ví dụ ベトナムじん.', {
        audioText: 'じん',
        pronunciationVi: 'jin',
        example: { jp: 'マイさん は ベトナムじん です。', highlight: 'じん', meaning: 'Chị Mai là người Việt Nam.' }
      }),
      makeDailyVocab('day01', 9, 'greeting', 'はい', 'はい', 'vâng, dạ', 'Dùng để xác nhận đồng ý hoặc trả lời lịch sự.', {
        pronunciationVi: 'hai',
        example: { jp: 'はい、わかりました。', meaning: 'Vâng, tôi hiểu rồi.' }
      }),
      makeDailyVocab('day01', 10, 'greeting', 'いいえ', 'いいえ', 'không', 'Dùng để phủ định hoặc từ chối lịch sự.', {
        pronunciationVi: 'iie',
        example: { jp: 'いいえ、がくせい では ありません。', meaning: 'Không, tôi không phải là học sinh.' }
      })
    ],
    kanji: [
      makeDailyKanji('day01', 1, '人', 'ひと / じん', 'người', 'Dùng trong 人 và hậu tố quốc tịch như 〜じん.', 'ひと'),
      makeDailyKanji('day01', 2, '一', 'いち', 'số 1', 'Kanji cơ bản chỉ số một.', 'いち'),
      makeDailyKanji('day01', 3, '二', 'に', 'số 2', 'Kanji cơ bản chỉ số hai.', 'に')
    ]
  },
  day02: {
    minnaLesson: 2,
    topic: 'Nghề nghiệp và Tổ chức',
    vocab: [
      makeDailyVocab('day02', 1, 'vocab', 'せんせい', 'せんせい', 'thầy/cô/bác sĩ (gọi tên)', 'Dùng để gọi người có chuyên môn như giáo viên hoặc bác sĩ.', {
        pronunciationVi: 'sensei',
        example: { jp: 'やまだせんせい は にほんじん です。', meaning: 'Cô Yamada là người Nhật.' }
      }),
      makeDailyVocab('day02', 2, 'vocab', 'きょうし', 'きょうし', 'giáo viên', 'Đây là nghề nghiệp, không dùng trực tiếp để gọi tên.', {
        pronunciationVi: 'kyoushi',
        example: { jp: 'わたし の はは は きょうし です。', meaning: 'Mẹ tôi là giáo viên.' }
      }),
      makeDailyVocab('day02', 3, 'vocab', 'がくせい', 'がくせい', 'học sinh, sinh viên', 'Chỉ người đang đi học.', {
        pronunciationVi: 'gakusei',
        example: { jp: 'マイさん は がくせい です。', meaning: 'Chị Mai là sinh viên.' }
      }),
      makeDailyVocab('day02', 4, 'vocab', 'かいしゃいん', 'かいしゃいん', 'nhân viên công ty', 'Người làm việc cho một công ty.', {
        pronunciationVi: 'kaishain',
        example: { jp: 'たなかさん は かいしゃいん です。', meaning: 'Anh Tanaka là nhân viên công ty.' }
      }),
      makeDailyVocab('day02', 5, 'vocab', 'しゃいん', 'しゃいん', 'nhân viên', 'Hay dùng khi nói nhân viên của công ty cụ thể.', {
        pronunciationVi: 'shain',
        example: { jp: 'ABC の しゃいん です。', meaning: 'Tôi là nhân viên của công ty ABC.' }
      }),
      makeDailyVocab('day02', 6, 'vocab', 'ぎんこういん', 'ぎんこういん', 'nhân viên ngân hàng', 'Người làm việc trong ngân hàng.', {
        pronunciationVi: 'ginkouin',
        example: { jp: 'ちちは ぎんこういん です。', meaning: 'Bố tôi là nhân viên ngân hàng.' }
      }),
      makeDailyVocab('day02', 7, 'vocab', 'いしゃ', 'いしゃ', 'bác sĩ', 'Nghề nghiệp chỉ bác sĩ.', {
        pronunciationVi: 'isha',
        example: { jp: 'あね は いしゃ です。', meaning: 'Chị tôi là bác sĩ.' }
      }),
      makeDailyVocab('day02', 8, 'vocab', 'けんきゅうしゃ', 'けんきゅうしゃ', 'nhà nghiên cứu', 'Người làm công việc nghiên cứu.', {
        pronunciationVi: 'kenkyuusha',
        example: { jp: 'あのひと は けんきゅうしゃ です。', meaning: 'Người kia là nhà nghiên cứu.' }
      }),
      makeDailyVocab('day02', 9, 'vocab', 'だいがく', 'だいがく', 'trường đại học', 'Danh từ chỉ trường đại học.', {
        pronunciationVi: 'daigaku',
        example: { jp: 'その だいがく は ゆうめい です。', meaning: 'Trường đại học đó nổi tiếng.' }
      }),
      makeDailyVocab('day02', 10, 'vocab', 'びょういん', 'びょういん', 'bệnh viện', 'Nơi khám và chữa bệnh.', {
        pronunciationVi: 'byouin',
        example: { jp: 'びょういん は どこ です か。', meaning: 'Bệnh viện ở đâu vậy?' }
      })
    ],
    kanji: [
      makeDailyKanji('day02', 1, '学', 'がく', 'học tập', 'Xuất hiện trong がくせい và だいがく.', 'がく'),
      makeDailyKanji('day02', 2, '先', 'せん', 'trước', 'Xuất hiện trong せんせい.', 'せん'),
      makeDailyKanji('day02', 3, '生', 'せい', 'sống / sinh', 'Xuất hiện trong せんせい và がくせい.', 'せい')
    ]
  },
  day03: {
    minnaLesson: 3,
    topic: 'Câu hỏi, Tuổi và Giao tiếp',
    vocab: [
      makeDailyVocab('day03', 1, 'vocab', 'だれ', 'だれ', 'ai', 'Cách hỏi ai trong văn nói thông thường.', {
        pronunciationVi: 'dare',
        example: { jp: 'あのひと は だれ です か。', meaning: 'Người kia là ai vậy?' }
      }),
      makeDailyVocab('day03', 2, 'greeting', 'どなた', 'どなた', 'vị nào (lịch sự)', 'Cách nói lịch sự hơn của だれ.', {
        pronunciationVi: 'donata',
        example: { jp: 'あのかた は どなた です か。', meaning: 'Vị kia là ai vậy ạ?' }
      }),
      makeDailyVocab('day03', 3, 'suffix', '〜さい', '〜さい', '... tuổi', 'Hậu tố dùng để nói số tuổi.', {
        audioText: 'さい',
        pronunciationVi: 'sai',
        example: { jp: 'わたし は じゅうはっさい です。', highlight: 'さい', meaning: 'Tôi 18 tuổi.' }
      }),
      makeDailyVocab('day03', 4, 'vocab', 'はたち', 'はたち', '20 tuổi', 'Cách nói đặc biệt cho hai mươi tuổi.', {
        pronunciationVi: 'hatachi',
        example: { jp: 'あね は はたち です。', meaning: 'Chị tôi 20 tuổi.' }
      }),
      makeDailyVocab('day03', 5, 'vocab', 'なんさい', 'なんさい', 'mấy tuổi', 'Cách hỏi tuổi thông thường.', {
        pronunciationVi: 'nansai',
        example: { jp: 'ミラーさん は なんさい です か。', meaning: 'Anh Miller bao nhiêu tuổi?' }
      }),
      makeDailyVocab('day03', 6, 'greeting', 'おいくつ', 'おいくつ', 'bao nhiêu tuổi (lịch sự)', 'Cách hỏi tuổi lịch sự hơn của なんさい.', {
        pronunciationVi: 'oikutsu',
        example: { jp: 'おかあさん は おいくつ です か。', meaning: 'Mẹ bạn bao nhiêu tuổi ạ?' }
      }),
      makeDailyVocab('day03', 7, 'greeting', 'はじめまして', 'はじめまして', 'rất hân hạnh được gặp', 'Dùng khi gặp lần đầu.', {
        pronunciationVi: 'hajimemashite',
        example: { jp: 'はじめまして、マイ です。', meaning: 'Rất hân hạnh được gặp, tôi là Mai.' }
      }),
      makeDailyVocab('day03', 8, 'phrase', '〜からきました', '〜からきました', 'đến từ...', 'Mẫu câu dùng để nói nơi xuất thân.', {
        audioText: 'からきました',
        pronunciationVi: 'kara kimashita',
        example: { jp: 'ベトナム からきました。', highlight: 'からきました', meaning: 'Tôi đến từ Việt Nam.' }
      }),
      makeDailyVocab('day03', 9, 'greeting', 'どうぞよろしくおねがいします', 'どうぞよろしくおねがいします', 'rất mong được giúp đỡ', 'Cụm giao tiếp rất hay dùng khi chào hỏi lần đầu.', {
        pronunciationVi: 'douzo yoroshiku onegaishimasu',
        example: { jp: 'どうぞよろしくおねがいします。', meaning: 'Rất mong được giúp đỡ.' }
      }),
      makeDailyVocab('day03', 10, 'greeting', 'しつれいですが', 'しつれいですが', 'xin lỗi cho hỏi...', 'Mở đầu lịch sự trước khi hỏi điều gì đó.', {
        pronunciationVi: 'shitsurei desu ga',
        example: { jp: 'しつれいですが、おなまえ は？', meaning: 'Xin lỗi cho hỏi, tên bạn là gì?' }
      })
    ],
    kanji: [
      makeDailyKanji('day03', 1, '三', 'さん', 'số 3', 'Kanji cơ bản chỉ số ba.', 'さん'),
      makeDailyKanji('day03', 2, '四', 'よん / し', 'số 4', 'Kanji cơ bản chỉ số bốn.', 'よん'),
      makeDailyKanji('day03', 3, '五', 'ご', 'số 5', 'Kanji cơ bản chỉ số năm.', 'ご')
    ]
  },
  day04: {
    minnaLesson: 4,
    topic: 'Quốc gia và Giao tiếp còn lại',
    vocab: [
      makeDailyVocab('day04', 1, 'phrase', 'おなまえは？', 'おなまえは？', 'tên bạn là gì?', 'Câu hỏi lịch sự để hỏi tên người khác.', {
        audioText: 'おなまえは',
        pronunciationVi: 'onamae wa',
        example: { jp: 'しつれいですが、おなまえは？', meaning: 'Xin lỗi cho hỏi, tên bạn là gì?' }
      }),
      makeDailyVocab('day04', 2, 'phrase', 'こちらは〜さんです', 'こちらは〜さんです', 'đây là anh/chị...', 'Mẫu câu giới thiệu người khác một cách lịch sự.', {
        audioText: 'こちらはさんです',
        pronunciationVi: 'kochira wa ~san desu',
        example: { jp: 'こちらは たなかさん です。', highlight: 'こちらは', meaning: 'Đây là anh Tanaka.' }
      }),
      makeDailyVocab('day04', 3, 'vocab', 'アメリカ', 'アメリカ', 'Mỹ', 'Tên quốc gia viết bằng katakana.', {
        pronunciationVi: 'Amerika',
        example: { jp: 'ミラーさん は アメリカ からきました。', meaning: 'Anh Miller đến từ Mỹ.' }
      }),
      makeDailyVocab('day04', 4, 'vocab', 'イギリス', 'イギリス', 'Anh', 'Tên quốc gia viết bằng katakana.', {
        pronunciationVi: 'Igirisu',
        example: { jp: 'スミスさん は イギリス じん です。', meaning: 'Anh Smith là người Anh.' }
      }),
      makeDailyVocab('day04', 5, 'vocab', 'インド', 'インド', 'Ấn Độ', 'Tên quốc gia viết bằng katakana.', {
        pronunciationVi: 'Indo',
        example: { jp: 'ラジ さん は インド からきました。', meaning: 'Anh Raj đến từ Ấn Độ.' }
      }),
      makeDailyVocab('day04', 6, 'vocab', 'インドネシア', 'インドネシア', 'Indonesia', 'Tên quốc gia viết bằng katakana.', {
        pronunciationVi: 'Indonesia',
        example: { jp: 'あのかた は インドネシア じん です。', meaning: 'Vị kia là người Indonesia.' }
      }),
      makeDailyVocab('day04', 7, 'vocab', 'かんこく', 'かんこく', 'Hàn Quốc', 'Có thể viết bằng kanji là 韓国.', {
        pronunciationVi: 'Kankoku',
        example: { jp: 'キムさん は かんこく からきました。', meaning: 'Anh Kim đến từ Hàn Quốc.' }
      }),
      makeDailyVocab('day04', 8, 'vocab', 'タイ', 'タイ', 'Thái Lan', 'Tên quốc gia viết bằng katakana.', {
        pronunciationVi: 'Tai',
        example: { jp: 'ソムさん は タイ じん です。', meaning: 'Chị Som là người Thái Lan.' }
      }),
      makeDailyVocab('day04', 9, 'vocab', 'ちゅうごく', 'ちゅうごく', 'Trung Quốc', 'Có thể viết bằng kanji là 中国.', {
        pronunciationVi: 'Chuugoku',
        example: { jp: 'リーさん は ちゅうごく じん です。', meaning: 'Anh Lee là người Trung Quốc.' }
      }),
      makeDailyVocab('day04', 10, 'vocab', 'にほん', 'にほん', 'Nhật Bản', 'Có thể viết bằng kanji là 日本.', {
        pronunciationVi: 'Nihon',
        example: { jp: 'やまださん は にほん じん です。', meaning: 'Anh Yamada là người Nhật.' }
      })
    ],
    kanji: [
      makeDailyKanji('day04', 1, '日', 'にち / ひ', 'ngày / mặt trời', 'Xuất hiện trong 日本.', 'にち'),
      makeDailyKanji('day04', 2, '本', 'ほん', 'gốc / sách', 'Xuất hiện trong 日本.', 'ほん'),
      makeDailyKanji('day04', 3, '中', 'ちゅう / なか', 'ở giữa', 'Xuất hiện trong 中国.', 'ちゅう')
    ]
  },
  day05: {
    minnaLesson: 5,
    topic: 'Đồ vật và chỉ định sự vật',
    vocab: [
      makeDailyVocab('day05', 1, 'vocab', 'これ', 'これ', 'cái này', 'Dùng để chỉ vật ở gần người nói.', {
        pronunciationVi: 'kore',
        example: { jp: 'これ は ほん です。', meaning: 'Cái này là sách.' }
      }),
      makeDailyVocab('day05', 2, 'vocab', 'それ', 'それ', 'cái đó', 'Dùng để chỉ vật ở gần người nghe.', {
        pronunciationVi: 'sore',
        example: { jp: 'それ は じしょ です か。', meaning: 'Cái đó là từ điển phải không?' }
      }),
      makeDailyVocab('day05', 3, 'vocab', 'あれ', 'あれ', 'cái kia', 'Dùng để chỉ vật ở xa cả người nói lẫn người nghe.', {
        pronunciationVi: 'are',
        example: { jp: 'あれ は しんぶん です。', meaning: 'Cái kia là tờ báo.' }
      }),
      makeDailyVocab('day05', 4, 'vocab', 'この', 'この', '~ này', 'Đứng trước danh từ để chỉ vật ở gần người nói.', {
        pronunciationVi: 'kono',
        example: { jp: 'この ざっし は おもしろい です。', meaning: 'Cuốn tạp chí này thú vị.' }
      }),
      makeDailyVocab('day05', 5, 'vocab', 'その', 'その', '~ đó', 'Đứng trước danh từ để chỉ vật ở gần người nghe.', {
        pronunciationVi: 'sono',
        example: { jp: 'その ほん は わたし の です。', meaning: 'Cuốn sách đó là của tôi.' }
      }),
      makeDailyVocab('day05', 6, 'vocab', 'あの', 'あの', '~ kia', 'Đứng trước danh từ để chỉ vật ở xa cả hai bên.', {
        pronunciationVi: 'ano',
        example: { jp: 'あの ひと は せんせい です。', meaning: 'Người kia là giáo viên.' }
      }),
      makeDailyVocab('day05', 7, 'vocab', 'ほん', 'ほん', 'sách', 'Danh từ chỉ sách hoặc quyển sách.', {
        pronunciationVi: 'hon',
        example: { jp: 'ほん を よみます。', meaning: 'Tôi đọc sách.' }
      }),
      makeDailyVocab('day05', 8, 'vocab', 'じしょ', 'じしょ', 'từ điển', 'Dùng để tra nghĩa và cách đọc.', {
        pronunciationVi: 'jisho',
        example: { jp: 'これは にほんご の じしょ です。', meaning: 'Đây là từ điển tiếng Nhật.' }
      }),
      makeDailyVocab('day05', 9, 'vocab', 'ざっし', 'ざっし', 'tạp chí', 'Ấn phẩm định kỳ như tạp chí.', {
        pronunciationVi: 'zasshi',
        example: { jp: 'その ざっし は ゆうめい です。', meaning: 'Cuốn tạp chí đó nổi tiếng.' }
      }),
      makeDailyVocab('day05', 10, 'vocab', 'しんぶん', 'しんぶん', 'báo', 'Tờ báo hoặc báo chí hằng ngày.', {
        pronunciationVi: 'shimbun',
        example: { jp: 'ちちは まいにち しんぶん を よみます。', meaning: 'Bố tôi đọc báo mỗi ngày.' }
      })
    ],
    kanji: [
      makeDailyKanji('day05', 1, '六', 'ろく', 'số 6', 'Kanji cơ bản chỉ số sáu.', 'ろく'),
      makeDailyKanji('day05', 2, '七', 'しち / なな', 'số 7', 'Kanji cơ bản chỉ số bảy.', 'しち'),
      makeDailyKanji('day05', 3, '八', 'はち', 'số 8', 'Kanji cơ bản chỉ số tám.', 'はち')
    ]
  },
  day06: {
    minnaLesson: 6,
    topic: 'Đồ dùng cá nhân',
    vocab: [
      makeDailyVocab('day06', 1, 'vocab', 'ノート', 'ノート', 'vở', 'Từ katakana chỉ quyển vở hoặc notebook.', {
        pronunciationVi: 'no-to',
        example: { jp: 'ノート に なまえ を かきます。', meaning: 'Tôi viết tên vào vở.' }
      }),
      makeDailyVocab('day06', 2, 'vocab', 'てちょう', 'てちょう', 'sổ tay', 'Sổ nhỏ dùng để ghi chú hằng ngày.', {
        pronunciationVi: 'techou',
        example: { jp: 'てちょう に よてい を かきます。', meaning: 'Tôi ghi lịch hẹn vào sổ tay.' }
      }),
      makeDailyVocab('day06', 3, 'vocab', 'めいし', 'めいし', 'danh thiếp', 'Thẻ giới thiệu tên và chức vụ.', {
        pronunciationVi: 'meishi',
        example: { jp: 'めいし を どうぞ。', meaning: 'Xin mời danh thiếp của tôi.' }
      }),
      makeDailyVocab('day06', 4, 'vocab', 'カード', 'カード', 'thẻ / card', 'Từ katakana chỉ thẻ nói chung.', {
        pronunciationVi: 'ka-do',
        example: { jp: 'カード は かばん の なか です。', meaning: 'Thẻ ở trong cặp.' }
      }),
      makeDailyVocab('day06', 5, 'vocab', 'えんぴつ', 'えんぴつ', 'bút chì', 'Dùng để viết hoặc vẽ bằng chì.', {
        pronunciationVi: 'enpitsu',
        example: { jp: 'えんぴつ で かきます。', meaning: 'Tôi viết bằng bút chì.' }
      }),
      makeDailyVocab('day06', 6, 'vocab', 'ボールペン', 'ボールペン', 'bút bi', 'Loại bút dùng mực bi.', {
        pronunciationVi: 'bo-rupen',
        example: { jp: 'ボールペン を かしてください。', meaning: 'Cho tôi mượn bút bi nhé.' }
      }),
      makeDailyVocab('day06', 7, 'vocab', 'シャープペンシル', 'シャープペンシル', 'bút chì kim', 'Loại bút chì dùng ruột chì nhỏ.', {
        pronunciationVi: 'sha-pu penshiru',
        example: { jp: 'シャープペンシル は つくえ の うえ です。', meaning: 'Bút chì kim ở trên bàn.' }
      }),
      makeDailyVocab('day06', 8, 'vocab', 'かぎ', 'かぎ', 'chìa khóa', 'Dùng để mở cửa hoặc khóa.', {
        pronunciationVi: 'kagi',
        example: { jp: 'かぎ は どこ です か。', meaning: 'Chìa khóa ở đâu vậy?' }
      }),
      makeDailyVocab('day06', 9, 'vocab', 'とけい', 'とけい', 'đồng hồ', 'Danh từ chỉ đồng hồ nói chung.', {
        pronunciationVi: 'tokei',
        example: { jp: 'この とけい は べんり です。', meaning: 'Cái đồng hồ này tiện lợi.' }
      }),
      makeDailyVocab('day06', 10, 'vocab', 'かさ', 'かさ', 'cái ô', 'Dùng khi trời mưa hoặc nắng gắt.', {
        pronunciationVi: 'kasa',
        example: { jp: 'あした かさ を もっていきます。', meaning: 'Ngày mai tôi sẽ mang ô đi.' }
      })
    ],
    kanji: [
      makeDailyKanji('day06', 1, '九', 'きゅう / く', 'số 9', 'Kanji cơ bản chỉ số chín.', 'きゅう'),
      makeDailyKanji('day06', 2, '十', 'じゅう', 'số 10', 'Kanji cơ bản chỉ số mười.', 'じゅう'),
      makeDailyKanji('day06', 3, '百', 'ひゃく', '100', 'Kanji chỉ một trăm.', 'ひゃく')
    ]
  },
  day07: {
    minnaLesson: 7,
    topic: 'Thiết bị và đồ dùng quanh ta',
    vocab: [
      makeDailyVocab('day07', 1, 'vocab', 'かばん', 'かばん', 'cặp sách', 'Túi hoặc cặp để đựng đồ.', {
        pronunciationVi: 'kaban',
        example: { jp: 'かばん は いす の した です。', meaning: 'Cặp sách ở dưới ghế.' }
      }),
      makeDailyVocab('day07', 2, 'vocab', 'シーディー', 'シーディー', 'đĩa CD', 'Từ katakana chỉ đĩa CD.', {
        pronunciationVi: 'shi-di-',
        example: { jp: 'シーディー を ききます。', meaning: 'Tôi nghe đĩa CD.' }
      }),
      makeDailyVocab('day07', 3, 'vocab', 'テレビ', 'テレビ', 'tivi', 'Từ katakana chỉ tivi.', {
        pronunciationVi: 'terebi',
        example: { jp: 'まいばん テレビ を みます。', meaning: 'Tối nào tôi cũng xem tivi.' }
      }),
      makeDailyVocab('day07', 4, 'vocab', 'ラジオ', 'ラジオ', 'radio', 'Thiết bị nghe chương trình phát thanh.', {
        pronunciationVi: 'rajio',
        example: { jp: 'ラジオ で ニュース を ききます。', meaning: 'Tôi nghe tin tức bằng radio.' }
      }),
      makeDailyVocab('day07', 5, 'vocab', 'カメラ', 'カメラ', 'máy ảnh', 'Thiết bị dùng để chụp ảnh.', {
        pronunciationVi: 'kamera',
        example: { jp: 'この カメラ は あたらしい です。', meaning: 'Cái máy ảnh này mới.' }
      }),
      makeDailyVocab('day07', 6, 'vocab', 'コンピューター', 'コンピューター', 'máy tính', 'Từ katakana chỉ máy tính.', {
        pronunciationVi: 'konpyu-ta-',
        example: { jp: 'コンピューター で しごと を します。', meaning: 'Tôi làm việc bằng máy tính.' }
      }),
      makeDailyVocab('day07', 7, 'vocab', 'じどうしゃ', 'じどうしゃ / くるま', 'ô tô', 'Có thể nói là じどうしゃ hoặc くるま trong hội thoại.', {
        pronunciationVi: 'jidousha / kuruma',
        audioText: 'じどうしゃ',
        example: { jp: 'じどうしゃ で かいしゃ へ いきます。', meaning: 'Tôi đi ô tô đến công ty.' }
      }),
      makeDailyVocab('day07', 8, 'vocab', 'つくえ', 'つくえ', 'cái bàn', 'Bàn học hoặc bàn làm việc.', {
        pronunciationVi: 'tsukue',
        example: { jp: 'つくえ の うえ に ほん が あります。', meaning: 'Có một cuốn sách ở trên bàn.' }
      }),
      makeDailyVocab('day07', 9, 'vocab', 'いす', 'いす', 'cái ghế', 'Ghế để ngồi.', {
        pronunciationVi: 'isu',
        example: { jp: 'いす に すわって ください。', meaning: 'Mời bạn ngồi vào ghế.' }
      }),
      makeDailyVocab('day07', 10, 'vocab', 'チョコレート', 'チョコレート', 'socola', 'Từ katakana chỉ chocolate.', {
        pronunciationVi: 'chokore-to',
        example: { jp: 'チョコレート が すき です。', meaning: 'Tôi thích socola.' }
      })
    ],
    kanji: [
      makeDailyKanji('day07', 1, '千', 'せん', '1.000', 'Kanji chỉ một nghìn.', 'せん'),
      makeDailyKanji('day07', 2, '万', 'まん', '10.000', 'Kanji chỉ mười nghìn.', 'まん'),
      makeDailyKanji('day07', 3, '円', 'えん', 'yên (tiền)', 'Kanji chỉ đơn vị tiền Nhật.', 'えん')
    ]
  },
  day08: {
    minnaLesson: 8,
    topic: 'Đồ ăn nhẹ và giao tiếp cơ bản',
    vocab: [
      makeDailyVocab('day08', 1, 'vocab', 'コーヒー', 'コーヒー', 'cà phê', 'Đồ uống quen thuộc, viết bằng katakana.', {
        pronunciationVi: 'ko-hi-',
        example: { jp: 'あさ コーヒー を のみます。', meaning: 'Buổi sáng tôi uống cà phê.' }
      }),
      makeDailyVocab('day08', 2, 'vocab', 'おみやげ', 'おみやげ', 'quà lưu niệm', 'Món quà mang về sau chuyến đi.', {
        pronunciationVi: 'omiyage',
        example: { jp: 'これは ベトナム の おみやげ です。', meaning: 'Đây là quà lưu niệm từ Việt Nam.' }
      }),
      makeDailyVocab('day08', 3, 'vocab', 'えいご', 'えいご', 'tiếng Anh', 'Ngôn ngữ tiếng Anh.', {
        pronunciationVi: 'eigo',
        example: { jp: 'えいご を べんきょう します。', meaning: 'Tôi học tiếng Anh.' }
      }),
      makeDailyVocab('day08', 4, 'vocab', 'にほんご', 'にほんご', 'tiếng Nhật', 'Ngôn ngữ tiếng Nhật.', {
        pronunciationVi: 'nihongo',
        example: { jp: 'にほんご は おもしろい です。', meaning: 'Tiếng Nhật thú vị.' }
      }),
      makeDailyVocab('day08', 5, 'vocab', 'なん', 'なん / なに', 'cái gì', 'Dùng để hỏi tên hoặc bản chất sự vật.', {
        pronunciationVi: 'nan / nani',
        audioText: 'なん',
        example: { jp: 'これは なん です か。', meaning: 'Đây là cái gì vậy?' }
      }),
      makeDailyVocab('day08', 6, 'phrase', 'そうです', 'そう です', 'đúng vậy', 'Cụm xác nhận điều vừa nghe là đúng.', {
        audioText: 'そうです',
        pronunciationVi: 'sou desu',
        example: { jp: 'はい、そうです。', meaning: 'Vâng, đúng vậy.' }
      }),
      makeDailyVocab('day08', 7, 'phrase', 'ちがいます', 'ちがいます', 'không phải', 'Dùng để phủ định hoặc sửa lại thông tin.', {
        pronunciationVi: 'chigaimasu',
        example: { jp: 'いいえ、ちがいます。', meaning: 'Không, không phải đâu.' }
      }),
      makeDailyVocab('day08', 8, 'phrase', 'そうですか', 'そう です か', 'thế à / vậy à', 'Dùng khi đáp lại thông tin vừa nghe.', {
        audioText: 'そうですか',
        pronunciationVi: 'sou desu ka',
        example: { jp: 'にほんじん です か。そうですか。', meaning: 'Bạn là người Nhật à. Thế à.' }
      }),
      makeDailyVocab('day08', 9, 'greeting', 'どうぞ', 'どうぞ', 'xin mời', 'Dùng khi mời ai đó nhận hoặc làm gì.', {
        pronunciationVi: 'douzo',
        example: { jp: 'どうぞ、コーヒー を のんで ください。', meaning: 'Xin mời, hãy uống cà phê.' }
      }),
      makeDailyVocab('day08', 10, 'greeting', 'どうもありがとうございます', 'どうも ありがとう ございます', 'cảm ơn', 'Cách cảm ơn lịch sự và đầy đủ.', {
        audioText: 'どうもありがとうございます',
        pronunciationVi: 'doumo arigatou gozaimasu',
        example: { jp: 'どうもありがとうございます。', meaning: 'Xin cảm ơn rất nhiều.' }
      })
    ],
    kanji: [
      makeDailyKanji('day08', 1, '口', 'くち', 'cái miệng', 'Kanji chỉ miệng hoặc lỗ mở.', 'くち'),
      makeDailyKanji('day08', 2, '目', 'め', 'mắt', 'Kanji chỉ mắt hoặc thứ tự.', 'め'),
      makeDailyKanji('day08', 3, '耳', 'みみ', 'tai', 'Kanji chỉ tai.', 'みみ')
    ]
  }
};

function buildDailyLessonVocabulary(dayNumber) {
  var dayId = 'day' + String(dayNumber).padStart(2, '0');
  return Array.from({ length: 10 }, function(_, index) {
    var itemNumber = index + 1;
    return makeDailyVocab(
      dayId,
      itemNumber,
      itemNumber <= 6 ? 'vocab' : 'phrase',
      '単語' + dayNumber + '-' + itemNumber,
      'たんご' + dayNumber + '-' + itemNumber,
      'Minna lesson ' + dayNumber + ' vocab ' + itemNumber,
      'Placeholder content cho ngày ' + dayNumber + ', sẽ được thay bằng dữ liệu thật sau.',
      {
        pronunciationVi: '',
        example: null
      }
    );
  });
}

function buildDailyLessonKanji(dayNumber) {
  var dayId = 'day' + String(dayNumber).padStart(2, '0');
  return Array.from({ length: 3 }, function(_, index) {
    var itemNumber = index + 1;
    return makeDailyKanji(
      dayId,
      itemNumber,
      '漢字' + dayNumber + '-' + itemNumber,
      'かんじ' + dayNumber + '-' + itemNumber,
      'Minna lesson ' + dayNumber + ' kanji ' + itemNumber,
      'Placeholder kanji cho ngày ' + dayNumber + ', sẽ được thay bằng dữ liệu thật sau.'
    );
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
      topic: seed ? seed.topic : 'Chủ đề Minna bài ' + dayNumber,
      vocab: seed ? seed.vocab : buildDailyLessonVocabulary(dayNumber),
      kanji: seed ? seed.kanji : buildDailyLessonKanji(dayNumber)
    };
  });
}

const DAILY_LESSONS = buildDailyLessons();
