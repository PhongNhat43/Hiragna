// src/lessonsData.js
// Lesson Study dataset for Minna no Nihongo V1.
// Global-scope data to match current script-tag architecture.

const lessonsData = {
  lesson01: {
    id: 'lesson01',
    title: 'Bài 1: Chào hỏi & Giới thiệu bản thân',
    sections: [
      {
        id: 'l1_sA',
        title: 'Phần 1.A: Đại từ & Chào hỏi',
        vocabularies: [
          { id: 'v1', jp: 'わたし', reading: 'watashi', meaning: 'Tôi', category: 'Đại từ', note: 'Chỉ bản thân' },
          { id: 'v2', jp: 'あなた', reading: 'anata', meaning: 'Bạn, anh/chị', category: 'Đại từ', note: 'Hạn chế dùng trực tiếp' },
          { id: 'v3', jp: 'あのひと', reading: 'ano hito', meaning: 'Người kia', category: 'Đại từ', note: 'Lịch sự là あのかた' },
          { id: 'v4', jp: '～さん', reading: '~san', meaning: 'Anh, chị, ông, bà', category: 'Hậu tố', note: 'Thêm sau tên người khác' },
          { id: 'v5', jp: '～ちゃん', reading: '~chan', meaning: 'Bé (dùng cho trẻ em)', category: 'Hậu tố', note: 'Dùng thân mật' },
          { id: 'v6', jp: 'はじめまして', reading: 'hajimemashite', meaning: 'Rất hân hạnh được gặp anh/chị', category: 'Chào hỏi', note: 'Câu mở đầu khi gặp lần đầu' },
          { id: 'v7', jp: '～からきました', reading: '~kara kimashita', meaning: 'Tôi đến từ ~', category: 'Chào hỏi', note: 'Giới thiệu xuất xứ' },
          { id: 'v8', jp: 'どうぞよろしく', reading: 'douzo yoroshiku', meaning: 'Rất mong được sự giúp đỡ', category: 'Chào hỏi', note: 'Câu kết thúc giới thiệu' },
          { id: 'v9', jp: 'しつれいですが', reading: 'shitsurei desuga', meaning: 'Xin lỗi, mạo muội...', category: 'Cụm từ', note: 'Dùng trước khi hỏi thông tin cá nhân' },
          { id: 'v10', jp: 'おなまえは？', reading: 'onamae wa?', meaning: 'Tên anh/chị là gì?', category: 'Cụm từ', note: 'Hỏi tên lịch sự' }
        ]
      },
      {
        id: 'l1_sB',
        title: 'Phần 1.B: Nghề nghiệp & Trường học',
        vocabularies: [
          { id: 'v11', jp: 'せんせい', reading: 'sensei', meaning: 'Thầy cô giáo', category: 'Nghề nghiệp', note: 'Không dùng cho bản thân' },
          { id: 'v12', jp: 'きょうし', reading: 'kyoushi', meaning: 'Giáo viên', category: 'Nghề nghiệp', note: 'Dùng chỉ nghề nghiệp của mình' },
          { id: 'v13', jp: 'がくせい', reading: 'gakusei', meaning: 'Học sinh, sinh viên', category: 'Nghề nghiệp', note: '' },
          { id: 'v14', jp: 'かいしゃいん', reading: 'kaishayin', meaning: 'Nhân viên công ty', category: 'Nghề nghiệp', note: '' },
          { id: 'v15', jp: 'しゃいん', reading: 'shayin', meaning: 'Nhân viên công ty ~', category: 'Nghề nghiệp', note: 'Đi kèm tên công ty cụ thể' },
          { id: 'v16', jp: 'ぎんこういん', reading: 'ginkoyin', meaning: 'Nhân viên ngân hàng', category: 'Nghề nghiệp', note: '' },
          { id: 'v17', jp: 'いしゃ', reading: 'isha', meaning: 'Bác sĩ', category: 'Nghề nghiệp', note: '' },
          { id: 'v18', jp: 'けんきゅうしゃ', reading: 'kenkyuusha', meaning: 'Nhà nghiên cứu', category: 'Nghề nghiệp', note: '' },
          { id: 'v19', jp: 'だいがく', reading: 'daigaku', meaning: 'Trường đại học', category: 'Địa điểm', note: '' },
          { id: 'v20', jp: 'びょういん', reading: 'byouin', meaning: 'Bệnh viện', category: 'Địa điểm', note: '' }
        ]
      }
    ]
  },
  lesson02: {
    id: 'lesson02',
    title: 'Bài 2: Đồ vật xung quanh',
    sections: [
      {
        id: 'l2_sA',
        title: 'Phần 2.A: Chỉ thị từ & Đồ dùng học tập',
        vocabularies: [
          { id: 'v21', jp: 'これ', reading: 'kore', meaning: 'Cái này', category: 'Chỉ thị từ', note: '' },
          { id: 'v22', jp: 'それ', reading: 'sore', meaning: 'Cái đó', category: 'Chỉ thị từ', note: '' },
          { id: 'v23', jp: 'あれ', reading: 'are', meaning: 'Cái kia', category: 'Chỉ thị từ', note: '' },
          { id: 'v24', jp: 'ほん', reading: 'hon', meaning: 'Sách', category: 'Đồ vật', note: '' },
          { id: 'v25', jp: 'じしょ', reading: 'jisho', meaning: 'Từ điển', category: 'Đồ vật', note: '' },
          { id: 'v26', jp: 'ざっし', reading: 'zasshi', meaning: 'Tạp chí', category: 'Đồ vật', note: '' },
          { id: 'v27', jp: 'しんぶん', reading: 'shinbun', meaning: 'Báo', category: 'Đồ vật', note: '' },
          { id: 'v28', jp: 'ノート', reading: 'no-to', meaning: 'Vở, sổ tay', category: 'Đồ vật', note: '' },
          { id: 'v29', jp: 'てちょう', reading: 'techou', meaning: 'Sổ lịch trình', category: 'Đồ vật', note: '' },
          { id: 'v30', jp: 'めいし', reading: 'meishi', meaning: 'Danh thiếp', category: 'Đồ vật', note: '' },
          { id: 'v31', jp: 'えんぴつ', reading: 'enpitsu', meaning: 'Bút chì', category: 'Đồ vật', note: '' },
          { id: 'v32', jp: 'ボールペン', reading: 'bo-rupen', meaning: 'Bút bi', category: 'Đồ vật', note: '' }
        ]
      },
      {
        id: 'l2_sB',
        title: 'Phần 2.B: Đồ gia dụng & Giao tiếp',
        vocabularies: [
          { id: 'v33', jp: 'かぎ', reading: 'kagi', meaning: 'Chìa khóa', category: 'Đồ vật', note: '' },
          { id: 'v34', jp: 'とけい', reading: 'tokei', meaning: 'Đồng hồ', category: 'Đồ vật', note: '' },
          { id: 'v35', jp: 'かさ', reading: 'kasa', meaning: 'Ô, dù', category: 'Đồ vật', note: '' },
          { id: 'v36', jp: 'かばん', reading: 'kaban', meaning: 'Cặp sách, túi xách', category: 'Đồ vật', note: '' },
          { id: 'v37', jp: 'テレビ', reading: 'terebi', meaning: 'Tivi', category: 'Đồ vật', note: '' },
          { id: 'v38', jp: 'カメラ', reading: 'kamera', meaning: 'Máy ảnh', category: 'Đồ vật', note: '' },
          { id: 'v39', jp: 'コンピューター', reading: 'konpyu-ta-', meaning: 'Máy tính', category: 'Đồ vật', note: '' },
          { id: 'v40', jp: 'じどうしゃ', reading: 'jidousha', meaning: 'Xe ô tô', category: 'Đồ vật', note: '' },
          { id: 'v41', jp: 'つくえ', reading: 'tsukue', meaning: 'Bàn', category: 'Đồ vật', note: '' },
          { id: 'v42', jp: 'いす', reading: 'isu', meaning: 'Ghế', category: 'Đồ vật', note: '' },
          { id: 'v43', jp: 'そう', reading: 'sou', meaning: 'Đúng vậy', category: 'Giao tiếp', note: '' },
          { id: 'v44', jp: 'ちがいます', reading: 'chigaimasu', meaning: 'Không phải, nhầm rồi', category: 'Giao tiếp', note: '' },
          { id: 'v45', jp: 'ほんのきもちです', reading: 'hon no kimochi desu', meaning: 'Chút lòng thành', category: 'Giao tiếp', note: '' }
        ]
      }
    ]
  },
  lesson03: {
    id: 'lesson03',
    title: 'Bài 3: Nơi chốn & Địa điểm',
    sections: [
      {
        id: 'l3_sA',
        title: 'Phần 3.A: Địa điểm trong trường và công ty',
        vocabularies: [
          { id: 'v46', jp: 'ここ', reading: 'koko', meaning: 'Ở đây', category: 'Địa điểm', note: 'Gần người nói' },
          { id: 'v47', jp: 'そこ', reading: 'soko', meaning: 'Ở đó', category: 'Địa điểm', note: 'Gần người nghe' },
          { id: 'v48', jp: 'あそこ', reading: 'asoko', meaning: 'Ở kia', category: 'Địa điểm', note: 'Xa cả hai' },
          { id: 'v49', jp: 'どこ', reading: 'doko', meaning: 'Ở đâu', category: 'Địa điểm', note: 'Từ để hỏi địa điểm' },
          { id: 'v50', jp: 'こちら', reading: 'kochira', meaning: 'Phía này, đây', category: 'Địa điểm', note: 'Lịch sự hơn ここ' },
          { id: 'v51', jp: 'そちら', reading: 'sochira', meaning: 'Phía đó', category: 'Địa điểm', note: 'Lịch sự hơn そこ' },
          { id: 'v52', jp: 'あちら', reading: 'achira', meaning: 'Phía kia', category: 'Địa điểm', note: 'Lịch sự hơn あそこ' },
          { id: 'v53', jp: 'どちら', reading: 'dochira', meaning: 'Phía nào, đâu', category: 'Địa điểm', note: 'Lịch sự hơn どこ' },
          { id: 'v54', jp: 'きょうしつ', reading: 'kyoushitsu', meaning: 'Phòng học', category: 'Địa điểm', note: '' },
          { id: 'v55', jp: 'しょくどう', reading: 'shokudou', meaning: 'Nhà ăn', category: 'Địa điểm', note: '' },
          { id: 'v56', jp: 'じむしょ', reading: 'jimusho', meaning: 'Văn phòng', category: 'Địa điểm', note: '' },
          { id: 'v57', jp: 'かいぎしつ', reading: 'kaigishitsu', meaning: 'Phòng họp', category: 'Địa điểm', note: '' }
        ]
      },
      {
        id: 'l3_sB',
        title: 'Phần 3.B: Cửa hàng & Quốc gia',
        vocabularies: [
          { id: 'v58', jp: 'うけつけ', reading: 'uketsuke', meaning: 'Quầy tiếp tân', category: 'Địa điểm', note: '' },
          { id: 'v59', jp: 'ロビー', reading: 'robi-', meaning: 'Sảnh lớn', category: 'Địa điểm', note: '' },
          { id: 'v60', jp: 'へや', reading: 'heya', meaning: 'Phòng', category: 'Địa điểm', note: '' },
          { id: 'v61', jp: 'トイレ', reading: 'toire', meaning: 'Nhà vệ sinh', category: 'Địa điểm', note: '' },
          { id: 'v62', jp: 'デパート', reading: 'depa-to', meaning: 'Cửa hàng bách hóa', category: 'Địa điểm', note: '' },
          { id: 'v63', jp: 'ぎんこう', reading: 'ginkou', meaning: 'Ngân hàng', category: 'Địa điểm', note: '' },
          { id: 'v64', jp: 'ゆうびんきょく', reading: 'yuubinkyoku', meaning: 'Bưu điện', category: 'Địa điểm', note: '' },
          { id: 'v65', jp: 'としょかん', reading: 'toshokan', meaning: 'Thư viện', category: 'Địa điểm', note: '' },
          { id: 'v66', jp: 'びじゅつかん', reading: 'bijutsukan', meaning: 'Bảo tàng mỹ thuật', category: 'Địa điểm', note: '' },
          { id: 'v67', jp: 'イタリア', reading: 'itaria', meaning: 'Ý', category: 'Quốc gia', note: '' },
          { id: 'v68', jp: 'スイス', reading: 'suisu', meaning: 'Thụy Sĩ', category: 'Quốc gia', note: '' },
          { id: 'v69', jp: 'ドイツ', reading: 'doitsu', meaning: 'Đức', category: 'Quốc gia', note: '' }
        ]
      }
    ]
  },
  lesson04: {
    id: 'lesson04',
    title: 'Bài 4: Thời gian & Thời khóa biểu',
    sections: [
      {
        id: 'l4_sA',
        title: 'Phần 4.A: Giờ giấc trong ngày',
        vocabularies: [
          { id: 'v70', jp: 'おきます', reading: 'okimasu', meaning: 'Thức dậy', category: 'Động từ', note: '' },
          { id: 'v71', jp: 'ねます', reading: 'nemasu', meaning: 'Ngủ', category: 'Động từ', note: '' },
          { id: 'v72', jp: 'はたらきます', reading: 'hatarakimasu', meaning: 'Làm việc', category: 'Động từ', note: '' },
          { id: 'v73', jp: 'やすみます', reading: 'yasumimasu', meaning: 'Nghỉ, nghỉ ngơi', category: 'Động từ', note: '' },
          { id: 'v74', jp: 'べんきょうします', reading: 'benkyou shimasu', meaning: 'Học', category: 'Động từ', note: '' },
          { id: 'v75', jp: 'おわります', reading: 'owarimasu', meaning: 'Kết thúc', category: 'Động từ', note: '' },
          { id: 'v76', jp: 'あさ', reading: 'asa', meaning: 'Buổi sáng', category: 'Thời gian', note: '' },
          { id: 'v77', jp: 'ひる', reading: 'hiru', meaning: 'Buổi trưa', category: 'Thời gian', note: '' },
          { id: 'v78', jp: 'ばん', reading: 'ban', meaning: 'Buổi tối', category: 'Thời gian', note: '' },
          { id: 'v79', jp: 'よる', reading: 'yoru', meaning: 'Ban đêm', category: 'Thời gian', note: '' },
          { id: 'v80', jp: 'まいあさ', reading: 'maiasa', meaning: 'Mỗi sáng', category: 'Thời gian', note: '' },
          { id: 'v81', jp: 'まいばん', reading: 'maiban', meaning: 'Mỗi tối', category: 'Thời gian', note: '' }
        ]
      },
      {
        id: 'l4_sB',
        title: 'Phần 4.B: Ngày nghỉ & Khung giờ',
        vocabularies: [
          { id: 'v82', jp: 'まいにち', reading: 'mainichi', meaning: 'Mỗi ngày', category: 'Thời gian', note: '' },
          { id: 'v83', jp: 'げつようび', reading: 'getsuyoubi', meaning: 'Thứ hai', category: 'Thời gian', note: '' },
          { id: 'v84', jp: 'かようび', reading: 'kayoubi', meaning: 'Thứ ba', category: 'Thời gian', note: '' },
          { id: 'v85', jp: 'すいようび', reading: 'suiyoubi', meaning: 'Thứ tư', category: 'Thời gian', note: '' },
          { id: 'v86', jp: 'もくようび', reading: 'mokuyoubi', meaning: 'Thứ năm', category: 'Thời gian', note: '' },
          { id: 'v87', jp: 'きんようび', reading: 'kinyoubi', meaning: 'Thứ sáu', category: 'Thời gian', note: '' },
          { id: 'v88', jp: 'どようび', reading: 'doyoubi', meaning: 'Thứ bảy', category: 'Thời gian', note: '' },
          { id: 'v89', jp: 'にちようび', reading: 'nichiyoubi', meaning: 'Chủ nhật', category: 'Thời gian', note: '' },
          { id: 'v90', jp: 'きょう', reading: 'kyou', meaning: 'Hôm nay', category: 'Thời gian', note: '' },
          { id: 'v91', jp: 'あした', reading: 'ashita', meaning: 'Ngày mai', category: 'Thời gian', note: '' },
          { id: 'v92', jp: 'きのう', reading: 'kinou', meaning: 'Hôm qua', category: 'Thời gian', note: '' },
          { id: 'v93', jp: 'なんじ', reading: 'nanji', meaning: 'Mấy giờ', category: 'Câu hỏi', note: '' },
          { id: 'v94', jp: 'なんぷん', reading: 'nanpun', meaning: 'Mấy phút', category: 'Câu hỏi', note: '' }
        ]
      }
    ]
  },
  lesson05: {
    id: 'lesson05',
    title: 'Bài 5: Di chuyển & Đi lại',
    sections: [
      {
        id: 'l5_sA',
        title: 'Phần 5.A: Phương tiện & Động tác di chuyển',
        vocabularies: [
          { id: 'v95', jp: 'いきます', reading: 'ikimasu', meaning: 'Đi', category: 'Động từ', note: '' },
          { id: 'v96', jp: 'きます', reading: 'kimasu', meaning: 'Đến', category: 'Động từ', note: '' },
          { id: 'v97', jp: 'かえります', reading: 'kaerimasu', meaning: 'Về', category: 'Động từ', note: '' },
          { id: 'v98', jp: 'がっこう', reading: 'gakkou', meaning: 'Trường học', category: 'Địa điểm', note: '' },
          { id: 'v99', jp: 'スーパー', reading: 'su-pa-', meaning: 'Siêu thị', category: 'Địa điểm', note: '' },
          { id: 'v100', jp: 'えき', reading: 'eki', meaning: 'Nhà ga', category: 'Địa điểm', note: '' },
          { id: 'v101', jp: 'ひこうき', reading: 'hikouki', meaning: 'Máy bay', category: 'Phương tiện', note: '' },
          { id: 'v102', jp: 'ふね', reading: 'fune', meaning: 'Tàu thủy', category: 'Phương tiện', note: '' },
          { id: 'v103', jp: 'でんしゃ', reading: 'densha', meaning: 'Tàu điện', category: 'Phương tiện', note: '' },
          { id: 'v104', jp: 'ちかてつ', reading: 'chikatetsu', meaning: 'Tàu điện ngầm', category: 'Phương tiện', note: '' },
          { id: 'v105', jp: 'しんかんせん', reading: 'shinkansen', meaning: 'Tàu siêu tốc', category: 'Phương tiện', note: '' },
          { id: 'v106', jp: 'バス', reading: 'basu', meaning: 'Xe buýt', category: 'Phương tiện', note: '' },
          { id: 'v107', jp: 'タクシー', reading: 'takushi-', meaning: 'Taxi', category: 'Phương tiện', note: '' }
        ]
      },
      {
        id: 'l5_sB',
        title: 'Phần 5.B: Bạn đồng hành & Mốc thời gian',
        vocabularies: [
          { id: 'v108', jp: 'じてんしゃ', reading: 'jitensha', meaning: 'Xe đạp', category: 'Phương tiện', note: '' },
          { id: 'v109', jp: 'あるいて', reading: 'aruite', meaning: 'Đi bộ', category: 'Cách thức', note: '' },
          { id: 'v110', jp: 'ひと', reading: 'hito', meaning: 'Người', category: 'Danh từ', note: '' },
          { id: 'v111', jp: 'ともだち', reading: 'tomodachi', meaning: 'Bạn bè', category: 'Danh từ', note: '' },
          { id: 'v112', jp: 'かれ', reading: 'kare', meaning: 'Anh ấy, bạn trai', category: 'Đại từ', note: '' },
          { id: 'v113', jp: 'かのじょ', reading: 'kanojo', meaning: 'Cô ấy, bạn gái', category: 'Đại từ', note: '' },
          { id: 'v114', jp: 'かぞく', reading: 'kazoku', meaning: 'Gia đình', category: 'Danh từ', note: '' },
          { id: 'v115', jp: 'ひとりで', reading: 'hitori de', meaning: 'Một mình', category: 'Cách thức', note: '' },
          { id: 'v116', jp: 'せんしゅう', reading: 'senshuu', meaning: 'Tuần trước', category: 'Thời gian', note: '' },
          { id: 'v117', jp: 'こんしゅう', reading: 'konshuu', meaning: 'Tuần này', category: 'Thời gian', note: '' },
          { id: 'v118', jp: 'らいしゅう', reading: 'raishuu', meaning: 'Tuần sau', category: 'Thời gian', note: '' },
          { id: 'v119', jp: 'せんげつ', reading: 'sengetsu', meaning: 'Tháng trước', category: 'Thời gian', note: '' },
          { id: 'v120', jp: 'らいげつ', reading: 'raigetsu', meaning: 'Tháng sau', category: 'Thời gian', note: '' }
        ]
      }
    ]
  },
  lesson06: {
    id: 'lesson06',
    title: 'Bài 6: Ăn uống & Hoạt động thường ngày',
    sections: [
      {
        id: 'l6_sA',
        title: 'Phần 6.A: Đồ ăn, thức uống',
        vocabularies: [
          { id: 'v121', jp: 'たべます', reading: 'tabemasu', meaning: 'Ăn', category: 'Động từ', note: '' },
          { id: 'v122', jp: 'のみます', reading: 'nomimasu', meaning: 'Uống', category: 'Động từ', note: '' },
          { id: 'v123', jp: 'すいます', reading: 'suimasu', meaning: 'Hút', category: 'Động từ', note: 'Dùng cho thuốc lá' },
          { id: 'v124', jp: 'みます', reading: 'mimasu', meaning: 'Xem, nhìn', category: 'Động từ', note: '' },
          { id: 'v125', jp: 'ききます', reading: 'kikimasu', meaning: 'Nghe', category: 'Động từ', note: '' },
          { id: 'v126', jp: 'よみます', reading: 'yomimasu', meaning: 'Đọc', category: 'Động từ', note: '' },
          { id: 'v127', jp: 'かきます', reading: 'kakimasu', meaning: 'Viết', category: 'Động từ', note: '' },
          { id: 'v128', jp: 'かいます', reading: 'kaimasu', meaning: 'Mua', category: 'Động từ', note: '' },
          { id: 'v129', jp: 'とります', reading: 'torimasu', meaning: 'Chụp, lấy', category: 'Động từ', note: '' },
          { id: 'v130', jp: 'ごはん', reading: 'gohan', meaning: 'Cơm, bữa ăn', category: 'Đồ ăn', note: '' },
          { id: 'v131', jp: 'パン', reading: 'pan', meaning: 'Bánh mì', category: 'Đồ ăn', note: '' },
          { id: 'v132', jp: 'たまご', reading: 'tamago', meaning: 'Trứng', category: 'Đồ ăn', note: '' },
          { id: 'v133', jp: 'にく', reading: 'niku', meaning: 'Thịt', category: 'Đồ ăn', note: '' }
        ]
      },
      {
        id: 'l6_sB',
        title: 'Phần 6.B: Uống gì, ở đâu, khi nào',
        vocabularies: [
          { id: 'v134', jp: 'さかな', reading: 'sakana', meaning: 'Cá', category: 'Đồ ăn', note: '' },
          { id: 'v135', jp: 'やさい', reading: 'yasai', meaning: 'Rau', category: 'Đồ ăn', note: '' },
          { id: 'v136', jp: 'みず', reading: 'mizu', meaning: 'Nước', category: 'Đồ uống', note: '' },
          { id: 'v137', jp: 'おちゃ', reading: 'ocha', meaning: 'Trà', category: 'Đồ uống', note: '' },
          { id: 'v138', jp: 'コーヒー', reading: 'ko-hi-', meaning: 'Cà phê', category: 'Đồ uống', note: '' },
          { id: 'v139', jp: 'ぎゅうにゅう', reading: 'gyuunyuu', meaning: 'Sữa bò', category: 'Đồ uống', note: '' },
          { id: 'v140', jp: 'ジュース', reading: 'ju-su', meaning: 'Nước trái cây', category: 'Đồ uống', note: '' },
          { id: 'v141', jp: 'ビール', reading: 'bi-ru', meaning: 'Bia', category: 'Đồ uống', note: '' },
          { id: 'v142', jp: 'たばこ', reading: 'tabako', meaning: 'Thuốc lá', category: 'Đồ vật', note: '' },
          { id: 'v143', jp: 'レストラン', reading: 'resutoran', meaning: 'Nhà hàng', category: 'Địa điểm', note: '' },
          { id: 'v144', jp: 'うち', reading: 'uchi', meaning: 'Nhà', category: 'Địa điểm', note: '' },
          { id: 'v145', jp: 'いっしょに', reading: 'issho ni', meaning: 'Cùng nhau', category: 'Cách thức', note: '' }
        ]
      }
    ]
  },
  lesson07: {
    id: 'lesson07',
    title: 'Bài 7: Phương thức hành động & Tặng quà',
    sections: [
      {
        id: 'l7_sA',
        title: 'Phần 7.A: Công cụ & Ngôn ngữ',
        vocabularies: [
          { id: 'v146', jp: 'きります', reading: 'kirimasu', meaning: 'Cắt', category: 'Động từ', note: '' },
          { id: 'v147', jp: 'おくります', reading: 'okurimasu', meaning: 'Gửi', category: 'Động từ', note: '' },
          { id: 'v148', jp: 'あげます', reading: 'agemasu', meaning: 'Tặng, cho', category: 'Động từ', note: '' },
          { id: 'v149', jp: 'もらいます', reading: 'moraimasu', meaning: 'Nhận', category: 'Động từ', note: '' },
          { id: 'v150', jp: 'かします', reading: 'kashimasu', meaning: 'Cho mượn', category: 'Động từ', note: '' },
          { id: 'v151', jp: 'かります', reading: 'karimasu', meaning: 'Mượn', category: 'Động từ', note: '' },
          { id: 'v152', jp: 'おしえます', reading: 'oshiemasu', meaning: 'Chỉ, dạy', category: 'Động từ', note: '' },
          { id: 'v153', jp: 'ならいます', reading: 'naraimasu', meaning: 'Học từ ai đó', category: 'Động từ', note: '' },
          { id: 'v154', jp: 'て', reading: 'te', meaning: 'Tay', category: 'Bộ phận cơ thể', note: '' },
          { id: 'v155', jp: 'はし', reading: 'hashi', meaning: 'Đũa', category: 'Công cụ', note: '' },
          { id: 'v156', jp: 'スプーン', reading: 'supu-n', meaning: 'Thìa', category: 'Công cụ', note: '' },
          { id: 'v157', jp: 'ナイフ', reading: 'naifu', meaning: 'Dao', category: 'Công cụ', note: '' },
          { id: 'v158', jp: 'フォーク', reading: 'fo-ku', meaning: 'Nĩa', category: 'Công cụ', note: '' },
          { id: 'v159', jp: 'にほんごで', reading: 'nihongo de', meaning: 'Bằng tiếng Nhật', category: 'Phương thức', note: '' }
        ]
      },
      {
        id: 'l7_sB',
        title: 'Phần 7.B: Quà tặng & Liên hệ',
        vocabularies: [
          { id: 'v160', jp: 'えいごで', reading: 'eigo de', meaning: 'Bằng tiếng Anh', category: 'Phương thức', note: '' },
          { id: 'v161', jp: 'プレゼント', reading: 'purezento', meaning: 'Quà tặng', category: 'Đồ vật', note: '' },
          { id: 'v162', jp: 'にもつ', reading: 'nimotsu', meaning: 'Hành lý, bưu kiện', category: 'Đồ vật', note: '' },
          { id: 'v163', jp: 'おかね', reading: 'okane', meaning: 'Tiền', category: 'Đồ vật', note: '' },
          { id: 'v164', jp: 'でんわばんごう', reading: 'denwa bangou', meaning: 'Số điện thoại', category: 'Thông tin', note: '' },
          { id: 'v165', jp: 'メールアドレス', reading: 'me-ru adoresu', meaning: 'Địa chỉ email', category: 'Thông tin', note: '' }
        ]
      }
    ]
  }
};
