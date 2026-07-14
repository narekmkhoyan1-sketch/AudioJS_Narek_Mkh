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
    ]
};


let song = new Audio();
let currentSong = 0;

window.onload = function () {
    loadSong();
};

function loadSong() {
    song.src = data.song[currentSong];
    let songTitle = document.getElementById("songTitle");
    songTitle.textContent = data.title[currentSong];
    let img = document.getElementById("row1");
    img.style.backgroundImage =
        "url(" + data.poster[currentSong] + ")";
    let main = document.getElementById("main");
    main.style.backgroundImage =
        "url(" + data.poster[currentSong] + ")";
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
    let position =
        (song.currentTime / song.duration) * 100;
    fill.style.width = position + "%";
    convertTime(song.currentTime);
    if (song.ended) {
        next();
    }

});


function convertTime(seconds) {

    let currentTime =
        document.getElementById("currentTime");
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    min = min < 10 ? "0" + min : min;
    sec = sec < 10 ? "0" + sec : sec;
    currentTime.textContent =
        min + ":" + sec;
    totalTime(song.duration);

}


function totalTime(seconds) {

    let total =
        document.getElementById("totalTime");
    if (!seconds) return;
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    min = min < 10 ? "0" + min : min;
    sec = sec < 10 ? "0" + sec : sec;
    total.textContent =  min + ":" + sec;
}


function next() {
    currentSong++;
    if (currentSong >= data.song.length) {
        currentSong = 0;
    }
    loadSong();
    song.play();
    let play =
        document.getElementById("play");
    play.src = "images/pause.png";
}




function pre() {
    currentSong--;
    if (currentSong < 0) {
        currentSong = data.song.length - 1;
    }
    loadSong();
    song.play();
    let play =
        document.getElementById("play");
    play.src = "images/pause.png";

}

function muted (){
    let mute = document.getElementById("mute")
    if(song.muted){
        song.muted = false
        mute.src = "images/volume.png"
    }else{
        song.muted = true
        mute.src = "images/volume-mute.png"
    }
}

document.getElementById("increase").onclick = function () {
    if (song.volume < 1) {
        song.volume += 0.1;
    }
};


document.getElementById("decrease").onclick = function () {
    if (song.volume > 0) {
        song.volume -= 0.1;
    }
};   
//ee