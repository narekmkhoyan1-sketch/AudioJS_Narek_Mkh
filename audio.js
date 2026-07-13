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
}

let song = new Audio()
let currentSong = 0

window.onload = function(){
    playSong(false) // false = не запускать play() сразу, браузер это заблокирует
}

function playSong(shouldPlay = true){
    song.src = data.song[currentSong]
    let songTitle = document.getElementById("songTitle")
    songTitle.textContent = data.title[currentSong]
    let img = document.getElementById("row1")
    img.style.backgroundImage = "url(" + data.poster[currentSong] + ")" 
    let main = document.getElementById("main") 
    main.style.backgroundImage = "url(" + data.poster[currentSong] + ")" 
    if (shouldPlay) {
        song.play()
    }
}

function playOrPauseSong(){
    let play = document.getElementById("play") // укажи реальный id кнопки

    if (song.paused) {
            song.play()
            play.src = "images/pause.png"

    }else{
        song.pause()
        play.src = "images/play-button-arrowhead.png"
    }
}