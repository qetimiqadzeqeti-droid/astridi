/**
 * app.js - მთავარი ლოგიკა და ინტერაქცია
 * ასტრიდ ლინდგრენის კვირეული — II - III კლასები (II ა და II ბ)
 */

// გლობალური მდგომარეობა (State)
const state = {
  currentClass: "II ა",
  studentName: "პატარა მკითხველი",
  teacherName: "დაწყებითი კლასების მასწავლებელი",
  dateText: "ნოემბერი, 2026 წელი",
  missions: {
    pippi: { itemsFound: new Set(), quizSolved: new Set(), done: false },
    karlsson: { itemsFound: new Set(), quizSolved: new Set(), done: false },
    emil: { itemsFound: new Set(), quizSolved: new Set(), done: false },
    ronia: { itemsFound: new Set(), quizSolved: new Set(), done: false },
    library: { solved: new Set(), done: false }
  }
};

// აპლიკაციის ინიციალიზაცია ჩატვირთვისას
document.addEventListener("DOMContentLoaded", () => {
  initDate();
  renderAllCharacters();
  renderLibrarySimulator();
  updateProgressUI();
  setupConfettiCanvas();

  // კლასის ავტომატური სინქრონიზაცია
  const classSelect = document.getElementById("student-class-select");
  if (classSelect) {
    classSelect.value = state.currentClass + " კლასი";
  }
});

// თარიღის ინიციალიზაცია
function initDate() {
  const now = new Date();
  const monthsGeo = [
    "იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი",
    "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი"
  ];
  const curMonth = monthsGeo[now.getMonth()] || "ნოემბერი";
  const curYear = now.getFullYear();
  state.dateText = `${curMonth}, ${curYear} წელი`;
  const dateEl = document.getElementById("cert-display-date");
  if (dateEl) dateEl.textContent = state.dateText;
}

