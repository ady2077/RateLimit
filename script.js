// Initialize particles
particlesJS('particles-js', {
    particles: {
        number: { value: 140, density: { enable: true, value_area: 800 } },
        color: { value: '#c0c0c0' }, // Silver particles
        shape: { type: 'polygon' },
        opacity: { value: 0.6, random: true },
        size: { value: 5, random: true },
        line_linked: { enable: true, distance: 160, color: '#808080', opacity: 0.3, width: 2 },
        move: { enable: true, speed: 4.5, direction: 'none', random: true }
    },
    interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' } },
        modes: { repulse: { distance: 180 }, push: { particles_nb: 6 } }
    },
    retina_detect: true
});

let clicks = 0;
let lastClickTime = 0;
let cooldown = 0;
const clickHistory = [];
const MAX_CLICKS_PER_SECOND = 5;

const canvas = document.getElementById('rateGraph');
const ctx = canvas.getContext('2d');

function handleClick() {
    const now = Date.now();
    const timeDiff = (now - lastClickTime) / 1000; // Time since last click in seconds

    if (cooldown > 0) {
        document.getElementById('message').innerHTML = `<span style="animation: alertFlash 0.5s infinite;">Cooling down (${cooldown}s)!</span>`;
        return;
    }

    clicks++;
    document.getElementById('clickCount').textContent = clicks;

    const rate = timeDiff > 0 ? (1 / timeDiff).toFixed(2) : 0;
    clickHistory.push(rate);
    if (clickHistory.length > 20) clickHistory.shift(); // Keep last 20 rates

    document.getElementById('clickRate').textContent = rate;

    if (rate > MAX_CLICKS_PER_SECOND) {
        document.getElementById('message').innerHTML = `<span style="animation: alertFlash 0.5s infinite;">Too fast! Rate: ${rate} clicks/s</span>`;
        cooldown = 3; // 3-second cooldown
        startCooldown();
    } else {
        document.getElementById('message').textContent = '';
    }

    lastClickTime = now;
    updateGraph();
}

function startCooldown() {
    const cooldownSpan = document.getElementById('cooldown');
    const interval = setInterval(() => {
        cooldown--;
        cooldownSpan.textContent = `${cooldown}s`;
        if (cooldown <= 0) {
            clearInterval(interval);
            document.getElementById('message').textContent = '';
            cooldownSpan.textContent = '0s';
        }
    }, 1000);
}

function updateGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = '#c0c0c0';
    ctx.lineWidth = 2;

    const step = canvas.width / (clickHistory.length - 1);
    const maxRate = Math.max(...clickHistory, MAX_CLICKS_PER_SECOND);

    clickHistory.forEach((rate, i) => {
        const x = i * step;
        const y = canvas.height - (rate / maxRate) * canvas.height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });

    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 1;
    const limitY = canvas.height - (MAX_CLICKS_PER_SECOND / maxRate) * canvas.height;
    ctx.moveTo(0, limitY);
    ctx.lineTo(canvas.width, limitY);
    ctx.stroke();
}

// Alert flash animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes alertFlash {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
    }
`;
document.head.appendChild(styleSheet);