/* ==========================================================
   아준 역무원 - 한글 승차권 복구센터
   ========================================================== */

const WORDS = [
  ["기차", "🚆"],
  ["기차역", "🚉"],
  ["열차", "🚆"],
  ["기관차", "🚂"],
  ["철도", "🛤️"],
  ["승객", "🧑"],
  ["서울", "🏙️"],
  ["부산", "🌊"],
  ["대전", "🏙️"],
  ["창원", "🏙️"],
  ["마산", "🚉"],
  ["진주", "🏯"],
  ["수서", "🚄"],
  ["학교", "🏫"],
  ["사과", "🍎"],
  ["바나나", "🍌"],
  ["우유", "🥛"],
  ["자동차", "🚗"],
  ["비행기", "✈️"],
  ["강아지", "🐶"],
  ["고양이", "🐱"],
  ["토끼", "🐰"],
  ["나무", "🌳"],
  ["바다", "🌊"],
  ["구름", "☁️"],
  ["하늘", "🌤️"],
  ["모자", "🧢"],
  ["가방", "🎒"],
  ["아빠", "👨"],
  ["엄마", "👩"],
  ["아준", "👦"],
  ["이서", "👧"],
  ["할머니", "👵"],
  ["할아버지", "👴"]
];


/* ==========================================================
   한글 자모
   ========================================================== */

const INITIALS = [
  "ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ",
  "ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ",
  "ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"
];

const VOWELS = [
  "ㅏ","ㅐ","ㅑ","ㅒ","ㅓ","ㅔ","ㅕ",
  "ㅖ","ㅗ","ㅘ","ㅙ","ㅚ","ㅛ",
  "ㅜ","ㅝ","ㅞ","ㅟ","ㅠ","ㅡ","ㅢ","ㅣ"
];

const FINALS = [
  "",
  "ㄱ","ㄲ","ㄳ","ㄴ","ㄵ","ㄶ","ㄷ",
  "ㄹ","ㄺ","ㄻ","ㄼ","ㄽ","ㄾ","ㄿ","ㅀ",
  "ㅁ","ㅂ","ㅄ","ㅅ","ㅆ","ㅇ",
  "ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"
];


const CONSONANT_NAMES = {
  "ㄱ":"기역",
  "ㄲ":"쌍기역",
  "ㄴ":"니은",
  "ㄷ":"디귿",
  "ㄸ":"쌍디귿",
  "ㄹ":"리을",
  "ㅁ":"미음",
  "ㅂ":"비읍",
  "ㅃ":"쌍비읍",
  "ㅅ":"시옷",
  "ㅆ":"쌍시옷",
  "ㅇ":"이응",
  "ㅈ":"지읒",
  "ㅉ":"쌍지읒",
  "ㅊ":"치읓",
  "ㅋ":"키읔",
  "ㅌ":"티읕",
  "ㅍ":"피읖",
  "ㅎ":"히읗"
};


const VOWEL_SOUNDS = {
  "ㅏ":"아",
  "ㅐ":"애",
  "ㅑ":"야",
  "ㅒ":"얘",
  "ㅓ":"어",
  "ㅔ":"에",
  "ㅕ":"여",
  "ㅖ":"예",
  "ㅗ":"오",
  "ㅘ":"와",
  "ㅙ":"왜",
  "ㅚ":"외",
  "ㅛ":"요",
  "ㅜ":"우",
  "ㅝ":"워",
  "ㅞ":"웨",
  "ㅟ":"위",
  "ㅠ":"유",
  "ㅡ":"으",
  "ㅢ":"의",
  "ㅣ":"이"
};


/* ==========================================================
   상태
   ========================================================== */

let level = 1;
let score = 0;
let current = null;

let drawing = false;
let lastX = 0;
let lastY = 0;

let previousWord = "";


/* ==========================================================
   DOM
   ========================================================== */

const canvas = document.getElementById("writingCanvas");
const ctx = canvas.getContext("2d");

const wordDisplay = document.getElementById("wordDisplay");
const wordEmoji = document.getElementById("wordEmoji");
const destination = document.getElementById("destination");
const missionText = document.getElementById("missionText");
const levelText = document.getElementById("levelText");

const scoreElement = document.getElementById("score");
const train = document.getElementById("train");


/* ==========================================================
   한글 분해
   ========================================================== */

function decompose(char) {

  const code = char.charCodeAt(0);

  if (code < 0xAC00 || code > 0xD7A3) {
    return null;
  }

  const index = code - 0xAC00;

  const initialIndex =
    Math.floor(index / 588);

  const vowelIndex =
    Math.floor((index % 588) / 28);

  const finalIndex =
    index % 28;

  return {
    initial: INITIALS[initialIndex],
    vowel: VOWELS[vowelIndex],
    final: FINALS[finalIndex]
  };
}


