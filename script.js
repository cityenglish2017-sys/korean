/* =========================================================
   아준 역무원 - 사라진 글자 승차권
   script.js
   ========================================================= */

const JAMO = {
  consonants: [
    { ch: "ㄱ", name: "기역", sound: "그" },
    { ch: "ㄴ", name: "니은", sound: "느" },
    { ch: "ㄷ", name: "디귿", sound: "드" },
    { ch: "ㄹ", name: "리을", sound: "르" },
    { ch: "ㅁ", name: "미음", sound: "므" },
    { ch: "ㅂ", name: "비읍", sound: "브" },
    { ch: "ㅅ", name: "시옷", sound: "스" },
    { ch: "ㅇ", name: "이응", sound: "으" },
    { ch: "ㅈ", name: "지읒", sound: "즈" },
    { ch: "ㅊ", name: "치읓", sound: "츠" },
    { ch: "ㅋ", name: "키읔", sound: "크" },
    { ch: "ㅌ", name: "티읕", sound: "트" },
    { ch: "ㅍ", name: "피읖", sound: "프" },
    { ch: "ㅎ", name: "히읗", sound: "흐" }
  ],

  vowels: [
    { ch: "ㅏ", name: "아", sound: "아" },
    { ch: "ㅑ", name: "야", sound: "야" },
    { ch: "ㅓ", name: "어", sound: "어" },
    { ch: "ㅕ", name: "여", sound: "여" },
    { ch: "ㅗ", name: "오", sound: "오" },
    { ch: "ㅛ", name: "요", sound: "요" },
    { ch: "ㅜ", name: "우", sound: "우" },
    { ch: "ㅠ", name: "유", sound: "유" },
    { ch: "ㅡ", name: "으", sound: "으" },
    { ch: "ㅣ", name: "이", sound: "이" }
  ],

  doubleConsonants: [
    { ch: "ㄲ", name: "쌍기역", sound: "끄" },
    { ch: "ㄸ", name: "쌍디귿", sound: "뜨" },
    { ch: "ㅃ", name: "쌍비읍", sound: "쁘" },
    { ch: "ㅆ", name: "쌍시옷", sound: "쓰" },
    { ch: "ㅉ", name: "쌍지읒", sound: "쯔" }
  ],

  complexVowels: [
    { ch: "ㅐ", name: "애", sound: "애" },
    { ch: "ㅔ", name: "에", sound: "에" },
    { ch: "ㅒ", name: "얘", sound: "얘" },
    { ch: "ㅖ", name: "예", sound: "예" },
    { ch: "ㅘ", name: "와", sound: "와" },
    { ch: "ㅙ", name: "왜", sound: "왜" },
    { ch: "ㅚ", name: "외", sound: "외" },
    { ch: "ㅝ", name: "워", sound: "워" },
    { ch: "ㅞ", name: "웨", sound: "웨" },
    { ch: "ㅟ", name: "위", sound: "위" },
    { ch: "ㅢ", name: "의", sound: "의" }
  ]
};

/* ---------------------------------------------------------
   단어 데이터
   아준이가 의미를 쉽게 아는 기차/일상 단어 중심
   --------------------------------------------------------- */

