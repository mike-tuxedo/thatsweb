console.log('main skript loaded')

// Verschiedene Path-Definitionen
const paths = [
    "M32.5,-65.4C38.7,-52.6,38.2,-37.2,40.9,-25.8C43.5,-14.5,49.4,-7.2,51.3,1.1C53.2,9.5,51.2,18.9,49.7,32.4C48.3,45.9,47.5,63.4,39.3,74.3C31.2,85.1,15.6,89.3,2.7,84.6C-10.2,79.9,-20.3,66.4,-26.8,54.5C-33.3,42.7,-36,32.5,-46.7,23.7C-57.4,14.9,-76,7.5,-79.4,-2C-82.9,-11.4,-71.1,-22.8,-60.5,-31.9C-50,-40.9,-40.6,-47.5,-30.7,-58.2C-20.8,-69,-10.4,-83.8,1.3,-86.2C13.1,-88.5,26.2,-78.3,32.5,-65.4Z",
    "M47,-80.9C61,-73.3,72.7,-61,71.9,-46.7C71.1,-32.5,57.9,-16.2,57.3,-0.3C56.7,15.6,68.8,31.2,64.7,36.8C60.5,42.4,40,38.2,26.5,38C13,37.8,6.5,41.8,-2.2,45.6C-10.9,49.4,-21.8,53,-32.2,51.4C-42.5,49.8,-52.3,42.8,-55.6,33.4C-58.8,23.9,-55.5,12,-52,2C-48.4,-7.9,-44.7,-15.8,-40.5,-23.5C-36.2,-31.1,-31.4,-38.6,-24.6,-50.3C-17.7,-62.1,-8.9,-78.2,3.8,-84.8C16.5,-91.4,32.9,-88.5,47,-80.9Z",
    "M32.5,-65.4C38.7,-52.6,38.2,-37.2,40.9,-25.8C43.5,-14.5,49.4,-7.2,51.3,1.1C53.2,9.5,51.2,18.9,49.7,32.4C48.3,45.9,47.5,63.4,39.3,74.3C31.2,85.1,15.6,89.3,2.7,84.6C-10.2,79.9,-20.3,66.4,-26.8,54.5C-33.3,42.7,-36,32.5,-46.7,23.7C-57.4,14.9,-76,7.5,-79.4,-2C-82.9,-11.4,-71.1,-22.8,-60.5,-31.9C-50,-40.9,-40.6,-47.5,-30.7,-58.2C-20.8,-69,-10.4,-83.8,1.3,-86.2C13.1,-88.5,26.2,-78.3,32.5,-65.4Z",
  "M26.7,-54.1C31.2,-43.6,29.1,-29.6,31.4,-20C33.7,-10.4,40.4,-5.2,42.1,1C43.7,7.1,40.3,14.2,34.7,18C29,21.7,21,22.1,14.8,30.3C8.6,38.6,4.3,54.7,-1.3,57C-6.9,59.3,-13.9,47.6,-26.7,43.2C-39.5,38.8,-58.2,41.6,-63.4,35.6C-68.5,29.6,-60.2,14.8,-53.9,3.6C-47.6,-7.5,-43.4,-15.1,-38.7,-22C-34.1,-28.9,-29,-35.2,-22.5,-44.6C-16,-54,-8,-66.5,1.5,-69.2C11.1,-71.9,22.1,-64.7,26.7,-54.1Z",
"M34.4,-63.3C41,-55.8,40.2,-39.3,42.3,-27.2C44.3,-15.2,49.2,-7.6,53.9,2.7C58.6,13,63.1,26,60.4,37C57.8,48,47.9,56.9,36.6,59.5C25.4,62,12.7,58.1,-1.7,61C-16,63.8,-32,73.5,-40.7,69.5C-49.4,65.5,-50.8,47.8,-51.6,33.9C-52.5,20.1,-52.8,10,-49.6,1.8C-46.4,-6.4,-39.7,-12.7,-35.6,-20.9C-31.4,-29,-29.8,-38.9,-24.3,-47.1C-18.8,-55.3,-9.4,-61.8,2.2,-65.7C13.9,-69.6,27.8,-70.9,34.4,-63.3Z",
"M22.3,-36.9C33.9,-31.9,51.7,-36,54.7,-31.4C57.6,-26.8,45.7,-13.4,44.9,-0.5C44,12.5,54.4,24.9,52.6,31.6C50.9,38.3,37,39.2,26.2,37.2C15.4,35.1,7.7,30.2,-0.6,31.2C-8.9,32.3,-17.9,39.3,-23.5,38.4C-29,37.4,-31.3,28.4,-41.9,20.6C-52.5,12.9,-71.5,6.5,-79.7,-4.7C-87.9,-15.9,-85.3,-31.8,-75.3,-40.6C-65.2,-49.3,-47.7,-50.8,-33.9,-54.6C-20.2,-58.4,-10.1,-64.3,-2.4,-60.2C5.3,-56.1,10.7,-41.9,22.3,-36.9Z",
    "M47,-80.9C61,-73.3,72.7,-61,71.9,-46.7C71.1,-32.5,57.9,-16.2,57.3,-0.3C56.7,15.6,68.8,31.2,64.7,36.8C60.5,42.4,40,38.2,26.5,38C13,37.8,6.5,41.8,-2.2,45.6C-10.9,49.4,-21.8,53,-32.2,51.4C-42.5,49.8,-52.3,42.8,-55.6,33.4C-58.8,23.9,-55.5,12,-52,2C-48.4,-7.9,-44.7,-15.8,-40.5,-23.5C-36.2,-31.1,-31.4,-38.6,-24.6,-50.3C-17.7,-62.1,-8.9,-78.2,3.8,-84.8C16.5,-91.4,32.9,-88.5,47,-80.9Z",
    "M32.5,-65.4C38.7,-52.6,38.2,-37.2,40.9,-25.8C43.5,-14.5,49.4,-7.2,51.3,1.1C53.2,9.5,51.2,18.9,49.7,32.4C48.3,45.9,47.5,63.4,39.3,74.3C31.2,85.1,15.6,89.3,2.7,84.6C-10.2,79.9,-20.3,66.4,-26.8,54.5C-33.3,42.7,-36,32.5,-46.7,23.7C-57.4,14.9,-76,7.5,-79.4,-2C-82.9,-11.4,-71.1,-22.8,-60.5,-31.9C-50,-40.9,-40.6,-47.5,-30.7,-58.2C-20.8,-69,-10.4,-83.8,1.3,-86.2C13.1,-88.5,26.2,-78.3,32.5,-65.4Z"
];