/* ==========================================================
   랜덤
   ========================================================== */

function random(array) {
  return array[
    Math.floor(Math.random() * array.length)
  ];
}


function getRandomWord() {

  let choice;

  do {
    choice = random(WORDS);
  }
  while (
    choice[0] === previousWord &&
    WORDS.length > 1
  );

  previousWord = choice[0];

  return choice;
}


/* ==========================================================
   문제 만들기
   ========================================================== */

function makeQuestion() {

  let selected = getRandomWord();

  let word = selected[0];
  let emoji = selected[1];

  let letters = [...word];

  let index =
    Math.floor(Math.random() * letters.length);

  let syllable = letters[index];

  let parts = decompose(syllable);

  if (!parts) {
    makeQuestion();
    return;
  }


  let type;
  let answer;


  if (level === 1) {

    type = "consonant";
    answer = parts.initial;

  }

  else if (level === 2) {

    type = "vowel";
    answer = parts.vowel;

  }

  else if (level === 3) {

    if (Math.random() < 0.5) {

      type = "consonant";
      answer = parts.initial;

    } else {

      type = "vowel";
      answer = parts.vowel;

    }

  }

  else if (level === 4) {

    type = "syllable";
    answer = syllable;

  }

  else {

    type = "word";
    answer = word;

  }


  current = {
    word,
    emoji,
    letters,
    index,
    syllable,
    parts,
    type,
    answer
  };


  renderQuestion();

  clearCanvas();
}


/* ==========================================================
   문제 표시
   ========================================================== */

function renderQuestion() {

  wordEmoji.textContent =
    current.emoji;

  destination.textContent =
    current.word;


  let display = "";


  /* 단어 전체 */

  if (current.type === "word") {

    display =
      current.letters
        .map(() => "□")
        .join(" ");

    missionText.textContent =
      `'${current.word}'을 기억해서 승차권에 써 주세요!`;

  }


  /* 한 음절 */

  else if (current.type === "syllable") {

    display =
      current.letters
        .map((letter, i) =>
          i === current.index
            ? "□"
            : letter
        )
        .join(" ");

    missionText.textContent =
      "승차권에서 한 글자가 통째로 사라졌어요!";

  }


  /* 자음 */

  else if (current.type === "consonant") {

    display =
      current.letters
        .map((letter, i) => {

          if (i !== current.index)
            return letter;

          let p = current.parts;

          return (
            "[ □ + " +
            p.vowel +
            (p.final
              ? " + " + p.final
              : "") +
            " ]"
          );

        })
        .join(" ");

    missionText.textContent =
      "승차권에서 자음 하나가 지워졌어요!";

  }


  /* 모음 */

  else {

    display =
      current.letters
        .map((letter, i) => {

          if (i !== current.index)
            return letter;

          let p = current.parts;

          return (
            "[ " +
            p.initial +
            " + □" +
            (p.final
              ? " + " + p.final
              : "") +
            " ]"
          );

        })
        .join(" ");

    missionText.textContent =
      "승차권에서 모음 하나가 지워졌어요!";

  }


  wordDisplay.textContent = display;
}


/* ==========================================================
   Canvas
   ========================================================== */

function resizeCanvas() {

  const rect =
    canvas.getBoundingClientRect();

  const ratio =
    window.devicePixelRatio || 1;

  canvas.width =
    rect.width * ratio;

  canvas.height =
    rect.height * ratio;

  ctx.setTransform(
    ratio,
    0,
    0,
    ratio,
    0,
    0
  );

  ctx.lineWidth = 9;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.strokeStyle = "#172b3a";
}


resizeCanvas();

window.addEventListener(
  "resize",
  resizeCanvas
);


canvas.addEventListener(
  "pointerdown",
  function(e) {

    drawing = true;

    canvas.setPointerCapture(
      e.pointerId
    );

    const rect =
      canvas.getBoundingClientRect();

    lastX =
      e.clientX - rect.left;

    lastY =
      e.clientY - rect.top;
  }
);


canvas.addEventListener(
  "pointermove",
  function(e) {

    if (!drawing)
      return;

    const rect =
      canvas.getBoundingClientRect();

    const x =
      e.clientX - rect.left;

    const y =
      e.clientY - rect.top;


    ctx.beginPath();

    ctx.moveTo(
      lastX,
      lastY
    );

    ctx.lineTo(
      x,
      y
    );

    ctx.stroke();


    lastX = x;
    lastY = y;
  }
);


