 const MORSE_CODE = {
     'A': '.-',
     'B': '-...',
     'C': '-.-.',
     'D': '-..',
     'E': '.',
     'F': '..-.',
     'G': '--.',
     'H': '....',
     'I': '..',
     'J': '.---',
     'K': '-.-',
     'L': '.-..',
     'M': '--',
     'N': '-.',
     'O': '---',
     'P': '.--.',
     'Q': '--.-',
     'R': '.-.',
     'S': '...',
     'T': '-',
     'U': '..-',
     'V': '...-',
     'W': '.--',
     'X': '-..-',
     'Y': '-.--',
     'Z': '--..',
     '0': '-----',
     '1': '.----',
     '2': '..---',
     '3': '...--',
     '4': '....-',
     '5': '.....',
     '6': '-....',
     '7': '--...',
     '8': '---..',
     '9': '----.',
     '.': '.-.-.-',
     ',': '--..--',
     '?': '..--..',
     '!': '-.-.--',
     '/': '-..-.',
     '(': '-.--.',
     ')': '-.--.-',
     '&': '.-...',
     ':': '---...',
     ';': '-.-.-.',
     '=': '-...-',
     '+': '.-.-.',
     '-': '-....-',
     '_': '..--.-',
     '"': '.-..-.',
     '$': '...-..-',
     '@': '.--.-.',
     ' ': '/' // space as word separator
 };

 // Reverse mapping for decoding
 const REVERSE_MORSE = Object.fromEntries(
     Object.entries(MORSE_CODE).map(([k, v]) => [v, k])
 );

 const inputText = document.getElementById('inputText');
 const outputArea = document.getElementById('outputArea');
 const flashBox = document.getElementById('flashBox');

 // Encode text to Morse
 document.getElementById('encodeBtn').addEventListener('click', () => {
     const text = inputText.value.toUpperCase();
     let morse = '';
     for (let char of text) {
         if (MORSE_CODE[char]) {
             morse += MORSE_CODE[char] + ' ';
         }
     }
     outputArea.textContent = morse.trim();
 });

 // Decode Morse to text
 document.getElementById('decodeBtn').addEventListener('click', () => {
     const morse = inputText.value.trim();
     const words = morse.split(' / '); // words separated by '/'
     let decoded = '';
     for (let word of words) {
         const letters = word.split(' ');
         for (let letter of letters) {
             decoded += REVERSE_MORSE[letter] || '';
         }
         decoded += ' ';
     }
     outputArea.textContent = decoded.trim();
 });

 // Play Morse code with sound and flash
 document.getElementById('playBtn').addEventListener('click', async() => {
     const morse = outputArea.textContent.trim();
     if (!morse) return alert("No Morse code to play!");

     const unit = 200; // basic time unit in ms
     const audioCtx = new(window.AudioContext || window.webkitAudioContext)();

     // Play a beep for a given duration
     const beep = async(duration) => {
         const oscillator = audioCtx.createOscillator();
         const gainNode = audioCtx.createGain();
         oscillator.type = 'sine';
         oscillator.frequency.value = 600; // Hz
         oscillator.connect(gainNode);
         gainNode.connect(audioCtx.destination);
         oscillator.start();
         flashBox.style.backgroundColor = '#ff5252'; // flash
         await new Promise(r => setTimeout(r, duration));
         oscillator.stop();
         flashBox.style.backgroundColor = '#555'; // back to normal
         await new Promise(r => setTimeout(r, unit)); // gap after symbol
     };

     // Iterate over each symbol
     for (let symbol of morse) {
         if (symbol === '.') {
             await beep(unit); // dot
         } else if (symbol === '-') {
             await beep(unit * 3); // dash
         } else if (symbol === ' ') {
             await new Promise(r => setTimeout(r, unit * 2)); // space between letters
         } else if (symbol === '/') {
             await new Promise(r => setTimeout(r, unit * 4)); // space between words
         }
     }
 });