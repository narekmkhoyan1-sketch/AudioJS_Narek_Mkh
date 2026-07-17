var data = {
    title: [
        "Alexandra Capitanescu - Choke Me",
        "Dara - Bangaranga",
        "Essyla - Dancing On The Ice",
        "Justyna Steczkowska - GAJA",
        "Sona Umroyan - Tsaghikneri Ashxarhum",
        "Tamara Zivkovic - Nova Zora"
    ],

    song: [
        "music/Alexandra Capitanescu - Choke Me.mp3",
        "music/Dara - Bangaranga.mp3",
        "music/Essyla - Dancing On The Ice.mp3",
        "music/Justyna Steczkowska - GAJA.mp3",
        "music/Sona Umroyan - Tsaghikneri Ashxarhum.mp3",
        "music/Tamara Zivkovic - Nova Zora.mp3"
    ],

    poster: [
        "cover/cover-1.jpg",
        "cover/cover-2.jpg",
        "cover/cover-3.jpg",
        "cover/cover-4.jpg",
        "cover/cover-5.webp",
        "cover/cover-6.jpg"
    ],


    lrc: [
        "lrc/Alexandra Capitanescu - Choke Me.lrc",
        "lrc/Dara - Bangaranga.lrc",
        "lrc/Essyla - Dancing On The Ice.lrc",
        "lrc/Justyna Steczkowska - GAJA.lrc",
        null,
        "lrc/Tamara Zivkovic - Nova Zora.lrc"
    ]
};

let song = new Audio();
let currentSong = 0;
let lyrics = [];          
let activeLyricIndex = -1;

window.onload = function () {
    loadSong();
};

function loadSong() {
    song.src = data.song[currentSong];
    let songTitle = document.getElementById("songTitle");
    songTitle.textContent = data.title[currentSong];
    let img = document.getElementById("row1");
    img.style.backgroundImage = "url('" + encodeURI(data.poster[currentSong]) + "')";
    let main = document.getElementById("main");
    main.style.backgroundImage = "url('" + encodeURI(data.poster[currentSong]) + "')";

    loadLyrics(currentSong);
}

//ergi barer

function loadLyrics(index) {
    lyrics = [];
    activeLyricIndex = -1;
    let scroll = document.getElementById("lyricsScroll");
    let file = data.lrc[index];

    if (!file) {
        scroll.innerHTML =
            '<div class="lyric-empty">Instrumental<br>No lyrics for this track</div>';
        return;
    }

    scroll.innerHTML = '<div class="lyric-empty">Loading…</div>';

    fetch(encodeURI(file))
        .then(function (r) {
            if (!r.ok) throw new Error("not found");
            return r.text();
        })
        .then(function (text) {
            lyrics = parseLRC(text);
            renderLyrics();
        })
        .catch(function () {
            scroll.innerHTML =
                '<div class="lyric-empty">Lyrics unavailable</div>';
        });
}

function parseLRC(text) {
    let out = [];
    let lines = text.split(/\r?\n/);
    let tagRe = /\[(\d{1,2}):(\d{2})(?:[.:](\d{1,3}))?\]/g;

    for (let raw of lines) {
        let matches = [...raw.matchAll(tagRe)];
        if (matches.length === 0) continue;
        let content = raw.replace(tagRe, "").trim();
        for (let m of matches) {
            let min = parseInt(m[1], 10);
            let sec = parseInt(m[2], 10);
            let frac = m[3] ? parseInt(m[3], 10) : 0;
            if (m[3]) {
                if (m[3].length === 1) frac = frac / 10;
                else if (m[3].length === 2) frac = frac / 100;
                else frac = frac / 1000;
            }
            let time = min * 60 + sec + frac;
            out.push({ time: time, text: content });
        }
    }
    out.sort(function (a, b) { return a.time - b.time; });
    return out;
}