canvas.addEventListener(
  "pointerup",
  () => drawing = false
);


canvas.addEventListener(
  "pointercancel",
  () => drawing = false
);


function clearCanvas() {

  const rect =
    canvas.getBoundingClientRect();

  ctx.clearRect(
    0,
    0,
    rect.width,
    rect.height
  );
}


/* ==========================================================
   음성
   ========================================================== */

function speak(text) {

  if (
    !("speechSynthesis" in window)
  )
    return;


  speechSynthesis.cancel();


  const voice =
    new SpeechSynthesisUtterance(text);


  voice.lang = "ko-KR";

  voice.rate = 0.78;

  voice.pitch = 1.05;


  speechSynthesis.speak(voice);
}


/* ==========================================================
   힌트
   ========================================================== */

function hint() {

  let message;


  if (
    current.type === "consonant"
  ) {

    /*
      중요한 부분:
      처음부터 정답 자음 이름을 알려주지 않는다.
    */

    message =
      `'${current.syllable}'을 천천히 소리 내어 읽어 보세요. ` +
      `첫소리에 어떤 모양이 들어가는지 생각해 봐요.`;

  }


  else if (
    current.type === "vowel"
  ) {

    message =
      `'${current.syllable}'을 길게 말해 보세요. ` +
      `가운데에서 들리는 모음 소리를 생각해 봐요.`;

  }


  else if (
    current.type === "syllable"
  ) {

    message =
      `'${current.word}'을 천천히 읽어 보세요. ` +
      `빠진 글자는 '${current.syllable}'이에요.`;

  }


  else {

    message =
      `'${current.word}'. ` +
      `한 글자씩 천천히 소리 내면서 써 보세요.`;

  }


  showToast(message);

  speak(message);
}


function showToast(message) {

  const toast =
    document.createElement("div");

  toast.className =
    "hint-toast";

  toast.textContent =
    message;

  document.body.appendChild(
    toast
  );


  setTimeout(
    () => toast.remove(),
    3800
  );
}


/* ==========================================================
   확인
   ========================================================== */

function checkAnswer() {

  const overlay =
    document.createElement("div");

  overlay.className =
    "popup-overlay";


  overlay.innerHTML = `

    <div class="popup-card">

      <div class="popup-title">
        정답과 비교해 봐요
      </div>

      <div class="correct-answer">
        ${current.answer}
      </div>

      <div class="popup-word">
        ${current.emoji}
        ${current.word}
      </div>

      <div class="popup-question">
        아준이가 쓴 글자와 같나요?
      </div>

      <div class="popup-buttons">

        <button
          id="retryButton"
          class="retry-button">

          🔄 다시 써볼래요

        </button>

        <button
          id="correctButton"
          class="yes-button">

          ⭐ 맞게 썼어요!

        </button>

      </div>

    </div>
  `;


  document.body.appendChild(
    overlay
  );


  document
    .getElementById("retryButton")
    .onclick = function() {

      overlay.remove();

      clearCanvas();

      speak(
        "좋아요. 천천히 다시 써 봐요."
      );
    };


  document
    .getElementById("correctButton")
    .onclick = function() {

      overlay.remove();

      score += 10;

      scoreElement.textContent =
        score;

      learningPopup();
    };
}


/* ==========================================================
   정답 후 학습
   ========================================================== */

