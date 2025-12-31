gsap.registerPlugin(ScrollTrigger);

// --- 1. Entry & Audio Logic ---
const audio = document.getElementById('bgMusic');
const entryScreen = document.getElementById('entry-screen');
const enterBtn = document.getElementById('enterBtn');
const mainContent = document.getElementById('main-content');

enterBtn.addEventListener('click', () => {
    // Play music immediately
    audio.play()
        .then(() => console.log("Audio playing"))
        .catch(e => console.log("Audio play error:", e));

    // Fade out entry screen
    entryScreen.style.opacity = '0';
    
    setTimeout(() => {
        entryScreen.style.display = 'none';
        
        // Show Main Content
        mainContent.classList.remove('hidden-content');
        mainContent.classList.add('visible-content');
        
        // Trigger Hero Animation
        gsap.to(".title", { duration: 1.5, opacity: 1, y: 0, ease: "power3.out" });
        gsap.to(".subtitle", { duration: 1.5, delay: 0.5, opacity: 0.6, ease: "power3.out" });
    }, 800);
});

// --- 2. Flip Card Logic ---
const flipCards = document.querySelectorAll('.flip-card-inner');
flipCards.forEach(card => {
    card.addEventListener('click', function() {
        this.classList.toggle('flipped');
    });
});

// --- 3. Scroll Animation ---
const cardContainers = document.querySelectorAll('.memory-card-container');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.15 });

cardContainers.forEach(container => observer.observe(container));

// --- 4. Hold Button Logic ---
const btn = document.getElementById('holdBtn');
const circle = document.querySelector('.progress-ring__circle');
const circumference = circle.r.baseVal.value * 2 * Math.PI;
let timer = null;
let progress = 0;
let unlocked = false;

circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = circumference;

function setProgress(percent) {
    const offset = circumference - (percent / 100) * circumference;
    circle.style.strokeDashoffset = offset;
}

function startHold(e) {
    if (unlocked) return;
    if (e.cancelable) e.preventDefault(); 

    timer = setInterval(() => {
        progress += 2; 
        setProgress(progress);
        
        if (progress >= 100) {
            clearInterval(timer);
            unlockFinale();
        }
    }, 20);
}

function stopHold() {
    if (unlocked) return;
    clearInterval(timer);
    progress = 0;
    circle.style.transition = 'stroke-dashoffset 0.3s ease';
    setProgress(0);
    setTimeout(() => circle.style.transition = 'stroke-dashoffset 0.1s linear', 300);
}

btn.addEventListener('mousedown', startHold);
btn.addEventListener('mouseup', stopHold);
btn.addEventListener('mouseleave', stopHold);
btn.addEventListener('touchstart', startHold);
btn.addEventListener('touchend', stopHold);

// --- 5. Finale Logic ---
function unlockFinale() {
    unlocked = true;
    const finale = document.getElementById('finale');
    
    finale.classList.remove('hidden');
    void finale.offsetWidth; 
    finale.classList.add('show');

    // Rocket Fireworks Loop
    const duration = 10 * 1000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5, angle: 60, spread: 55, origin: { x: 0, y: 1 },
            colors: ['#d4af37', '#ffffff', '#e0e0e0'], startVelocity: 80, gravity: 1.2, ticks: 300, scalar: 1.2
        });
        confetti({
            particleCount: 5, angle: 120, spread: 55, origin: { x: 1, y: 1 },
            colors: ['#d4af37', '#ffffff', '#e0e0e0'], startVelocity: 80, gravity: 1.2, ticks: 300, scalar: 1.2
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        } else {
            // Gold Dust Rain
            setInterval(() => {
                confetti({
                    particleCount: 2, angle: 90, spread: 160, origin: { y: -0.1 },
                    startVelocity: 15, gravity: 0.5, scalar: 0.6, colors: ['#d4af37', '#FFF'], ticks: 400
                });
            }, 150);
        }
    }());

    // Typewriter
    const text = "I'm so lucky to have you. Here is to making more memories together in 2026. I love you.";
    const el = document.getElementById('typewriter');
    let i = 0;
    function type() {
        if (i < text.length) {
            el.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, 50);
        }
    }
    setTimeout(type, 1000);
}