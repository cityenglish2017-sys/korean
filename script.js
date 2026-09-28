/* ==========================================================
   아준 역무원
   사라진 글자 승차권 - DAMAGE EDITION
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
  "ㅜ","ㅝ","ㅞ","ㅟ","ㅠ",
  "ㅡ","ㅢ","ㅣ"
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
   훼손 종류
========================================================== */

const DAMAGES = [

  {
    className: "damage-sticker",
    name: "수리 스티커",
    message: "승차권에 수리 스티커가 붙었어요!"
  },

  {
    className: "damage-ink",
    name: "잉크 얼룩",
    message: "승차권에 잉크가 번졌어요!"
  },

  {
    className: "damage-stamp",
    name: "도장",
    message: "역무원 도장이 글자를 가렸어요!"
  },

  {
    className: "damage-tear",
    name: "찢어진 부분",
    message: "승차권 일부가 찢어졌어요!"
  }

];


/* ==========================================================
   상태
========================================================== */

let level = 1;

let score = 0;

let current = null;

let previousWord = "";

let previousDamage = "";

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

const ticket =
  document.querySelector(".ticket");


/* ==========================================================
   복구 완료 도장 생성
========================================================== */

const repairStamp =
  document.createElement("div");

repairStamp.className =
  "repair-stamp";

repairStamp.textContent =
  "복구 완료 ✓";

ticket.appendChild(
  repairStamp
);


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
    Math.floor(
      index / 588
    );


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

  }

  while (
    choice[0] === previousWord &&
    WORDS.length > 1
  );


  previousWord =
    choice[0];


  return choice;
}


/* ==========================================================
   훼손 선택
========================================================== */

