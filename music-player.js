const musicPlayer = {
  titleMusic: document.querySelector(".title-music"),
  artist: document.querySelector(".singer"),
  playList: document.querySelector(".playlist-items"),
  totalTime: document.querySelector(".total-time"),
  albumCover: document.querySelector(".album-cover"),
  audioElement: document.querySelector("#audio"),
  playBtn: document.querySelector(".btn-toggle-play"),
  playIcon: document.querySelector("#play-icon"),
  BtnNext: document.querySelector(".btn-next"),
  BtnPrev: document.querySelector(".btn-prev"),
  NEXT: 1,
  PREV: -1,
  minTimeAudio: 2,
  repeatBtn: document.querySelector(".btn-repeat"),
  currentTimeEL: document.querySelector(".current-time"),
  progressBar: document.querySelector(".progress-bar"),
  progressPlay: document.querySelector(".progress-play"),
  randomBtn: document.querySelector(".btn-random"),
  songList: [
    {
      id: 1,
      name: "Còn Gì Đẹp Hơn (Mưa Đỏ Original Soundtrack)",
      path: "./music/Còn Gì Đẹp Hơn (Mưa Đỏ Original Soundtrack).mp3",
      artist: "Nguyễn Hùng",
      imgCover: "./img/congidephon.jpg",
      duration: "4:41",
    },
    {
      id: 2,
      name: "Máu Đỏ Da Vàng",
      path: "./music/Máu Đỏ Da Vàng.mp3",
      artist: "DTAP,ERIK",
      duration: "4:05",
      imgCover: "./img/maudodavang.jpg",
    },
    {
      id: 3,
      name: "Nỗi Đau Giữa Hòa Bình",
      path: "./music/Nỗi Đau Giữa Hòa Bình.mp3",
      artist: "Hòa Minzy,Nguyễn Văn Chung",
      duration: "5:19",
      imgCover: "./img/HoaMinzy.jpg",
    },
    {
      id: 4,
      name: "Vị Nhà",
      path: "./music/Vị Nhà.mp3",
      artist: "Đen",
      duration: "4:58",
      imgCover: "./img/denvau.jpg",
    },
    {
      id: 5,
      name: "Việt Nam Tôi",
      path: "./music/Việt Nam Tôi.mp3",
      artist: "ICM,Jack - J97,K-ICM",
      imgCover: "./img/Jack.jpg",
      duration: "4:29",
    },
    {
      id: 6,
      name: "Viết Tiếp Câu Chuyện Hòa Bình",
      path: "./music/Viết Tiếp Câu Chuyện Hòa Bình.mp3",
      artist: "Nguyễn Văn Chung,Tùng Dương",
      imgCover: "./img/viettiepcauchuyenHB.jpg",
      duration: "4:57",
    },
  ],
  currentSongIndex: 0,
  getCurrentSong() {
    return this.songList[this.currentSongIndex];
  },
  loadCurrentSong() {
    const currentSong = this.getCurrentSong();
    this.titleMusic.textContent = currentSong.name;
    this.artist.textContent = currentSong.artist;
    this.totalTime.textContent = currentSong.duration;
    this.albumCover.innerHTML = ` 
          <img src="${currentSong.imgCover}" alt="anhNen">  `;
    this.audioElement.src = currentSong.path;
  },
  renderPlayList() {
    const playListHtml = this.songList
      .map((song, index) => {
        return `<div class="playlist-item ${
          this.currentSongIndex === index ? "active" : ""
        } " data-index="${index}">
            <div class="playlist-item-number">${song.id}</div>
            <div class="playlist-item-info">
              <div class="playlist-item-title">${song.name}</div>
              <div class="playlist-item-artist">${song.artist}</div>
            </div>
            <div class="playlist-item-duration">${song.duration}</div>
          </div>`;
      })
      .join("");
    this.playList.innerHTML = playListHtml;
  },
  handleAudioPausePlayClick() {
    if (this.audioElement.paused) {
      this.handleAudioPlay();
      this.audioElement.play();
    } else {
      this.audioElement.pause();
      this.handleAudioPause();
    }
  },
  handleAudioPlay() {
    this.playIcon.classList.add("fa-pause");
    this.playIcon.classList.remove("fa-play");
  },
  handleAudioPause() {
    this.playIcon.classList.remove("fa-pause");
    this.playIcon.classList.add("fa-play");
  },
  changeSong(direction) {
    this.currentSongIndex =
      (this.currentSongIndex + direction + this.songList.length) %
      this.songList.length;
    this.loadCurrentSong();
    this.handleAudioPlay();
    this.audioElement.play();
    this.renderPlayList();
  },
  handleNextClick() {
    if (this.isRandom) {
      this.choiceShufflePool();
      return;
    }
    this.changeSong(this.NEXT);
  },
  handlePrevClick() {
    if (this.isRandom) {
      this.choiceShufflePool();
    } else if (this.audioElement.currentTime > this.minTimeAudio) {
      this.audioElement.currentTime = 0;
    } else {
      this.changeSong(this.PREV);
    }
  },
  // Update process khi phat
  UpdateProgress() {
    if (this.isDragging) return;
    if (this.audioElement.duration) {
      const progressPercent =
        (this.audioElement.currentTime / this.audioElement.duration) * 100;
      document.documentElement.style.setProperty(
        "--progressWith",
        `${progressPercent}%`
      );
      const currentMinutes = Math.floor(this.audioElement.currentTime / 60);
      const currentSecond = Math.floor(this.audioElement.currentTime % 60);

      this.currentTimeEL.textContent = `${currentMinutes}:${currentSecond
        .toString()
        .padStart(2, "0")}`;
    }
  },

  //   Keo tha progress
  isDragging: false,
  // Luu tam time
  previewTime: 0,
  // Update keo tha
  UpdateProgressMouse(e) {
    console.log(e);
    const rect = this.progressBar.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    const percent = (x / rect.width) * 100;
    document.documentElement.style.setProperty("--progressWith", `${percent}%`);
    if (this.audioElement.duration) {
      this.previewTime = (percent * this.audioElement.duration) / 100;
      //   update time khi keo
      this.currentTimeEL.textContent = this.formatTime(this.previewTime);
    }
  },
  // (tuỳ chọn) format thời gian và set total từ metadata để luôn đúng
  formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  },
  handleDown(e) {
    e.preventDefault();
    this.isDragging = true;
    document.body.style.userSelect = "none"; //khong boi den khi keo
    this.UpdateProgressMouse(e);
  },

  handleMove(e) {
    if (!this.isDragging) return;
    this.UpdateProgressMouse(e);
  },
  handleUp() {
    if (!this.isDragging) return;
    this.isDragging = false;
    document.body.style.userSelect = "";
    if (this.audioElement.duration) {
      this.audioElement.currentTime = this.previewTime;
    }
  },
  audioEnd() {
    if (this.isRepeat) {
      this.audioElement.play();
    } else if (this.isRandom) {
      this.choiceShufflePool();
    } else {
      this.changeSong(this.NEXT);
    }
  },
  handleRepeat() {
    this.isRepeat = !this.isRepeat;
    this.repeatBtn.classList.toggle("active", this.isRepeat);
    localStorage.setItem("isRepeat", this.isRepeat);
  },
  //   repeat
  isRepeat: localStorage.getItem("isRepeat") === "true",

  //    bắt sự kiện chuyển bài
  handlePlaylistClick(e) {
    const item = e.target.closest(".playlist-item");
    if (!item || !this.playList.contains(item)) return;
    const index = Number(item.dataset.index);
    if (Number.isNaN(index)) return;
    this.currentSongIndex = index;
    if (this.isRandom) this.resetShufflePool();
    this.loadCurrentSong();
    this.renderPlayList();
    this.handleAudioPlay();
    this.audioElement.play();
  },
  //  Option Random
  isRandom: localStorage.getItem("isRandom") === "true",
  shuffleArr: [],
  handleRandom() {
    this.isRandom = !this.isRandom;
    this.randomBtn.classList.toggle("active", this.isRandom);
    localStorage.setItem("isRandom", this.isRandom);
    if (this.isRandom) {
      this.resetShufflePool();
    } else {
      this.shuffleArr = [];
    }
  },
  resetShufflePool() {
    const n = this.songList.length;
    if (n <= 1) {
      this.shuffleArr = [];
      return;
    }
    this.shuffleArr = [];
    for (let i = 0; i < n; i++) {
      if (i !== this.currentSongIndex) {
        this.shuffleArr.push(i);
      }
    }
  },
  choiceShufflePool() {
    const n = this.songList.length;

    if (n === 1) {
      this.loadCurrentSong();
      this.handleAudioPlay();
      this.audioElement.play();
      this.renderPlayList();
      return;
    }
    if (!Array.isArray(this.shuffleArr) || this.shuffleArr.length === 0) {
      this.resetShufflePool();
    }
    const randomChoice = Math.floor(Math.random() * this.shuffleArr.length);
    const nextIndex = this.shuffleArr[randomChoice];
    this.shuffleArr.splice(randomChoice, 1);
    this.currentSongIndex = nextIndex;
    this.loadCurrentSong();
    this.handleAudioPlay();
    this.audioElement.play();
    this.renderPlayList();
  },

  // SuKien Chuot
  setUpEventListener() {
    this.playBtn.addEventListener("click", () => {
      this.handleAudioPausePlayClick();
    });
    this.BtnNext.addEventListener("click", () => {
      this.handleNextClick();
    });
    this.BtnPrev.addEventListener("click", () => {
      this.handlePrevClick();
    });
    this.audioElement.addEventListener("timeupdate", () => {
      this.UpdateProgress();
    });
    this.progressBar.addEventListener("touchstart", (e) => {
      this.handleDown(e);
    });
    document.addEventListener("touchend", (e) => {
      this.handleUp(e);
    });
    document.addEventListener("touchmove", (e) => {
      this.handleMove(e);
    });
    this.progressBar.addEventListener("mousedown", (e) => {
      this.handleDown(e);
    });
    document.addEventListener("mouseup", (e) => {
      this.handleUp(e);
    });
    document.addEventListener("mousemove", (e) => {
      this.handleMove(e);
    });
    this.audioElement.addEventListener("loadedmetadata", () => {
      if (!isNaN(this.audioElement.duration)) {
        this.totalTime.textContent = this.formatTime(
          this.audioElement.duration
        );
      }
    });
    this.audioElement.addEventListener("ended", () => {
      this.audioEnd();
    });
    this.repeatBtn.addEventListener("click", () => {
      this.handleRepeat();
    });
    // click chon bai
    this.playList.addEventListener("click", (e) => {
      this.handlePlaylistClick(e);
    });
    // Click Random
    this.randomBtn.addEventListener("click", () => {
      this.handleRandom();
    });
  },
  init() {
    if (this.isRandom) this.resetShufflePool();
    this.randomBtn.classList.toggle("active", this.isRandom);
    this.repeatBtn.classList.toggle("active", this.isRepeat);
    this.loadCurrentSong();
    this.setUpEventListener();
    this.renderPlayList();
  },
};
musicPlayer.init();
