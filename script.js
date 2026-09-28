/* ==========================================================
   아준 역무원 - 사라진 글자 승차권
   ? 자모 복구 버전
   ========================================================== */


/* ==========================================================
   단어 데이터
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


/* ==========================================================
   자음 이름
   ========================================================== */

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


/* ==========================================================
   모음 소리
   ========================================================== */

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

let previousWord = "";

let drawing = false;
let hasDrawn = false;

let lastX = 0;
let lastY = 0;


/* ==========================================================
   DOM
   ========================================================== */

const canvas =
  document.getElementById("writingCanvas");

const ctx =
  canvas.getContext("2d");

const wordDisplay =
  document.getElementById("wordDisplay");

const wordEmoji =
  document.getElementById("wordEmoji");

const destination =
  document.getElementById("destination");

const missionText =
  document.getElementById("missionText");

const levelText =
  document.getElementById("levelText");

const scoreElement =
  document.getElementById("score");

const train =
  document.getElementById("train");


/* ==========================================================
   한글 분해
   ========================================================== */

function decompose(char) {

  const code =
    char.charCodeAt(0);


  if (
    code < 0xAC00 ||
    code > 0xD7A3
  ) {
    return null;
  }


  const index =
    code - 0xAC00;


  const initialIndex =
    Math.floor(index / 588);


  const vowelIndex =
    Math.floor(
      (index % 588) / 28
    );


  const finalIndex =
    index % 28;


  return {
    initial:
      INITIALS[initialIndex],

    vowel:
      VOWELS[vowelIndex],

    final:
      FINALS[finalIndex]
  };
}


/* ==========================================================
   랜덤
   ========================================================== */

function random(array) {

  return array[
    Math.floor(
      Math.random() *
      array.length
    )
  ];
}


/* ==========================================================
   단어 선택
   ========================================================== */

function getRandomWord() {

  let choice;


  do {

    choice =
      random(WORDS);

  } while (
    choice[0] === previousWord &&
    WORDS.length > 1
  );


  previousWord =
    choice[0];


  return choice;
}


/* ==========================================================
   문제 만들기
   ========================================================== */

