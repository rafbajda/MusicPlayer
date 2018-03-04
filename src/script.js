
let infoContainer = document.querySelector('.infoContainer');
let infoBlocker = document.querySelector('.inscription');

let seekBar = document.querySelector('.seek-bar');
let fillBar = seekBar.querySelector('.fill');


let backwardButton = document.querySelector('button.backward');
let playButton = document.querySelector('button.play');
let forwardButton = document.querySelector('button.forward');
let playButtonIcon = playButton.querySelector('i');

let Img = document.querySelector('img');
let authorText = document.querySelector('.artist');
let titleText = document.querySelector('.title');
let timeDisplayer = document.querySelector('.time');

let volumeBar = document.querySelector('.volume-bar');
let v_fillBar = volumeBar.querySelector('.v-fill');
let muteIcon = document.querySelector('.glyphicon');

let mouseDown = false;
let mouseDownVol = false;
let firstRefresh = true;
let currentAudio = 1;
let isMuted = false;
let currentVolume = 1;

const playList = [
    {
        id: 1,
        author: 'NF',
        title: 'Let You Down',
        imgPath: './images/img1.jpg',
        songPath: './songs/song1.ogg'
    },
    {
        id: 2,
        author: 'Johny Cash',
        title: 'Hurt',
        imgPath: './images/img2.jpg',
        songPath: './songs/song2.ogg'
    },
    {
        id: 3,
        author: 'Elliot Smith',
        title: 'Between the bars',
        imgPath: './images/img3.jpg',
        songPath: './songs/song3.ogg'
    },
    {
        id: 4,
        author: 'Maanam',
        title: 'Krakowski spleen',
        imgPath: './images/img4.jpg',
        songPath: './songs/song4.ogg'
    },
    {
        id: 5,
        author: 'Krzysztof Krawczyk',
        title: 'Chciałem być',
        imgPath: './images/img5.jpg',
        songPath: './songs/song5.ogg'
    },
    {
        id: 6,
        author: 'L.B.ONE feat Laenz',
        title: 'Tired Bones',
        imgPath: './images/img6.jpg',
        songPath: './songs/song6.ogg'
    },
    {
        id: 7,
        author: 'The Clash',
        title: 'Should I stay or should I go',
        imgPath: './images/img7.jpg',
        songPath: './songs/song7.ogg'
    }
]

let audio = new Audio(playList[0].src);
window.onload = changeMusic()

//functions responsible for changing music

function changeMusic(){
    playList.forEach(e => {
        if(e.id === currentAudio){

            if(e.author.length>15) authorText.textContent = changeText(e.author);
                else authorText.textContent = e.author;

            if(e.title.length>20) titleText.textContent = changeText(e.title);
                else  titleText.textContent = e.title

            audio.src = e.songPath;
            Img.src = e.imgPath;
            playButtonIcon.className = 'glyphicon glyphicon-play';
            audio.currentTime = 0.00001;

           if(!firstRefresh) audio.play();
        }
    });
    firstRefresh=false;    
}

function changeText(text){
    return text.substr(0,14) + '...';
}

//functions responsible for change of states

audio.addEventListener('loadstart', function(){
infoContainer.className = "infoContainer-loading";
});

audio.addEventListener('canplay', function(){
    infoContainer.className = "infoContainer";
  });

  audio.addEventListener('playing', function(){
    playButtonIcon.className = 'glyphicon glyphicon-pause';
    infoContainer.className = "infoContainer";
    infoBlocker.textContent = "";
  });


  audio.addEventListener('pause', function(){
    playButtonIcon.className = 'glyphicon glyphicon-play';
    infoContainer.className = "infoContainer-paused";
    infoBlocker.textContent = "PAUSED";
  });

  audio.addEventListener('waiting', function(){
    infoContainer.className = "infoContainer-loading";    
  });   

//function responsible for mute icon

muteIcon.addEventListener('click', function(){
    if(!isMuted){    
    currentVolume = audio.volume;
    v_fillBar.style.width = 0 + '%';
    audio.volume = 0;
    isMuted=true;
    muteIcon.className="glyphicon glyphicon-volume-off";
    } else {
        v_fillBar.style.width = currentVolume * 100 + '%';
        audio.volume = currentVolume;
        isMuted = false;
        muteIcon.className="glyphicon glyphicon-volume-down";
    }
 })

 //functions responsible for backward/play/forward buttons

