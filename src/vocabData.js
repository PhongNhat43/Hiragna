// src/vocabData.js
// Vocabulary data layer for Vocab Learning (Phase 4 / HIRA-019).
// Global-scope data to match current script-tag architecture.
//
// - VOCAB_DECKS: bảng chữ Hiragana / Katakana — chunk 5 ký tự mỗi bài (từ hiraganaData / katakanaData có sẵn).
// - VOCAB_MINNA_LESSONS: 7 bài Minna no Nihongo, mỗi bài 4 unit × 5-7 từ.
//   Nội dung bám theo lessonsData (cùng nghĩa, cùng reading), nâng chính tả sang Kanji N5 phổ thông.
// - VOCAB_KANJI_INFO: thông tin Kanji (số nét, bộ thủ, nghĩa) cho mọi Kanji xuất hiện trong từ vựng.
//   Từ dùng chung Kanji được tính runtime (quét VOCAB_MINNA_LESSONS).

const VOCAB_KANA_LESSON_SIZE = 5; // mỗi bài bảng chữ 5 ký tự

function _chunkArray(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

// ===== Tầng 1 — bảng chữ: mỗi bài 5 ký tự =====
function _buildVocabDecks() {
  const decks = {};
  [
    { id: 'hiragana', title: 'Bảng chữ Hiragana', subtitle: 'あいうえお…', data: hiraganaData, prefix: 'hira' },
    { id: 'katakana', title: 'Bảng chữ Katakana', subtitle: 'アイウエオ…', data: katakanaData, prefix: 'kata' }
  ].forEach(deck => {
    const chunks = _chunkArray(deck.data, VOCAB_KANA_LESSON_SIZE);
    decks[deck.id] = {
      id: deck.id,
      title: deck.title,
      subtitle: deck.subtitle,
      items: deck.data,
      lessons: chunks.map((chunk, idx) => ({
        id: deck.prefix + '_l' + (idx + 1),
        deckId: deck.id,
        index: idx + 1,
        title: 'Bài ' + (idx + 1),
        range: chunk[0].kana + '〜' + chunk[chunk.length - 1].kana,
        items: chunk.map(item => ({
          id: deck.prefix + ':' + item.kana,
          jp: item.kana,
          reading: item.romaji,
          meaning: null,
          category: 'Bảng chữ',
          usage: '',
          example: null,
          kanji: []
        }))
      }))
    };
  });
  return decks;
}

// ===== Tầng 2 — từ vựng theo bài Minna (Kanji N5 form) =====
// id quy ước: m<bài>_u<unit>_<số>, đảm bảo unique toàn app.
const VOCAB_MINNA_LESSONS = [
  {
    id: 'm1', title: 'Bài 1: Chào hỏi & Giới thiệu bản thân',
    units: [
      { id: 'm1_u1', title: 'Nhóm 1', items: [
        { id: 'm1_u1_1', jp: '私', reading: 'わたし', meaning: 'Tôi', category: 'Đại từ', usage: 'Dùng bình thường cho cả nam và nữ. Khi nói chuyện công việc thường dùng わたくし cho trang trọng hơn.', example: { jp: '私は会社員です。', vi: 'Tôi là nhân viên công ty.' }, kanji: ['私'] },
        { id: 'm1_u1_2', jp: 'あなた', reading: 'anata', meaning: 'Bạn, anh/chị', category: 'Đại từ', usage: 'Không dùng trực tiếp với người lạ hay cấp trên — gọi tên + さん là lịch sự hơn.', example: { jp: 'あなたは学生ですか。', vi: 'Bạn là học sinh/sinh viên à?' }, kanji: [] },
        { id: 'm1_u1_3', jp: 'あの人', reading: 'あのひと', meaning: 'Người kia', category: 'Đại từ', usage: 'Chỉ người ở xa cả hai. Lịch sự hơn là あの方.', example: { jp: 'あの人は先生です。', vi: 'Người kia là giáo viên.' }, kanji: ['人'] },
        { id: 'm1_u1_4', jp: '～さん', reading: '~san', meaning: 'Anh, chị, ông, bà', category: 'Hậu tố', usage: 'Thêm sau tên người khác, không bao giờ dùng cho bản thân mình.', example: { jp: '田中さんは学生です。', vi: 'Anh Tanaka là sinh viên.' }, kanji: [] },
        { id: 'm1_u1_5', jp: '～ちゃん', reading: '~chan', meaning: 'Bé (dùng cho trẻ em)', category: 'Hậu tố', usage: 'Dùng thân mật cho trẻ em hoặc bạn thân, không dùng trong công việc.', example: { jp: 'ゆきちゃんは子どもです。', vi: 'Bé Yuki là trẻ con.' }, kanji: [] }
      ]},
      { id: 'm1_u2', title: 'Nhóm 2', items: [
        { id: 'm1_u2_1', jp: 'はじめまして', reading: 'hajimemashite', meaning: 'Rất hân hạnh được gặp anh/chị', category: 'Chào hỏi', usage: 'Chỉ dùng khi gặp lần đầu, kết hợp với どうぞよろしく.', example: { jp: 'はじめまして。よろしくお願いします。', vi: 'Rất hân hạnh. Mong được anh/chị giúp đỡ.' }, kanji: [] },
        { id: 'm1_u2_2', jp: '～から来ました', reading: '~からきました', meaning: 'Tôi đến từ ~', category: 'Chào hỏi', usage: 'Dùng khi giới thiệu xuất xứ. 来ました là thể lịch sự.', example: { jp: 'ベトナムから来ました。', vi: 'Tôi đến từ Việt Nam.' }, kanji: ['来'] },
        { id: 'm1_u2_3', jp: 'どうぞよろしく', reading: 'douzo yoroshiku', meaning: 'Rất mong được sự giúp đỡ', category: 'Chào hỏi', usage: 'Câu kết khi giới thiệu bản thân. Trang trọng hơn: よろしくお願いします.', example: { jp: 'どうぞよろしく。', vi: 'Rất mong được giúp đỡ.' }, kanji: [] },
        { id: 'm1_u2_4', jp: '失礼ですが', reading: 'しつれいですが', meaning: 'Xin lỗi, mạo muội...', category: 'Cụm từ', usage: 'Dùng trước khi hỏi thông tin cá nhân (tên, nghề nghiệp) — đỡ phá lệ.', example: { jp: '失礼ですが、お名前は？', vi: 'Xin phép được hỏi, anh/chị tên gì?' }, kanji: ['失', '礼'] },
        { id: 'm1_u2_5', jp: 'お名前は？', reading: 'おなまえは？', meaning: 'Tên anh/chị là gì?', category: 'Cụm từ', usage: 'Hỏi tên lịch sự, thêm お là kính ngữ.', example: { jp: '失礼ですが、お名前は？', vi: 'Xin phép, anh/chị tên gì?' }, kanji: ['名', '前'] }
      ]},
      { id: 'm1_u3', title: 'Nhóm 3', items: [
        { id: 'm1_u3_1', jp: '先生', reading: 'せんせい', meaning: 'Thầy cô giáo', category: 'Nghề nghiệp', usage: 'Cũng dùng gọi bác sĩ, luật sư. Không tự xưng mình là 先生.', example: { jp: '山田先生は日本人です。', vi: 'Thầy Yamada là người Nhật.' }, kanji: ['先', '生'] },
        { id: 'm1_u3_2', jp: '教師', reading: 'きょうし', meaning: 'Giáo viên', category: 'Nghề nghiệp', usage: 'Chỉ nghề giáo nói chung, dùng khi nói về bản thân. Gọi người khác thì dùng 先生.', example: { jp: '私は大学の教師です。', vi: 'Tôi là giáo viên đại học.' }, kanji: ['教', '師'] },
        { id: 'm1_u3_3', jp: '学生', reading: 'がくせい', meaning: 'Học sinh, sinh viên', category: 'Nghề nghiệp', usage: 'Thường chỉ sinh viên đại học. Học sinh cấp dưới dùng 生徒.', example: { jp: '私は学生です。', vi: 'Tôi là sinh viên.' }, kanji: ['学', '生'] },
        { id: 'm1_u3_4', jp: '会社員', reading: 'かいしゃいん', meaning: 'Nhân viên công ty', category: 'Nghề nghiệp', usage: 'Từ chung chỉ người làm ở công ty. Nói rõ công ty thì dùng 社員.', example: { jp: '私は会社員です。', vi: 'Tôi là nhân viên công ty.' }, kanji: ['会', '社', '員'] },
        { id: 'm1_u3_5', jp: '社員', reading: 'しゃいん', meaning: 'Nhân viên công ty ~', category: 'Nghề nghiệp', usage: 'Đi kèm tên công ty cụ thể, ví dụ XYZ社員.', example: { jp: '彼はABC会社の社員です。', vi: 'Anh ấy là nhân viên công ty ABC.' }, kanji: ['社', '員'] }
      ]},
      { id: 'm1_u4', title: 'Nhóm 4', items: [
        { id: 'm1_u4_1', jp: '銀行員', reading: 'ぎんこういん', meaning: 'Nhân viên ngân hàng', category: 'Nghề nghiệp', usage: 'Từ chỉ nghề, dùng khi giới thiệu công việc.', example: { jp: '私は銀行員です。', vi: 'Tôi là nhân viên ngân hàng.' }, kanji: ['銀', '行', '員'] },
        { id: 'm1_u4_2', jp: '医者', reading: 'いしゃ', meaning: 'Bác sĩ', category: 'Nghề nghiệp', usage: 'Danh từ chỉ nghề. Gọi trực tiếp bác sĩ thì dùng 先生.', example: { jp: '兄は医者です。', vi: 'Anh trai tôi là bác sĩ.' }, kanji: ['医', '者'] },
        { id: 'm1_u4_3', jp: '研究者', reading: 'けんきゅうしゃ', meaning: 'Nhà nghiên cứu', category: 'Nghề nghiệp', usage: 'Chỉ người làm nghiên cứu chuyên nghiệp.', example: { jp: '父は研究者です。', vi: 'Bố tôi là nhà nghiên cứu.' }, kanji: ['研', '究', '者'] },
        { id: 'm1_u4_4', jp: '大学', reading: 'だいがく', meaning: 'Trường đại học', category: 'Địa điểm', usage: 'Chỉ trường đại học. Học đại học: 大学に入ります.', example: { jp: '私は大学の学生です。', vi: 'Tôi là sinh viên đại học.' }, kanji: ['大', '学'] },
        { id: 'm1_u4_5', jp: '病院', reading: 'びょういん', meaning: 'Bệnh viện', category: 'Địa điểm', usage: 'Distinguish 病院 (bệnh viện) và 病気 (bệnh tật). Đến khám: 病院に行きます.', example: { jp: '私は病院へ行きます。', vi: 'Tôi đi bệnh viện.' }, kanji: ['病', '院'] }
      ]}
    ]
  },
  {
    id: 'm2', title: 'Bài 2: Đồ vật xung quanh',
    units: [
      { id: 'm2_u1', title: 'Nhóm 1', items: [
        { id: 'm2_u1_1', jp: 'これ', reading: 'kore', meaning: 'Cái này', category: 'Chỉ thị từ', usage: 'Chỉ vật gần người nói, không cần danh từ đi sau.', example: { jp: 'これは本です。', vi: 'Đây là sách.' }, kanji: [] },
        { id: 'm2_u1_2', jp: 'それ', reading: 'sore', meaning: 'Cái đó', category: 'Chỉ thị từ', usage: 'Chỉ vật gần người nghe, xa người nói.', example: { jp: 'それは辞書ですか。', vi: 'Cái đó là từ điển à?' }, kanji: [] },
        { id: 'm2_u1_3', jp: 'あれ', reading: 'are', meaning: 'Cái kia', category: 'Chỉ thị từ', usage: 'Chỉ vật xa cả hai người.', example: { jp: 'あれは雑誌です。', vi: 'Cái kia là tạp chí.' }, kanji: [] },
        { id: 'm2_u1_4', jp: '本', reading: 'ほん', meaning: 'Sách', category: 'Đồ vật', usage: 'Chỉ sách nói chung. Sổ ghi chép là ノート.', example: { jp: 'これは日本の本です。', vi: 'Đây là sách Nhật Bản.' }, kanji: ['本'] },
        { id: 'm2_u1_5', jp: '辞書', reading: 'じしょ', meaning: 'Từ điển', category: 'Đồ vật', usage: 'Từ điển ngôn ngữ nói chung; từ điển Nhật là 国語辞典.', example: { jp: 'これは私の辞書です。', vi: 'Đây là từ điển của tôi.' }, kanji: ['辞', '書'] },
        { id: 'm2_u1_6', jp: '雑誌', reading: 'ざっし', meaning: 'Tạp chí', category: 'Đồ vật', usage: 'Tạp chí định kỳ. Đọc báo thì dùng 新聞.', example: { jp: 'それは新しい雑誌です。', vi: 'Đó là tạp chí mới.' }, kanji: ['雑', '誌'] }
      ]},
      { id: 'm2_u2', title: 'Nhóm 2', items: [
        { id: 'm2_u2_1', jp: '新聞', reading: 'しんぶん', meaning: 'Báo', category: 'Đồ vật', usage: 'Báo in nói chung, 1 chữ 新 đọc しん.', example: { jp: '私は朝新聞を読みます。', vi: 'Tôi đọc báo buổi sáng.' }, kanji: ['新', '聞'] },
        { id: 'm2_u2_2', jp: 'ノート', reading: 'no-to', meaning: 'Vở, sổ tay', category: 'Đồ vật', usage: 'Từ mượn tiếng Anh "note", nghĩa là vở ghi.', example: { jp: 'これは日本語のノートです。', vi: 'Đây là vở tiếng Nhật.' }, kanji: [] },
        { id: 'm2_u2_3', jp: '手帳', reading: 'てちょう', meaning: 'Sổ lịch trình', category: 'Đồ vật', usage: 'Sổ nhỏ ghi kế hoạch, lịch hẹn — phổ biến ở Nhật.', example: { jp: '手帳に名前を書きます。', vi: 'Ghi tên vào sổ lịch trình.' }, kanji: ['手', '帳'] },
        { id: 'm2_u2_4', jp: '名刺', reading: 'めいし', meaning: 'Danh thiếp', category: 'Đồ vật', usage: 'Danh thiếp trao đổi khi gặp mặt công việc.', example: { jp: 'これが私の名刺です。', vi: 'Đây là danh thiếp của tôi.' }, kanji: ['名', '刺'] },
        { id: 'm2_u2_5', jp: '鉛筆', reading: 'えんぴつ', meaning: 'Bút chì', category: 'Đồ vật', usage: 'Bút chì gỗ; bút mực là ペン.', example: { jp: 'これは鉛筆です。', vi: 'Đây là bút chì.' }, kanji: ['鉛', '筆'] },
        { id: 'm2_u2_6', jp: 'ボールペン', reading: 'bo-rupen', meaning: 'Bút bi', category: 'Đồ vật', usage: 'Từ mượn "ballpoint pen".', example: { jp: 'ボールペンで書きます。', vi: 'Viết bằng bút bi.' }, kanji: [] }
      ]},
      { id: 'm2_u3', title: 'Nhóm 3', items: [
        { id: 'm2_u3_1', jp: '鍵', reading: 'かぎ', meaning: 'Chìa khóa', category: 'Đồ vật', usage: 'Chìa khóa cửa, xe. Mở khóa: 鍵を開けます.', example: { jp: '鍵はあそこです。', vi: 'Chìa khóa ở kia.' }, kanji: ['鍵'] },
        { id: 'm2_u3_2', jp: '時計', reading: 'とけい', meaning: 'Đồng hồ', category: 'Đồ vật', usage: 'Đồng hồ nói chung (đeo tay hoặc để bàn).', example: { jp: 'それは新しい時計です。', vi: 'Đó là đồng hồ mới.' }, kanji: ['時', '計'] },
        { id: 'm2_u3_3', jp: '傘', reading: 'かさ', meaning: 'Ô, dù', category: 'Đồ vật', usage: 'Ô giấy truyền thống cũng là 傘, phân biệt bằng ngữ cảnh.', example: { jp: 'これは私の傘です。', vi: 'Đây là ô của tôi.' }, kanji: ['傘'] },
        { id: 'm2_u3_4', jp: 'かばん', reading: 'kaban', meaning: 'Cặp sách, túi xách', category: 'Đồ vật', usage: 'Túi/cặp đựng đồ. Thường viết hiragana.', example: { jp: 'このかばんは私のです。', vi: 'Chiếc cặp này là của tôi.' }, kanji: [] },
        { id: 'm2_u3_5', jp: 'テレビ', reading: 'terebi', meaning: 'Tivi', category: 'Đồ vật', usage: 'Từ mượn "television".', example: { jp: 'テレビはあそこです。', vi: 'Tivi ở kia.' }, kanji: [] },
        { id: 'm2_u3_6', jp: 'カメラ', reading: 'kamera', meaning: 'Máy ảnh', category: 'Đồ vật', usage: 'Từ mượn "camera".', example: { jp: 'それは私のカメラです。', vi: 'Đó là máy ảnh của tôi.' }, kanji: [] }
      ]},
      { id: 'm2_u4', title: 'Nhóm 4', items: [
        { id: 'm2_u4_1', jp: 'コンピューター', reading: 'konpyu-ta-', meaning: 'Máy tính', category: 'Đồ vật', usage: 'Từ mượn "computer" — máy tính cá nhân.', example: { jp: 'コンピューターはここです。', vi: 'Máy tính ở đây.' }, kanji: [] },
        { id: 'm2_u4_2', jp: '自動車', reading: 'じどうしゃ', meaning: 'Xe ô tô', category: 'Đồ vật', usage: 'Từ chính thức chỉ ô tô; hội thoại thường dùng 車.', example: { jp: 'これは日本の自動車です。', vi: 'Đây là ô tô Nhật Bản.' }, kanji: ['自', '動', '車'] },
        { id: 'm2_u4_3', jp: '机', reading: 'つくえ', meaning: 'Bàn', category: 'Đồ vật', usage: 'Bàn làm việc/học. Bàn ăn là テーブル.', example: { jp: '机の上に本があります。', vi: 'Có sách trên bàn.' }, kanji: ['机'] },
        { id: 'm2_u4_4', jp: '椅子', reading: 'いす', meaning: 'Ghế', category: 'Đồ vật', usage: 'Ghế ngồi có lưng; ghế không lưng là ベンチ/腰かけ.', example: { jp: '椅子はここです。', vi: 'Ghế ở đây.' }, kanji: ['椅', '子'] },
        { id: 'm2_u4_5', jp: 'そう', reading: 'sou', meaning: 'Đúng vậy', category: 'Giao tiếp', usage: 'Đồng ý với người khác. Thể lịch sự: そうです.', example: { jp: '—これは鉛筆ですか。—そうです。', vi: '—Đây là bút chì à? —Đúng vậy.' }, kanji: [] },
        { id: 'm2_u4_6', jp: '違います', reading: 'ちがいます', meaning: 'Không phải, nhầm rồi', category: 'Giao tiếp', usage: 'Phủ định, lịch sự hơn "sai rồi". Văn nói thường rút thành 違う.', example: { jp: 'それは私の傘ではありません。違います。', vi: 'Đó không phải ô của tôi. Nhầm rồi.' }, kanji: ['違'] },
        { id: 'm2_u4_7', jp: 'ほんのきもちです', reading: 'hon no kimochi desu', meaning: 'Chút lòng thành', category: 'Giao tiếp', usage: 'Câu khiêm nhường khi tặng quà nhỏ. Trang trọng, dùng khi đưa quà.', example: { jp: 'つまらないものですが、ほんのきもちです。', vi: 'Món nhỏ thôi, chút lòng thành của tôi.' }, kanji: [] }
      ]}
    ]
  },
  {
    id: 'm3', title: 'Bài 3: Nơi chốn & Địa điểm',
    units: [
      { id: 'm3_u1', title: 'Nhóm 1', items: [
        { id: 'm3_u1_1', jp: 'ここ', reading: 'koko', meaning: 'Ở đây', category: 'Địa điểm', usage: 'Nơi gần người nói. Kèm danh từ thì dùng この (この学校).', example: { jp: 'ここは教室です。', vi: 'Đây là phòng học.' }, kanji: [] },
        { id: 'm3_u1_2', jp: 'そこ', reading: 'soko', meaning: 'Ở đó', category: 'Địa điểm', usage: 'Nơi gần người nghe.', example: { jp: 'トイレはそこです。', vi: 'Nhà vệ sinh ở đó.' }, kanji: [] },
        { id: 'm3_u1_3', jp: 'あそこ', reading: 'asoko', meaning: 'Ở kia', category: 'Địa điểm', usage: 'Nơi xa cả hai người.', example: { jp: '銀行はあそこです。', vi: 'Ngân hàng ở kia.' }, kanji: [] },
        { id: 'm3_u1_4', jp: 'どこ', reading: 'doko', meaning: 'Ở đâu', category: 'Địa điểm', usage: 'Từ để hỏi địa điểm. Lịch sự hơn: どちら.', example: { jp: '食堂はどこですか。', vi: 'Nhà ăn ở đâu?' }, kanji: [] },
        { id: 'm3_u1_5', jp: 'こちら', reading: 'kochira', meaning: 'Phía này, đây', category: 'Địa điểm', usage: 'Lịch sự hơn ここ; cũng dùng giới thiệu người: こちらは...', example: { jp: 'こちらは事務所です。', vi: 'Phía này là văn phòng.' }, kanji: [] },
        { id: 'm3_u1_6', jp: 'そちら', reading: 'sochira', meaning: 'Phía đó', category: 'Địa điểm', usage: 'Lịch sự hơn そこ.', example: { jp: '受付はそちらです。', vi: 'Quầy tiếp tân phía đó.' }, kanji: [] }
      ]},
      { id: 'm3_u2', title: 'Nhóm 2', items: [
        { id: 'm3_u2_1', jp: 'あちら', reading: 'achira', meaning: 'Phía kia', category: 'Địa điểm', usage: 'Lịch sự hơn あそこ.', example: { jp: '図書館はあちらです。', vi: 'Thư viện phía kia.' }, kanji: [] },
        { id: 'm3_u2_2', jp: 'どちら', reading: 'dochira', meaning: 'Phía nào, đâu', category: 'Địa điểm', usage: 'Lịch sự hơn どこ; cũng dùng hỏi lựa chọn giữa hai thứ.', example: { jp: 'トイレはどちらですか。', vi: 'Nhà vệ sinh ở phía nào ạ?' }, kanji: [] },
        { id: 'm3_u2_3', jp: '教室', reading: 'きょうしつ', meaning: 'Phòng học', category: 'Địa điểm', usage: 'Phòng học trong trường.', example: { jp: '教室はあそこです。', vi: 'Phòng học ở kia.' }, kanji: ['教', '室'] },
        { id: 'm3_u2_4', jp: '食堂', reading: 'しょくどう', meaning: 'Nhà ăn', category: 'Địa điểm', usage: 'Căn tin trong trường/công ty; nhà hàng ngoài là レストラン.', example: { jp: '食堂はどこですか。', vi: 'Nhà ăn ở đâu?' }, kanji: ['食', '堂'] },
        { id: 'm3_u2_5', jp: '事務所', reading: 'じむしょ', meaning: 'Văn phòng', category: 'Địa điểm', usage: 'Nơi làm việc hành chính.', example: { jp: '事務所は2階です。', vi: 'Văn phòng ở tầng 2.' }, kanji: ['事', '務', '所'] },
        { id: 'm3_u2_6', jp: '会議室', reading: 'かいぎしつ', meaning: 'Phòng họp', category: 'Địa điểm', usage: 'Phòng tổ chức họp.', example: { jp: '会議室はそちらです。', vi: 'Phòng họp phía đó.' }, kanji: ['会', '議', '室'] }
      ]},
      { id: 'm3_u3', title: 'Nhóm 3', items: [
        { id: 'm3_u3_1', jp: '受付', reading: 'うけつけ', meaning: 'Quầy tiếp tân', category: 'Địa điểm', usage: 'Quầy đón khách, làm thủ tục.', example: { jp: '受付は1階です。', vi: 'Quầy tiếp tân ở tầng 1.' }, kanji: ['受', '付'] },
        { id: 'm3_u3_2', jp: 'ロビー', reading: 'robi-', meaning: 'Sảnh lớn', category: 'Địa điểm', usage: 'Từ mượn "lobby" — sảnh khách sạn, tòa nhà.', example: { jp: 'ロビーで待ちます。', vi: 'Tôi đợi ở sảnh.' }, kanji: [] },
        { id: 'm3_u3_3', jp: '部屋', reading: 'へや', meaning: 'Phòng', category: 'Địa điểm', usage: 'Phòng nói chung (phòng ngủ, phòng khách...).', example: { jp: '部屋に椅子があります。', vi: 'Trong phòng có ghế.' }, kanji: ['部', '屋'] },
        { id: 'm3_u3_4', jp: 'トイレ', reading: 'toire', meaning: 'Nhà vệ sinh', category: 'Địa điểm', usage: 'Từ mượn "toilet" — dùng phổ biến hàng ngày.', example: { jp: 'トイレはどこですか。', vi: 'Nhà vệ sinh ở đâu?' }, kanji: [] },
        { id: 'm3_u3_5', jp: 'デパート', reading: 'depa-to', meaning: 'Cửa hàng bách hóa', category: 'Địa điểm', usage: 'Từ mượn "department store".', example: { jp: 'デパートはあそこです。', vi: 'Bách hóa ở kia.' }, kanji: [] },
        { id: 'm3_u3_6', jp: '銀行', reading: 'ぎんこう', meaning: 'Ngân hàng', category: 'Địa điểm', usage: 'Ngân hàng; để ý đọc âm kéo dài ぎんこう.', example: { jp: '銀行はどこですか。', vi: 'Ngân hàng ở đâu?' }, kanji: ['銀', '行'] }
      ]},
      { id: 'm3_u4', title: 'Nhóm 4', items: [
        { id: 'm3_u4_1', jp: '郵便局', reading: 'ゆうびんきょく', meaning: 'Bưu điện', category: 'Địa điểm', usage: 'Bưu điện, gửi thư — bưu kiện.', example: { jp: '郵便局はあそこです。', vi: 'Bưu điện ở kia.' }, kanji: ['郵', '便', '局'] },
        { id: 'm3_u4_2', jp: '図書館', reading: 'としょかん', meaning: 'Thư viện', category: 'Địa điểm', usage: 'Thư viện — để ý 館 đọc かん.', example: { jp: '図書館で本を読みます。', vi: 'Đọc sách ở thư viện.' }, kanji: ['図', '書', '館'] },
        { id: 'm3_u4_3', jp: '美術館', reading: 'びじゅつかん', meaning: 'Bảo tàng mỹ thuật', category: 'Địa điểm', usage: 'Bảo tàng nghệ thuật, triển lãm tranh.', example: { jp: '美術館へ行きます。', vi: 'Tôi đi bảo tàng mỹ thuật.' }, kanji: ['美', '術', '館'] },
        { id: 'm3_u4_4', jp: 'イタリア', reading: 'itaria', meaning: 'Ý', category: 'Quốc gia', usage: 'Tên nước, viết katakana.', example: { jp: '私はイタリアから来ました。', vi: 'Tôi đến từ nước Ý.' }, kanji: [] },
        { id: 'm3_u4_5', jp: 'スイス', reading: 'suisu', meaning: 'Thụy Sĩ', category: 'Quốc gia', usage: 'Tên nước, viết katakana.', example: { jp: '彼はスイスから来ました。', vi: 'Anh ấy đến từ Thụy Sĩ.' }, kanji: [] },
        { id: 'm3_u4_6', jp: 'ドイツ', reading: 'doitsu', meaning: 'Đức', category: 'Quốc gia', usage: 'Tên nước, viết katakana.', example: { jp: 'ドイツの自動車です。', vi: 'Là ô tô của Đức.' }, kanji: [] }
      ]}
    ]
  },
  {
    id: 'm4', title: 'Bài 4: Thời gian & Thời khóa biểu',
    units: [
      { id: 'm4_u1', title: 'Nhóm 1', items: [
        { id: 'm4_u1_1', jp: '起きます', reading: 'おきます', meaning: 'Thức dậy', category: 'Động từ', usage: 'Động từ nhóm 2, thể lịch sự ます. Thức dậy buổi sáng.', example: { jp: '朝6時に起きます。', vi: 'Buổi sáng tôi thức dậy lúc 6 giờ.' }, kanji: ['起'] },
        { id: 'm4_u1_2', jp: '寝ます', reading: 'ねます', meaning: 'Ngủ', category: 'Động từ', usage: 'Đi ngủ, nằm nghỉ. Ngủ trưa cũng dùng được.', example: { jp: '夜11時に寝ます。', vi: 'Ban đêm tôi ngủ lúc 11 giờ.' }, kanji: ['寝'] },
        { id: 'm4_u1_3', jp: '働きます', reading: 'はたらきます', meaning: 'Làm việc', category: 'Động từ', usage: 'Làm việc (vì tiền, công việc thể lực/văn phòng). Học tập thì dùng 勉強します.', example: { jp: '銀行で働きます。', vi: 'Tôi làm việc ở ngân hàng.' }, kanji: ['働'] },
        { id: 'm4_u1_4', jp: '休みます', reading: 'やすみます', meaning: 'Nghỉ, nghỉ ngơi', category: 'Động từ', usage: 'Nghỉ làm, nghỉ học, nghỉ ngơi.', example: { jp: '日曜日に休みます。', vi: 'Chủ nhật tôi nghỉ.' }, kanji: ['休'] },
        { id: 'm4_u1_5', jp: '勉強します', reading: 'べんきょうします', meaning: 'Học', category: 'Động từ', usage: 'Học, tự học. Danh từ 勉強 + します tạo động từ.', example: { jp: '毎日日本語を勉強します。', vi: 'Mỗi ngày tôi học tiếng Nhật.' }, kanji: ['勉', '強'] },
        { id: 'm4_u1_6', jp: '終わります', reading: 'おわります', meaning: 'Kết thúc', category: 'Động từ', usage: 'Việc gì đó kết thúc (buổi học, họp, làm).', example: { jp: '授業は4時に終わります。', vi: 'Buổi học kết thúc lúc 4 giờ.' }, kanji: ['終'] }
      ]},
      { id: 'm4_u2', title: 'Nhóm 2', items: [
        { id: 'm4_u2_1', jp: '朝', reading: 'あさ', meaning: 'Buổi sáng', category: 'Thời gian', usage: 'Khoảng sáng trong ngày. Sáng hôm nay: 今朝.', example: { jp: '朝、新聞を読みます。', vi: 'Buổi sáng tôi đọc báo.' }, kanji: ['朝'] },
        { id: 'm4_u2_2', jp: '昼', reading: 'ひる', meaning: 'Buổi trưa', category: 'Thời gian', usage: 'Buổi trưa; ăn trưa là 昼ご飯.', example: { jp: '昼に休みます。', vi: 'Buổi trưa tôi nghỉ.' }, kanji: ['昼'] },
        { id: 'm4_u2_3', jp: '晩', reading: 'ばん', meaning: 'Buổi tối', category: 'Thời gian', usage: 'Khoảng tối trong ngày, thường gặp 晩ご飯.', example: { jp: '晩、テレビを見ます。', vi: 'Buổi tối tôi xem tivi.' }, kanji: ['晩'] },
        { id: 'm4_u2_4', jp: '夜', reading: 'よる', meaning: 'Ban đêm', category: 'Thời gian', usage: 'Khoảng thời gian đêm, dài hơn 晩.', example: { jp: '夜、勉強します。', vi: 'Ban đêm tôi học.' }, kanji: ['夜'] },
        { id: 'm4_u2_5', jp: '毎朝', reading: 'まいあさ', meaning: 'Mỗi sáng', category: 'Thời gian', usage: '毎 + thời gian = đều đặn hàng ngày.', example: { jp: '毎朝6時に起きます。', vi: 'Mỗi sáng tôi dậy lúc 6 giờ.' }, kanji: ['毎', '朝'] },
        { id: 'm4_u2_6', jp: '毎晩', reading: 'まいばん', meaning: 'Mỗi tối', category: 'Thời gian', usage: 'Tối nào cũng làm việc gì đó.', example: { jp: '毎晩、本を読みます。', vi: 'Mỗi tối tôi đọc sách.' }, kanji: ['毎', '晩'] }
      ]},
      { id: 'm4_u3', title: 'Nhóm 3', items: [
        { id: 'm4_u3_1', jp: '毎日', reading: 'まいにち', meaning: 'Mỗi ngày', category: 'Thời gian', usage: 'Ngày nào cũng làm.', example: { jp: '毎日働きます。', vi: 'Mỗi ngày tôi làm việc.' }, kanji: ['毎', '日'] },
        { id: 'm4_u3_2', jp: '月曜日', reading: 'げつようび', meaning: 'Thứ hai', category: 'Thời gian', usage: 'Thứ trong tuần — 月 = mặt trăng.', example: { jp: '月曜日に働きます。', vi: 'Thứ hai tôi làm việc.' }, kanji: ['月', '曜', '日'] },
        { id: 'm4_u3_3', jp: '火曜日', reading: 'かようび', meaning: 'Thứ ba', category: 'Thời gian', usage: '火 = lửa — thứ ba.', example: { jp: '火曜日に会議があります。', vi: 'Thứ ba có cuộc họp.' }, kanji: ['火', '曜', '日'] },
        { id: 'm4_u3_4', jp: '水曜日', reading: 'すいようび', meaning: 'Thứ tư', category: 'Thời gian', usage: '水 = nước — thứ tư.', example: { jp: '水曜日に休みます。', vi: 'Thứ tư tôi nghỉ.' }, kanji: ['水', '曜', '日'] },
        { id: 'm4_u3_5', jp: '木曜日', reading: 'もくようび', meaning: 'Thứ năm', category: 'Thời gian', usage: '木 = gỗ — thứ năm.', example: { jp: '木曜日に日本語を勉強します。', vi: 'Thứ năm tôi học tiếng Nhật.' }, kanji: ['木', '曜', '日'] },
        { id: 'm4_u3_6', jp: '金曜日', reading: 'きんようび', meaning: 'Thứ sáu', category: 'Thời gian', usage: '金 = vàng (kim loại) — thứ sáu.', example: { jp: '金曜日は忙しいです。', vi: 'Thứ sáu bận rộn.' }, kanji: ['金', '曜', '日'] }
      ]},
      { id: 'm4_u4', title: 'Nhóm 4', items: [
        { id: 'm4_u4_1', jp: '土曜日', reading: 'どようび', meaning: 'Thứ bảy', category: 'Thời gian', usage: '土 = đất — thứ bảy.', example: { jp: '土曜日に映画を見ます。', vi: 'Thứ bảy tôi xem phim.' }, kanji: ['土', '曜', '日'] },
        { id: 'm4_u4_2', jp: '日曜日', reading: 'にちようび', meaning: 'Chủ nhật', category: 'Thời gian', usage: '日 = mặt trời — chủ nhật.', example: { jp: '日曜日に休みます。', vi: 'Chủ nhật tôi nghỉ.' }, kanji: ['日', '曜'] },
        { id: 'm4_u4_3', jp: '今日', reading: 'きょう', meaning: 'Hôm nay', category: 'Thời gian', usage: 'Đọc bất quy tắc きょう — ghi nhớ.', example: { jp: '今日は日曜日です。', vi: 'Hôm nay là chủ nhật.' }, kanji: ['今', '日'] },
        { id: 'm4_u4_4', jp: '明日', reading: 'あした', meaning: 'Ngày mai', category: 'Thời gian', usage: 'Đọc bất quy tắc あした; 明日 đọc みょうにち trong trang trọng.', example: { jp: '明日、働きます。', vi: 'Ngày mai tôi làm việc.' }, kanji: ['明', '日'] },
        { id: 'm4_u4_5', jp: '昨日', reading: 'きのう', meaning: 'Hôm qua', category: 'Thời gian', usage: 'Đọc bất quy tắc きのう.', example: { jp: '昨日は休みました。', vi: 'Hôm qua tôi đã nghỉ.' }, kanji: ['昨', '日'] },
        { id: 'm4_u4_6', jp: '何時', reading: 'なんじ', meaning: 'Mấy giờ', category: 'Câu hỏi', usage: '何 + 时: hỏi giờ. Hỏi phút: 何分.', example: { jp: '今、何時ですか。', vi: 'Bây giờ là mấy giờ?' }, kanji: ['何', '時'] },
        { id: 'm4_u4_7', jp: '何分', reading: 'なんぷん', meaning: 'Mấy phút', category: 'Câu hỏi', usage: 'Hỏi số phút; 分 đọc ぷん/ふん tùy số.', example: { jp: '何分ぐらいかかりますか。', vi: 'Mất khoảng mấy phút ạ?' }, kanji: ['何', '分'] }
      ]}
    ]
  },
  {
    id: 'm5', title: 'Bài 5: Di chuyển & Đi lại',
    units: [
      { id: 'm5_u1', title: 'Nhóm 1', items: [
        { id: 'm5_u1_1', jp: '行きます', reading: 'いきます', meaning: 'Đi', category: 'Động từ', usage: 'Đi đến nơi nào: nơi + へ/に 行きます.', example: { jp: '学校へ行きます。', vi: 'Tôi đi trường.' }, kanji: ['行'] },
        { id: 'm5_u1_2', jp: '来ます', reading: 'きます', meaning: 'Đến', category: 'Động từ', usage: 'Đến (về phía người nói). Đọc きます, không phải きますのように来る.', example: { jp: '明日、学校に来ます。', vi: 'Ngày mai tôi đến trường.' }, kanji: ['来'] },
        { id: 'm5_u1_3', jp: '帰ります', reading: 'かえります', meaning: 'Về', category: 'Động từ', usage: 'Về (nhà, nước). Về nhà: 家に帰ります.', example: { jp: '6時に家へ帰ります。', vi: '6 giờ tôi về nhà.' }, kanji: ['帰'] },
        { id: 'm5_u1_4', jp: '学校', reading: 'がっこう', meaning: 'Trường học', category: 'Địa điểm', usage: 'Trường học nói chung (âm ngắt がっ).', example: { jp: '学校はあそこです。', vi: 'Trường học ở kia.' }, kanji: ['学', '校'] },
        { id: 'm5_u1_5', jp: 'スーパー', reading: 'su-pa-', meaning: 'Siêu thị', category: 'Địa điểm', usage: 'Viết tắt của スーパーマーケット.', example: { jp: 'スーパーで買い物します。', vi: 'Tôi đi siêu thị mua sắm.' }, kanji: [] },
        { id: 'm5_u1_6', jp: '駅', reading: 'えき', meaning: 'Nhà ga', category: 'Địa điểm', usage: 'Ga tàu/tàu điện.', example: { jp: '駅はどこですか。', vi: 'Nhà ga ở đâu?' }, kanji: ['駅'] },
        { id: 'm5_u1_7', jp: '飛行機', reading: 'ひこうき', meaning: 'Máy bay', category: 'Phương tiện', usage: 'Máy bay — bay đi đâu đó.', example: { jp: '飛行機で行きます。', vi: 'Tôi đi bằng máy bay.' }, kanji: ['飛', '行', '機'] }
      ]},
      { id: 'm5_u2', title: 'Nhóm 2', items: [
        { id: 'm5_u2_1', jp: '船', reading: 'ふね', meaning: 'Tàu thủy', category: 'Phương tiện', usage: 'Tàu, thuyền nói chung.', example: { jp: '船で行きます。', vi: 'Tôi đi bằng tàu thủy.' }, kanji: ['船'] },
        { id: 'm5_u2_2', jp: '電車', reading: 'でんしゃ', meaning: 'Tàu điện', category: 'Phương tiện', usage: 'Tàu chạy điện trên mặt đất; 地下鉄 đi ngầm.', example: { jp: '電車で学校へ行きます。', vi: 'Tôi đi trường bằng tàu điện.' }, kanji: ['電', '車'] },
        { id: 'm5_u2_3', jp: '地下鉄', reading: 'ちかてつ', meaning: 'Tàu điện ngầm', category: 'Phương tiện', usage: 'Tàu điện dưới lòng đất — 地下 = ngầm.', example: { jp: '地下鉄で駅へ行きます。', vi: 'Tôi đi ga bằng tàu điện ngầm.' }, kanji: ['地', '下', '鉄'] },
        { id: 'm5_u2_4', jp: '新幹線', reading: 'しんかんせん', meaning: 'Tàu siêu tốc', category: 'Phương tiện', usage: 'Tàu cao tốc của Nhật (Shinkansen).', example: { jp: '新幹線で京都へ行きます。', vi: 'Tôi đi Kyoto bằng tàu siêu tốc.' }, kanji: ['新', '幹', '線'] },
        { id: 'm5_u2_5', jp: 'バス', reading: 'basu', meaning: 'Xe buýt', category: 'Phương tiện', usage: 'Từ mượn "bus".', example: { jp: 'バスで行きます。', vi: 'Tôi đi bằng xe buýt.' }, kanji: [] },
        { id: 'm5_u2_6', jp: 'タクシー', reading: 'takushi-', meaning: 'Taxi', category: 'Phương tiện', usage: 'Từ mượn "taxi".', example: { jp: 'タクシーで帰ります。', vi: 'Tôi về bằng taxi.' }, kanji: [] }
      ]},
      { id: 'm5_u3', title: 'Nhóm 3', items: [
        { id: 'm5_u3_1', jp: '自転車', reading: 'じてんしゃ', meaning: 'Xe đạp', category: 'Phương tiện', usage: 'Xe 2 bánh đạp — 自転 = tự quay.', example: { jp: '自転車で行きます。', vi: 'Tôi đi bằng xe đạp.' }, kanji: ['自', '転', '車'] },
        { id: 'm5_u3_2', jp: '歩いて', reading: 'あるいて', meaning: 'Đi bộ', category: 'Cách thức', usage: 'Dạng て của 歩きます; đi bộ đến: 歩いて 行きます.', example: { jp: '駅まで歩いて行きます。', vi: 'Tôi đi bộ đến nhà ga.' }, kanji: ['歩'] },
        { id: 'm5_u3_3', jp: '人', reading: 'ひと', meaning: 'Người', category: 'Danh từ', usage: 'Người nói chung. Người khác lịch sự: 人の方.', example: { jp: 'あの人は友達です。', vi: 'Người kia là bạn tôi.' }, kanji: ['人'] },
        { id: 'm5_u3_4', jp: '友達', reading: 'ともだち', meaning: 'Bạn bè', category: 'Danh từ', usage: 'Bạn, bạn bè — một hay nhiều người đều dùng được.', example: { jp: '友達と行きます。', vi: 'Tôi đi cùng bạn.' }, kanji: ['友', '達'] },
        { id: 'm5_u3_5', jp: '彼', reading: 'かれ', meaning: 'Anh ấy, bạn trai', category: 'Đại từ', usage: 'Chỉ nam. Bạn gái là 彼女.', example: { jp: '彼は会社員です。', vi: 'Anh ấy là nhân viên công ty.' }, kanji: ['彼'] },
        { id: 'm5_u3_6', jp: '彼女', reading: 'かのじょ', meaning: 'Cô ấy, bạn gái', category: 'Đại từ', usage: 'Chỉ nữ; cũng nghĩa "bạn gái" tùy ngữ cảnh.', example: { jp: '彼女は学生です。', vi: 'Cô ấy là sinh viên.' }, kanji: ['彼', '女'] },
        { id: 'm5_u3_7', jp: '家族', reading: 'かぞく', meaning: 'Gia đình', category: 'Danh từ', usage: 'Thành viên gia đình. Nhà ở là 家 (いえ).', example: { jp: '家族と住んでいます。', vi: 'Tôi sống cùng gia đình.' }, kanji: ['家', '族'] }
      ]},
      { id: 'm5_u4', title: 'Nhóm 4', items: [
        { id: 'm5_u4_1', jp: '一人で', reading: 'ひとりで', meaning: 'Một mình', category: 'Cách thức', usage: 'Tự một mình làm gì đó. 一 đọc ひとり ở đây.', example: { jp: '一人で行きます。', vi: 'Tôi đi một mình.' }, kanji: ['一', '人'] },
        { id: 'm5_u4_2', jp: '先週', reading: 'せんしゅう', meaning: 'Tuần trước', category: 'Thời gian', usage: 'Tuần đã qua. Tuần này: 今週.', example: { jp: '先週、京都へ行きました。', vi: 'Tuần trước tôi đã đi Kyoto.' }, kanji: ['先', '週'] },
        { id: 'm5_u4_3', jp: '今週', reading: 'こんしゅう', meaning: 'Tuần này', category: 'Thời gian', usage: 'Tuần hiện tại.', example: { jp: '今週は忙しいです。', vi: 'Tuần này bận rộn.' }, kanji: ['今', '週'] },
        { id: 'm5_u4_4', jp: '来週', reading: 'らいしゅう', meaning: 'Tuần sau', category: 'Thời gian', usage: 'Tuần kế tiếp. 来 cũng gặp ở 来ます/来ました.', example: { jp: '来週、休みます。', vi: 'Tuần sau tôi nghỉ.' }, kanji: ['来', '週'] },
        { id: 'm5_u4_5', jp: '先月', reading: 'せんげつ', meaning: 'Tháng trước', category: 'Thời gian', usage: 'Tháng đã qua; tháng này 今月.', example: { jp: '先月、日本へ行きました。', vi: 'Tháng trước tôi đã đi Nhật.' }, kanji: ['先', '月'] },
        { id: 'm5_u4_6', jp: '来月', reading: 'らいげつ', meaning: 'Tháng sau', category: 'Thời gian', usage: 'Tháng kế tiếp.', example: { jp: '来月、帰ります。', vi: 'Tháng sau tôi về.' }, kanji: ['来', '月'] }
      ]}
    ]
  },
  {
    id: 'm6', title: 'Bài 6: Ăn uống & Hoạt động thường ngày',
    units: [
      { id: 'm6_u1', title: 'Nhóm 1', items: [
        { id: 'm6_u1_1', jp: '食べます', reading: 'たべます', meaning: 'Ăn', category: 'Động từ', usage: 'Động từ nhóm 2. Ăn thứ gì: thứ + を 食べます.', example: { jp: '朝ご飯を食べます。', vi: 'Tôi ăn sáng.' }, kanji: ['食'] },
        { id: 'm6_u1_2', jp: '飲みます', reading: 'のみます', meaning: 'Uống', category: 'Động từ', usage: 'Uống nước, trà, thuốc đều dùng 飲みます.', example: { jp: 'コーヒーを飲みます。', vi: 'Tôi uống cà phê.' }, kanji: ['飲'] },
        { id: 'm6_u1_3', jp: '吸います', reading: 'すいます', meaning: 'Hút', category: 'Động từ', usage: 'Hút (thuốc lá), hít (không khí).', example: { jp: 'タバコを吸います。', vi: 'Tôi hút thuốc lá.' }, kanji: ['吸'] },
        { id: 'm6_u1_4', jp: '見ます', reading: 'みます', meaning: 'Xem, nhìn', category: 'Động từ', usage: 'Xem phim, tivi; nhìn cái gì.', example: { jp: 'テレビを見ます。', vi: 'Tôi xem tivi.' }, kanji: ['見'] },
        { id: 'm6_u1_5', jp: '聞きます', reading: 'ききます', meaning: 'Nghe', category: 'Động từ', usage: 'Nghe âm thanh, nhạc; hỏi (聞く = hỏi khi nói chuyện).', example: { jp: '音楽を聞きます。', vi: 'Tôi nghe nhạc.' }, kanji: ['聞'] },
        { id: 'm6_u1_6', jp: '読みます', reading: 'よみます', meaning: 'Đọc', category: 'Động từ', usage: 'Đọc sách, báo, tạp chí.', example: { jp: '新聞を読みます。', vi: 'Tôi đọc báo.' }, kanji: ['読'] },
        { id: 'm6_u1_7', jp: '書きます', reading: 'かきます', meaning: 'Viết', category: 'Động từ', usage: 'Viết chữ, thư. Toán thì よく書きます với kanji 計算.', example: { jp: '手帳に名前を書きます。', vi: 'Viết tên vào sổ.' }, kanji: ['書'] }
      ]},
      { id: 'm6_u2', title: 'Nhóm 2', items: [
        { id: 'm6_u2_1', jp: '買います', reading: 'かいます', meaning: 'Mua', category: 'Động từ', usage: 'Mua thứ gì: thứ + を 買います.', example: { jp: 'スーパーでパンを買います。', vi: 'Tôi mua bánh mì ở siêu thị.' }, kanji: ['買'] },
        { id: 'm6_u2_2', jp: '撮ります', reading: 'とります', meaning: 'Chụp, lấy', category: 'Động từ', usage: 'Chụp ảnh/Quay phim: 写真を撮ります.', example: { jp: '写真を撮ります。', vi: 'Tôi chụp ảnh.' }, kanji: ['撮'] },
        { id: 'm6_u2_3', jp: 'ご飯', reading: 'ごはん', meaning: 'Cơm, bữa ăn', category: 'Đồ ăn', usage: 'Cơm trắng; ăn sáng/trưa/tối: 朝/昼/晩ご飯.', example: { jp: 'ご飯を食べます。', vi: 'Tôi ăn cơm.' }, kanji: ['飯'] },
        { id: 'm6_u2_4', jp: 'パン', reading: 'pan', meaning: 'Bánh mì', category: 'Đồ ăn', usage: 'Từ mượn từ tiếng Bồ Đào Nha "pão".', example: { jp: '朝、パンを食べます。', vi: 'Buổi sáng tôi ăn bánh mì.' }, kanji: [] },
        { id: 'm6_u2_5', jp: '卵', reading: 'たまご', meaning: 'Trứng', category: 'Đồ ăn', usage: 'Trứng gà nói chung trong ăn uống.', example: { jp: '卵を食べます。', vi: 'Tôi ăn trứng.' }, kanji: ['卵'] },
        { id: 'm6_u2_6', jp: '肉', reading: 'にく', meaning: 'Thịt', category: 'Đồ ăn', usage: 'Thịt nói chung; thịt bò 牛肉, thịt lợn 豚肉.', example: { jp: '肉を食べます。', vi: 'Tôi ăn thịt.' }, kanji: ['肉'] }
      ]},
      { id: 'm6_u3', title: 'Nhóm 3', items: [
        { id: 'm6_u3_1', jp: '魚', reading: 'さかな', meaning: 'Cá', category: 'Đồ ăn', usage: 'Cá để ăn; cá sống trong hồ là 魚 đọc うお.', example: { jp: '魚を食べます。', vi: 'Tôi ăn cá.' }, kanji: ['魚'] },
        { id: 'm6_u3_2', jp: '野菜', reading: 'やさい', meaning: 'Rau', category: 'Đồ ăn', usage: 'Rau củ nói chung.', example: { jp: '野菜を食べます。', vi: 'Tôi ăn rau.' }, kanji: ['野', '菜'] },
        { id: 'm6_u3_3', jp: '水', reading: 'みず', meaning: 'Nước', category: 'Đồ uống', usage: 'Nước lọc. Nước nóng là お湯.', example: { jp: '水を飲みます。', vi: 'Tôi uống nước.' }, kanji: ['水'] },
        { id: 'm6_u3_4', jp: 'お茶', reading: 'おちゃ', meaning: 'Trà', category: 'Đồ uống', usage: 'Trà xanh nói chung của Nhật; お là kính ngữ.', example: { jp: 'お茶を飲みます。', vi: 'Tôi uống trà.' }, kanji: ['茶'] },
        { id: 'm6_u3_5', jp: 'コーヒー', reading: 'ko-hi-', meaning: 'Cà phê', category: 'Đồ uống', usage: 'Từ mượn "coffee".', example: { jp: 'コーヒーを飲みます。', vi: 'Tôi uống cà phê.' }, kanji: [] },
        { id: 'm6_u3_6', jp: '牛乳', reading: 'ぎゅうにゅう', meaning: 'Sữa bò', category: 'Đồ uống', usage: 'Sữa tươi của bò; sữa hộp uống sẵn là ミルク.', example: { jp: '毎朝牛乳を飲みます。', vi: 'Mỗi sáng tôi uống sữa.' }, kanji: ['牛', '乳'] }
      ]},
      { id: 'm6_u4', title: 'Nhóm 4', items: [
        { id: 'm6_u4_1', jp: 'ジュース', reading: 'ju-su', meaning: 'Nước trái cây', category: 'Đồ uống', usage: 'Từ mượn "juice" — nước ép, nước ngọt.', example: { jp: 'ジュースを飲みます。', vi: 'Tôi uống nước trái cây.' }, kanji: [] },
        { id: 'm6_u4_2', jp: 'ビール', reading: 'bi-ru', meaning: 'Bia', category: 'Đồ uống', usage: 'Từ mượn "beer".', example: { jp: 'ビールを飲みます。', vi: 'Tôi uống bia.' }, kanji: [] },
        { id: 'm6_u4_3', jp: 'たばこ', reading: 'tabako', meaning: 'Thuốc lá', category: 'Đồ vật', usage: 'Thuốc lá; hút: たばこを吸います. Thường viết hiragana.', example: { jp: 'たばこを吸います。', vi: 'Tôi hút thuốc lá.' }, kanji: [] },
        { id: 'm6_u4_4', jp: 'レストラン', reading: 'resutoran', meaning: 'Nhà hàng', category: 'Địa điểm', usage: 'Từ mượn "restaurant" — nhà hàng ngoài; trong trường là 食堂.', example: { jp: 'レストランで食べます。', vi: 'Tôi ăn ở nhà hàng.' }, kanji: [] },
        { id: 'm6_u4_5', jp: 'うち', reading: 'uchi', meaning: 'Nhà', category: 'Địa điểm', usage: 'Nhà của mình — khiêm nhường. Nhà người khác là お宅.', example: { jp: 'うちでご飯を食べます。', vi: 'Tôi ăn cơm ở nhà.' }, kanji: [] },
        { id: 'm6_u4_6', jp: '一緒に', reading: 'いっしょに', meaning: 'Cùng nhau', category: 'Cách thức', usage: 'Làm gì đó cùng ai; 一 đọc いっ ở từ này.', example: { jp: '一緒に行きます。', vi: 'Tôi đi cùng (bạn).' }, kanji: ['一', '緒'] }
      ]}
    ]
  },
  {
    id: 'm7', title: 'Bài 7: Phương thức hành động & Tặng quà',
    units: [
      { id: 'm7_u1', title: 'Nhóm 1', items: [
        { id: 'm7_u1_1', jp: '切ります', reading: 'きります', meaning: 'Cắt', category: 'Động từ', usage: 'Cắt giấy, tóc; tắt (điện thoại): 電話を切ります.', example: { jp: '紙を切ります。', vi: 'Tôi cắt giấy.' }, kanji: ['切'] },
        { id: 'm7_u1_2', jp: '送ります', reading: 'おくります', meaning: 'Gửi', category: 'Động từ', usage: 'Gửi thư, email, hàng hóa.', example: { jp: 'メールを送ります。', vi: 'Tôi gửi email.' }, kanji: ['送'] },
        { id: 'm7_u1_3', jp: 'あげます', reading: 'agemasu', meaning: 'Tặng, cho', category: 'Động từ', usage: 'Tặng cho người khác (người nói cho đi). Nhận là もらいます.', example: { jp: '友達にプレゼントをあげます。', vi: 'Tôi tặng quà cho bạn.' }, kanji: [] },
        { id: 'm7_u1_4', jp: 'もらいます', reading: 'moraimasu', meaning: 'Nhận', category: 'Động từ', usage: 'Nhận từ ai: người + から もらいます.', example: { jp: '友達から本をもらいます。', vi: 'Tôi nhận sách từ bạn.' }, kanji: [] },
        { id: 'm7_u1_5', jp: '貸します', reading: 'かします', meaning: 'Cho mượn', category: 'Động từ', usage: 'Cho người khác mượn đồ. Mượn (của ai) là 借ります.', example: { jp: 'ペンを貸します。', vi: 'Tôi cho mượn bút.' }, kanji: ['貸'] }
      ]},
      { id: 'm7_u2', title: 'Nhóm 2', items: [
        { id: 'm7_u2_1', jp: '借ります', reading: 'かります', meaning: 'Mượn', category: 'Động từ', usage: 'Mượn đồ của ai: người + から 借ります.', example: { jp: '図書館で本を借ります。', vi: 'Tôi mượn sách ở thư viện.' }, kanji: ['借'] },
        { id: 'm7_u2_2', jp: '教えます', reading: 'おしえます', meaning: 'Chỉ, dạy', category: 'Động từ', usage: 'Dạy học; chỉ đường/thông tin.', example: { jp: '日本語を教えます。', vi: 'Tôi dạy tiếng Nhật.' }, kanji: ['教'] },
        { id: 'm7_u2_3', jp: '習います', reading: 'ならいます', meaning: 'Học từ ai đó', category: 'Động từ', usage: 'Học có người hướng dẫn (lớp học, thầy). Tự học là 勉強します.', example: { jp: '先生に日本語を習います。', vi: 'Tôi học tiếng Nhật từ thầy cô.' }, kanji: ['習'] },
        { id: 'm7_u2_4', jp: '手', reading: 'て', meaning: 'Tay', category: 'Bộ phận cơ thể', usage: 'Bàn tay; cụm 手を洗います = rửa tay.', example: { jp: '手を洗います。', vi: 'Tôi rửa tay.' }, kanji: ['手'] },
        { id: 'm7_u2_5', jp: '箸', reading: 'はし', meaning: 'Đũa', category: 'Công cụ', usage: 'Đũa ăn; chú ý 箸 (はし-đũa) và 橋 (はし-cầu) khác chữ.', example: { jp: '箸で食べます。', vi: 'Tôi ăn bằng đũa.' }, kanji: ['箸'] }
      ]},
      { id: 'm7_u3', title: 'Nhóm 3', items: [
        { id: 'm7_u3_1', jp: 'スプーン', reading: 'supu-n', meaning: 'Thìa', category: 'Công cụ', usage: 'Từ mượn "spoon".', example: { jp: 'スプーンで食べます。', vi: 'Tôi ăn bằng thìa.' }, kanji: [] },
        { id: 'm7_u3_2', jp: 'ナイフ', reading: 'naifu', meaning: 'Dao', category: 'Công cụ', usage: 'Từ mượn "knife".', example: { jp: 'ナイフで切ります。', vi: 'Tôi cắt bằng dao.' }, kanji: [] },
        { id: 'm7_u3_3', jp: 'フォーク', reading: 'fo-ku', meaning: 'Nĩa', category: 'Công cụ', usage: 'Từ mượn "fork".', example: { jp: 'フォークを使います。', vi: 'Tôi dùng nĩa.' }, kanji: [] },
        { id: 'm7_u3_4', jp: '日本語で', reading: 'にほんごで', meaning: 'Bằng tiếng Nhật', category: 'Phương thức', usage: 'Ngôn ngữ + で = dùng ngôn ngữ đó. 日本 = Nhật Bản.', example: { jp: '日本語で書きます。', vi: 'Tôi viết bằng tiếng Nhật.' }, kanji: ['日', '本', '語'] },
        { id: 'm7_u3_5', jp: '英語で', reading: 'えいごで', meaning: 'Bằng tiếng Anh', category: 'Phương thức', usage: '英語 = tiếng Anh; 英語で教えます = dạy bằng tiếng Anh.', example: { jp: '英語で話します。', vi: 'Tôi nói bằng tiếng Anh.' }, kanji: ['英', '語'] }
      ]},
      { id: 'm7_u4', title: 'Nhóm 4', items: [
        { id: 'm7_u4_1', jp: 'プレゼント', reading: 'purezento', meaning: 'Quà tặng', category: 'Đồ vật', usage: 'Từ mượn "present" — quà tặng.', example: { jp: '友達にプレゼントをあげます。', vi: 'Tôi tặng quà cho bạn.' }, kanji: [] },
        { id: 'm7_u4_2', jp: '荷物', reading: 'にもつ', meaning: 'Hành lý, bưu kiện', category: 'Đồ vật', usage: 'Đồ mang theo, bưu kiện gửi đi.', example: { jp: '荷物を送ります。', vi: 'Tôi gửi bưu kiện.' }, kanji: ['荷', '物'] },
        { id: 'm7_u4_3', jp: 'お金', reading: 'okane', meaning: 'Tiền', category: 'Đồ vật', usage: 'Tiền — お là kính ngữ, dùng lịch sự hơn 金.', example: { jp: 'お金を使います。', vi: 'Tôi dùng tiền.' }, kanji: ['金'] },
        { id: 'm7_u4_4', jp: '電話番号', reading: 'でんわばんごう', meaning: 'Số điện thoại', category: 'Thông tin', usage: '電話 = điện thoại, 番号 = số.', example: { jp: '電話番号を教えます。', vi: 'Tôi cho biết số điện thoại.' }, kanji: ['電', '話', '番', '号'] },
        { id: 'm7_u4_5', jp: 'メールアドレス', reading: 'me-ru adoresu', meaning: 'Địa chỉ email', category: 'Thông tin', usage: 'メール = email, アドレス = address.', example: { jp: 'メールアドレスを書きます。', vi: 'Tôi viết địa chỉ email.' }, kanji: [] }
      ]}
    ]
  }
];

// ===== Build runtime =====
const VOCAB_DECKS = _buildVocabDecks();

// ===== Tầng 3 — thông tin Kanji =====
// strokes: tổng số nét viết; radical: bộ thủ chính; meaning: nghĩa của chữ.
// Thứ tự nét trực quan (SVG/stroke data) chưa có trong dự án — hiển thị số nét + hướng viết chuẩn, ghi trong result.md.
const VOCAB_KANJI_INFO = {
  '私': { strokes: 7, radical: '禾', meaning: 'tôi, cá nhân' },
  '人': { strokes: 2, radical: '人', meaning: 'người' },
  '先': { strokes: 5, radical: '儿', meaning: 'trước, trước tiên' },
  '生': { strokes: 5, radical: '生', meaning: 'sống, sinh' },
  '教': { strokes: 11, radical: '攵', meaning: 'dạy, giáo dục' },
  '師': { strokes: 10, radical: '巾', meaning: 'thầy, sư' },
  '学': { strokes: 8, radical: '子', meaning: 'học' },
  '会': { strokes: 6, radical: '人', meaning: 'họp, hội' },
  '社': { strokes: 7, radical: '示', meaning: 'công ty, xã' },
  '員': { strokes: 7, radical: '口', meaning: 'thành viên, viên' },
  '銀': { strokes: 14, radical: '金', meaning: 'bạc, ngân' },
  '行': { strokes: 6, radical: '行', meaning: 'đi, hành' },
  '医': { strokes: 7, radical: '匚', meaning: 'y, chữa bệnh' },
  '者': { strokes: 8, radical: '老', meaning: 'người, giả' },
  '研': { strokes: 9, radical: '石', meaning: 'nghiên, mài' },
  '究': { strokes: 9, radical: '穴', meaning: 'tìm tòi, cứu' },
  '大': { strokes: 3, radical: '大', meaning: 'lớn' },
  '病': { strokes: 10, radical: '疒', meaning: 'bệnh' },
  '院': { strokes: 10, radical: '阜', meaning: 'viện, cơ quan' },
  '本': { strokes: 5, radical: '木', meaning: 'gốc, sách' },
  '辞': { strokes: 13, radical: '辛', meaning: 'từ, lời' },
  '書': { strokes: 6, radical: '日', meaning: 'viết, sách' },
  '雑': { strokes: 14, radical: '隹', meaning: 'lẫn lộn, tạp' },
  '誌': { strokes: 14, radical: '言', meaning: 'tạp chí, chí' },
  '新': { strokes: 13, radical: '斤', meaning: 'mới' },
  '聞': { strokes: 12, radical: '耳', meaning: 'nghe' },
  '手': { strokes: 4, radical: '手', meaning: 'tay' },
  '帳': { strokes: 11, radical: '巾', meaning: 'sổ, màn' },
  '名': { strokes: 6, radical: '口', meaning: 'tên' },
  '刺': { strokes: 8, radical: '刀', meaning: 'đâm, thiếp' },
  '鉛': { strokes: 13, radical: '金', meaning: 'chì (kim loại)' },
  '筆': { strokes: 12, radical: '竹', meaning: 'bút, cây viết' },
  '鍵': { strokes: 18, radical: '金', meaning: 'chìa khóa' },
  '時': { strokes: 10, radical: '日', meaning: 'thời, giờ' },
  '計': { strokes: 10, radical: '言', meaning: 'tính, kế' },
  '傘': { strokes: 12, radical: '人', meaning: 'cái ô' },
  '自': { strokes: 6, radical: '自', meaning: 'tự, mình' },
  '動': { strokes: 11, radical: '力', meaning: 'chuyển động' },
  '車': { strokes: 7, radical: '車', meaning: 'xe' },
  '机': { strokes: 6, radical: '木', meaning: 'bàn học' },
  '椅': { strokes: 12, radical: '木', meaning: 'ghế' },
  '子': { strokes: 3, radical: '子', meaning: 'con, trẻ' },
  '違': { strokes: 12, radical: '辵', meaning: 'khác, sai' },
  '失': { strokes: 5, radical: '大', meaning: 'mất, thất' },
  '礼': { strokes: 5, radical: '示', meaning: 'lễ, cúi chào' },
  '来': { strokes: 7, radical: '木', meaning: 'đến, lại' },
  '前': { strokes: 9, radical: '刀', meaning: 'trước, phía trước' },
  '朝': { strokes: 12, radical: '月', meaning: 'buổi sáng' },
  '昼': { strokes: 9, radical: '日', meaning: 'ban ngày, trưa' },
  '晩': { strokes: 12, radical: '日', meaning: 'buổi tối' },
  '夜': { strokes: 8, radical: '夕', meaning: 'đêm' },
  '毎': { strokes: 7, radical: '毋', meaning: 'mỗi, hằng' },
  '日': { strokes: 4, radical: '日', meaning: 'ngày, mặt trời' },
  '月': { strokes: 4, radical: '月', meaning: 'tháng, mặt trăng' },
  '曜': { strokes: 18, radical: '日', meaning: 'ngày trong tuần' },
  '火': { strokes: 4, radical: '火', meaning: 'lửa' },
  '金': { strokes: 8, radical: '金', meaning: 'vàng, kim loại' },
  '土': { strokes: 3, radical: '土', meaning: 'đất' },
  '木': { strokes: 4, radical: '木', meaning: 'cây, gỗ' },
  '水': { strokes: 4, radical: '水', meaning: 'nước' },
  '起': { strokes: 10, radical: '走', meaning: 'dậy, khởi' },
  '寝': { strokes: 13, radical: '宀', meaning: 'ngủ' },
  '働': { strokes: 13, radical: '人', meaning: 'làm việc, lao động' },
  '休': { strokes: 6, radical: '人', meaning: 'nghỉ' },
  '勉': { strokes: 10, radical: '力', meaning: 'cố gắng' },
  '強': { strokes: 11, radical: '弓', meaning: 'mạnh, giỏi' },
  '終': { strokes: 11, radical: '糸', meaning: 'kết thúc' },
  '今': { strokes: 4, radical: '人', meaning: 'bây giờ' },
  '昨': { strokes: 9, radical: '日', meaning: 'qua (hôm qua)' },
  '何': { strokes: 7, radical: '人', meaning: 'cái gì, mấy' },
  '分': { strokes: 4, radical: '刀', meaning: 'phút, chia' },
  '明': { strokes: 8, radical: '日', meaning: 'sáng, sáng tỏ' },
  '帰': { strokes: 10, radical: '巾', meaning: 'về, trở về' },
  '校': { strokes: 10, radical: '木', meaning: 'trường học' },
  '駅': { strokes: 14, radical: '馬', meaning: 'nhà ga' },
  '飛': { strokes: 9, radical: '飛', meaning: 'bay' },
  '機': { strokes: 16, radical: '木', meaning: 'cơ, máy móc' },
  '船': { strokes: 11, radical: '舟', meaning: 'tàu, thuyền' },
  '電': { strokes: 13, radical: '雨', meaning: 'điện' },
  '地': { strokes: 6, radical: '土', meaning: 'đất, mặt đất' },
  '下': { strokes: 3, radical: '一', meaning: 'dưới, xuống' },
  '鉄': { strokes: 13, radical: '金', meaning: 'sắt' },
  '幹': { strokes: 13, radical: '干', meaning: 'thân cây, cốt lõi' },
  '線': { strokes: 15, radical: '糸', meaning: 'đường, tuyến' },
  '転': { strokes: 11, radical: '車', meaning: 'xoay, chuyển' },
  '歩': { strokes: 8, radical: '止', meaning: 'đi bộ' },
  '友': { strokes: 4, radical: '又', meaning: 'bạn' },
  '達': { strokes: 12, radical: '辵', meaning: 'đạt, nhóm' },
  '彼': { strokes: 11, radical: '彳', meaning: 'anh ấy' },
  '女': { strokes: 3, radical: '女', meaning: 'phụ nữ' },
  '家': { strokes: 10, radical: '宀', meaning: 'nhà' },
  '族': { strokes: 11, radical: '方', meaning: 'tộc, nhóm họ' },
  '一': { strokes: 1, radical: '一', meaning: 'một' },
  '週': { strokes: 11, radical: '辵', meaning: 'tuần' },
  '食': { strokes: 9, radical: '食', meaning: 'ăn, thức ăn' },
  '堂': { strokes: 11, radical: '土', meaning: 'hành lang, phòng lớn' },
  '事': { strokes: 8, radical: '亅', meaning: 'việc' },
  '務': { strokes: 11, radical: '力', meaning: 'nhiệm vụ' },
  '所': { strokes: 8, radical: '戸', meaning: 'nơi chốn' },
  '議': { strokes: 20, radical: '言', meaning: 'thảo luận, nghị' },
  '室': { strokes: 9, radical: '宀', meaning: 'phòng' },
  '受': { strokes: 7, radical: '又', meaning: 'nhận' },
  '付': { strokes: 5, radical: '人', meaning: 'gắn, đính kèm' },
  '部': { strokes: 11, radical: '邑', meaning: 'bộ phận, phòng ban' },
  '屋': { strokes: 9, radical: '尸', meaning: 'nhà, mái' },
  '郵': { strokes: 11, radical: '辵', meaning: 'bưu chính' },
  '便': { strokes: 9, radical: '人', meaning: 'tiện, thư' },
  '局': { strokes: 7, radical: '尸', meaning: 'cơ quan, cục' },
  '図': { strokes: 7, radical: '囗', meaning: 'bản đồ' },
  '館': { strokes: 16, radical: '食', meaning: 'tòa nhà, quán' },
  '美': { strokes: 9, radical: '羊', meaning: 'đẹp' },
  '術': { strokes: 11, radical: '行', meaning: 'kỹ thuật, nghệ thuật' },
  '飲': { strokes: 12, radical: '食', meaning: 'uống' },
  '吸': { strokes: 6, radical: '口', meaning: 'hút, hít' },
  '見': { strokes: 7, radical: '見', meaning: 'nhìn, xem' },
  '読': { strokes: 14, radical: '言', meaning: 'đọc' },
  '買': { strokes: 12, radical: '貝', meaning: 'mua' },
  '撮': { strokes: 15, radical: '手', meaning: 'chụp, quay' },
  '飯': { strokes: 12, radical: '食', meaning: 'cơm, bữa ăn' },
  '卵': { strokes: 7, radical: '卩', meaning: 'trứng' },
  '肉': { strokes: 6, radical: '肉', meaning: 'thịt' },
  '魚': { strokes: 11, radical: '魚', meaning: 'cá' },
  '野': { strokes: 11, radical: '里', meaning: 'đồng hoang, dã' },
  '菜': { strokes: 11, radical: '艸', meaning: 'rau' },
  '茶': { strokes: 9, radical: '艸', meaning: 'trà' },
  '牛': { strokes: 4, radical: '牛', meaning: 'con bò' },
  '乳': { strokes: 8, radical: '子', meaning: 'sữa' },
  '緒': { strokes: 14, radical: '糸', meaning: 'đầu sợi, cùng nhau' },
  '切': { strokes: 4, radical: '刀', meaning: 'cắt' },
  '送': { strokes: 9, radical: '辵', meaning: 'gửi' },
  '貸': { strokes: 13, radical: '貝', meaning: 'cho mượn' },
  '借': { strokes: 10, radical: '人', meaning: 'mượn' },
  '習': { strokes: 11, radical: '羽', meaning: 'học, tập' },
  '箸': { strokes: 15, radical: '竹', meaning: 'đũa' },
  '語': { strokes: 14, radical: '言', meaning: 'ngôn ngữ' },
  '英': { strokes: 8, radical: '艸', meaning: 'Anh, xuất chúng' },
  '荷': { strokes: 10, radical: '艸', meaning: 'hàng hóa' },
  '物': { strokes: 8, radical: '牛', meaning: 'vật, đồ vật' },
  '話': { strokes: 13, radical: '言', meaning: 'nói, chuyện' },
  '番': { strokes: 12, radical: '田', meaning: 'số thứ tự, lượt' },
  '号': { strokes: 5, radical: '口', meaning: 'số hiệu' }
};