function learningPopup() {

  let content = "";
  let speech = "";


  /* 자음 */

  if (
    current.type === "consonant"
  ) {

    const name =
      CONSONANT_NAMES[
        current.answer
      ];


    content = `

      <div class="jamo-main">
        ${current.answer}
      </div>

      <div class="jamo-card">

        이 글자는
        <strong>자음</strong>이에요.

        <br>

        이름은

        <strong>
          ${name}
        </strong>

        이에요.

      </div>

      <div class="jamo-card">

        ${current.parts.initial}
        +
        ${current.parts.vowel}

        ${
          current.parts.final
          ? "+ " +
            current.parts.final
          : ""
        }

        →

        <strong>
          ${current.syllable}
        </strong>

      </div>
    `;


    speech =
      `딩동댕! ` +
      `지워진 ${current.answer}을 완성했어요. ` +
      `${current.answer}은 자음이고, 이름은 ${name}이에요. ` +
      `${current.word}. 승차권 복구 성공!`;
  }


  /* 모음 */

  else if (
    current.type === "vowel"
  ) {

    const sound =
      VOWEL_SOUNDS[
        current.answer
      ];


    content = `

      <div class="jamo-main">
        ${current.answer}
      </div>

      <div class="jamo-card">

        이 글자는
        <strong>모음</strong>이에요.

        <br>

        <span class="sound-highlight">

          🔊 ${sound}

        </span>

        소리가 나요.

      </div>

      <div class="jamo-card">

        지워진 승차권의

        <strong>
          ${current.answer}
        </strong>

        ,

        <strong>
          '${sound}'
        </strong>

        소리를 완성했어요!

      </div>

      <div class="jamo-card">

        ${current.parts.initial}
        +
        ${current.parts.vowel}

        ${
          current.parts.final
          ? "+ " +
            current.parts.final
          : ""
        }

        →

        <strong>
          ${current.syllable}
        </strong>

      </div>
    `;


    speech =
      `딩동댕! ` +
      `지워진 승차권의 ${current.answer}를 완성했어요. ` +
      `${current.answer}는 모음이고, ${sound} 소리가 나요. ` +
      `${current.word}. 승차권 복구 성공!`;
  }


  /* 한 글자 */

  else if (
    current.type === "syllable"
  ) {

    content = `

      <div class="jamo-main">
        ${current.syllable}
      </div>

      <div class="jamo-card">

        한 글자를
        스스로 완성했어요!

      </div>

      <div class="jamo-card">

        ${current.parts.initial}
        +
        ${current.parts.vowel}

        ${
          current.parts.final
          ? "+ " +
            current.parts.final
          : ""
        }

        →

        <strong>
          ${current.syllable}
        </strong>

      </div>
    `;


    speech =
      `잘했어요 아준 역무원! ` +
      `${current.syllable} 글자를 완성했어요. ` +
      `${current.word}. 승차권 복구 성공!`;
  }


  /* 단어 */

  else {

    content = `

      <div
        class="jamo-main"
        style="font-size:52px">

        ${current.word}

      </div>

      <div class="jamo-card">

        단어 전체를
        기억해서 썼어요!

        <br><br>

        ${current.emoji}
        <strong>
          ${current.word}
        </strong>

      </div>
    `;


    speech =
      `대단해요 아준 역무원! ` +
      `${current.word} 단어 전체를 완성했어요. ` +
      `기차가 출발합니다!`;
  }


  const overlay =
    document.createElement("div");

  overlay.className =
    "popup-overlay";


  overlay.innerHTML = `

    <div class="popup-card">

      <div class="popup-title">
        🎉 승차권 복구 성공!
      </div>

      ${content}

      <button
        id="listenAgain"
        class="big-popup-button sound-button">

        🔊 다시 듣기

      </button>

      <button
        id="nextTicket"
        class="big-popup-button">

        🚄 기차 출발!

      </button>

    </div>
  `;


  document.body.appendChild(
    overlay
  );


  speak(speech);


  document
    .getElementById("listenAgain")
    .onclick = function() {

      speak(speech);
    };


  document
    .getElementById("nextTicket")
    .onclick = function() {

      speechSynthesis.cancel();

      overlay.remove();

      departTrain();
    };
}


/* ==========================================================
   기차 출발
   ========================================================== */

function departTrain() {

  train.classList.add("go");


  setTimeout(
    function() {

      train.classList.remove("go");

      makeQuestion();

    },
    1750
  );
}


/* ==========================================================
   난이도
   ========================================================== */

const levelNames = {

  1:
    "LEVEL 1 · 자음 하나 쓰기",

  2:
    "LEVEL 2 · 모음 하나 쓰기",

  3:
    "LEVEL 3 · 자음과 모음 섞어서",

  4:
    "LEVEL 4 · 한 글자 전체 쓰기",

  5:
    "LEVEL 5 · 단어 전체 쓰기"

};


document
  .querySelectorAll(
    ".level-btn"
  )
  .forEach(
    function(button) {

      button.onclick =
        function() {

          level =
            Number(
              button.dataset.level
            );


          document
            .querySelectorAll(
              ".level-btn"
            )
            .forEach(
              b =>
                b.classList.remove(
                  "active"
                )
            );


          button.classList.add(
            "active"
          );


          levelText.textContent =
            levelNames[level];


          makeQuestion();
        };
    }
  );


/* ==========================================================
   버튼
   ========================================================== */

document
  .getElementById("clearBtn")
  .onclick =
    clearCanvas;


document
  .getElementById("hintBtn")
  .onclick =
    hint;


document
  .getElementById("checkBtn")
  .onclick =
    checkAnswer;


/* ==========================================================
   게임 시작
   ========================================================== */

makeQuestion();


setTimeout(
  function() {

    speak(
      "아준 역무원 출근! 지워진 승차권의 글자를 직접 써 주세요."
    );

  },
  700
);
