let selectedString = 6;
(function keyboardOnly() {
    let lastPointerType = "";

    function fromMouse(event) {
        if (event.pointerType) {
            return event.pointerType === "mouse";
        }

        if (event.type === "click" && event.detail === 0) {
            return false;
        }

        return lastPointerType === "mouse";
    }

    function block(event) {
        if (fromMouse(event)) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    }

    window.addEventListener("pointermove", function (event) {
        lastPointerType = event.pointerType;
    }, true);

    window.addEventListener("pointerdown", function (event) {
        lastPointerType = event.pointerType;
        block(event);
    }, true);

    ["pointerup", "mousedown", "mouseup", "click", "dblclick",
     "auxclick", "contextmenu", "dragstart"].forEach(function (type) {
        window.addEventListener(type, block, true);
    });


    window.addEventListener("wheel", function (event) {
        event.preventDefault();
    }, { passive: false, capture: true });
})();


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

window.addEventListener("keydown", function (event) {
    if (event.key === "Tab") {
        event.preventDefault();
        return;
    }

    if (![
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown"
    ].includes(event.key)) {
        return;
    }

    const tutorialOverlay = document.getElementById("tutorial-overlay");
    if (tutorialOverlay && !tutorialOverlay.classList.contains("hidden")) {
        return;
    }

    const target = event.target;
    const isTextInput = target instanceof HTMLInputElement && target.type === "text";
    const isRangeInput = target instanceof HTMLInputElement && target.type === "range";

    if (isRangeInput && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
        return;
    }

    let direction = event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1;

    if (isTextInput && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
        const hasSelection = target.selectionStart !== target.selectionEnd;
        const hasTextInDirection = event.key === "ArrowLeft"
            ? target.selectionStart > 0
            : target.selectionEnd < target.value.length;

        if (hasSelection || hasTextInDirection) {
            return;
        }
    }

    const controls = Array.from(document.querySelectorAll(
        'button, input:not([type="hidden"]), select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
    )).filter(function (control) {
        return !control.disabled && control.getClientRects().length > 0;
    });

    if (controls.length === 0) {
        return;
    }

    const currentIndex = controls.indexOf(document.activeElement);
    const nextIndex = currentIndex === -1
        ? (direction > 0 ? 0 : controls.length - 1)
        : (currentIndex + direction + controls.length) % controls.length;

    event.preventDefault();
    controls[nextIndex].focus();
}, true);


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
