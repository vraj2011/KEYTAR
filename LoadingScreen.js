    (function setupLoadingScreen() {
    const loadingScreen = document.getElementById("loading-screen");

    if (!loadingScreen) {
        return;
    }

// i am here because i want a kreo swarm 75 (gradient edition)
// because it looks aesthetic and gaming kinda and infact i love it!
// i hope that ARY and tabbed guys approve us
// this keyboard is a quite expensive around 5600 so i need 60 $


    const stringPath = document.getElementById("loading-string");

    const pickGroup = document.getElementById("loading-pick");

    const statusEl = document.getElementById("loading-status");

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"

    ).matches;

    document.body.classList.add("is-loading");

    const START = { x: 10, y: 35 };

    const END = { x: 390, y: 35 };

    const BASE_SLACK = 22;


    let progress = 0;

    let vibrationPhase = 0;

    let settled = false;


    function pointOnCurve(t, controlY) {

        const x =
            (1 - t) * (1 - t) * START.x +
            2 * (1 - t) * t * 200 +
            t * t * END.x;

            const y =
            (1 - t) * (1 - t) * START.y +
            2 * (1 - t) * t * controlY +
            t * t * END.y;

            return { x: x, y: y };
    }

    
    function render() {

        vibrationPhase += 0.12;

        const slack = BASE_SLACK * (1 - progress);

        const wiggle =

        !settled && !prefersReducedMotion ? Math.sin(vibrationPhase) * 1.6 : 0;

        const amplitude = Math.max(0, slack + wiggle);

        const controlY = 35 - amplitude;

        stringPath.setAttribute(
            "d",
            "M" + START.x + "," + START.y +
                " Q200," + controlY + " " + END.x + "," + END.y
        );

        const pick = pointOnCurve(progress, controlY);
        const tilt = wiggle * 4;
        pickGroup.setAttribute(
            "transform",
            "translate(" + pick.x + "," + pick.y + ") rotate(" + tilt + ")"
        );

        if (!settled) {
            requestAnimationFrame(render);
        }
    }
    requestAnimationFrame(render);


    const allAudioElements = [];

    for (let set = 1; set <= 6; set++) {

        for (const letter in guitarSounds[set]) {

            allAudioElements.push(guitarSounds[set][letter].audio);
        }
    }


// i am vraj and huys this time i am  writinmg these kinda things to see if anybody's 
// actually see this or not because i  don't think if anyone from HQ really see this 
// so if you see this kinda anything , tell me i knew it.... bcz everytime i write it but nobody actually takes deep intrest


    const total = allAudioElements.length;

    let loadedCount = 0;

    let finished = false;


    function markLoaded() {

        loadedCount++;

        progress = Math.min(1, loadedCount / total);

        statusEl.textContent = "Tuning strings\u2026 " + Math.round(progress * 100) + "%";

        if (loadedCount >= total) {
            finish();
        }
    }


    function finish() {

        if (finished) {

            return;
        }

        finished = true;

        progress = 1;
        
        settled = true;

        statusEl.textContent = "Ready to play";

        requestAnimationFrame(render); 

        setTimeout(function () {
            loadingScreen.classList.add("hidden");
            document.body.classList.remove("is-loading");
        }, 400);
    }

    if (total === 0) {
        finish();
    } else {
        allAudioElements.forEach(function (audio) {
            if (audio.readyState >= 3) {
                markLoaded();
            } else {
                audio.addEventListener("canplaythrough", markLoaded, { once: true });
                audio.addEventListener("error", markLoaded, { once: true });
            }
        });
    }

    setTimeout(function () {
        if (!finished) {
            finish();
        }
    }, 8000);
})();

// in this file , i have included the core logic for the loading screen!
// i have done this to make KEYTAR  bit more good looking...
// i am little weak on JS coz i confuse in JS  the most time
//that is why i HTML and CSS  more!!
// HAS ANYBODY ACTUALLY SEE THIS ??????????????????!!
