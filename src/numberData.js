// src/numberData.js

// ===== Unit readings (index = digit 0–9) =====
const NT_UNIT_PRIMARY = [
  'ゼロ',     // 0
  'いち',     // 1
  'に',       // 2
  'さん',     // 3
  'よん',     // 4
  'ご',       // 5
  'ろく',     // 6
  'なな',     // 7
  'はち',     // 8
  'きゅう'    // 9
];

const NT_UNIT_ALT = [
  'れい',     // 0 alt
  null,       // 1
  null,       // 2
  null,       // 3
  'し',       // 4 alt
  null,       // 5
  null,       // 6
  'しち',     // 7 alt
  null,       // 8
  'く'        // 9 alt
];

// ===== Tens readings (index = tens digit: 1 = 10, 2 = 20, ...) =====
const NT_TENS_PRIMARY = [
  null,             // 0 (unused)
  'じゅう',         // 10
  'にじゅう',       // 20
  'さんじゅう',     // 30
  'よんじゅう',     // 40
  'ごじゅう',       // 50
  'ろくじゅう',     // 60
  'ななじゅう',     // 70
  'はちじゅう',     // 80
  'きゅうじゅう'    // 90
];

// ===== Build dataset 0–99 =====
function _buildNumberData() {
  const items = [];

  // 0
  items.push({ value: 0, reading: 'ゼロ', altReading: 'れい', composition: null });

  // 1–9
  for (let i = 1; i <= 9; i++) {
    items.push({
      value: i,
      reading: NT_UNIT_PRIMARY[i],
      altReading: NT_UNIT_ALT[i],
      composition: null
    });
  }

  // 10
  items.push({ value: 10, reading: 'じゅう', altReading: null, composition: null });

  // 11–19
  for (let i = 11; i <= 19; i++) {
    const unit = i - 10;
    items.push({
      value: i,
      reading: 'じゅう' + NT_UNIT_PRIMARY[unit],
      altReading: NT_UNIT_ALT[unit] ? 'じゅう' + NT_UNIT_ALT[unit] : null,
      composition: `10 + ${unit}`
    });
  }

  // 20–99
  for (let tens = 2; tens <= 9; tens++) {
    // Pure tens: 20, 30, 40, ...
    items.push({
      value: tens * 10,
      reading: NT_TENS_PRIMARY[tens],
      altReading: null,
      composition: null
    });
    // Compounds: 21–29, 31–39, ...
    for (let unit = 1; unit <= 9; unit++) {
      const val = tens * 10 + unit;
      items.push({
        value: val,
        reading: NT_TENS_PRIMARY[tens] + NT_UNIT_PRIMARY[unit],
        altReading: NT_UNIT_ALT[unit] ? NT_TENS_PRIMARY[tens] + NT_UNIT_ALT[unit] : null,
        composition: `${tens * 10} + ${unit}`
      });
    }
  }

  return items;
}

const numberData = _buildNumberData();

// ===== Lesson definitions =====
const NUMBER_LESSONS = [
  {
    id: 'lesson1',
    label: 'Bài 1 — 0 đến 10',
    hint: 'Số đơn cơ bản',
    filter: function(d) { return d.value >= 0 && d.value <= 10; }
  },
  {
    id: 'lesson2',
    label: 'Bài 2 — 11 đến 19',
    hint: 'じゅう + số đơn',
    filter: function(d) { return d.value >= 11 && d.value <= 19; }
  },
  {
    id: 'lesson3',
    label: 'Bài 3 — Hàng chục',
    hint: 'Số × じゅう (10, 20 ... 90)',
    filter: function(d) { return d.value >= 10 && d.value <= 90 && d.value % 10 === 0; }
  },
  {
    id: 'lesson4a',
    label: 'Bài 4A — 21 đến 49',
    hint: 'Số ghép hai thành phần',
    filter: function(d) { return d.value >= 21 && d.value <= 49 && d.value % 10 !== 0; }
  },
  {
    id: 'lesson4b',
    label: 'Bài 4B — 51 đến 99',
    hint: 'Số ghép hai thành phần (tiếp theo)',
    filter: function(d) { return d.value >= 51 && d.value <= 99 && d.value % 10 !== 0; }
  }
];