const WORDS = [
  { word: "기차", emoji: "🚆", category: "train" },
  { word: "기차역", emoji: "🚉", category: "train" },
  { word: "열차", emoji: "🚆", category: "train" },
  { word: "역무원", emoji: "👨‍✈️", category: "train" },
  { word: "승강장", emoji: "🚉", category: "train" },
  { word: "출발", emoji: "🚦", category: "train" },
  { word: "도착", emoji: "🏁", category: "train" },
  { word: "서울", emoji: "🏙️", category: "station" },
  { word: "부산", emoji: "🌊", category: "station" },
  { word: "대전", emoji: "🏙️", category: "station" },
  { word: "동대구", emoji: "🚉", category: "station" },
  { word: "창원", emoji: "🏙️", category: "station" },
  { word: "마산", emoji: "🚉", category: "station" },
  { word: "진주", emoji: "🏯", category: "station" },
  { word: "수서", emoji: "🚄", category: "station" },
  { word: "학교", emoji: "🏫", category: "daily" },
  { word: "사과", emoji: "🍎", category: "daily" },
  { word: "바나나", emoji: "🍌", category: "daily" },
  { word: "우유", emoji: "🥛", category: "daily" },
  { word: "자동차", emoji: "🚗", category: "daily" },
  { word: "비행기", emoji: "✈️", category: "daily" },
  { word: "강아지", emoji: "🐶", category: "daily" },
  { word: "고양이", emoji: "🐱", category: "daily" },
  { word: "토끼", emoji: "🐰", category: "daily" },
  { word: "아빠", emoji: "👨", category: "family" },
  { word: "엄마", emoji: "👩", category: "family" },
  { word: "할머니", emoji: "👵", category: "family" },
  { word: "할아버지", emoji: "👴", category: "family" },
  { word: "아준", emoji: "👦", category: "family" },
  { word: "이서", emoji: "👧", category: "family" }
];

/* ---------------------------------------------------------
   게임 상태
   --------------------------------------------------------- */

let state = {
  level: 1,
  score: 0,
  streak: 0,
  solved: 0,
  includeAdvanced: false,
  current: null,
  drawing: false,
  lastX: 0,
  lastY: 0
};

/* ---------------------------------------------------------
   DOM
   --------------------------------------------------------- */

const $ = id => document.getElementById(id);

const canvas =
  $("writingCanvas") ||
  $("drawCanvas") ||
  $("canvas");

let ctx = canvas ? canvas.getContext("2d") : null;

/* ---------------------------------------------------------
   한글 분해
   --------------------------------------------------------- */

const CHOSEONG = [
  "ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ",
  "ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"
];

const JUNGSEONG = [
  "ㅏ","ㅐ","ㅑ","ㅒ","ㅓ","ㅔ","ㅕ","ㅖ",
  "ㅗ","ㅘ","ㅙ","ㅚ","ㅛ",
  "ㅜ","ㅝ","ㅞ","ㅟ","ㅠ",
  "ㅡ","ㅢ","ㅣ"
];

const JONGSEONG = [
  "",
  "ㄱ","ㄲ","ㄳ","ㄴ","ㄵ","ㄶ","ㄷ","ㄹ","ㄺ","ㄻ",
  "ㄼ","ㄽ","ㄾ","ㄿ","ㅀ","ㅁ","ㅂ","ㅄ","ㅅ","ㅆ",
  "ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"
];

function decomposeHangul(char) {

  const code = char.charCodeAt(0);

  if (code < 0xac00 || code > 0xd7a3) {
    return null;
  }

  const syllableIndex = code - 0xac00;

  const choIndex = Math.floor(syllableIndex / 588);
  const jungIndex = Math.floor((syllableIndex % 588) / 28);
  const jongIndex = syllableIndex % 28;

  return {
    char,
    initial: CHOSEONG[choIndex],
    vowel: JUNGSEONG[jungIndex],
    final: JONGSEONG[jongIndex]
  };
}

/* ---------------------------------------------------------
   자모 정보
   --------------------------------------------------------- */

function getJamoInfo(ch) {

  const all = [
    ...JAMO.consonants,
    ...JAMO.vowels,
    ...JAMO.doubleConsonants,
    ...JAMO.complexVowels
  ];

  return all.find(item => item.ch === ch) || {
    ch,
    name: ch,
    sound: ch
  };
}

function isVowel(ch) {
  return [...JAMO.vowels, ...JAMO.complexVowels]
    .some(item => item.ch === ch);
}

function isConsonant(ch) {
  return [...JAMO.consonants, ...JAMO.doubleConsonants]
    .some(item => item.ch === ch);
}