backwardButton.addEventListener('click', function(){
   currentAudio--;
   if(currentAudio<1) currentAudio=playList.length;
   changeMusic();
})

playButton.addEventListener('click', function(){
    if(audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
})

forwardButton.addEventListener('click', function(){
    currentAudio++;
    if(currentAudio>playList.length) currentAudio=1;
    changeMusic();
 })

 //function responsible for automatically updating seek-bar

audio.addEventListener('timeupdate', function(){
    if(mouseDown) return;
    let p = audio.currentTime / audio.duration;
    fillBar.style.width = p * 100 + '%';
});

//function responsible for displaying time

audio.addEventListener('timeupdate', function(){ 
    if(audio.readyState == 4){  // this condition eliminates temporary displaying "NaN"
    let secs_current=Math.floor(audio.currentTime%60);
    let mins_current=Math.floor(audio.currentTime/60);

    let secs_duration=Math.floor(audio.duration%60);
    let mins_duration=Math.floor(audio.duration/60);

    if(secs_current<10) secs_current = '0' + secs_current;
    if(mins_current<10) mins_current = '0' + mins_current;
    if(secs_duration<10) secs_duration = '0' + secs_duration;
    if(mins_duration<10) mins_duration = '0' + mins_duration;
    
    timeDisplayer.textContent = mins_current + ':' + secs_current +
    '/' + mins_duration + ':' + secs_duration;
    }
});

//functions responsible for "clamping" value of the X axis

function clamp (min, val, max) {
    return Math.min(Math.max(min, val), max);
}

function getP(e){
    let p = (e.clientX - seekBar.offsetLeft) / seekBar.clientWidth;
    p = clamp(0, p, 1);
    return p;
}
function getPV(e){
    let p = (e.clientX - volumeBar.offsetLeft) / volumeBar.clientWidth;
    p = clamp(0, p, 1);
    return p;
}

//functions responsible for seek-bar and volume-bar

seekBar.addEventListener('mousedown', function(e){
    mouseDown = true;
    let p = getP(e);

     fillBar.style.width = p * 100 + '%';
     audio.play(); 
})

volumeBar.addEventListener('mousedown', function(e){
    mouseDownVol = true;
    let p_v = getPV(e);

     v_fillBar.style.width = p_v * 100 + '%';
     audio.volume = p_v; 

     if(audio.volume != 0){
        muteIcon.className="glyphicon glyphicon-volume-down";
    } else muteIcon.className="glyphicon glyphicon-volume-off";
})

window.addEventListener('mousemove', function(e){
    if(!mouseDown && !mouseDownVol) return;  

    if(mouseDown){
    let p = getP(e);
    fillBar.style.width = p * 100 + '%';
    } else {
        let p_v = getPV(e);
        v_fillBar.style.width = p_v * 100 + '%';
        audio.volume = p_v; 

        if(audio.volume != 0){
            muteIcon.className="glyphicon glyphicon-volume-down";
        } else muteIcon.className="glyphicon glyphicon-volume-off";
    }
})

window.addEventListener('mouseup', function(e){
    if(!mouseDown && !mouseDownVol) return;

    if(mouseDown){
        let p = getP(e);
        fillBar.style.width = p * 100 + '%'; 
        audio.currentTime = p * audio.duration;
        mouseDown = false;
        } else {
                let p_v = getPV(e);
                v_fillBar.style.width = p_v * 100 + '%'; 
                audio.volume = p_v;
                mouseDownVol = false;
                if(audio.volume != 0){
                    muteIcon.className="glyphicon glyphicon-volume-down";
                } else muteIcon.className="glyphicon glyphicon-volume-off";
            }
})

//functions responsible for changing music 

audio.addEventListener('timeupdate', function(){ 
    if(audio.currentTime == audio.duration) {
        currentAudio++;
        if(currentAudio>playList.length) {
            currentAudio=1;
            firstRefresh=true;
        }
        changeMusic();
    }
});