// ============================================================
// ნავიგაცია (NAVIGATION)
// ============================================================
function navigateTo(viewId) {
  playChime();

  // ყველა სექციის დამალვა
  document.querySelectorAll(".view-section").forEach(sec => {
    sec.classList.remove("active");
  });

  // სამიზნე სექციის ჩვენება
  const targetSec = document.getElementById(`view-${viewId}`);
  if (targetSec) {
    targetSec.classList.add("active");
  }

  // ნავიგაციის ღილაკების გააქტიურება
  document.querySelectorAll(".nav-btn").forEach(btn => {
    if (btn.getAttribute("data-target") === viewId) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // სქროლი ზემოთ
  window.scrollTo({ top: 0, behavior: "smooth" });

  // თუ სერტიფიკატის გვერდზე გადავედით, განვაახლოთ პრევიუ
  if (viewId === "certificate") {
    updateCertPreview();
  }
}

// ============================================================
// კლასის არჩევა (II ა / II ბ / III კლასი)
// ============================================================
function selectClass(className) {
  state.currentClass = className;
  playChime();

  const btn2a = document.getElementById("btn-class-2a");
  const btn2b = document.getElementById("btn-class-2b");
  const btn3 = document.getElementById("btn-class-3");
  const classSelect = document.getElementById("student-class-select");
  const subTitle = document.getElementById("header-subtitle-text");

  [btn2a, btn2b, btn3].forEach(b => {
    if (b) b.classList.remove("active");
  });

  if (className === "II ა") {
    if (btn2a) btn2a.classList.add("active");
    if (classSelect) classSelect.value = "II ა კლასი";
    if (subTitle) subTitle.textContent = "საგანმანათლებლო მოგზაურობა • II ა კლასი 🌟";
  } else if (className === "II ბ") {
    if (btn2b) btn2b.classList.add("active");
    if (classSelect) classSelect.value = "II ბ კლასი";
    if (subTitle) subTitle.textContent = "საგანმანათლებლო მოგზაურობა • II ბ კლასი 🎈";
  } else {
    if (btn3) btn3.classList.add("active");
    if (classSelect) classSelect.value = "III კლასი";
    if (subTitle) subTitle.textContent = "საგანმანათლებლო მოგზაურობა • III კლასი 🚀";
  }

  updateCertPreview();
}

// ============================================================
// პერსონაჟების თამაშების გენერაცია და რენდერი
// ============================================================
function renderAllCharacters() {
  const charKeys = ["pippi", "karlsson", "emil", "ronia"];
  charKeys.forEach(key => {
    renderCharacterVocab(key);
    renderCharacterItems(key);
    renderCharacterQuiz(key);
  });
}

// 1. პატარა სიტყვარის რენდერი (ეთნიკური უმცირესობის მოსწავლეებისთვის)
function renderCharacterVocab(charKey) {
  const container = document.getElementById(`${charKey}-vocab-grid`);
  if (!container) return;

  const charData = APP_DATA[charKey];
  if (!charData || !charData.vocab) return;

  container.innerHTML = "";
  charData.vocab.forEach(v => {
    const card = document.createElement("div");
    card.className = "vocab-card";
    card.title = "დააწკაპუნე სიტყვის მოსასმენად";
    card.innerHTML = `
      <span class="vocab-word">${v.emoji} ${v.word}</span>
      <span class="vocab-def">${v.def}</span>
    `;

    card.addEventListener("click", () => {
      playChime();
      card.style.transform = "scale(1.05)";
      card.style.borderColor = "#3B82F6";
      setTimeout(() => {
        card.style.transform = "";
        card.style.borderColor = "";
      }, 400);

      if ('speechSynthesis' in window) {
        if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(`${v.word}. ${v.def}`);
        utter.lang = "ka-GE";
        utter.rate = 0.9;
        window.speechSynthesis.speak(utter);
      }
    });

    container.appendChild(card);
  });
}

// 2. ნივთების ბადის რენდერი & მთვლელი
function renderCharacterItems(charKey) {
  const container = document.getElementById(`${charKey}-items-grid`);
  if (!container) return;

  const charData = APP_DATA[charKey];
  container.innerHTML = "";

  // განვაახლოთ მთვლელის ტექსტი
  updateItemsCounter(charKey);

  // ნივთების არევა (Shuffle)
  const itemsShuffled = [...charData.items].sort(() => Math.random() - 0.5);

  itemsShuffled.forEach(item => {
    const tile = document.createElement("div");
    tile.className = "item-tile";
    tile.id = `item-tile-${charKey}-${item.id}`;
    tile.innerHTML = `
      <span class="item-emoji">${item.emoji}</span>
      <span class="item-name">${item.name}</span>
    `;

    tile.addEventListener("click", () => {
      handleItemClick(charKey, item, tile);
    });

    container.appendChild(tile);
  });
}

function updateItemsCounter(charKey) {
  const counterEl = document.getElementById(`${charKey}-counter-text`);
  const barEl = document.getElementById(`${charKey}-counter-bar`);
  if (!counterEl) return;

  const count = state.missions[charKey].itemsFound.size;
  counterEl.textContent = `${count} / 4`;

  if (count === 4 && barEl) {
    barEl.classList.add("completed");
    barEl.innerHTML = "<span>🎉 ყველა ნივთი შეგროვებულია! (4 / 4) ⭐</span>";
  }
}

// ნივთზე დაჭერის დამმუშავებელი
function handleItemClick(charKey, item, tile) {
  const feedbackEl = document.getElementById(`${charKey}-items-feedback`);

  if (item.isCorrect) {
    // სწორი ნივთი
    if (!state.missions[charKey].itemsFound.has(item.id)) {
      tile.classList.add("selected-correct");
      playSuccess();
      state.missions[charKey].itemsFound.add(item.id);
      updateItemsCounter(charKey);

      if (feedbackEl) {
        feedbackEl.className = "act-feedback success";
        feedbackEl.textContent = `🌟 ${item.hint}`;
      }

      // შევამოწმოთ, ყველა სწორი ნივთი ნაპოვნია თუ არა (სულ 4 სწორია)
      if (state.missions[charKey].itemsFound.size === 4) {
        playStar();
        if (feedbackEl) {
          feedbackEl.textContent = "🎉 ყოჩაღ! შენ იპოვე ყველა ჯადოსნური ნივთი!";
        }
        checkCharacterCompletion(charKey);
      }
    }
  } else {
    // არასწორი ნივთი (მეგობრული მინიშნება)
    tile.classList.add("selected-wrong");
    playGentleBoop();
    setTimeout(() => {
      tile.classList.remove("selected-wrong");
    }, 500);

    if (feedbackEl) {
      feedbackEl.className = "act-feedback hint";
      feedbackEl.textContent = `💡 ${item.hint}`;
    }
  }
}

// 3. ვიქტორინის რენდერი
function renderCharacterQuiz(charKey) {
  const container = document.getElementById(`${charKey}-quiz-container`);
  if (!container) return;

  const charData = APP_DATA[charKey];
  container.innerHTML = "";

  charData.quiz.forEach((q, qIndex) => {
    const qBox = document.createElement("div");
    qBox.className = "quiz-question-box";

    const qTitle = document.createElement("div");
    qTitle.className = "quiz-q-text";
    qTitle.textContent = q.question;
    qBox.appendChild(qTitle);

    const optWrap = document.createElement("div");
    optWrap.className = "quiz-options";

    q.options.forEach((opt, optIndex) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-opt-btn";
      btn.id = `qbtn-${charKey}-${qIndex}-${optIndex}`;
      btn.innerHTML = `<span>${opt.text}</span>`;

      btn.addEventListener("click", () => {
        handleQuizClick(charKey, qIndex, opt, btn, optWrap);
      });

      optWrap.appendChild(btn);
    });

    qBox.appendChild(optWrap);
    container.appendChild(qBox);
  });
}

// ვიქტორინის პასუხზე დაჭერა
function handleQuizClick(charKey, qIndex, opt, btn, optWrap) {
  if (opt.correct) {
    btn.classList.add("correct");
    playSuccess();
    state.missions[charKey].quizSolved.add(qIndex);

    // ამ კითხვის სხვა ღილაკების დაბლოკვა
    optWrap.querySelectorAll("button").forEach(b => {
      b.style.pointerEvents = "none";
      if (b !== btn) b.style.opacity = "0.5";
    });

    // შევამოწმოთ, ყველა კითხვა ამოხსნილია თუ არა
    const totalQuestions = APP_DATA[charKey].quiz.length;
    if (state.missions[charKey].quizSolved.size === totalQuestions) {
      playStar();
      checkCharacterCompletion(charKey);
    }
  } else {
    btn.classList.add("wrong");
    playGentleBoop();
    setTimeout(() => {
      btn.classList.remove("wrong");
    }, 600);
  }
}

// პერსონაჟის მისიის დასრულების შემოწმება
function checkCharacterCompletion(charKey) {
  const isItemsDone = state.missions[charKey].itemsFound.size === 4;
  const isQuizDone = state.missions[charKey].quizSolved.size === APP_DATA[charKey].quiz.length;

  if (isItemsDone && isQuizDone && !state.missions[charKey].done) {
    state.missions[charKey].done = true;
    playFanfare();
    triggerMiniConfetti();

    // ჰედერისა და ნავის სტატუსის განახლება
    const pill = document.getElementById(`${charKey}-status-pill`);
    if (pill) {
      pill.classList.add("completed");
      pill.innerHTML = "<span>🎉 მისია შესრულებულია! ⭐ ოქროს მედალი მიღებულია!</span>";
    }

    const cardBadge = document.getElementById(`card-badge-${charKey}`);
    if (cardBadge) {
      cardBadge.classList.add("completed");
      cardBadge.textContent = "შესრულებულია! ⭐";
    }

    const navStar = document.getElementById(`nav-star-${charKey}`);
    if (navStar) navStar.textContent = "⭐";

    updateProgressUI();
  }
}

// ============================================================
// საუნივერსიტეტო ბიბლიოთეკის სიმულატორი
// ============================================================
function renderLibrarySimulator() {
  const container = document.getElementById("library-sim-container");
  if (!container) return;
  container.innerHTML = "";

  APP_DATA.libraryScenarios.forEach((sc, index) => {
    const box = document.createElement("div");
    box.className = "sim-scenario-box";
    box.id = `scenario-box-${sc.id}`;

    box.innerHTML = `
      <div class="scenario-text">
        <span style="font-size: 1.6rem;">${sc.icon}</span>
        <span>${sc.text}</span>
      </div>
      <div class="scenario-buttons">
        <button type="button" class="choice-btn choice-yes" id="btn-yes-${sc.id}">✅ კი, სწორია!</button>
        <button type="button" class="choice-btn choice-no" id="btn-no-${sc.id}">❌ არა, არ შეიძლება!</button>
      </div>
    `;

    const btnYes = box.querySelector(`#btn-yes-${sc.id}`);
    const btnNo = box.querySelector(`#btn-no-${sc.id}`);

    btnYes.addEventListener("click", () => handleSimChoice(sc, true, box, btnYes, btnNo));
    btnNo.addEventListener("click", () => handleSimChoice(sc, false, box, btnNo, btnYes));

    container.appendChild(box);
  });
}

function handleSimChoice(sc, chosenYes, box, activeBtn, otherBtn) {
  const isCorrect = (chosenYes === sc.isGood);

  if (isCorrect) {
    playSuccess();
    state.missions.library.solved.add(sc.id);

    box.style.borderColor = "#10B981";
    box.style.background = "#ECFDF5";
    activeBtn.style.background = "#10B981";
    activeBtn.style.color = "#FFFFFF";
    otherBtn.style.display = "none";

    // შევამოწმოთ ყველა სიტუაცია
    if (state.missions.library.solved.size === APP_DATA.libraryScenarios.length && !state.missions.library.done) {
      state.missions.library.done = true;
      playFanfare();
      triggerConfettiAndCheer();

      const libPill = document.getElementById("library-status-pill");
      if (libPill) {
        libPill.classList.add("completed");
        libPill.innerHTML = "<span>🎉 ბიბლიოთეკის მისია შესრულებულია! ⭐ ოქროს მედალი გახსნილია!</span>";
      }

      const navStar = document.getElementById("nav-star-library");
      if (navStar) navStar.textContent = "⭐";

      const unlockBox = document.getElementById("cert-unlock-box");
      if (unlockBox) {
        unlockBox.style.animation = "pulseStar 1s infinite alternate";
      }

      updateProgressUI();
    }
  } else {
    playGentleBoop();
    box.style.borderColor = "#EF4444";
    box.style.background = "#FEF2F2";
    setTimeout(() => {
      box.style.borderColor = "#CBD5E1";
      box.style.background = "#F8FAFC";
    }, 700);
  }
}

// ============================================================
// პროგრესისა და ვარსკვლავების განახლება (UI)
// ============================================================
function updateProgressUI() {
  const keys = ["pippi", "karlsson", "emil", "ronia", "library"];
  let completedCount = 0;

  keys.forEach(key => {
    const isDone = state.missions[key].done;
    if (isDone) completedCount++;

    const indicator = document.getElementById(getIndicatorId(key));
    if (indicator) {
      if (isDone) {
        indicator.classList.add("completed");
        indicator.innerHTML = indicator.innerHTML.replace("⚪", "⭐");
      }
    }
  });

  // ვარსკვლავების რაოდენობა
  const countEl = document.getElementById("star-count");
  if (countEl) countEl.textContent = completedCount;

  // პროცენტული პროგრესი
  const percent = Math.round((completedCount / keys.length) * 100);
  const fillEl = document.getElementById("progress-bar-fill");
  const percentEl = document.getElementById("progress-percent-text");
  if (fillEl) fillEl.style.width = `${percent}%`;
  if (percentEl) percentEl.textContent = `${percent}% დასრულებულია (${completedCount}/5 მისია)`;
}

function getIndicatorId(key) {
  const map = {
    pippi: "badge-pip-indicator",
    karlsson: "badge-karl-indicator",
    emil: "badge-emil-indicator",
    ronia: "badge-ron-indicator",
    library: "badge-lib-indicator"
  };
  return map[key];
}

// ============================================================
// სერტიფიკატის გადახედვა და განახლება
// ============================================================
function updateCertPreview() {
  const nameInput = document.getElementById("student-name-input");
  const classSelect = document.getElementById("student-class-select");
  const teacherInput = document.getElementById("teacher-name-input");

  const displayName = document.getElementById("cert-display-name");
  const displayClass = document.getElementById("cert-display-class");
  const displayTeacher = document.getElementById("cert-display-teacher");

  if (nameInput && displayName) {
    const val = nameInput.value.trim();
    displayName.textContent = val || "პატარა მკითხველი";
    state.studentName = displayName.textContent;
  }

  if (classSelect && displayClass) {
    displayClass.textContent = classSelect.value;
  }

  if (teacherInput && displayTeacher) {
    const val = teacherInput.value.trim();
    displayTeacher.textContent = val || "დაწყებითი კლასების მასწავლებელი";
    state.teacherName = displayTeacher.textContent;
  }
}

// სერტიფიკატის დაბეჭდვა
function printCertificate() {
  updateCertPreview();
  playSuccess();
  window.print();
}

// ============================================================
// ხმამაღლა წაკითხვა და ვიზუალური კარაოკე (Audio & Visual Karaoke)
// ============================================================
let readingInterval = null;

function speakText(storyBoxId) {
  const storyBox = document.getElementById(storyBoxId);
  if (!storyBox) return;

  const sentences = storyBox.querySelectorAll(".story-sentence");
  if (!sentences || sentences.length === 0) return;

  // თუ უკვე აქტიურია, შევაჩეროთ
  if (readingInterval || (window.speechSynthesis && window.speechSynthesis.speaking)) {
    stopReading(storyBox);
    return;
  }

  playChime();

  // Web Speech API მომზადება
  let fullText = "";
  sentences.forEach(s => {
    fullText += s.innerText.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim() + " ";
  });

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = "ka-GE";
    utterance.rate = 0.88; // ოდნავ ნელი, ბავშვებისთვის გასაგები ტემპი
    utterance.pitch = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const kaVoice = voices.find(v => v.lang.startsWith("ka") || v.name.toLowerCase().includes("georgian"));
    if (kaVoice) utterance.voice = kaVoice;

    utterance.onend = () => stopReading(storyBox);
    utterance.onerror = () => stopReading(storyBox);

    try {
      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  }

  // ვიზუალური კარაოკე / Sentence-by-sentence highlighter
  storyBox.classList.add("reading-active-box");
  let currentIdx = 0;

  function highlightSentence(idx) {
    sentences.forEach((s, i) => {
      if (i === idx) {
        s.classList.add("active-reading");
        playChime();
      } else {
        s.classList.remove("active-reading");
      }
    });
  }

  highlightSentence(0);

  // 3.8 წამი თითოეულ წინადადებაზე — იდეალური ტემპი მე-2/3 კლასელებისთვის
  readingInterval = setInterval(() => {
    currentIdx++;
    if (currentIdx < sentences.length) {
      highlightSentence(currentIdx);
    } else {
      stopReading(storyBox);
    }
  }, 3800);
}

function stopReading(storyBox) {
  if (readingInterval) {
    clearInterval(readingInterval);
    readingInterval = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  if (storyBox) {
    storyBox.classList.remove("reading-active-box");
    storyBox.querySelectorAll(".story-sentence").forEach(s => s.classList.remove("active-reading"));
  }
}

// ბიბლიოთეკის წესების ხმამაღლა წაკითხვა
function speakSingleRule(ruleNum, text) {
  playChime();
  const card = document.getElementById(`rule-card-${ruleNum}`);
  if (card) {
    card.style.borderColor = "#6366F1";
    card.style.boxShadow = "0 0 20px rgba(99, 102, 241, 0.35)";
    setTimeout(() => {
      card.style.borderColor = "";
      card.style.boxShadow = "";
    }, 2500);
  }

  if (!('speechSynthesis' in window)) return;
  if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ka-GE";
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

function speakAllRules() {
  playChime();
  const allText = "ბიბლიოთეკის ოთხი ოქროს წესი: " +
    "პირველი — ჩურჩულის წესი: ბიბლიოთეკაში ვსაუბრობთ ჩურჩულით და წყნარად. " +
    "მეორე — სუფთა ხელების წესი: წიგნებს ვეხებით მხოლოდ სუფთა ხელებით, წიგნთან არ ვჭამთ საჭმელს. " +
    "მესამე — მშვიდი ნაბიჯის წესი: დავდივართ მშვიდად, არ დავრბივართ. " +
    "მეოთხე — წიგნის მოფრთხილების წესი: ფურცლებს ვშლით ნაზად და წიგნს ვუფრთხილდებით!";

  if (!('speechSynthesis' in window)) return;
  if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(allText);
  utterance.lang = "ka-GE";
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

// ============================================================
// მასწავლებლის გზამკვლევის მოდალი
// ============================================================
function openTeacherModal() {
  playChime();
  const modal = document.getElementById("teacher-modal");
  if (modal) modal.classList.add("active");
}

function closeTeacherModal(event) {
  if (event && event.target !== event.currentTarget && !event.target.classList.contains("close-modal-btn")) {
    return;
  }
  const modal = document.getElementById("teacher-modal");
  if (modal) modal.classList.remove("active");
}

// ============================================================
// კონფეტის სისტემა (CANVAS CONFETTI)
// ============================================================
let confettiCanvas, confettiCtx;
let confettiParticles = [];
let confettiAnimationId = null;

function setupConfettiCanvas() {
  confettiCanvas = document.getElementById("confetti-canvas");
  if (!confettiCanvas) return;
  confettiCtx = confettiCanvas.getContext("2d");

  function resize() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);
}

function triggerMiniConfetti() {
  createConfettiBurst(40, window.innerWidth / 2, window.innerHeight / 2);
}

function triggerConfettiAndCheer() {
  playFanfare();
  setTimeout(() => playApplause(), 500);

  // სამი ტალღა კონფეტი
  createConfettiBurst(60, window.innerWidth * 0.3, window.innerHeight * 0.4);
  setTimeout(() => createConfettiBurst(60, window.innerWidth * 0.7, window.innerHeight * 0.4), 250);
  setTimeout(() => createConfettiBurst(80, window.innerWidth * 0.5, window.innerHeight * 0.3), 500);
}

function createConfettiBurst(count, originX, originY) {
  if (!confettiCanvas) setupConfettiCanvas();
  if (!confettiCtx) return;

  const colors = ["#FF5722", "#FFC107", "#4CAF50", "#03A9F4", "#E91E63", "#9C27B0", "#FFEB3B"];

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 4;
    confettiParticles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      w: Math.random() * 8 + 6,
      h: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 10 - 5,
      gravity: 0.25,
      opacity: 1
    });
  }

  if (!confettiAnimationId) {
    animateConfetti();
  }
}

function animateConfetti() {
  if (!confettiCtx || !confettiCanvas) return;
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  for (let i = 0; i < confettiParticles.length; i++) {
    const p = confettiParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.rotation += p.rotationSpeed;
    p.opacity -= 0.007;

    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate((p.rotation * Math.PI) / 180);
    confettiCtx.fillStyle = p.color;
    confettiCtx.globalAlpha = Math.max(0, p.opacity);
    confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    confettiCtx.restore();
  }

  // ამოვშალოთ გაუჩინარებული ნაწილაკები
  confettiParticles = confettiParticles.filter(p => p.opacity > 0 && p.y < confettiCanvas.height + 50);

  if (confettiParticles.length > 0) {
    confettiAnimationId = requestAnimationFrame(animateConfetti);
  } else {
    confettiAnimationId = null;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }
}
