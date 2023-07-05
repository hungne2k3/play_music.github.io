/*
Nhưngx chức năng cần phải làm
1. Render songs
2. Scroll top
3. Play / Pause / seek
4. CD rotate
5. next / prew
6. Random
7. Next / repeat when ended
8. Active song
9. Scroll active song into view
10. play song when click. 
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'Manh_Hung_PLAYER'

const cd = $('.cd');
const cdThumb = $('.cd-thumb');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const heading = $('header h2');
const audio = $('#audio');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev'); 
const playList = $('.playList');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
// const timeMin = $('.time-min');
// const timeMax = $('.time-max');
// console.log(nextBtn);

// tao ra 1 bien la app de luu.
const app = {
    // Tạo Play, / Pause / seek
    // để tạo đc ta dùng thẻ Audio bên HTML
    // khi chạy nó sẽ lấy bài hát ở vị trí: 0, và thông tin, img.
    currentIndex: 0, // từ thằng currentIndex ta sẽ lấy được vị
    // trí đầu tiên của bài hát.
    isPlaying: false, // ban đầu paly cd sẽ là pause.
    isRandom: false, //ban đầu sẽ k random bài hát.
    isRepeat: false, //ban đầu sẽ k lặp lại 1 bài hát.
    config: JSON.parse(localStorage.getItem('Manh_Hung_PLAYER')) || {},

    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem('Manh_Hung_PLAYER', JSON.stringify(this.config));
    },

    songs: [
        {
            name: 'Making MAy Way',
            singer: 'Sơn Tùng M-TP',
            path: './music/making_may_way.mp3',
            image: './img/making_may_way.jpeg',
        },
        {
            name: 'Chúng Ta Của Hiện Tại',
            singer: 'Sơn Tùng M-TP',
            path: './music/chungtacuahientai.mp3',
            image: './img/chung_ta_cua_hien_tai.jpg'
        },
    
        {
            name: 'There no one at all',
            singer: 'Sơn Tùng M-TP',
            path: './music/there_no_one_at_all.mp3',
            image: './img/there_no_one_at_all.jpg'
        },
    
        {
            name: 'Nơi Này Có Anh.',
            singer: 'Sơn Tùng M-TP',
            path: './music/noi_nay_co_anh.mp3',
            image: './img/289693821_582015943280803_2102006602626651935_n.jpg',
        },

        {
            name: 'Kill this Love',
            singer: 'Black Ping',
            path: './music/kill_this_love.mp3',
            image: 'https://scontent.fhan14-3.fna.fbcdn.net/v/t39.30808-6/329431198_554787789948726_4980632073711939323_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=730e14&_nc_ohc=ngoFEAa58bEAX98ajuh&_nc_ht=scontent.fhan14-3.fna&oh=00_AfDZV42niGN39RtkRXUabXgc0lSZvtLm4HFN_uzL1qXQ4A&oe=64048B17'
        },
    
        {
            name: 'Chay Ngay Di.',
            singer: 'Sơn Tùng M-TP',
            path: './music/chay_ngay_di.mp3',
            image: './img/chay_ngay_di.jpg'
        },

        {
            name: 'Haruharu',
            singer: 'Big Bang',
            path: './music/haruharu.mp3',
            image: 'https://scontent.fhan14-3.fna.fbcdn.net/v/t1.6435-9/176773701_305469524282411_3284984605449477014_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=HiT_GO-3mB0AX-IV_Ro&_nc_ht=scontent.fhan14-3.fna&oh=00_AfArrDQQwoTdHAY2tYr0IYPRf-n5QxGxR9gq01W9wpL2tw&oe=642758AF'
        },

        {
            name: 'Cuoi Cung Thi.',
            singer: 'Jack',
            path: './music/cuoi_cung_thi.mp3',
            image: 'https://scontent.fhan14-1.fna.fbcdn.net/v/t39.30808-6/312722871_665291265167885_5491004537990821081_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=UjCaVdtINoQAX-hlwzm&_nc_ht=scontent.fhan14-1.fna&oh=00_AfDMZDt_q-U3-2OZ-KcFNILhpcSyFSVFD6EkJvUpF0PD2g&oe=6403826C'
        },
    ],
    
    // tao ra 1 ham render + scroll top
    render: function() {
        // tao ra 1 bien html de luu gia tri. khi lay cac phan
        // tu cua bien songs
        const htmls = this.songs.map((song, index) => {
            // render ra list danh sach
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.image}');"> 

                    </div>

                    <div class="body">
                        <h3 class="title">
                            ${song.name}
                        </h3>

                        <p class="author">${song.singer}</p>
                    </div>

                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        // goi ra danh sach list nhac
        playList.innerHTML = htmls.join('');
    },

    defineProperties: function() {
        // hàm get: sẽ lấy ra bài hát đầu tiên khi start.
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            },
        });
    },


    _handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // xử lý CD quay / dừng.
        // animate: có 2 đối số.
        const cdThumbAnimation = cdThumb.animate([
            {
                // quay 360 độ.
                transform: 'rotate(360deg)',
            }
        ], {
            duration: 10000,
            iterations: Infinity //lặp lại bao nhiêu lần: Infinity (liên tục).
        });

        // lúc đầu animate sẽ quay, nhưng muốn khi nào bấm "play", mới quay
        // nên dòng tiếp theo sẽ cho dừng lại.
        cdThumbAnimation.pause();

        // Begin
        // lang nghe su kien ca trang
        // lang nghe khi keo thanh scroll cua trang.
        // xử lý phóng to thu nhỏ
        document.onscroll = function () {
            // lấy tọa độ khi vuốt, kéo list để làm hiệu ứng khi 
            // kéo list xuống thì đĩa CD sẽ mờ dần và mất ngược lại.
            const scrollTop = window.scrollY || document.documentElement.scrollTop;

            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            // khi keo len, xuong đã thu nhỏ lại, nhưng khi kéo nhanh thì
            // sẽ bị lỗi k mất đi hẳn CD.Vì khi kéo nhanh thì khi chạy đến
            // dòng thứ "98" sẽ ra đến giá trị âm, nên sẽ không được tính.
            // Kiểm tra Nếu: cdWidth > 0 thì lấy newCdWidth + px, ngược lại
            // lấy giá trị 0.
            // làm hiệu ứng mờ dần khi kéo xuống rồi mất đi
            // Cách làm là lấy opacity từ 0 -> 1;
            // lấy giá trị của độ rộng mới chia cho độ rộng cũ.
            cd.style.opacity = newCdWidth / cdWidth;
        };
        // END
        // tạo sự kiện play / pause.
        // Begin
        //xử lý onclick play.
        playBtn.onclick = function () {

            if (_this.isPlaying) {
                // pause
                audio.pause();
            }
            else {
                // play
                audio.play();
            }
        };

        // khi bài hát được player
        // thẻ Audio có thuộc tính lắng nghe 
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            /*
            Khi ấn play, thì animate sẽ quay*/
            cdThumbAnimation.play();
        };



        // khi bài hát được pause
        // thẻ Audio có thuộc tính lắng nghe 
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            /*
            khi ấn paus, thì sẽ dừng lại ngay và khi ấn play sẽ                 quay tiếp chỗ vừa dừng.
            */
            cdThumbAnimation.pause();
        };

        // khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function (e) {
            // Duration: một số biểu thị độ dài của âm thanh, tính                 // bằng giây. Nếu k có âm thanh nào đc đặt "NAN" (k phải là số)
            // đc trả về. Nếu âm thanh đc phát trực tiếp và k có độ dài đc xác
            // định trc, "infinity" sẽ đc trả về.
            /*
            CurrentTime: đặt hoặc trả về vị trí phát lại hiện tại trong âm thanh
            (tính bằng giây).
            - Seconds: chỉ định vị trí để phát lại âm thanh, tính bằng giây.
            */
            if (audio.duration) {
                /*
                floor() trả về số nguyên lớn nhất nhỏ hơn
                hoặc bằng tham số truyền vào hay còn gọi nôm
                na làm tròn xuống.
                */
                const progressPercen = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercen;
            };
        };


        // xử lý phần khi tua bài hát
        // onchange: khi có sự thay đổi xẩy ra.
        /*
        Onchange xảy ra khi giá trị của 1 phần tử HTML bị thay đổi
        Sự kiện này tương tự như Oninput. Sự khác biệt là
        sự kiện oninput xảy ra ngay sau khi giá trị của 1 phần tử thay đổi, trong khi onchange
        xảy ra khi phần tử mất tiêu điểm, sau khi nội
        dung đã đc thay đổi. Điểm khác biệt nữa là sk
        onchange cx hoạt động trên các phần tử select.
        */
        // oninput: 
        progress.oninput = function (e) {
            // e.target.value: lấy ra giá trị %
            // để tính số giây ta lấy: tổng số giây / 100 * %;                
            // audio.duration: tổng số giây
            const seekTimeOut = audio.duration / 100 * e.target.value;

            audio.currentTime = seekTimeOut;
        };

        

        // khi next song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        // Khi ấn quay lại bài hát.
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            }
            else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };
        // hiểu đơn giản là khi play bài hát thanh nhạc sẽ chạy theo
        // bài hát cho đến khi hết
        // END


        // xử lý next song khi hết bài
        audio.onended = function () {
            if(_this.isRepeat) {
                audio.play();
            } else {
                // khi chạy hết cuối bài thì sẽ tự động bấm nút 
                // next để chuyênr bài
                nextBtn.click();
            }
            
        };

        // lắng nghe hành vi kích vào play list
        // kick vaof bai nao se hat vao bai do
        playList.onclick = function (e) {
            // closest(): trả về element là chính nó, 2 lfà thẻ 
            // cha của nó. Nếu k tìm thấy element thì nó sẽ trả
            // về null
            const songNode = e.target.closest('.song:not(.active)');
            // nếu bài hát đang chạy khi click vào sẽ k nhận, còn 
            // kick vào option vẫn nhận.
            if(songNode || e.target.closest('.option')) {
                if(songNode) {
                    // xử lý khi click vào song
                    _this.currentIndex = Number(songNode.getAttribute('data-index'));
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

                // xu ly khi kick vao song option
            }
        }

        // xử lý phát lại bài hát khi đã chạy hết.
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        // ramdom bai hat
        randomBtn.onclick = function (e) {
            // nếu random bằng chính nó thì ! sẽ đảo ngược lại chính nó. 
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            // nếu this.random là true thì sẽ thêm active, ngược lại
            // nếu this.random là false thì sẽ xóa acive.
            randomBtn.classList.toggle('active', _this.isRandom);


        };
    },
    get handleEvents_1() {
        return this._handleEvents;
    },
    set handleEvents_1(value) {
        this._handleEvents = value;
    },

    get handleEvents() {
        return this._handleEvents;
    },
    set handleEvents(value) {
        this._handleEvents = value;
    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }, 300)
    },

    // taọ 1 hàm load bài hát hiện tại.
    loadCurrentSong: function() {
        // khi load bài hát sẽ cần có header: tên bài hát, 
        // cd-thumb: ảnh đĩa cd,
        // audio link bài hát.
        

        heading.textContent = this.currentSong.name; // lấy tên bài hát đầu tiên khi chạy
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`; // lấy ảnh của bài hát đó
        audio.src = this.currentSong.path; // lấy link mp3 bài hát đó.

        // console.log(heading, cdThumb, audio);
    },

    // load lại trang khi k bị mất radom và repeat
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    // Begin Next Song
    nextSong: function () {
        app.currentIndex++;

        if(app.currentIndex >= app.songs.length) {
            app.currentIndex = 0;
        }

        app.loadCurrentSong();
    },

    // Begin Tua lại.
    prevSong: function () {
        // khi vị trí bài hát nhỏ hơn hoặc bằng danh sách bài hát
        // thì khi ấn nút quay lại thì vị trí bài hát sẽ phải 
        // giảm dần.
        if(app.currentIndex <= app.songs.length) {
            app.currentIndex--;

        }

        app.loadCurrentSong();
    },

    // random bai hat
    playRandomSong: function () {
        let newIndex;

        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } 
        // random k cho ra bài đang phát.
        // lặp trong While là: k lặp đến baì đang phát.
        while(newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    // // Begin Next Song-
    // nextSong: function() {
    //     // tăng lên bài hát kế tiếp.
    //     this.currentIndex++;

    //     /*
    //     kiểm tra nếu currentIndex lớn hơn bài hát, thì sẽ quay về bài
    //     đầu tiên.
    //     */
    //     if(this.currentIndex >= this.songs.length) {
    //         this.currentIndex = 0;
    //     }
    //     this.loadCurrentSong();

    // },
    // // END
 
    // tao ra start: khi code chay 
    // se xu ly trong phan function
    start: function() {
        //gán cấu hình từ config vào ứng dụng
        this.loadConfig();
        // Ngay khi ứng dụng đc start thì sẽ gọi 1 hàm
        // Định nghĩa các thuộc tính cho Object
        this.defineProperties();

        // Lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvents();


        // Tải Thông tin bài hát đầu tiên vào UI khi chạy ứng dụngf
        this.loadCurrentSong();

        // next songs
        // this.nextSong();


        // code chay o day
        // goi nhu nay thì hàm sẽ k phải gọi lại nhiều sẽ mất thời gian
        // khi chạy nó chỉ gọi hàm start thôi.

        // Render playlist
        this.render();

        // hiển thị trạng thái ban đầu của button repeat và randombtn 
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    }
}

// goi ham start ra.
app.start();