(function setupPlaybackControls() {
   
    const volumeSlider = document.getElementById("volume-slider");
   
    const volumeValue = document.getElementById("volume-value");

    function applyVolume(percent) {
   
        const level = percent / 100;
        for (let set = 1; set <= 6; set++) {
   
            for (const letter in guitarSounds[set]) {
                guitarSounds[set][letter].audio.volume = level;
            }
        }
    }

    if (volumeSlider) {
   
        applyVolume(Number(volumeSlider.value));

        volumeSlider.addEventListener("input", function () {
   
            const percent = Number(volumeSlider.value);
   
            applyVolume(percent);
            volumeValue.textContent = percent + "%";
        });
    }

    const recordBtn = document.getElementById("record-btn");
   
    const playBtn = document.getElementById("play-btn");
   
    const clearBtn = document.getElementById("clear-btn");
   
    const statusEl = document.getElementById("recorder-status");
   
    const nameInput = document.getElementById("recording-name-input");
   
    const saveBtn = document.getElementById("save-recording-btn");
   
    const savedListEl = document.getElementById("saved-recordings-list");
   
    const savedEmptyEl = document.getElementById("saved-recordings-empty");

    if (!recordBtn) {
        return;
    }

    const MAX_DURATION_MS = 600000;
   
    const STORAGE_KEY = "keytarRecordings";

    let events = [];
    let isRecording = false;
    let isPlaying = false;
    let recordingStartTime = 0;
    let autoStopTimer = null;

    function logEvent(string, letter) {
        if (!isRecording) {
            return;
        }
   
        events.push({
            string: string,
            letter: letter,
            delay: performance.now() - recordingStartTime
        });
    }

    function startRecording() {
        events = [];
        isRecording = true;
        recordingStartTime = performance.now();

        recordBtn.textContent = "\u25A0 Stop";
   
        recordBtn.classList.add("is-recording");
   
        playBtn.disabled = true;
   
        clearBtn.disabled = true;
   
        nameInput.disabled = true;
   
        saveBtn.disabled = true;
   
        statusEl.textContent = "Recording\u2026";


        autoStopTimer = setTimeout(stopRecording, MAX_DURATION_MS);
    }

    function stopRecording() {
        isRecording = false;
        clearTimeout(autoStopTimer);

        recordBtn.textContent = "\u25CF Record";
        
        recordBtn.classList.remove("is-recording");
        
        playBtn.disabled = events.length === 0;
        
        clearBtn.disabled = events.length === 0;
        
        nameInput.disabled = events.length === 0;
        
        saveBtn.disabled = events.length === 0;
        
        statusEl.textContent = events.length
            ? events.length + " notes recorded"
            : "Nothing recorded";
    }

    function playRecordedNote(string, letter) {
        const soundData = guitarSounds[string] && guitarSounds[string][letter];
        if (!soundData) {
            return;
        }

        soundData.audio.currentTime = 0;
        soundData.audio.play();

        const playedNote = midiToNote(soundData.midi);
        
        const keyStatusEl = document.getElementById("key-status");
        
        const noteStatusEl = document.getElementById("note-status");

        if (keyStatusEl) {
            keyStatusEl.textContent = "Playing: " + letter.toUpperCase();
        
        }
        
        if (noteStatusEl) {
            noteStatusEl.textContent = "Note: " + playedNote;
        }

        
        const keyEl = document.querySelector('.key[data-key="' + letter + '"]');
        
        if (keyEl) {
            keyEl.classList.add("active");
            setTimeout(function () {
                keyEl.classList.remove("active");
            }, 180);
        }
    }

    function playRecording() {
        
        if (isPlaying || events.length === 0) {
            return;
        }

        isPlaying = true;
        recordBtn.disabled = true;
        playBtn.disabled = true;
        clearBtn.disabled = true;
        nameInput.disabled = true;
        saveBtn.disabled = true;
        statusEl.textContent = "Playing back\u2026";

        events.forEach(function (evt) {
            setTimeout(function () {
                playRecordedNote(evt.string, evt.letter);
            }, evt.delay);
        });

        const totalDuration = events[events.length - 1].delay + 400;

        setTimeout(function () {
            isPlaying = false;
            recordBtn.disabled = false;
            playBtn.disabled = false;
            clearBtn.disabled = false;
            nameInput.disabled = false;
            saveBtn.disabled = false;
            statusEl.textContent = events.length + " notes recorded";
        }, totalDuration);
    }

    function clearRecording() {
        events = [];
        playBtn.disabled = true;
        clearBtn.disabled = true;
        nameInput.disabled = true;
        saveBtn.disabled = true;
        nameInput.value = "";
        statusEl.textContent = "Not recording";
    }

    recordBtn.addEventListener("click", function () {
        if (isRecording) {
            stopRecording();
        }
        
        else {
            startRecording();
        }
    });

    playBtn.addEventListener("click", playRecording);
    
    clearBtn.addEventListener("click", clearRecording);

    document.addEventListener("keydown", function (event) {
    
        if (!isRecording || event.repeat) {
            return;
        }

        const key = event.key.toLowerCase();

        if (key >= "1" && key <= "6") {
            return;
        }

        if (guitarSounds[selectedString] && guitarSounds[selectedString][key]) {
            logEvent(selectedString, key);
        }
    });

    document.querySelectorAll(".key").forEach(function (keyEl) {
        keyEl.addEventListener("pointerdown", function () {
            logEvent(selectedString, keyEl.dataset.key);
        });
    });

    function loadSavedRecordings() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        }
         catch (err) {
            return [];
        }
    }

    function writeSavedRecordings(list) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        } catch (err) {
        }
    }

    function renderSavedRecordings() {
        
        if (!savedListEl) {
            return;
        }

        const saved = loadSavedRecordings();

        savedListEl.querySelectorAll(".saved-recording-item").forEach(function (el) {
            el.remove();
        });

        if (saved.length === 0) {
        
            if (savedEmptyEl) {
                savedEmptyEl.style.display = "";
            }
            return;
        }
        
        if (savedEmptyEl) {
            savedEmptyEl.style.display = "none";
        }

        saved.forEach(function (rec) {
        
            const li = document.createElement("li");
            li.className = "saved-recording-item";

            const nameSpan = document.createElement("span");
            nameSpan.className = "saved-recording-name";
            nameSpan.textContent = rec.name;

            const metaSpan = document.createElement("span");
            metaSpan.className = "saved-recording-meta";
            metaSpan.textContent = rec.events.length + " notes";

            const loadBtn = document.createElement("button");
            loadBtn.type = "button";
            loadBtn.className = "mini-btn";
            loadBtn.textContent = "Load";
            loadBtn.addEventListener("click", function () {
                loadRecording(rec);
            });

            const deleteBtn = document.createElement("button");
            deleteBtn.type = "button";
            deleteBtn.className = "mini-btn mini-btn-danger";
            deleteBtn.textContent = "Delete";
            deleteBtn.addEventListener("click", function () {
                deleteRecording(rec.id);
            });

            li.appendChild(nameSpan);
            li.appendChild(metaSpan);
            li.appendChild(loadBtn);
            li.appendChild(deleteBtn);
            savedListEl.appendChild(li);
        });
    }

    function loadRecording(rec) {
        
        if (isRecording || isPlaying) {
            return;
        }

        events = rec.events.slice();
        playBtn.disabled = events.length === 0;
        clearBtn.disabled = events.length === 0;
        nameInput.disabled = true;
        saveBtn.disabled = true;
        statusEl.textContent = "Loaded \u201C" + rec.name + "\u201D \u2014 " + events.length + " notes";
    }

    function deleteRecording(id) {
        const saved = loadSavedRecordings().filter(function (rec) {
            return rec.id !== id;
        });
        writeSavedRecordings(saved);
        renderSavedRecordings();
    }

    function saveCurrentRecording() {
        if (events.length === 0) {
            return;
        }

        const name = nameInput.value.trim() || "Untitled";
        const saved = loadSavedRecordings();

        saved.push({
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
            name: name,
            events: events,
            savedAt: Date.now()
        });

        writeSavedRecordings(saved);
        nameInput.value = "";
        renderSavedRecordings();
        statusEl.textContent = "Saved \u201C" + name + "\u201D";
    }

    if (saveBtn) {
        saveBtn.addEventListener("click", saveCurrentRecording);
    }

    if (nameInput) {
        document.addEventListener("keydown", function (event) {
            if (event.target !== nameInput) {
                return;
            }
            if (event.key === "Enter") {
                event.preventDefault();
                saveCurrentRecording();
            }
            event.stopPropagation();
        }, true);
    }

    renderSavedRecordings();
})();   