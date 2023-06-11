const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cdThumb = $(".cd-thumb");
const playlist = $(".playlist");
const heading = $("header h2");
const cd = $(".cd");
const audio = $("#audio");
const player = $(".player");
const progressPercent = $(".progress");
const btnPlay = $(".btn-toggle-play");
const btnPrev = $(".btn-prev");
const btnNext = $(".btn-next");
const btnRandom = $(".btn-random");
const btnRepeat = $(".btn-repeat");

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat:false,
    songs: [
        {
            name: "Name listen 1",
            singer: "singer: Le Anh Duc",
            path: "./assets/music/song1.mp3",
            image: "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_webp/cover/e/1/f/1/e1f1f29fd4d171cd37c42bef51935a17.jpg"
        },
        {
            name: "Name listen 2",
            singer: "singer: Le Anh Duc",
            path: "./assets/music/song2.mp3",
            image: "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_webp/cover/e/1/f/1/e1f1f29fd4d171cd37c42bef51935a17.jpg"
        },
        {
            name: "Name listen 3",
            singer: "singer: Le Anh Duc",
            path: "./assets/music/song3.mp3",
            image: "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_webp/cover/e/1/f/1/e1f1f29fd4d171cd37c42bef51935a17.jpg"
        },
        {
            name: "Le Anh Duc",
            singer: "singer: Le Anh Duc",
            path: "https://mp3.filmisongs.com/go.php?id=Damn%20Song%20Raftaar%20Ft%20KrSNa.mp3",
            image: "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_webp/cover/e/1/f/1/e1f1f29fd4d171cd37c42bef51935a17.jpg"
        },
        {
            name: "Le Anh Duc",
            singer: "singer: Le Anh Duc",
            path: "https://mp3.filmisongs.com/go.php?id=Damn%20Song%20Raftaar%20Ft%20KrSNa.mp3",
            image: "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_webp/cover/e/1/f/1/e1f1f29fd4d171cd37c42bef51935a17.jpg"
        }
    ],
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            }
        });
    },
    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;
        // Xử lý CD quay / dừng
        // Handle CD spins / stops
        const cdThumbAnimate = cdThumb.animate([{transform: "rotate(360deg)"}], {
            duration: 20000,
            iterations: Infinity,
        })
        cdThumbAnimate.pause();

        // Xử lý phóng to / thu nhỏ CD
        // Handles CD enlargement / reduction
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = (cdWidth - scrollTop);
            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
            // console.log(window.scrollY)
        };
        // Xử lý khi click play
        // Handle when click play

        btnPlay.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };

        // Khi song được play
        // When the song is played
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThumbAnimate.play();
        };
        // Khi song bị pause
        // When the song is paused
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        };

        // Khi tiến độ bài hát thay đổi
        // When the song progress changes
        audio.ontimeupdate = function () {
            if (audio.duration) {
                progress.value = Math.floor(
                    (audio.currentTime / audio.duration) * 100
                );
            }
        }

        // Xử lý khi tua song
        // Handling when seek
        progress.onchange = function (event) {
            const seekTime = (event.target.value / 100) * audio.duration;
            audio.currentTime = seekTime;
        };

        // Khi next song
        // When next song
        btnNext.onclick = function () {
            if(_this.isRandom){
                _this.playRandomSong()
            } else{
                _this.nextSong();
            }
            audio.play();
            _this.render();
        }

        // Khi prev song
        // When prev song
        btnPrev.onclick = function () {
            if(_this.isRandom) {
                _this.playRandomSong();
            } else{
                _this.prevSong();
            }
            audio.play();
            _this.render();
        };

        // Xử lý bật / tắt random song
        // Handling on / off random song
        btnRandom.onclick = function (event){
            _this.isRandom = !_this.isRandom;
            btnRandom.classList.toggle("active", _this.isRandom);
        };
        // Xử lý lặp lại một song
        // Single-parallel repeat processing
        btnRepeat.onclick = function (event) {
            _this.isRepeat = !_this.isRepeat;

            btnRepeat.classList.toggle("active", _this.isRepeat);
        };

        // Xử lý next song khi audio ended
        // Handle next song when audio ended
        audio.onended = function (){
            if (_this.isRepeat){
                audio.play();
            }else{
                btnNext.click();
            }
        };

        // Lắng nghe hành vi click vào playlist
        // Listen to playlist clicks
        playlist.onclick = function (event){
            const songNode = event.target.closest(".song:not(.active)");
            if (songNode || event.target.closest(".option")){
                // Xử lý khi click vào song
                // Handle when clicking on the song
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
            }
        }
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class = "song" data-index="${index}">
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">"${song.name}"</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
        });
        playlist.innerHTML = htmls.join("");
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function (){
        let newIndex;
        do {
            newIndex= Math.floor(Math.random() * this.songs.length);
        }while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function () {
        // Định nghĩa các thuộc tính cho object
        // Defines properties for the object
        this.defineProperties();

        // Render playlist
        this.render();

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        //  Load the first song information into the UI when running the app
        this.loadCurrentSong();

        // Lắng nghe / xử lý các sự kiện (DOM events)
        // Listening / handling events (DOM events)
        this.handleEvents();
    },
};
app.start();