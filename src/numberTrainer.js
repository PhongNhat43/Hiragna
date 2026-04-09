// src/numberTrainer.js
// Number Trainer logic — Learn → Practice → Reverse → Review

const ntState = {
  lessonId: null,
  phase: null,          // 'learn' | 'practice' | 'reverse' | 'review'
  lessonItems: [],      // all items for current lesson (ordered)
  currentItems: [],     // items for current phase
  currentIndex: 0,
  wrongItems: [],       // items answered wrong (practice + reverse, deduped)
  reviewTotal: 0,       // size of review batch (for summary)
  answerSelected: false // guard double-click
};

document.addEventListener('DOMContentLoaded', function() {

  // ===== DOM refs =====
  var modeSelectionScreen   = document.getElementById('mode-selection-screen');
  var ntBtn                 = document.getElementById('nt-btn');
  var ntLessonScreen        = document.getElementById('nt-lesson-screen');
  var ntLessonButtonsCont   = document.getElementById('nt-lesson-buttons');
  var backFromNTLessonBtn   = document.getElementById('back-from-nt-lesson-btn');
  var ntScreen              = document.getElementById('nt-screen');
  var ntPhaseLabel          = document.getElementById('nt-phase-label');
  var ntProgressEl          = document.getElementById('nt-progress');
  var ntDisplay             = document.getElementById('nt-display');
  var ntReading             = document.getElementById('nt-reading');
  var ntComposition         = document.getElementById('nt-composition');
  var ntOptionsSection      = document.getElementById('nt-options-section');
  var ntChoiceOptions       = document.getElementById('nt-choice-options');
  var ntSpeakBtn            = document.getElementById('nt-speak-btn');
  var ntNextBtn             = document.getElementById('nt-next-btn');
  var ntExitBtn             = document.getElementById('nt-exit-btn');
  var ntSummaryScreen       = document.getElementById('nt-summary-screen');
  var ntSummaryTitle        = document.getElementById('nt-summary-title');
  var ntSummaryContent      = document.getElementById('nt-summary-content');
  var ntRetryBtn            = document.getElementById('nt-retry-btn');
  var ntChooseLessonBtn     = document.getElementById('nt-choose-lesson-btn');
  var ntHomeBtn             = document.getElementById('nt-home-btn');

  // ===== Helpers =====
  function ntShuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function ntRandInt(max) {
    return Math.floor(Math.random() * max);
  }

  // ===== Lesson screen =====
  function renderNTLessons() {
    ntLessonButtonsCont.innerHTML = '';
    NUMBER_LESSONS.forEach(function(lesson) {
      var items = numberData.filter(lesson.filter);
      var btn = document.createElement('button');
      btn.className = 'nt-lesson-btn';
      btn.innerHTML =
        '<span class="nt-lesson-name">' + lesson.label + '</span>' +
        '<span class="nt-lesson-hint">' + lesson.hint + ' · ' + items.length + ' số</span>';
      btn.addEventListener('click', function() { startNTLesson(lesson.id); });
      ntLessonButtonsCont.appendChild(btn);
    });
  }

  // ===== Start lesson =====
  function startNTLesson(lessonId) {
    var lesson = null;
    for (var i = 0; i < NUMBER_LESSONS.length; i++) {
      if (NUMBER_LESSONS[i].id === lessonId) { lesson = NUMBER_LESSONS[i]; break; }
    }
    var items = numberData.filter(lesson.filter);

    ntState.lessonId      = lessonId;
    ntState.lessonItems   = items.slice();
    ntState.wrongItems    = [];
    ntState.reviewTotal   = 0;
    ntState.phase         = 'learn';
    ntState.currentItems  = items.slice(); // sequential for learn
    ntState.currentIndex  = 0;
    ntState.answerSelected = false;

    ntLessonScreen.style.display = 'none';
    ntScreen.style.display = 'flex';
    renderNTItem();
  }

  // ===== Main render dispatch =====
  function renderNTItem() {
    ntState.answerSelected = false;
    var item = ntState.currentItems[ntState.currentIndex];

    ntProgressEl.textContent = (ntState.currentIndex + 1) + ' / ' + ntState.currentItems.length;

    // Reset all sections
    ntOptionsSection.style.display = 'none';
    ntNextBtn.style.display = 'none';
    ntSpeakBtn.style.display = 'none';
    ntReading.style.display = 'none';
    ntComposition.style.display = 'none';
    ntChoiceOptions.innerHTML = '';

    if (ntState.phase === 'learn') {
      renderLearnItem(item);
    } else if (ntState.phase === 'practice') {
      renderPracticeItem(item);
    } else if (ntState.phase === 'reverse') {
      renderReverseItem(item);
    } else if (ntState.phase === 'review') {
      if (item._reviewType === 'reverse') {
        renderReverseItem(item);
      } else {
        renderPracticeItem(item);
      }
    }
  }

  // ===== Learn phase =====
  function renderLearnItem(item) {
    ntPhaseLabel.textContent = '📖 Học';

    ntDisplay.textContent = item.value;

    // Reading: show primary + alt if exists
    ntReading.textContent = item.altReading
      ? item.reading + ' / ' + item.altReading
      : item.reading;
    ntReading.style.display = 'block';

    // Composition
    if (item.composition) {
      ntComposition.textContent = item.composition + '  →  ' + item.reading;
      ntComposition.style.display = 'block';
    }

    // TTS
    if (window.speechSynthesis) {
      ntSpeakBtn.style.display = 'inline-block';
      setTimeout(function() { speakJapanese(item.reading); }, 300);
    }

    ntNextBtn.style.display = 'inline-block';
  }

  // ===== Practice forward: number → reading =====
  function renderPracticeItem(item) {
    ntPhaseLabel.textContent = ntState.phase === 'review'
      ? '🔁 Ôn — Số → Đọc'
      : '✏️ Luyện — Số → Đọc';

    ntDisplay.textContent = item.value;
    ntOptionsSection.style.display = 'flex';
    renderReadingOptions(item);
  }

  // ===== Practice reverse: reading → number =====
  function renderReverseItem(item) {
    ntPhaseLabel.textContent = ntState.phase === 'review'
      ? '🔁 Ôn — Đọc → Số'
      : '🔄 Đảo — Đọc → Số';

    ntDisplay.textContent = item.reading;
    ntOptionsSection.style.display = 'flex';
    renderNumberOptions(item);
  }

  // ===== Generate MCQ: reading options =====
  function renderReadingOptions(item) {
    // Prefer options from same lesson, fall back to full pool
    var pool = getOptionPool(item);
    var wrongOpts = [];
    var attempts = 0;
    var maxAttempts = pool.length * 4;
    while (wrongOpts.length < 3 && attempts < maxAttempts) {
      var rand = pool[ntRandInt(pool.length)];
      if (rand.reading !== item.reading &&
          rand.reading !== item.altReading &&
          wrongOpts.indexOf(rand.reading) === -1) {
        wrongOpts.push(rand.reading);
      }
      attempts++;
    }
    var options = ntShuffle([item.reading].concat(wrongOpts));
    renderChoiceButtons(options, function(selected) {
      var correct = selected === item.reading ||
                    (item.altReading !== null && selected === item.altReading);
      handleNTAnswer(correct, item, selected, item.reading);
    });
  }

  // ===== Generate MCQ: number options =====
  function renderNumberOptions(item) {
    var pool = getOptionPool(item);
    var correctStr = String(item.value);
    var wrongOpts = [];
    var attempts = 0;
    var maxAttempts = pool.length * 4;
    while (wrongOpts.length < 3 && attempts < maxAttempts) {
      var rand = pool[ntRandInt(pool.length)];
      var valStr = String(rand.value);
      if (valStr !== correctStr && wrongOpts.indexOf(valStr) === -1) {
        wrongOpts.push(valStr);
      }
      attempts++;
    }
    var options = ntShuffle([correctStr].concat(wrongOpts));
    renderChoiceButtons(options, function(selected) {
      var correct = selected === correctStr;
      handleNTAnswer(correct, item, selected, correctStr);
    });
  }

  // Pool: same-lesson items preferred; fall back to full pool
  function getOptionPool(item) {
    var lesson = null;
    for (var i = 0; i < NUMBER_LESSONS.length; i++) {
      if (NUMBER_LESSONS[i].id === ntState.lessonId) { lesson = NUMBER_LESSONS[i]; break; }
    }
    if (lesson) {
      var lessonPool = numberData.filter(function(d) {
        return lesson.filter(d) && d.value !== item.value;
      });
      if (lessonPool.length >= 3) return lessonPool;
    }
    return numberData.filter(function(d) { return d.value !== item.value; });
  }

  // ===== Render choice buttons =====
  function renderChoiceButtons(options, onSelect) {
    ntChoiceOptions.innerHTML = '';
    options.forEach(function(opt) {
      var btn = document.createElement('button');
      btn.className = 'nt-choice-btn';
      btn.textContent = opt;
      btn.addEventListener('click', function() {
        if (ntState.answerSelected) return;
        ntState.answerSelected = true;
        onSelect(opt);
      });
      ntChoiceOptions.appendChild(btn);
    });
  }

  // ===== Handle answer =====
  function handleNTAnswer(correct, item, selected, correctDisplay) {
    // Disable all buttons and highlight
    var btns = ntChoiceOptions.querySelectorAll('.nt-choice-btn');
    btns.forEach(function(btn) {
      btn.disabled = true;
      if (btn.textContent === selected) {
        btn.classList.add(correct ? 'correct' : 'wrong');
      }
      if (!correct && btn.textContent === correctDisplay) {
        btn.classList.add('correct');
      }
    });

    // Track wrong: dedupe by value
    if (!correct) {
      var already = false;
      for (var i = 0; i < ntState.wrongItems.length; i++) {
        if (ntState.wrongItems[i].value === item.value) { already = true; break; }
      }
      if (!already) ntState.wrongItems.push(item);
    }

    setTimeout(function() { advanceNT(); }, 900);
  }

  // ===== Advance to next item / next phase =====
  function advanceNT() {
    ntState.currentIndex++;
    if (ntState.currentIndex < ntState.currentItems.length) {
      renderNTItem();
      return;
    }

    // Phase exhausted
    if (ntState.phase === 'learn') {
      ntState.phase = 'practice';
      ntState.currentItems = ntShuffle(ntState.lessonItems.slice());
      ntState.currentIndex = 0;
      renderNTItem();

    } else if (ntState.phase === 'practice') {
      ntState.phase = 'reverse';
      ntState.currentItems = ntShuffle(ntState.lessonItems.slice());
      ntState.currentIndex = 0;
      renderNTItem();

    } else if (ntState.phase === 'reverse') {
      if (ntState.wrongItems.length > 0) {
        // Build review items with mixed forward/reverse type
        var reviewItems = ntShuffle(ntState.wrongItems.slice()).map(function(it) {
          return Object.assign({}, it, {
            _reviewType: Math.random() < 0.5 ? 'practice' : 'reverse'
          });
        });
        ntState.reviewTotal = reviewItems.length;
        ntState.phase = 'review';
        ntState.currentItems = reviewItems;
        ntState.currentIndex = 0;
        ntState.wrongItems = []; // reset — will track new wrongs during review
        renderNTItem();
      } else {
        showNTSummary();
      }

    } else if (ntState.phase === 'review') {
      showNTSummary();
    }
  }

  // ===== Summary screen =====
  function showNTSummary() {
    ntScreen.style.display = 'none';
    var wrongCount  = ntState.wrongItems.length; // still wrong after review
    var reviewCount = ntState.reviewTotal;

    if (reviewCount === 0) {
      ntSummaryTitle.textContent = 'Hoàn thành!';
      ntSummaryContent.innerHTML =
        '<p class="nt-summary-perfect">Xuất sắc! Bạn nhớ hết tất cả các số. 🎉</p>';
    } else if (wrongCount === 0) {
      ntSummaryTitle.textContent = 'Hoàn thành!';
      ntSummaryContent.innerHTML =
        '<p class="nt-summary-good">Tốt lắm! Đã ôn xong ' + reviewCount + ' số cần luyện thêm. 👍</p>';
    } else {
      ntSummaryTitle.textContent = 'Kết Quả';
      ntSummaryContent.innerHTML =
        '<p>Còn <span class="nt-count-wrong">' + wrongCount + '</span> số cần ôn thêm.</p>';
    }

    ntRetryBtn.style.display = wrongCount > 0 ? 'inline-block' : 'none';
    ntSummaryScreen.style.display = 'flex';
  }

  // ===== Start a retry review session =====
  function startRetryReview() {
    if (ntState.wrongItems.length === 0) return;
    var reviewItems = ntShuffle(ntState.wrongItems.slice()).map(function(it) {
      return Object.assign({}, it, {
        _reviewType: Math.random() < 0.5 ? 'practice' : 'reverse'
      });
    });
    ntState.reviewTotal  = reviewItems.length;
    ntState.phase        = 'review';
    ntState.currentItems = reviewItems;
    ntState.currentIndex = 0;
    ntState.wrongItems   = [];
    ntSummaryScreen.style.display = 'none';
    ntScreen.style.display = 'flex';
    renderNTItem();
  }

  // ===== Event listeners =====
  ntBtn.addEventListener('click', function() {
    modeSelectionScreen.style.display = 'none';
    renderNTLessons();
    ntLessonScreen.style.display = 'flex';
  });

  backFromNTLessonBtn.addEventListener('click', function() {
    ntLessonScreen.style.display = 'none';
    modeSelectionScreen.style.display = 'flex';
  });

  ntSpeakBtn.addEventListener('click', function() {
    var item = ntState.currentItems[ntState.currentIndex];
    if (item) speakJapanese(item.reading);
  });

  ntNextBtn.addEventListener('click', advanceNT);

  ntExitBtn.addEventListener('click', function() {
    ntScreen.style.display = 'none';
    ntState.phase        = null;
    ntState.currentItems = [];
    ntState.currentIndex = 0;
    ntState.wrongItems   = [];
    renderNTLessons();
    ntLessonScreen.style.display = 'flex';
  });

  ntRetryBtn.addEventListener('click', startRetryReview);

  ntChooseLessonBtn.addEventListener('click', function() {
    ntSummaryScreen.style.display = 'none';
    renderNTLessons();
    ntLessonScreen.style.display = 'flex';
  });

  ntHomeBtn.addEventListener('click', function() {
    ntSummaryScreen.style.display = 'none';
    modeSelectionScreen.style.display = 'flex';
  });

});
