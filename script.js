let selectedString = 6;

const noteNames = [
    "C", "C#", "D", "D#", "E", "F",
    "F#", "G", "G#", "A", "A#", "B"
];

const sampleNumbers = [];

for (let number = 40;
     number <= 84;
      number++)
       {
    sampleNumbers.push(number);
}

const guitarSounds = {};

for (let set = 1; set <= 6; set++) {
    guitarSounds[set] = {};

    for (let i = 0; i < 26; i++) {
        
        const letter = String.fromCharCode(97 + i);
        
        const sampleIndex = ((set - 1) * 26 + i) % sampleNumbers.length;
        
        const sampleNumber = sampleNumbers[sampleIndex];

        guitarSounds[set][letter] = {
        
            audio: new Audio(`audio/guitar/HV_${sampleNumber}.wav`),
        
            midi: sampleNumber
        };
    }
}

function midiToNote(midi) {

    const noteName = noteNames[midi % 12];

    const octave = Math.floor(midi / 12) - 1;

    return noteName + octave;
}


const stringStatusEl = document.getElementById("string-status");

const keyStatusEl = document.getElementById("key-status");

const noteStatusEl = document.getElementById("note-status");


const stringButtons = document.querySelectorAll(".string-key");

const onScreenKeys = document.querySelectorAll(".key");


function selectString(number) {

    selectedString = number;


    stringStatusEl.textContent = "Selected string: " + selectedString;

    keyStatusEl.textContent = "Choose a letter";

    noteStatusEl.textContent = "Note: --";


    stringButtons.forEach(function (btn) {

        btn.classList.toggle("active", Number(btn.dataset.string) === selectedString);

    });

}

function playLetter(letter) {

    const soundData = guitarSounds[selectedString][letter];

    if (!soundData) {
        return;
    }


    soundData.audio.currentTime = 0;

    soundData.audio.play();


    const playedNote = midiToNote(soundData.midi);


    keyStatusEl.textContent = "Playing: " + letter.toUpperCase();

    noteStatusEl.textContent = "Note: " + playedNote;

}


function highlightKey(letter, isActive) {

    onScreenKeys.forEach(function (keyEl) {

        if (keyEl.dataset.key === letter) {

            keyEl.classList.toggle("active", isActive);

        }
    });
}


document.addEventListener("keydown", function (event) {

    if (event.repeat) {

        return;
    }

    const key = event.key.toLowerCase();

    if (key >= "1" && key <= "6") {
        selectString(Number(key));
        return;
    }

    if (guitarSounds[selectedString][key]) {
        playLetter(key);
        highlightKey(key, true);
    }
});


document.addEventListener("keyup", function (event) {

    highlightKey(event.key.toLowerCase(), false);
});

onScreenKeys.forEach(function (keyEl) {

    const letter = keyEl.dataset.key;


    keyEl.addEventListener("pointerdown", function () {

        playLetter(letter);
        keyEl.classList.add("active");
    });

    keyEl.addEventListener("pointerup", function () {
        keyEl.classList.remove("active");
    });

    
    keyEl.addEventListener("pointercancel", function () {
    
        keyEl.classList.remove("active");
    
    });
});


stringButtons.forEach(function (btn) {

    btn.addEventListener("click", function () {

        selectString(Number(btn.dataset.string));
    });
});

// i used my maths power at here 
// my bro and gpt both suggested to enter each recording but i used my mathematics here!!
// I BET YOU CAN'T FIGURE IT OUT!
// GUYS PLS TELL ME IF YOU REALLY SEE THIS COZ I WANT TO FIGURE THAT OUT ,
// DOES ANYBODY READS MY CODE ACTUALLY OR NOT!!!