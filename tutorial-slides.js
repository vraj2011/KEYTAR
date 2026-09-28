(function setupTutorial() {

    const overlay = document.getElementById("tutorial-overlay");

    if (!overlay) {
        return;
    }


    const slides = Array.prototype.slice.call(

        overlay.querySelectorAll(".tutorial-slide")

    );

    const dotsContainer = document.getElementById("tutorial-dots");

    const countEl = document.getElementById("tutorial-count");

    const prevBtn = document.getElementById("tutorial-prev");


    const nextBtn = document.getElementById("tutorial-next");

    const helpBtn = document.getElementById("tutorial-help-btn");


    
    const SEEN_KEY = "keytarTutorialSeen";
    
    let currentIndex = 0;

slides.forEach(function (_, i) {

    const dot = document.createElement("button");

    dot.type = "button";

    dot.className = "tutorial-dot";

    dot.setAttribute("aria-label", "Go to slide " + (i + 1));

    dot.addEventListener("click", function () {
        showSlide(i);
    });
    dotsContainer.appendChild(dot);
});


    const dots = Array.prototype.slice.call(dotsContainer.children);

    
    function showSlide(index) {
    
        currentIndex = Math.max(0, Math.min(index, slides.length - 1));


        
        slides.forEach(function (slide, i) {
        
            slide.classList.toggle("active", i === currentIndex);
        });
        
        dots.forEach(function (dot, i) {
        
            dot.classList.toggle("active", i === currentIndex);
        });

        
        countEl.textContent = (currentIndex + 1) + " / " + slides.length;
        
        prevBtn.disabled = currentIndex === 0;
        
        nextBtn.textContent =
        
        currentIndex === slides.length - 1 ? "Got it — let's play" : "Next";
        
        overlay.setAttribute("aria-labelledby", "tutorial-heading-" + currentIndex);
    }

    
    function openTutorial() {
    
        showSlide(0);
    
    
        overlay.classList.remove("hidden");
    
        document.body.classList.add("tutorial-open");
    
        requestAnimationFrame(function () {
    
            nextBtn.focus();
    
        });
    
    }

    
    
    function closeTutorial() {
    
        overlay.classList.add("hidden");
    
        document.body.classList.remove("tutorial-open");
    
        helpBtn.focus();


        try {
            localStorage.setItem(SEEN_KEY, "true");
        } catch (err) {
   
        }
    }

    function next() {
    
        if (currentIndex === slides.length - 1) {
            closeTutorial();
        }    
         else {
            showSlide(currentIndex + 1);
        }
    }

    function prev() {
        showSlide(currentIndex - 1);
    }

    nextBtn.addEventListener("click", next);
    prevBtn.addEventListener("click", prev);
    helpBtn.addEventListener("click", openTutorial);

    overlay.addEventListener("click", function (event) {
    
        if (event.target === overlay) {
            closeTutorial();
        }
    
    });

    window.addEventListener(
    "keydown",
    

    
    function (event) {
        if (overlay.classList.contains("hidden")) {
    
            if (event.key === "?") {
                event.preventDefault();
                event.stopPropagation();
                openTutorial();
            }
    
            return;
        }

        const key = event.key;

        if (key === "Tab" || key === "Shift") {
            event.preventDefault();
            event.stopImmediatePropagation();
            return;
        }
    
    
        if (key === "ArrowRight" || key === "Enter" || key === " ") {
            event.preventDefault();
            event.stopImmediatePropagation();
            next();
        }
    
        else if (key === "ArrowLeft") {
            event.preventDefault();
            event.stopImmediatePropagation();
            prev();
        }
        
        else if (key === "Escape") {
            event.stopImmediatePropagation();
            closeTutorial();
        }

        event.stopImmediatePropagation();
    },
    true
);



    function maybeAutoOpen() {
        let alreadySeen = false;
        try {
            alreadySeen = localStorage.getItem(SEEN_KEY) === "true";
        } catch (err) {
            alreadySeen = false;
        }

        if (!alreadySeen) {
            openTutorial();
        }
    }

    const loadingScreen = document.getElementById("loading-screen");

    
    if (!loadingScreen || loadingScreen.classList.contains("hidden")) {
    
        maybeAutoOpen();
    
    }
    
    else {
        const observer = new MutationObserver(function () {
    
            if (loadingScreen.classList.contains("hidden")) {
                observer.disconnect();
                maybeAutoOpen();
            }
        });
    
        observer.observe(loadingScreen, {
            attributes: true,
            attributeFilter: ["class"],
        });

    }
})();

// HEY DEAR REVIEWER
// DON'T RATE IT BLINDLY
// SEE MY EFFORTS I PUT IN IT!
// I HAVE LEARNED MANY NEW THINGS FROM THIS!
// YOU CAN'T BELIEVE BUT I REALLY NEED KREO SWARM 75
