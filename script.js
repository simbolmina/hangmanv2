const wordEl = document.getElementById('word');
const wrongLettersEl = document.getElementById('wrong-letters');
const playAgainBtn = document.getElementById('play-again');
const popup = document.getElementById('popup-container');
const notification = document.getElementById('notification-container');
const finalMessage = document.getElementById('final-message');
const figureParts = document.querySelectorAll('.figure-part');
const hintEl = document.querySelector('.hint');
const scoreEl = document.querySelector('.score');
const recordEl = document.querySelector('.record');

const words = ['application', 'programming', 'interface', 'wizard'];

let selectedWord; // = words[Math.floor(Math.random() * words.length)];
let score = 00;
let record = 00;

const randomWord = function () {
  const res = fetch('https://random-words-api.vercel.app/word')
    .then(res => res.json())
    .then(data => {
      const word = data[0].word;
      const definition = data[0].definition;

      console.log(data);
      console.log(word);
      console.log(definition);

      hintEl.innerHTML = `Hint: ${definition}`;
      selectedWord = word.toLowerCase();
      console.log(selectedWord);
    });

  console.log(res);
};

randomWord();

const correctLetters = [];
const wrongLetters = [];

const displayWord = function () {
  wordEl.innerHTML = `
      ${selectedWord
        .split('')
        .map(
          letter =>
            `<span class="letter"> ${
              correctLetters.includes(letter) ? letter : ''
            } </span>`
        )
        .join('')}
      `;

  const innerWord = wordEl.innerText.replace(/\n/g, '');
  if (innerWord === selectedWord) {
    finalMessage.innerText = 'Congratulation';
    popup.style.display = 'flex';
  }
};

const updateWrongLettersEl = function () {
  wrongLettersEl.innerHTML = `
    ${wrongLetters.length > 0 ? '<p>Wrong</p>' : ''}
    ${wrongLetters.map(letter => `<span>${letter}</span>`)}
    `;

  figureParts.forEach((part, index) => {
    const errors = wrongLetters.length;

    if (index < errors) {
      part.style.display = 'block';
      showRecord();
    } else {
      part.style.display = 'none';
      showRecord();
    }
  });

  if (wrongLetters.length === figureParts.length) {
    finalMessage.innerText = 'You have lost';
    popup.style.display = 'flex';
  }
};

const showNotification = function () {
  notification.classList.add('show');

  setTimeout(() => {
    notification.classList.remove('show');
  }, 2000);
};

window.addEventListener('keydown', e => {
  //console.log(e.keyCode); 65-90
  if (e.keyCode >= 65 && e.keyCode <= 90) {
    const letter = e.key;

    if (selectedWord.includes(letter)) {
      if (!correctLetters.includes(letter)) {
        correctLetters.push(letter);

        score += 10;
        showScore();

        displayWord();
      } else {
        showNotification();
      }
    } else {
      if (!wrongLetters.includes(letter)) {
        wrongLetters.push(letter);
        score -= 10;
        showScore();

        updateWrongLettersEl();
      } else {
        showNotification();
      }
    }
  }
});

playAgainBtn.addEventListener('click', () => {
  correctLetters.splice(0);
  wrongLetters.splice(0);

  randomWord();

  setTimeout(() => {
    displayWord();
  }, 1000);

  updateWrongLettersEl();

  popup.style.display = 'none';

  score = 00;
  showScore();
  showRecord();
});

const showScore = function () {
  scoreEl.innerText = score;

  record = JSON.parse(localStorage.getItem('record'));
  showRecord();
};

const showRecord = function () {
  if (score > record) {
    record = score;
  }

  recordEl.innerText = record;
  localStorage.setItem('record', JSON.stringify(record));
};

showScore();

setTimeout(() => {
  displayWord();
}, 1000);