/* ---------------------------------------------------------
   랜덤
   --------------------------------------------------------- */

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/* ---------------------------------------------------------
   문제 생성
   --------------------------------------------------------- */

function generateQuestion() {

  let candidates = WORDS.filter(item =>
    [...item.word].every(ch => decomposeHangul(ch))
  );

  let wordData = randomItem(candidates);

  let chars = [...wordData.word];

  let syllableIndex = Math.floor(Math.random() * chars.length);

  let syllable = chars[syllableIndex];

  let parts = decomposeHangul(syllable);

  if (!parts) {
    generateQuestion();
    return;
  }

  let answer;
  let type;

  switch (state.level) {

    /* 자음 하나 */
    case 1:
      answer = parts.initial;
      type = "consonant";
      break;

    /* 모음 하나 */
    case 2:
      answer = parts.vowel;
      type = "vowel";
      break;

    /* 자음/모음 랜덤 */
    case 3:
      if (Math.random() < 0.5) {
        answer = parts.initial;
        type = "consonant";
      } else {
        answer = parts.vowel;
        type = "vowel";
      }
      break;

    /* 한 글자 */
    case 4:
      answer = syllable;
      type = "syllable";
      break;

    /* 단어 전체 */
    case 5:
      answer = wordData.word;
      type = "word";
      break;

    default:
      answer = parts.initial;
      type = "consonant";
  }

  state.current = {
    word: wordData.word,
    emoji: wordData.emoji,
    syllableIndex,
    syllable,
    parts,
    answer,
    type
  };

  renderQuestion();
  clearCanvas();
}

/* ---------------------------------------------------------
   문제 화면 표시
   --------------------------------------------------------- */

function renderQuestion() {

  const q = state.current;

  if (!q) return;

  const wordDisplay =
    $("wordDisplay") ||
    $("ticketWord") ||
    $("questionWord");

  const mission =
    $("missionText") ||
    $("instruction");

  const emoji =
    $("wordEmoji") ||
    $("ticketEmoji");

  if (emoji) {
    emoji.textContent = q.emoji;
  }

  if (wordDisplay) {

    let display = "";

    if (q.type === "word") {

      display = "□ ".repeat([...q.word].length).trim();

    } else if (q.type === "syllable") {

      [...q.word].forEach((ch, index) => {

        if (index === q.syllableIndex) {
          display += " □ ";
        } else {
          display += ` ${ch} `;
        }

      });

    } else {

      [...q.word].forEach((ch, index) => {

        if (index !== q.syllableIndex) {
          display += ` ${ch} `;
          return;
        }

        const p = q.parts;

        if (q.type === "consonant") {

          display +=
            ` [ □ + ${p.vowel}${p.final ? " + " + p.final : ""} ] `;

        } else {

          display +=
            ` [ ${p.initial} + □${p.final ? " + " + p.final : ""} ] `;
        }

      });
    }

    wordDisplay.textContent = display;
  }

  if (mission) {

    if (q.type === "consonant") {
      mission.textContent =
        "🎫 승차권에서 자음 하나가 지워졌어요! 빈칸을 직접 써 주세요.";
    }

    if (q.type === "vowel") {
      mission.textContent =
        "🎫 승차권에서 모음 하나가 지워졌어요! 빈칸을 직접 써 주세요.";
    }

    if (q.type === "syllable") {
      mission.textContent =
        "🚆 글자 한 칸이 사라졌어요! 빠진 글자를 직접 써 주세요.";
    }

    if (q.type === "word") {
      mission.textContent =
        `🚄 목적지는 '${q.word}'입니다. 승차권에 단어 전체를 써 주세요!`;
    }
  }

  const destination = $("destination");

  if (destination) {
    destination.textContent = q.word;
  }
}

/* ---------------------------------------------------------
   Canvas 설정
   --------------------------------------------------------- */

