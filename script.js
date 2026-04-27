const state = {
    projectsH: 40,
    viewH: 40,
    startH: 40,
    maxH: 100,
    isDragging: false,
    pos: 0,
    startX: 0,
    speed: 0.7
};

const dom = {
    projectsPanel: document.getElementById('projectsPanel'),
    projectsScroll: document.getElementById('projectsScrollArea'),
    viewPanel: document.getElementById('viewPanel'),
    viewScroll: document.getElementById('viewScrollArea'),
    infoPanel: document.getElementById('infoPanel'),
    track: document.getElementById('track'),
    carousel: document.getElementById('carousel')
};

// =====================
// 📁 DATA PROJETS
// =====================
const projectsData = {
    barthou: {
        number: "001 / 005",
        title: "Barthou",
        subtitle: "Biarritz, 2025",
        images: [
            "assets/LOUISBARTHOU_1.png",
            "assets/LOUISBARTHOU_2.png",
            "assets/LOUISBARTHOU_3.png"
        ],
        description: "Projet Barthou."
    },
    gemillon: {
        number: "002 / 005",
        title: "Gemillon",
        subtitle: "Haute-Savoie, 2026",
        images: [
            "assets/GEMILLON_1.png",
            "assets/GEMILLON_2.png",
            "assets/GEMILLON_3.png"
        ],
        description: "Projet Gemillon."
    },
    bastille: {
        number: "003 / 005",
        title: "Bastille",
        subtitle: "Paris, 2025",
        images: [
            "assets/ILETUDY_1.png",
            "assets/ILETUDY_2.png",
            "assets/ILETUDY_3.png"
        ],
        description: "Projet Bastille."
    },
    louvel: {
        number: "004 / 005",
        title: "Louvel",
        subtitle: "Paris, 2025",
        images: [
            "assets/JLT_1.png",
            "assets/JLT_2.png",
            "assets/JLT_3.png"
        ],
        description: "Projet Louvel."
    },
    lesclefs: {
        number: "005 / 005",
        title: "Les Clefs",
        subtitle: "Haute-Savoie, 2025",
        images: [
            "assets/LESCLEFS_1.png",
            "assets/LESCLEFS_2.png",
            "assets/LESCLEFS_3.png"
        ],
        description: "Projet Les Clefs."
    }
};

// =====================
// 🔥 OPEN PROJECT VIEW (STACK MODE)
// =====================
function openProjectView(key) {
    const p = projectsData[key];
    if (!p) return;

    // ❌ NE FERME PLUS LES AUTRES PANELS (STACK MODE)
    dom.viewPanel.classList.add('open');

    // encart progressif (important)
    state.viewH = state.startH;
    dom.viewPanel.style.height = state.viewH + 'vh';

    // TEXTE
    document.getElementById('viewProjectNumber').innerText = p.number;
    document.getElementById('viewProjectArtist').innerText = p.title;
    document.getElementById('viewProjectTitle').innerText = p.subtitle;

    // GALERIE
    const gallery = document.querySelector('.view-gallery');
    gallery.innerHTML = "";

    p.images.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        gallery.appendChild(img);
    });

    // DESCRIPTION
    const text = document.querySelector('.view-text .col-text');
    text.innerHTML = `<p>${p.description}</p>`;
}

// =====================
// 📂 PANELS
// =====================
function togglePanel(id) {
    const panel = document.getElementById(id);

    if (!panel.classList.contains('open')) {

        // IMPORTANT : on ne ferme PAS view si on ouvre projects
        if (id !== 'viewPanel') {
            closeAllPanels();
        }

        panel.classList.add('open');

        if (id !== 'infoPanel') {
            state.projectsH = state.startH;
            panel.style.height = state.startH + 'vh';
        }
    } else {
        panel.classList.remove('open');
    }
}

function closePanel(id) {
    document.getElementById(id).classList.remove('open');
}

// ⚠️ version stack-safe
function closeAllPanels() {
    document.querySelectorAll('.sliding-panel').forEach(p =>
        p.classList.remove('open')
    );

    dom.viewPanel.style.height = state.startH + 'vh';
}

// =====================
// 🖱 SCROLL ENCASTRÉ
// =====================
function handleScroll(e, panel, scrollArea, heightKey) {
    if (!panel.classList.contains('open')) return;

    const atTop = scrollArea.scrollTop <= 0;
    const isFull = state[heightKey] >= 99.9;

    if (
        (e.deltaY > 0 && !isFull) ||
        (e.deltaY < 0 && atTop && state[heightKey] > state.startH)
    ) {
        e.preventDefault();

        state[heightKey] += e.deltaY * 0.12;

        state[heightKey] = Math.min(
            Math.max(state[heightKey], state.startH),
            state.maxH
        );

        panel.style.height = state[heightKey] + 'vh';
    }

    scrollArea.style.overflowY =
        state[heightKey] >= 99.9 ? 'auto' : 'hidden';
}

dom.projectsPanel.addEventListener(
    'wheel',
    e => handleScroll(e, dom.projectsPanel, dom.projectsScroll, 'projectsH'),
    { passive: false }
);

dom.viewPanel.addEventListener(
    'wheel',
    e => handleScroll(e, dom.viewPanel, dom.viewScroll, 'viewH'),
    { passive: false }
);

// =====================
// 🖱 OUTSIDE CLICK
// =====================
window.addEventListener('mousedown', e => {

    if (e.target.closest('#carousel')) {
        closeAllPanels();
        return;
    }

    if (dom.viewPanel.classList.contains('open')) {
        if (!e.target.closest('#viewPanel') && !e.target.closest('.view-link')) {
            closePanel('viewPanel');
        }
    } else if (dom.projectsPanel.classList.contains('open')) {
        if (!e.target.closest('#projectsPanel') && !e.target.closest('.nav-btn')) {
            closePanel('projectsPanel');
        }
    } else if (dom.infoPanel.classList.contains('open')) {
        if (!e.target.closest('#infoPanel') && !e.target.closest('.nav-btn')) {
            closePanel('infoPanel');
        }
    }
});

// =====================
// 🎞 CAROUSEL
// =====================
const initCarousel = () => {
    const images = dom.track.innerHTML;
    dom.track.innerHTML = images + images;
    animate();
};

const animate = () => {
    if (!state.isDragging) {
        state.pos -= state.speed;

        const halfWidth = dom.track.scrollWidth / 2;

        if (Math.abs(state.pos) >= halfWidth) {
            state.pos = 0;
        }

        dom.track.style.transform = `translateX(${state.pos}px)`;
    }

    requestAnimationFrame(animate);
};

dom.carousel.addEventListener('mousedown', e => {
    state.isDragging = true;
    state.startX = e.pageX - state.pos;
});

window.addEventListener('mouseup', () => {
    state.isDragging = false;
});

window.addEventListener('mousemove', e => {
    if (state.isDragging) {
        state.pos = e.pageX - state.startX;

        const halfWidth = dom.track.scrollWidth / 2;

        if (state.pos > 0) state.pos = -halfWidth;
        if (state.pos < -halfWidth) state.pos = 0;

        dom.track.style.transform = `translateX(${state.pos}px)`;
    }
});

// =====================
// 🚀 INIT
// =====================
window.onload = initCarousel;