function renderLyrics() {
    let scroll = document.getElementById("lyricsScroll");
    if (lyrics.length === 0) {
        scroll.innerHTML =
            '<div class="lyric-empty">Lyrics unavailable</div>';
        return;
    }
    let html = "";
    for (let i = 0; i < lyrics.length; i++) {
        let t = lyrics[i].text ? lyrics[i].text : "♪";
        html += '<div class="lyric-line" id="lyric-' + i + '" data-i="' + i + '">' + escapeHtml(t) + '</div>';
    }
    scroll.innerHTML = html;
// sexmel barerin
    let lines = scroll.querySelectorAll(".lyric-line");
    for (let el of lines) {
        el.addEventListener("click", function () {
            let i = parseInt(this.getAttribute("data-i"), 10);
            if (isNaN(i) || !lyrics[i]) return;
            let t = lyrics[i].time;
            if (t < 0) t = 0;
            if (song.duration && t > song.duration) t = song.duration;
            song.currentTime = t;
            if (song.paused) {
                song.play();
                document.getElementById("play").src = "images/pause.png";
            }
            updateLyrics(t);
        });
    }
}

function escapeHtml(s) {
    return s.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
}

function updateLyrics(currentTime) {
    if (lyrics.length === 0) return;

    let idx = -1;
    for (let i = 0; i < lyrics.length; i++) {
        if (currentTime >= lyrics[i].time) idx = i;
        else break;
    }

    if (idx === activeLyricIndex) return;

    
    if (activeLyricIndex >= 0) {
        let old = document.getElementById("lyric-" + activeLyricIndex);
        if (old) old.classList.remove("active");
    }

    activeLyricIndex = idx;

    if (idx >= 0) {
        let el = document.getElementById("lyric-" + idx);
        if (el) {
            el.classList.add("active");
            let scroll = document.getElementById("lyricsScroll");
            // center the active line
            let offset = el.offsetTop - (scroll.clientHeight / 2) + (el.clientHeight / 2);
            scroll.scrollTo({ top: offset, behavior: "smooth" });
        }
    }
}


function playOrPauseSong() {
    let play = document.getElementById("play");
    if (song.paused) {
        song.play();
        play.src = "images/pause.png";
    } else {
        song.pause();
        play.src = "images/play-button-arrowhead.png";
    }
}

song.addEventListener("timeupdate", function () {
    if (!song.duration) return;
    let fill = document.getElementById("fill");
    let position = (song.currentTime / song.duration) * 100;
    fill.style.width = position + "%";
    convertTime(song.currentTime);
    updateLyrics(song.currentTime);
    if (song.ended) {
        next();
    }
});

function convertTime(seconds) {
    let currentTime = document.getElementById("currentTime");
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    min = min < 10 ? "0" + min : min;
    sec = sec < 10 ? "0" + sec : sec;
    currentTime.textContent = min + ":" + sec;
    totalTime(song.duration);
}

function totalTime(seconds) {
    let total = document.getElementById("totalTime");
    if (!seconds) return;
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    min = min < 10 ? "0" + min : min;
    sec = sec < 10 ? "0" + sec : sec;
    total.textContent = min + ":" + sec;
}

function next() {
    currentSong++;
    if (currentSong >= data.song.length) {
        currentSong = 0;
    }
    loadSong();
    song.play();
    let play = document.getElementById("play");
    play.src = "images/pause.png";
}

function pre() {
    currentSong--;
    if (currentSong < 0) {
        currentSong = data.song.length - 1;
    }
    loadSong();
    song.play();
    let play = document.getElementById("play");
    play.src = "images/pause.png";
}

function muted() {
    let mute = document.getElementById("mute");
    if (song.muted) {
        song.muted = false;
        mute.src = "images/volume.png";
    } else {
        song.muted = true;
        mute.src = "images/volume-mute.png";
    }
}

document.getElementById("increase").onclick = function () {
    if (song.volume < 1) {
        song.volume = Math.min(1, song.volume + 0.1);
    }
};

document.getElementById("decrease").onclick = function () {
    if (song.volume > 0) {
        song.volume = Math.max(0, song.volume - 0.1);
    }
};


document.querySelector(".handle").addEventListener("click", function (e) {
    if (!song.duration) return;
    let rect = this.getBoundingClientRect();
    let ratio = (e.clientX - rect.left) / rect.width;
    ratio = Math.max(0, Math.min(1, ratio));
    song.currentTime = ratio * song.duration;
});