function setupCanvas() {

  if (!canvas || !ctx) return;

  function resize() {

    const rect = canvas.getBoundingClientRect();

    const ratio = window.devicePixelRatio || 1;

    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#222";
  }

  resize();

  window.addEventListener("resize", resize);

  canvas.style.touchAction = "none";

  canvas.addEventListener("pointerdown", e => {

    state.drawing = true;

    const rect = canvas.getBoundingClientRect();

    state.lastX = e.clientX - rect.left;
    state.lastY = e.clientY - rect.top;

    canvas.setPointerCapture(e.pointerId);
  });

  canvas.addEventListener("pointermove", e => {

    if (!state.drawing) return;

    const rect = canvas.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(state.lastX, state.lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    state.lastX = x;
    state.lastY = y;
  });

  canvas.addEventListener("pointerup", () => {
    state.drawing = false;
  });

  canvas.addEventListener("pointercancel", () => {
    state.drawing = false;
  });
}

function clearCanvas() {

  if (!canvas || !ctx) return;

  const rect = canvas.getBoundingClientRect();

  ctx.clearRect(0, 0, rect.width, rect.height);
}

/* ---------------------------------------------------------
   정답 확인
   아이가 직접 쓴 것을 부모/아이와 비교하는 방식
   --------------------------------------------------------- */

function checkAnswer() {

  const q = state.current;

  if (!q) return;

  showComparePopup();
}

function showComparePopup() {

  const q = state.current;

  let overlay = document.createElement("div");

  overlay.className = "answer-overlay";

  overlay.innerHTML = `
    <div class="answer-card">

      <div class="answer-small">
        내가 쓴 글자와 정답을 비교해 보세요
      </div>

      <div class="answer-title">
        정답은
      </div>

      <div class="big-answer">
        ${q.answer}
      </div>

      <div class="answer-word">
        ${q.emoji} ${q.word}
      </div>

      <div class="answer-question">
        아준 역무원, 똑같이 썼나요?
      </div>

      <div class="answer-buttons">
        <button class="retry-btn">
          🔄 다시 써볼래요
        </button>

        <button class="correct-btn">
          ⭐ 맞게 썼어요!
        </button>
      </div>

    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector(".retry-btn")
    .addEventListener("click", () => {

      overlay.remove();

      clearCanvas();

      speak(
        `괜찮아요. 정답은 ${q.answer}입니다. 천천히 다시 써 보세요.`
      );
    });

  overlay.querySelector(".correct-btn")
    .addEventListener("click", () => {

      overlay.remove();

      state.score += 10;
      state.streak++;
      state.solved++;

      updateScore();

      showLearningPopup();
    });
}

/* ---------------------------------------------------------
   핵심 학습 팝업
   --------------------------------------------------------- */

function showLearningPopup() {

  const q = state.current;

  let title = "";
  let explanation = "";
  let speech = "";

  if (q.type === "consonant") {

    const info = getJamoInfo(q.answer);

    title = `🎉 ${q.answer} 완성!`;

    explanation = `
      <div class="jamo-big">${q.answer}</div>

      <div class="jamo-name">
        이 자음의 이름은
        <strong>${info.name}</strong>
        이에요.
      </div>

      <div class="jamo-example">
        <strong>${q.word}</strong>의
        '${q.syllable}'에서 사용되는 자음이에요.
      </div>

      <div class="jamo-combination">
        ${q.parts.initial} + ${q.parts.vowel}
        ${q.parts.final ? "+ " + q.parts.final : ""}
        → ${q.syllable}
      </div>
    `;

    speech =
      `딩동댕! 잘했어요 아준 역무원! ` +
      `지워진 ${q.answer}을 완성했어요. ` +
      `${q.answer}의 이름은 ${info.name}이에요. ` +
      `${q.parts.initial}과 ${q.parts.vowel}이 만나서 ${q.syllable}. ` +
      `${q.word}. 승차권 복구 성공!`;
  }

  else if (q.type === "vowel") {

    const info = getJamoInfo(q.answer);

    title = `🎉 ${q.answer} 완성!`;

    explanation = `
      <div class="jamo-big">${q.answer}</div>

      <div class="jamo-name">
        <strong>${q.answer}</strong>는 모음이에요.
      </div>

      <div class="sound-box">
        🔊 <strong>"${info.sound}"</strong> 소리가 나요.
      </div>

      <div class="jamo-example">
        지워진 승차권의
        <strong>${q.answer}</strong>,
        '${info.sound}' 소리를 완성했어요!
      </div>

      <div class="jamo-combination">
        ${q.parts.initial} + ${q.parts.vowel}
        ${q.parts.final ? "+ " + q.parts.final : ""}
        → ${q.syllable}
      </div>
    `;

    speech =
      `딩동댕! 잘했어요! ` +
      `지워진 승차권의 ${q.answer}를 완성했어요. ` +
      `${q.answer}는 모음이고 ${info.sound} 소리가 나요. ` +
      `${q.parts.initial}과 ${q.parts.vowel}이 만나서 ${q.syllable}. ` +
      `${q.word}. 승차권 복구 성공!`;
  }

  else if (q.type === "syllable") {

    title = `🚆 '${q.syllable}' 완성!`;

    explanation = `
      <div class="jamo-big">${q.syllable}</div>

      <div class="jamo-name">
        한 글자를 스스로 완성했어요!
      </div>

      <div class="jamo-combination">
        ${q.parts.initial}
        +
        ${q.parts.vowel}
        ${q.parts.final ? "+ " + q.parts.final : ""}
        → <strong>${q.syllable}</strong>
      </div>

      <div class="jamo-example">
        ${q.word}
      </div>
    `;

    speech =
      `멋져요 아준 역무원! ` +
      `${q.syllable} 글자를 완성했어요. ` +
      `${q.parts.initial}과 ${q.parts.vowel}` +
      `${q.parts.final ? ` 그리고 ${q.parts.final}` : ""}` +
      `이 만나서 ${q.syllable}. ` +
      `${q.word}. 승차권 복구 성공!`;
  }

  else {

    title = `🏆 '${q.word}' 완성!`;

    explanation = `
      <div class="jamo-big word-complete">
        ${q.word}
      </div>

      <div class="jamo-name">
        단어 전체를 기억해서 썼어요!
      </div>

      <div class="jamo-example">
        ${q.emoji} ${q.word}
      </div>
    `;

    speech =
      `대단해요 아준 역무원! ` +
      `${q.word} 단어 전체를 완성했어요. ` +
      `이제 승객이 기차를 탈 수 있어요!`;
  }

  const overlay = document.createElement("div");

  overlay.className = "learning-overlay";

  overlay.innerHTML = `
    <div class="learning-card">

      <div class="learning-title">
        ${title}
      </div>

      ${explanation}

      <button class="sound-btn">
        🔊 다시 듣기
      </button>

      <button class="next-ticket-btn">
        🚆 다음 승차권
      </button>

    </div>
  `;

  document.body.appendChild(overlay);

  speak(speech);

  overlay.querySelector(".sound-btn")
    .addEventListener("click", () => {
      speak(speech);
    });

  overlay.querySelector(".next-ticket-btn")
    .addEventListener("click", () => {

      window.speechSynthesis.cancel();

      overlay.remove();

      generateQuestion();
    });
}

/* ---------------------------------------------------------
   음성
   --------------------------------------------------------- */

function speak(text) {

  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const utterance =
    new SpeechSynthesisUtterance(text);

  utterance.lang = "ko-KR";
  utterance.rate = 0.82;
  utterance.pitch = 1.08;
  utterance.volume = 1;

  const voices =
    window.speechSynthesis.getVoices();

  const koreanVoice =
    voices.find(v =>
      v.lang &&
      v.lang.toLowerCase().includes("ko")
    );

  if (koreanVoice) {
    utterance.voice = koreanVoice;
  }

  window.speechSynthesis.speak(utterance);
}

/* ---------------------------------------------------------
   힌트
   --------------------------------------------------------- */

function showHint() {

  const q = state.current;

  if (!q) return;

  let message = "";

  if (q.type === "consonant") {

    const info = getJamoInfo(q.answer);

    message =
      `힌트! '${q.syllable}'의 첫소리를 생각해 보세요. ` +
      `이 자음의 이름은 ${info.name}이에요.`;
  }

  else if (q.type === "vowel") {

    const info = getJamoInfo(q.answer);

    message =
      `힌트! ${q.answer}는 '${info.sound}' 소리가 나는 모음이에요.`;
  }

  else if (q.type === "syllable") {

    message =
      `힌트! ${q.parts.initial}과 ${q.parts.vowel}` +
      `${q.parts.final ? ` 그리고 ${q.parts.final}` : ""}` +
      `을 합쳐 보세요.`;
  }

  else {

    message =
      `힌트! 목적지는 ${q.word}. 천천히 소리 내어 읽고 글자를 떠올려 보세요.`;
  }

  speak(message);

  showTemporaryMessage(message);
}

function showTemporaryMessage(text) {

  const box = document.createElement("div");

  box.className = "hint-toast";

  box.textContent = text;

  document.body.appendChild(box);

  setTimeout(() => {
    box.remove();
  }, 3500);
}

/* ---------------------------------------------------------
   난이도
   --------------------------------------------------------- */

function setLevel(level) {

  state.level = Number(level);

  document.querySelectorAll("[data-level]")
    .forEach(btn => {

      btn.classList.toggle(
        "active",
        Number(btn.dataset.level) === state.level
      );

    });

  const levelText = $("levelText");

  if (levelText) {

    const names = {
      1: "LEVEL 1 · 자음 하나",
      2: "LEVEL 2 · 모음 하나",
      3: "LEVEL 3 · 자음 + 모음 랜덤",
      4: "LEVEL 4 · 한 글자 쓰기",
      5: "LEVEL 5 · 단어 전체 쓰기"
    };

    levelText.textContent = names[state.level];
  }

  generateQuestion();
}

/* ---------------------------------------------------------
   점수
   --------------------------------------------------------- */

function updateScore() {

  const score = $("score");

  if (score) {
    score.textContent = state.score;
  }

  const streak = $("streak");

  if (streak) {
    streak.textContent = state.streak;
  }

  const solved = $("solved");

  if (solved) {
    solved.textContent = state.solved;
  }
}

/* ---------------------------------------------------------
   버튼 자동 연결
   HTML의 ID가 약간 달라도 작동하도록 구성
   --------------------------------------------------------- */

function connectButtons() {

  const clearBtn =
    $("clearBtn") ||
    $("eraseBtn");

  if (clearBtn) {
    clearBtn.addEventListener("click", clearCanvas);
  }

  const checkBtn =
    $("checkBtn") ||
    $("completeBtn") ||
    $("submitBtn");

  if (checkBtn) {
    checkBtn.addEventListener("click", checkAnswer);
  }

  const hintBtn =
    $("hintBtn");

  if (hintBtn) {
    hintBtn.addEventListener("click", showHint);
  }

  const nextBtn =
    $("nextBtn");

  if (nextBtn) {
    nextBtn.addEventListener("click", generateQuestion);
  }

  document.querySelectorAll("[data-level]")
    .forEach(button => {

      button.addEventListener("click", () => {
        setLevel(button.dataset.level);
      });

    });

  const levelSelect = $("levelSelect");

  if (levelSelect) {

    levelSelect.addEventListener("change", e => {
      setLevel(e.target.value);
    });
  }

  const advancedToggle =
    $("advancedToggle");

  if (advancedToggle) {

    advancedToggle.addEventListener("change", e => {
      state.includeAdvanced = e.target.checked;
    });
  }
}

/* ---------------------------------------------------------
   팝업용 CSS를 JS에서도 추가
   기존 CSS와 관계없이 팝업이 정상 표시됨
   --------------------------------------------------------- */

function injectPopupStyles() {

  const style = document.createElement("style");

  style.textContent = `

    .answer-overlay,
    .learning-overlay {
      position: fixed;
      inset: 0;
      background: rgba(10, 30, 50, .72);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: 20px;
      box-sizing: border-box;
    }

    .answer-card,
    .learning-card {
      width: min(620px, 94vw);
      max-height: 90vh;
      overflow-y: auto;
      background: white;
      border-radius: 30px;
      padding: 28px;
      box-sizing: border-box;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,.3);
    }

    .answer-small {
      font-size: 20px;
      font-weight: 700;
      color: #666;
    }

    .answer-title {
      margin-top: 14px;
      font-size: 28px;
      font-weight: 900;
    }

    .big-answer,
    .jamo-big {
      font-size: 92px;
      line-height: 1.15;
      font-weight: 900;
      margin: 12px 0;
    }

    .word-complete {
      font-size: 64px;
    }

    .answer-word {
      font-size: 32px;
      font-weight: 800;
      margin: 12px 0 22px;
    }

    .answer-question {
      font-size: 25px;
      font-weight: 800;
      margin: 15px 0;
    }

    .answer-buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .answer-buttons button,
    .learning-card button {
      border: none;
      border-radius: 18px;
      padding: 18px 14px;
      font-size: 21px;
      font-weight: 900;
      cursor: pointer;
    }

    .retry-btn {
      background: #eeeeee;
    }

    .correct-btn,
    .next-ticket-btn {
      background: #ffd54f;
    }

    .learning-title {
      font-size: 32px;
      font-weight: 900;
    }

    .jamo-name {
      font-size: 26px;
      line-height: 1.5;
      margin: 14px 0;
    }

    .sound-box {
      display: inline-block;
      padding: 13px 24px;
      border-radius: 18px;
      background: #fff3c4;
      font-size: 28px;
      margin: 10px;
    }

    .jamo-example {
      font-size: 24px;
      line-height: 1.5;
      margin: 15px 0;
    }

    .jamo-combination {
      font-size: 31px;
      font-weight: 900;
      background: #eef7ff;
      border-radius: 20px;
      padding: 16px;
      margin: 18px 0;
    }

    .sound-btn {
      width: 100%;
      margin-top: 10px;
      background: #e8f3ff;
    }

    .next-ticket-btn {
      width: 100%;
      margin-top: 10px;
    }

    .hint-toast {
      position: fixed;
      left: 50%;
      bottom: 30px;
      transform: translateX(-50%);
      width: min(700px, 90vw);
      box-sizing: border-box;
      padding: 18px 22px;
      background: #222;
      color: white;
      border-radius: 18px;
      text-align: center;
      font-size: 21px;
      font-weight: 800;
      z-index: 10000;
    }

    @media (max-width: 700px) {

      .answer-card,
      .learning-card {
        padding: 20px;
      }

      .big-answer,
      .jamo-big {
        font-size: 72px;
      }

      .word-complete {
        font-size: 50px;
      }

      .answer-buttons {
        grid-template-columns: 1fr;
      }

      .jamo-name,
      .jamo-example {
        font-size: 21px;
      }

      .jamo-combination {
        font-size: 25px;
      }
    }
  `;

  document.head.appendChild(style);
}

/* ---------------------------------------------------------
   시작
   --------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {

  injectPopupStyles();

  setupCanvas();

  connectButtons();

  updateScore();

  generateQuestion();

  setTimeout(() => {

    speak(
      "아준 역무원 출근! 지워진 승차권의 글자를 찾아서 직접 써 주세요."
    );

  }, 700);
});