function makeQuestion() {

  const selected =
    getRandomWord();


  const word =
    selected[0];

  const emoji =
    selected[1];


  const letters =
    [...word];


  const index =
    Math.floor(
      Math.random() *
      letters.length
    );


  const syllable =
    letters[index];


  const parts =
    decompose(syllable);


  if (!parts) {

    makeQuestion();
    return;

  }


  let type;
  let answer;


  /* LEVEL 1
     초성
  */

  if (level === 1) {

    type =
      "consonant";

    answer =
      parts.initial;

  }


  /* LEVEL 2
     모음
  */

  else if (level === 2) {

    type =
      "vowel";

    answer =
      parts.vowel;

  }


  /* LEVEL 3
     자음/모음 랜덤
  */

  else if (level === 3) {

    if (
      Math.random() < 0.5
    ) {

      type =
        "consonant";

      answer =
        parts.initial;

    }

    else {

      type =
        "vowel";

      answer =
        parts.vowel;

    }

  }


  /* LEVEL 4
     한 음절
  */

  else if (level === 4) {

    type =
      "syllable";

    answer =
      syllable;

  }


  /* LEVEL 5
     전체 단어
  */

  else {

    type =
      "word";

    answer =
      word;

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
   ? 표시 스타일
   JS에서 직접 스타일을 넣기 때문에
   CSS 파일을 수정하지 않아도 됨
   ========================================================== */

function questionMark() {

  return `

    <span style="
      display:inline-flex;
      align-items:center;
      justify-content:center;

      min-width:52px;
      height:52px;

      margin:0 5px;

      padding:0 10px;

      border-radius:13px;

      background:#fff0a8;

      border:3px dashed #e0a800;

      color:#d64242;

      font-size:42px;
      font-weight:900;

      line-height:1;

      vertical-align:middle;

      box-shadow:
        0 3px 8px rgba(0,0,0,.08);
    ">

      ?

    </span>

  `;
}


/* ==========================================================
   한 음절의 분해 표시
   ========================================================== */

function makeJamoDisplay() {

  const p =
    current.parts;


  /* LEVEL 1
     초성 ?

     원 →
     ? + ㅝ + ㄴ
  */

  if (
    current.type ===
    "consonant"
  ) {

    return `

      <span style="
        display:inline-flex;
        align-items:center;
        gap:7px;
      ">

        ${questionMark()}

        <span>+</span>

        <span>
          ${p.vowel}
        </span>

        ${
          p.final
          ?
          `
            <span>+</span>

            <span>
              ${p.final}
            </span>
          `
          :
          ""
        }

      </span>

    `;

  }


  /* LEVEL 2
     모음 ?

     원 →
     ㅇ + ? + ㄴ
  */

  if (
    current.type ===
    "vowel"
  ) {

    return `

      <span style="
        display:inline-flex;
        align-items:center;
        gap:7px;
      ">

        <span>
          ${p.initial}
        </span>

        <span>+</span>

        ${questionMark()}

        ${
          p.final
          ?
          `
            <span>+</span>

            <span>
              ${p.final}
            </span>
          `
          :
          ""
        }

      </span>

    `;

  }


  return "";
}


/* ==========================================================
   문제 표시
   ========================================================== */

function renderQuestion() {

  wordEmoji.textContent =
    current.emoji;


  destination.textContent =
    random([
      "서울",
      "부산",
      "대전",
      "동대구",
      "수서",
      "진주",
      "창원"
    ]);


  let html = "";


  /* ======================================================
     LEVEL 1 / 2 / 3
     자모 하나가 ?
     ====================================================== */

  if (
    current.type === "consonant" ||
    current.type === "vowel"
  ) {

    current.letters.forEach(
      function(letter, i) {

        if (
          i === current.index
        ) {

          html += `

            <span style="
              display:inline-flex;
              align-items:center;

              padding:5px 10px;

              margin:0 4px;

              background:#f4f8fb;

              border:2px solid #cad7df;

              border-radius:14px;

              letter-spacing:0;
            ">

              ${makeJamoDisplay()}

            </span>

          `;

        }

        else {

          html += `

            <span style="
              display:inline-block;
              margin:0 5px;
            ">

              ${letter}

            </span>

          `;

        }

      }
    );


    if (
      current.type === "consonant"
    ) {

      missionText.innerHTML = `

        승차권에서
        <strong style="color:#d64242;">
          첫소리 하나
        </strong>
        가 사라졌어요!

        <br>

        <span style="
          font-size:14px;
          color:#607486;
        ">
          ?에 들어갈 자음을 직접 써 주세요.
        </span>

      `;

    }

    else {

      missionText.innerHTML = `

        승차권에서
        <strong style="color:#d64242;">
          가운데소리 하나
        </strong>
        가 사라졌어요!

        <br>

        <span style="
          font-size:14px;
          color:#607486;
        ">
          ?에 들어갈 모음을 직접 써 주세요.
        </span>

      `;

    }

  }


  /* ======================================================
     LEVEL 4
     한 글자가 ?
     ====================================================== */

  else if (
    current.type === "syllable"
  ) {

    current.letters.forEach(
      function(letter, i) {

        if (
          i === current.index
        ) {

          html +=
            questionMark();

        }

        else {

          html += `

            <span style="
              display:inline-block;
              margin:0 5px;
            ">

              ${letter}

            </span>

          `;

        }

      }
    );


    missionText.innerHTML = `

      승차권에서
      <strong style="color:#d64242;">
        한 글자
      </strong>
      가 사라졌어요!

      <br>

      <span style="
        font-size:14px;
        color:#607486;
      ">
        ?에 들어갈 글자를 직접 써 주세요.
      </span>

    `;

  }


  /* ======================================================
     LEVEL 5
     단어 전체
     ====================================================== */

  else {

    current.letters.forEach(
      function() {

        html +=
          questionMark();

      }
    );


    missionText.innerHTML = `

      승차권의
      <strong style="color:#d64242;">
        단어 전체
      </strong>
      가 사라졌어요!

      <br>

      <span style="
        font-size:14px;
        color:#607486;
      ">
        목적지 단어 전체를 기억해서 써 주세요.
      </span>

    `;

  }


  wordDisplay.innerHTML =
    html;
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


  ctx.lineWidth =
    9;


  ctx.lineCap =
    "round";


  ctx.lineJoin =
    "round";


  ctx.strokeStyle =
    "#172b3a";
}


resizeCanvas();


window.addEventListener(
  "resize",
  resizeCanvas
);


/* ==========================================================
   손글씨 쓰기
   ========================================================== */

canvas.addEventListener(
  "pointerdown",
  function(e) {

    drawing =
      true;

    hasDrawn =
      true;


    canvas.setPointerCapture(
      e.pointerId
    );


    const rect =
      canvas.getBoundingClientRect();


    lastX =
      e.clientX -
      rect.left;


    lastY =
      e.clientY -
      rect.top;


    ctx.beginPath();


    ctx.arc(
      lastX,
      lastY,
      4.5,
      0,
      Math.PI * 2
    );


    ctx.fillStyle =
      "#172b3a";


    ctx.fill();
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
      e.clientX -
      rect.left;


    const y =
      e.clientY -
      rect.top;


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
  function() {

    drawing =
      false;

  }
);


canvas.addEventListener(
  "pointercancel",
  function() {

    drawing =
      false;

  }
);


/* ==========================================================
   지우기
   ========================================================== */

function clearCanvas() {

  const rect =
    canvas.getBoundingClientRect();


  ctx.clearRect(
    0,
    0,
    rect.width,
    rect.height
  );


  hasDrawn =
    false;
}


/* ==========================================================
   음성
   ========================================================== */

function speak(text) {

  if (
    !(
      "speechSynthesis"
      in window
    )
  ) {
    return;
  }


  speechSynthesis.cancel();


  const voice =
    new SpeechSynthesisUtterance(
      text
    );


  voice.lang =
    "ko-KR";


  voice.rate =
    0.78;


  voice.pitch =
    1.05;


  speechSynthesis.speak(
    voice
  );
}


/* ==========================================================
   힌트
   ========================================================== */

function hint() {

  let message;


  if (
    current.type ===
    "consonant"
  ) {

    message =
      `'${current.word}'을 천천히 읽어 보세요. ` +
      `'${current.syllable}'의 첫소리에 어떤 자음이 들어갈까요?`;

  }


  else if (
    current.type ===
    "vowel"
  ) {

    message =
      `'${current.word}'을 천천히 읽어 보세요. ` +
      `'${current.syllable}'의 가운데소리에 어떤 모음이 들어갈까요?`;

  }


  else if (
    current.type ===
    "syllable"
  ) {

    message =
      `'${current.word}'을 천천히 읽어 보세요. ` +
      `물음표 자리에 어떤 글자가 들어갈까요?`;

  }


  else {

    message =
      `'${current.word}'. ` +
      `한 글자씩 천천히 말하면서 단어 전체를 써 보세요.`;

  }


  showToast(
    message
  );


  speak(
    message
  );
}


/* ==========================================================
   안내 메시지
   ========================================================== */

function showToast(message) {

  const oldToast =
    document.querySelector(
      ".hint-toast"
    );


  if (oldToast) {

    oldToast.remove();

  }


  const toast =
    document.createElement(
      "div"
    );


  toast.className =
    "hint-toast";


  toast.textContent =
    message;


  document.body.appendChild(
    toast
  );


  setTimeout(
    function() {

      toast.remove();

    },
    3800
  );
}


/* ==========================================================
   정답 확인
   ========================================================== */

function checkAnswer() {

  if (!hasDrawn) {

    showToast(
      "먼저 쓰기판에 글자를 써 주세요! ✏️"
    );


    speak(
      "먼저 글자를 써 주세요."
    );


    return;
  }


  const overlay =
    document.createElement(
      "div"
    );


  overlay.className =
    "popup-overlay";


  overlay.innerHTML = `

    <div class="popup-card">

      <div class="popup-title">

        🔎 승차권 복구 검사

      </div>


      <div style="
        font-size:18px;
        font-weight:800;
        margin-top:12px;
        color:#607486;
      ">

        ?에 들어갈 정답은

      </div>


      <div class="correct-answer">

        ${current.answer}

      </div>


      <div class="popup-word">

        ${current.emoji}
        ${current.word}

      </div>


      <div class="popup-question">

        아준이가 쓴 것과 같나요?

      </div>


      <div class="popup-buttons">

        <button
          id="retryButton"
          class="retry-button"
        >

          🔄 다시 써볼래요

        </button>


        <button
          id="correctButton"
          class="yes-button"
        >

          ⭐ 맞게 썼어요!

        </button>

      </div>

    </div>

  `;


  document.body.appendChild(
    overlay
  );


  document
    .getElementById(
      "retryButton"
    )
    .onclick =
    function() {

      overlay.remove();

      clearCanvas();


      speak(
        "좋아요. 천천히 다시 써 봐요."
      );

    };


  document
    .getElementById(
      "correctButton"
    )
    .onclick =
    function() {

      overlay.remove();


      score +=
        10;


      scoreElement.textContent =
        score;


      showRestoredWord();

    };
}


/* ==========================================================
   ? → 정답으로 복구
   ========================================================== */

function showRestoredWord() {

  wordDisplay.innerHTML = `

    <span style="
      display:inline-block;

      padding:8px 22px;

      background:#e9fff2;

      border:3px solid #21b66f;

      border-radius:18px;

      font-size:48px;
      font-weight:900;

      color:#183047;

      animation:restorePop .45s ease;
    ">

      ${current.word}

    </span>

  `;


  /*
    애니메이션을 JS에서 추가
  */

  if (
    !document.getElementById(
      "restoreAnimation"
    )
  ) {

    const style =
      document.createElement(
        "style"
      );


    style.id =
      "restoreAnimation";


    style.textContent = `

      @keyframes restorePop {

        0% {
          transform:scale(.65);
          opacity:.3;
        }

        70% {
          transform:scale(1.12);
        }

        100% {
          transform:scale(1);
          opacity:1;
        }

      }

    `;


    document.head.appendChild(
      style
    );
  }


  speak(
    `${current.word}. 승차권 복구 성공!`
  );


  setTimeout(
    function() {

      learningPopup();

    },
    700
  );
}


/* ==========================================================
   학습 팝업
   ========================================================== */

function learningPopup() {

  let content =
    "";

  let speech =
    "";


  /* ======================================================
     자음
     ====================================================== */

  if (
    current.type ===
    "consonant"
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

        물음표에 들어갈 글자는

        <strong>
          ${current.answer}
        </strong>

        이에요.

        <br><br>

        <strong>
          ${current.answer}
        </strong>

        은 자음이고,

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
          ?
          ` + ${current.parts.final}`
          :
          ""
        }

        →

        <strong style="
          font-size:30px;
        ">
          ${current.syllable}
        </strong>

      </div>

    `;


    speech =
      `딩동댕! ` +
      `물음표에 들어갈 글자는 ${current.answer}. ` +
      `${current.answer}은 자음이고 이름은 ${name}이에요. ` +
      `${current.syllable}. ` +
      `${current.word} 승차권 복구 성공!`;
  }


  /* ======================================================
     모음
     ====================================================== */

  else if (
    current.type ===
    "vowel"
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

        물음표에 들어갈 글자는

        <strong>
          ${current.answer}
        </strong>

        예요.

        <br><br>

        <strong>
          ${current.answer}
        </strong>

        는 모음이고

        <br>

        <span class="sound-highlight">

          🔊 ${sound}

        </span>

        소리가 나요.

      </div>


      <div class="jamo-card">

        ${current.parts.initial}

        +

        ${current.parts.vowel}

        ${
          current.parts.final
          ?
          ` + ${current.parts.final}`
          :
          ""
        }

        →

        <strong style="
          font-size:30px;
        ">
          ${current.syllable}
        </strong>

      </div>

    `;


    speech =
      `딩동댕! ` +
      `물음표에 들어갈 글자는 ${current.answer}. ` +
      `${current.answer}는 모음이고 ${sound} 소리가 나요. ` +
      `${current.syllable}. ` +
      `${current.word} 승차권 복구 성공!`;
  }


  /* ======================================================
     한 글자
     ====================================================== */

  else if (
    current.type ===
    "syllable"
  ) {

    content = `

      <div class="jamo-main">

        ${current.syllable}

      </div>


      <div class="jamo-card">

        물음표에 들어갈 글자는

        <strong>
          ${current.syllable}
        </strong>

        였어요!

      </div>


      <div class="jamo-card">

        ${current.parts.initial}

        +

        ${current.parts.vowel}

        ${
          current.parts.final
          ?
          ` + ${current.parts.final}`
          :
          ""
        }

        →

        <strong style="
          font-size:30px;
        ">
          ${current.syllable}
        </strong>

      </div>

    `;


    speech =
      `잘했어요 아준 역무원. ` +
      `물음표에 들어갈 글자는 ${current.syllable}. ` +
      `${current.word} 승차권 복구 성공!`;
  }


  /* ======================================================
     단어 전체
     ====================================================== */

  else {

    content = `

      <div
        class="jamo-main"
        style="font-size:52px;"
      >

        ${current.word}

      </div>


      <div class="jamo-card">

        사라진 단어는

        <br>

        ${current.emoji}

        <strong style="
          font-size:30px;
        ">
          ${current.word}
        </strong>

        <br><br>

        단어 전체를
        기억해서 완성했어요!

      </div>

    `;


    speech =
      `대단해요 아준 역무원. ` +
      `사라진 단어는 ${current.word}. ` +
      `단어 전체를 복구했어요. ` +
      `기차가 출발합니다!`;
  }


  const overlay =
    document.createElement(
      "div"
    );


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
        class="
          big-popup-button
          sound-button
        "
      >

        🔊 다시 듣기

      </button>


      <button
        id="nextTicket"
        class="big-popup-button"
      >

        🚄 기차 출발!

      </button>

    </div>

  `;


  document.body.appendChild(
    overlay
  );


  speak(
    speech
  );


  document
    .getElementById(
      "listenAgain"
    )
    .onclick =
    function() {

      speak(
        speech
      );

    };


  document
    .getElementById(
      "nextTicket"
    )
    .onclick =
    function() {

      speechSynthesis.cancel();

      overlay.remove();

      departTrain();

    };
}


/* ==========================================================
   기차 출발
   ========================================================== */

function departTrain() {

  train.classList.add(
    "go"
  );


  setTimeout(
    function() {

      train.classList.remove(
        "go"
      );


      makeQuestion();

    },
    1750
  );
}


/* ==========================================================
   난이도 이름
   ========================================================== */

const levelNames = {

  1:
    "LEVEL 1 · ?에 들어갈 자음 찾기",

  2:
    "LEVEL 2 · ?에 들어갈 모음 찾기",

  3:
    "LEVEL 3 · 자음·모음 랜덤",

  4:
    "LEVEL 4 · ?에 들어갈 한 글자 쓰기",

  5:
    "LEVEL 5 · 사라진 단어 전체 쓰기"

};


/* ==========================================================
   난이도 버튼
   ========================================================== */

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
              function(b) {

                b.classList.remove(
                  "active"
                );

              }
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
   버튼 연결
   ========================================================== */

document
  .getElementById(
    "clearBtn"
  )
  .onclick =
    clearCanvas;


document
  .getElementById(
    "hintBtn"
  )
  .onclick =
    hint;


document
  .getElementById(
    "checkBtn"
  )
  .onclick =
    checkAnswer;


/* ==========================================================
   게임 시작
   ========================================================== */

levelText.textContent =
  levelNames[level];


makeQuestion();


setTimeout(
  function() {

    speak(
      "아준 역무원 출근! 승차권에서 글자가 사라졌어요. 물음표에 들어갈 글자를 직접 써 주세요."
    );

  },
  700
);