let currentIndex = 0;
let isAnimating = false;
let autoPlay = false;
let autoPlayInterval;

const morphPath = document.getElementById('morphPath');

function morphTo(index) {
    if (isAnimating || index === currentIndex) return;

    isAnimating = true;

    // Morph-Animation mit Flubber
    const interpolator = flubber.interpolate(paths[currentIndex], paths[index]);

    const duration = 6000;
    const startTime = Date.now();

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing-Funktion für smoothere Animation
        const eased = easeInOutCubic(progress);

        // Path morphen
        morphPath.setAttribute('d', interpolator(eased));

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            currentIndex = index;
            isAnimating = false;
        }
    }

    animate();
}

function easeInOutCubic(t) {
    // return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    return -(Math.cos(Math.PI * t) - 1) / 2;
    // return t;
}

function interpolateColor(color1, color2) {
    const r1 = parseInt(color1.substr(1, 2), 16);
    const g1 = parseInt(color1.substr(3, 2), 16);
    const b1 = parseInt(color1.substr(5, 2), 16);

    const r2 = parseInt(color2.substr(1, 2), 16);
    const g2 = parseInt(color2.substr(3, 2), 16);
    const b2 = parseInt(color2.substr(5, 2), 16);

    return function (t) {
        const r = Math.round(r1 + (r2 - r1) * t);
        const g = Math.round(g1 + (g2 - g1) * t);
        const b = Math.round(b1 + (b2 - b1) * t);

        return `rgb(${r}, ${g}, ${b})`;
    };
}

function startAutoPlay() {
    if (autoPlay) return;

    autoPlay = true;
    autoPlayInterval = setInterval(() => {
        if (!isAnimating) {
            const nextIndex = (currentIndex + 1) % paths.length;
            morphTo(nextIndex);
        }
    }, 0);
}

function stopAutoPlay() {
    autoPlay = false;
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
}

// Event-Listener
morphPath.addEventListener('click', () => {
    if (autoPlay) {
        stopAutoPlay();
    } else {
        startAutoPlay();
    }
});

// Keyboard-Navigation
document.addEventListener('keydown', (e) => {
    if (e.key >= '1' && e.key <= '5') {
        const index = parseInt(e.key) - 1;
        morphTo(index);
        stopAutoPlay();
    } else if (e.key === ' ') {
        e.preventDefault();
        if (autoPlay) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    }
});

// Automatische Animation beim Laden stoppen nach 10 Sekunden
setTimeout(() => {
    if (!autoPlay) {
        startAutoPlay();
    }
}, 1000);