function getRandomDamage() {

  let damage;


  do {

    damage =
      random(DAMAGES);

  }

  while (
    damage.className ===
      previousDamage &&
    DAMAGES.length > 1
  );


  previousDamage =
    damage.className;


  return damage;
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


  let index =
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


  /* LEVEL 1 */

  if (level === 1) {

    type =
      "consonant";

    answer =
      parts.initial;

  }


  /* LEVEL 2 */

  else if (level === 2) {

    type =
      "vowel";

    answer =
      parts.vowel;

  }


  /* LEVEL 3 */

  else if (level === 3) {

    if (
      Math.random() < .5
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


  /* LEVEL 4 */

  else if (level === 4) {

    type =
      "syllable";

    answer =
      syllable;

  }


  /* LEVEL 5 */

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
    answer,

    damage:
      getRandomDamage()

  };


  repairStamp.classList.remove(
    "show"
  );


  renderQuestion();

  clearCanvas();

}


/* ==========================================================
   승차권 단어 만들기
========================================================== */

function createDamagedWord() {

  let html =
    `<div class="ticket-word">`;


  /* LEVEL 5
     단어 전체가 훼손됨
  */

  if (
    current.type === "word"
  ) {

    current.letters.forEach(
      function(letter) {

        html += `

          <span
            class="
              ticket-letter
              damaged-letter
              ${current.damage.className}
            "
          >

            <span
              class="hidden-original">

              ${letter}

            </span>

          </span>

        `;

      }
    );

  }


  /* LEVEL 1~4
     한 음절만 훼손됨
  */

  else {

    current.letters.forEach(
      function(letter, i) {

        if (
          i === current.index
        ) {

          html += `

            <span
              id="damagedTarget"
              class="
                ticket-letter
                damaged-letter
                ${current.damage.className}
              "
            >

              <span
                class="hidden-original">

                ${letter}

              </span>

            </span>

          `;

        }

        else {

          html += `

            <span
              class="ticket-letter">

              ${letter}

            </span>

          `;

        }

      }
    );

  }


  html +=
    `</div>`;


  return html;
}


/* ==========================================================
   문제 화면
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
      "진주"
    ]);


  let instruction;


  if (
    current.type ===
    "consonant"
  ) {

    instruction =
      `${current.damage.message} ` +
      `가려진 글자의 첫소리를 써서 복구하세요.`;

  }


  else if (
    current.type ===
    "vowel"
  ) {

    instruction =
      `${current.damage.message} ` +
      `가려진 글자의 가운데소리를 써서 복구하세요.`;

  }


  else if (
    current.type ===
    "syllable"
  ) {

    instruction =
      `${current.damage.message} ` +
      `가려진 글자 하나를 써서 복구하세요.`;

  }


  else {

    instruction =
      `승차권의 단어가 모두 훼손됐어요! ` +
      `단어 전체를 기억해서 써 주세요.`;

  }


  missionText.innerHTML = `

    <div class="damage-warning">

      ⚠️ 승차권 훼손 발견

    </div>

    <br>

    ${instruction}

  `;


  wordDisplay.innerHTML =
    createDamagedWord();

}


/* ==========================================================
   Canvas 크기
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
   쓰기
========================================================== */

canvas.addEventListener(
  "pointerdown",
  function(e) {

    drawing = true;

    hasDrawn = true;


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


    /*
      점 하나 찍어도 보이도록
    */

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

    drawing = false;

  }
);


canvas.addEventListener(
  "pointercancel",
  function() {

    drawing = false;

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


  hasDrawn = false;
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


  const utterance =
    new SpeechSynthesisUtterance(
      text
    );


  utterance.lang =
    "ko-KR";


  utterance.rate =
    .78;


  utterance.pitch =
    1.05;


  speechSynthesis.speak(
    utterance
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
      `'${current.word}'을 읽어 보세요. ` +
      `가려진 '${current.syllable}'의 ` +
      `첫소리를 생각해 보세요.`;

  }


  else if (
    current.type ===
    "vowel"
  ) {

    message =
      `'${current.word}'을 천천히 읽어 보세요. ` +
      `가려진 '${current.syllable}'의 ` +
      `가운데소리를 생각해 보세요.`;

  }


  else if (
    current.type ===
    "syllable"
  ) {

    message =
      `'${current.word}'을 천천히 읽어 보세요. ` +
      `어떤 글자가 가려졌을까요?`;

  }


  else {

    message =
      `'${current.word}'. ` +
      `한 글자씩 천천히 말하면서 ` +
      `단어 전체를 써 보세요.`;

  }


  showToast(
    message
  );


  speak(
    message
  );
}


/* ==========================================================
   토스트
========================================================== */

function showToast(message) {

  const old =
    document.querySelector(
      ".hint-toast"
    );


  if (old)
    old.remove();


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
   확인
========================================================== */

function checkAnswer() {

  /*
    아무것도 안 썼을 때
  */

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


      <div class="correct-answer">

        ${current.answer}

      </div>


      <div class="popup-word">

        ${current.emoji}

        ${current.word}

      </div>


      <div class="popup-question">

        아준이가 쓴 것과
        정답이 같나요?

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


      score += 10;


      scoreElement.textContent =
        score;


      revealTicket();

    };
}


/* ==========================================================
   승차권 복구 연출
========================================================== */

function revealTicket() {

  const targets =
    document.querySelectorAll(
      ".damaged-letter"
    );


  targets.forEach(
    function(target) {

      target.classList.add(
        "damage-reveal"
      );

    }
  );


  repairStamp.classList.add(
    "show"
  );


  speak(
    "승차권 복구 성공!"
  );


  setTimeout(
    function() {

      learningPopup();

    },
    900
  );
}


/* ==========================================================
   학습 팝업
========================================================== */

function learningPopup() {

  let content = "";

  let speech = "";


  /* ======================
     자음
  ====================== */

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

        <strong>
          ${current.answer}
        </strong>

        은 자음이에요.

        <br>

        이름은

        <strong>
          ${name}
        </strong>

        이에요.

      </div>


      <div class="jamo-card">

        승차권에서 가려졌던 글자는

        <strong>
          ${current.syllable}
        </strong>

        였어요.

        <br>

        ${current.parts.initial}
        +
        ${current.parts.vowel}

        ${
          current.parts.final
          ?
          "+ " +
          current.parts.final
          :
          ""
        }

        →

        <strong>
          ${current.syllable}
        </strong>

      </div>

    `;


    speech =
      `딩동댕! ` +
      `${current.answer}을 잘 찾았어요. ` +
      `${current.answer}의 이름은 ${name}이에요. ` +
      `가려졌던 글자는 ${current.syllable}. ` +
      `${current.word} 승차권 복구 성공!`;

  }


  /* ======================
     모음
  ====================== */

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

        <strong>
          ${current.answer}
        </strong>

        는 모음이에요.

        <br>

        <span class="sound-highlight">

          🔊 ${sound}

        </span>

        소리가 나요.

      </div>


      <div class="jamo-card">

        승차권에서 가려졌던 글자는

        <strong>
          ${current.syllable}
        </strong>

        였어요.

        <br>

        ${current.parts.initial}
        +
        ${current.parts.vowel}

        ${
          current.parts.final
          ?
          "+ " +
          current.parts.final
          :
          ""
        }

        →

        <strong>
          ${current.syllable}
        </strong>

      </div>

    `;


    speech =
      `딩동댕! ` +
      `${current.answer}를 잘 찾았어요. ` +
      `${current.answer}는 모음이고 ` +
      `${sound} 소리가 나요. ` +
      `가려졌던 글자는 ${current.syllable}. ` +
      `승차권 복구 성공!`;

  }


  /* ======================
     한 글자
  ====================== */

  else if (
    current.type ===
    "syllable"
  ) {

    content = `

      <div class="jamo-main">

        ${current.syllable}

      </div>


      <div class="jamo-card">

        가려졌던 글자는

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
          "+ " +
          current.parts.final
          :
          ""
        }

        →

        <strong>
          ${current.syllable}
        </strong>

      </div>

    `;


    speech =
      `잘했어요 아준 역무원! ` +
      `가려졌던 글자는 ${current.syllable}. ` +
      `${current.word} 승차권 복구 성공!`;

  }


  /* ======================
     단어
  ====================== */

  else {

    content = `

      <div
        class="jamo-main"
        style="font-size:52px;"
      >

        ${current.word}

      </div>


      <div class="jamo-card">

        승차권의 단어를
        모두 복구했어요!

        <br><br>

        ${current.emoji}

        <strong>
          ${current.word}
        </strong>

      </div>

    `;


    speech =
      `대단해요 아준 역무원! ` +
      `${current.word} 단어 전체를 복구했어요. ` +
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

        🚄 승차권 확인 · 출발!

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
   난이도
========================================================== */

const levelNames = {

  1:
    "LEVEL 1 · 가려진 글자의 첫소리 찾기",

  2:
    "LEVEL 2 · 가려진 글자의 가운데소리 찾기",

  3:
    "LEVEL 3 · 자음·모음 섞어서 복구",

  4:
    "LEVEL 4 · 가려진 한 글자 복구",

  5:
    "LEVEL 5 · 훼손된 단어 전체 복구"

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
   버튼
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
   시작
========================================================== */

levelText.textContent =
  levelNames[level];


makeQuestion();


setTimeout(
  function() {

    speak(
      "아준 역무원 출근! 승차권이 훼손됐어요. 가려진 글자를 찾아서 복구해 주세요."
    );

  },
  700
);
