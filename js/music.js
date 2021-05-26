
$(document).ready(function () {
    $("#audio_panel").hide();
    let buttonColorOnPress = "white";
    let user = JSON.parse(sessionStorage.getItem("user"));

    $("#user").append(user.name);

    let lang = "";
    $(document).on("click", ".langDropdown", function () {

        let lid = $(this).attr("id");

        let lname = $(this).attr("value");

        sessionStorage.setItem("languageId", lid);
        sessionStorage.setItem("langname", lname);
        location.reload();
    });

    let langd = sessionStorage.getItem("languageId");
    let language = sessionStorage.getItem("langname");
    if (langd != null && language != null) {
        langId = langd;
        lang = language;
    }
    else {
        langId = 0;
        lang = "hindi";
    }
    let muscURL = "http://localhost:3000/music/";
    let musicURLwithId = muscURL + langId;
   let artistUrl = "http://localhost:3000/artist/";
   

    $(".yourSongs").remove();

    //dynamic albums Ajax
    $.ajax({
        type: "GET",
        url: musicURLwithId,
        dataType: "json",
        async: true,
        success: function (data) {
            let html = "";
            $.each(data[lang], function (index, v) {

                html += `
             
                                <div class="col-lg-4 col-md-4 col-12 ">
                                    <div class="card yourSongs">
                                        <img class="card-img-top" 
                                        src="${v['image']}" alt="Card image" />
                                        <div class="card-body">
                                        <h4 class="card-title" id="album"
                                         value="${v.album}">${v.album}</h4>
                                        <h2 id="albumId" hidden>${v.id}</h2>
                                        </div>
                                    </div>
                                </div>
                                 `;
            });

            $(".albumcards").append(html);
            $("#audio_panel").hide();

        },
        error: function () {

            //console.log("error");
        }
    });

    //Ajax request for Artist data load 
    $(".artistImage").remove();
    $.ajax({
        type: "GET",
        url: artistUrl,
        dataType: "json",
        async: true,
        success: function (data) {

            let html = "";
            $.each(data, function (index, v) {

                if (v.language === lang) {
                    html += `
                                  <div class="col-lg-4 col-md-4 col-12 artistImage ">
                                    <img class="img-fluid" 
                                     src="${v['image']}" alt="Card image" />        
                                    <h4 class="card-title"
                                    id="artistName" value="${v.name}">${v.name}</h4>
                                    <h2 id="artistId" hidden>${v.id}</h2>
                                    <h2 id="language" hidden>${v.language}</h2>
                                  </div>
                                 `;
                }
            });
            $(".artistCards").append(html);
            $("#audio_panel").hide();

        },
        error: function () {

            //  console.log("error");
        }
    });

    //Get Songs from albums
    $(document).on("click", ".yourSongs", function () {

        //after selecting album it will fetch data from album id
        let albumId = $(this).find("#albumId").html();
        let album = $(this).find("#album").html();
        $("#audio_panel").show();

        $.getJSON(musicURLwithId, function (data) {

            //it will give list of selected language by user 
            let selectedLanguageList = data[lang];


            let albumlist = selectedLanguageList[albumId];

            let playlist = albumlist[album];
            let abort_other_json;
            let index = 0;
            let indexing = playlist[index];
            let time = 0;
            let totalTime = 0;
            let timeList = [];
            let play = 0;
            let counter = 0;
            let songRepeat = 0;
            let songShuffle = 0;
            let mute = 0;
            let stopTimer;
            let previousTime;
            let audio = document.getElementById("audioFile");


            function setSongName(songName) {
                let context = $(".song-name");

                //it will set all h2 tag with class name "song-name"
                for (let i = 0; i < context.length; i++) {
                    context[i].innerHTML = songName;
                }
            }

            function setArtistName(artistName) {
                let context = $(".artist-name");
                for (let i = 0; i < context.length; i++) {
                    context[i].innerHTML = artistName;
                }
            }
            function setAlbumArt(albumart) {

                let context = $("#album-art");
                context.attr("src", albumart);
            }

            function processTime(a) {
                let b = parseInt(a / 60000);
                let c = parseInt((a % 60000) / 1000);
                if (c < 10) {
                    c = "0" + c;
                }
                return b + ":" + c;
            }

            function reset() {
                time = 0;
                audio.currentTime = 0;
            }

            function playSong() {
                if (play == 0) {
                    play = 1;
                    audio.play();
                    $("#menu button#play i").removeClass("fa-play");
                    $("#menu button#play i").addClass("fa-pause");
                }
                else {
                    play = 0;
                    audio.pause();
                    $("#menu button#play i").removeClass("fa-pause");
                    $("#menu button#play i").addClass("fa-play");
                }
            }

            function processing(data) {
                // alert("processing");
                if (data.artist == "") {
                    data.artist = "Unknown";
                }

                setSongName(indexing.title);
                setArtistName(indexing.artist);
                setAlbumArt(indexing.image);


                $("#totalTime").html(processTime(totalTime));
                $("#currentTime").html(processTime(time));

                let percent = time / totalTime * 100;
                $("#progress").css("width", percent + "%");
            }

            $("#progress-bar").on("mousedown", function () {
                $("#progress-bar").on("mousemove", function handler(event) {
                    event.preventDefault;
                    if (event.offsetY > 5 || event.offsetY < 1)
                        return;
                    let width = $("#progress-bar").css("width");
                    let percent = parseInt(event.offsetX) / parseInt(width) * 100;
                    $("#progress").css("width", percent + "%");
                    time = parseInt(totalTime * (percent / 100));
                    audio.currentTime = parseInt(time / 1000);
                });
            });
            function changeProgress() {
                dragHandler = (event) => {
                    event.preventDefault;
                    if (event.offsetY > 5 || event.offsetY < 1) return;
                    let width = $("#progress-bar").css("width");
                    let percent = parseInt(event.offsetX) / parseInt(width) * 100;
                    $("#progress").css("width", percent + "%");
                    time = parseInt(totalTime * (percent / 100));
                    audio.currentTime = parseInt(time / 1000);
                }
            }

            $("#progressButton").on("mousedown", changeProgress());
            $("#progress-bar").mouseup(function () {
                $("#progress-bar").off("mousemove");
            });

            $("#progressButton").mouseup(function () {
                $("#progress-bar").off("mousemove");
            });

            function rewind5s() {
                if (time > 5000)
                    time = time - 5000;
                else
                    time = 0;
                audio.currentTime = parseInt(time / 1000);
            }

            function forward5s() {
                if ((time + 5000) < totalTime)
                    time = time + 5000;
                else
                    time = totalTime;
                audio.currentTime = parseInt(time / 1000);
            }



            function toggleRepeat() {
                if (songRepeat == 0) {
                    $("#repeat").css("color", buttonColorOnPress);
                    songRepeat = 1;
                } else {
                    $("#repeat").css("color", "grey");
                    songRepeat = 0;
                }
            }
            function toggleShuffle() {
                if (songShuffle == 0) {
                    $("#shuffle").css("color", buttonColorOnPress);
                    songShuffle = 1;
                    shuffle();

                } else {
                    $("#shuffle").css("color", "grey");
                    songShuffle = 0;
                }
            }
            function toggleMute() {
                if (mute == 0) {
                    mute = 1;
                    audio.volume = 0;
                } else {
                    mute = 0;
                    audio.volume = 1;
                }
            }


            function prevSong() {
                if (abort_other_json) {
                    abort_other_json.abort();
                }
                reset();
                timeList = [];
                previousTime = 0;
                counter = 0;
                clearInterval(stopTimer);

                index = (index - 1) % playlist.length;
                indexing = playlist[index];
                $('#audioFile').attr('src', indexing.song);
                loadSong();

            }
            function nextSong() {
                if (abort_other_json) {
                    abort_other_json.abort();
                } reset();
                timeList = [];
                previousTime = 0;
                counter = 0;
                clearInterval(stopTimer);
                index = (index + 1) % playlist.length;
                indexing = playlist[index];
                $('#audioFile').attr('src', indexing.song);
                loadSong();

            }
            function shuffle() {
                if (abort_other_json) {
                    abort_other_json.abort();
                }
                reset();
                timeList = [];
                previousTime = 0;
                counter = 0;
                clearInterval(stopTimer);

                let arr = playlist;
                {

                    for (let j, x, i = arr.length; i;
                        j = parseInt(Math.random() * i), x = arr[--i],
                        arr[i] = arr[j], arr[j] = x);

                    indexing = arr[index]
                    $('#audioFile').attr('src', indexing.song);
                    loadSong();
                }

            }
            function updateTimer(data) {
                if (totalTime == 0 || isNaN(totalTime)) {
                    totalTime = parseInt((audio.duration * 1000));
                    processing(data);
                }
                //for the end of the song
                if (time >= totalTime) {
                    if (play == 0) return; playSong();
                    if (songRepeat == 1) {
                        reset();
                        playSong();
                        return;
                    } else {
                        nextSong();
                        playSong();
                    }
                    return;
                }
                //update timer
                if (play == 1) {
                    time = time + 1000;
                }
                else if (play == -1) {
                    time = 0;
                }
                //upadate time on the progress bar
                if (audio.currentTime != previousTime) {

                    previousTime = audio.currentTime;

                    $('#currentTime').html(processTime(time));

                    let percent = time / totalTime * 100;

                    $('#progress').css("width", percent + "%");
                }
                else {
                    time = parseInt(audio.currentTime * 1000);
                    if (time > 100) time = time - 100;
                    if (play == 1) {
                        audio.pause();
                        if (audio.readyState == 4) {
                            audio.play();
                        }
                    }
                }

            }

            function loadSong() {

                $('#audioFile').attr('src', indexing.song);

                processing(data);
                totalTime = NaN;
                stopTimer = setInterval(function () {
                    updateTimer(data);
                }, 1000);

            }
            loadSong();

            $('#prev').on('click', prevSong);
            $('#next').on('click', nextSong);
            $('#play').on('click', playSong);
            $('#repeat').on('click', toggleRepeat);
            $('#shuffle').on('click', toggleShuffle);

            function playSongAtIndex(data) {


                if (data == index)
                    return;
                if (index >= playlist.length)
                    return;
                if (abort_other_json) {
                    abort_other_json.abort();
                    reset();
                    clearInterval(stopTimer);
                    timeList = [];
                    previousTime = 0;
                    counter = 0;
                }
                index = data;
                indexing = playlist[index];
                $('#audioFile').attr('src', indexing.song);
                loadSong();
            }

            function addToPlayList(data, index) {

                let html = "";
                // html = $('.show-list').html();
                html +=
                    `<tr class="float-song-card" data-index=${index}>
                                 <th scope="row  textSong">${index}</th>
                                 <td><img class="album-art" src="${playlist[index].image}"></td>
                                <td><h2 class="song textSong">${playlist[index].title}</h2></td>
                                <td><h4 class="artist  textSong">${playlist[index].artist}</h4></td>
                            </tr>`
                $('.musicLibrary').hide();
                $(".songList").show();
                $("#show-list").append(html);
                $('#playlist').css("display", "inline");

                $('.float-song-card').on('click', function () {
                    playSongAtIndex($(this).attr("data-index"));
                });
            }

            function setPlaylist() {
                for (let i = 0; i < playlist.length; i++) {


                    addToPlayList(data, i)

                }
            }
            setPlaylist();
        });
    });

    //Get artist song list
    $(document).on('click', ".artistImage", function () {

        let artistId = $(this).find("#artistId").html();
        let artistName = $(this).find("#artistName").html();
        let language = $(this).find("#language").html();
        $("#audio_panel").show();


        $.getJSON(musicURLwithId, function (data) {

            //it will give list of selected language by user
            // now it is fixed to only one language
            let selectedLanguageList = data[language];



            let playlist = [];


            $.each(selectedLanguageList, function (i, v) {

                let albums = v.album;

                $.each(v[albums], function (a, b) {

                    if (b.artist === artistName) {

                        playlist.push(b);
                    }

                });
            });



            let abort_other_json;
            let index = 0;
            let indexing = playlist[index];


            let time = 0;
            let totalTime = 0;
            let timeList = [];
            let play = 0;
            let counter = 0;
            let songRepeat = 0;
            let songShuffle = 0;
            let mute = 0;
            let stopTimer;
            let previousTime;
            let audio = document.getElementById('audioFile');

            function setSongName(songName) {
                let context = $('.song-name');

                //it will set all h2 tag with class name "song-name"
                for (let i = 0; i < context.length; i++) {
                    context[i].innerHTML = songName;
                }
            }

            function setArtistName(artistName) {
                let context = $('.artist-name');
                for (let i = 0; i < context.length; i++) {
                    context[i].innerHTML = artistName;
                }
            }
            function setAlbumArt(albumart) {

                let context = $('#album-art');
                context.attr("src", albumart);
            }

            function processTime(a) {
                let b = parseInt(a / 60000);
                let c = parseInt((a % 60000) / 1000);
                if (c < 10) {
                    c = "0" + c;
                }
                return b + ":" + c;
            }

            function reset() {
                time = 0;
                audio.currentTime = 0;
            }

            function playSong() {
                if (play == 0) {
                    play = 1;
                    audio.play();
                    $('#menu button#play i').removeClass("fa-play");
                    $('#menu button#play i').addClass("fa-pause");
                }
                else {
                    play = 0;
                    audio.pause();
                    $('#menu button#play i').removeClass("fa-pause");
                    $('#menu button#play i').addClass("fa-play");
                }
            }

            function processing(data) {
                // alert("processing");
                if (data.artist == "") {
                    data.artist = "Unknown";
                }

                setSongName(indexing.title);
                setArtistName(indexing.artist);
                setAlbumArt(indexing.image);




                $('#totalTime').html(processTime(totalTime));
                $('#currentTime').html(processTime(time));

                let percent = time / totalTime * 100;
                $('#progress').css("width", percent + "%");
            }

            $('#progress-bar').on('mousedown', function () {
                $('#progress-bar').on('mousemove',
                    function handler(event) {
                        event.preventDefault;
                        if (event.offsetY > 5 || event.offsetY < 1)
                            return;
                        let width = $('#progress-bar').css("width");
                        let percent = parseInt(event.offsetX) / parseInt(width) * 100;
                        $('#progress').css("width", percent + "%");
                        time = parseInt(totalTime * (percent / 100));
                        audio.currentTime = parseInt(time / 1000);
                    });
            });

            function changeProgress() {
                dragHandler = (event) => {
                    event.preventDefault;
                    if (event.offsetY > 5 || event.offsetY < 1) 
                    return;
                    let width = $('#progress-bar').css("width");
                    let percent = parseInt(event.offsetX) / parseInt(width) * 100;
                    $('#progress').css("width", percent + "%");
                    time = parseInt(totalTime * (percent / 100));
                    audio.currentTime = parseInt(time / 1000);
                }
            }

            $('#progressButton').on('mousedown', changeProgress());
            $('#progress-bar').mouseup(function () {
                $('#progress-bar').off('mousemove');
            });

            $('#progressButton').mouseup(function () {
                $('#progress-bar').off('mousemove');
            });

            function rewind5s() {
                if (time > 5000)
                    time = time - 5000;
                else
                    time = 0;
                audio.currentTime = parseInt(time / 1000);
            }

            function forward5s() {
                if ((time + 5000) < totalTime)
                    time = time + 5000;
                else
                    time = totalTime;
                audio.currentTime = parseInt(time / 1000);
            }

            function shuffle() {
                if (abort_other_json) {
                    abort_other_json.abort();
                }
                reset();
                timeList = [];
                previousTime = 0;
                counter = 0;
                clearInterval(stopTimer);

                let arr = playlist;
                {

                    for (let j, x, i = arr.length; i;
                        j = parseInt(Math.random() * i),
                        x = arr[--i],
                        arr[i] = arr[j],
                        arr[j] = x);

                    indexing = arr[index];
                    $('#audioFile').attr('src', indexing.song);
                    loadSong();
                }

            }


            function toggleRepeat() {
                if (songRepeat == 0) {
                    $('#repeat').css("color", buttonColorOnPress);
                    songRepeat = 1;
                } else {
                    $('#repeat').css("color", "grey");
                    songRepeat = 0;
                }
            }
            function toggleShuffle() {
                if (songShuffle == 0) {
                    $('#shuffle').css("color", buttonColorOnPress);
                    songShuffle = 1;
                    shuffle();

                } else {
                    $('#shuffle').css("color", "grey");
                    songShuffle = 0;
                }
            }
            function toggleMute() {
                if (mute == 0) {
                    mute = 1;
                    audio.volume = 0;
                } else {
                    mute = 0;
                    audio.volume = 1;
                }
            }

            function prevSong() {
                if (abort_other_json) {
                    abort_other_json.abort();
                }
                reset();
                timeList = [];
                previousTime = 0;
                counter = 0;
                clearInterval(stopTimer);

                index = (index - 1) % playlist.length;
                indexing = playlist[index];
                $('#audioFile').attr('src', indexing.song);
                loadSong();

            }
            function nextSong() {
                if (abort_other_json) {
                    abort_other_json.abort();
                } reset();
                timeList = [];
                previousTime = 0;
                counter = 0;
                clearInterval(stopTimer);
                index = (index + 1) % playlist.length;
                indexing = playlist[index];
                $('#audioFile').attr('src', indexing.song);
                loadSong();

            }

            function updateTimer(data) {
                if (totalTime == 0 || isNaN(totalTime)) {
                    totalTime = parseInt((audio.duration * 1000));
                    processing(data);
                }
                //for the end of the song
                if (time >= totalTime) {
                    if (play == 0) return; playSong();
                    if (songRepeat == 1) {
                        reset();
                        playSong();
                        return;
                    } else {
                        nextSong();
                        playSong();
                    }
                    return;
                }
                //update timer
                if (play == 1) {
                    time = time + 1000;
                }
                else if (play == -1) {
                    time = 0;
                }
                //upadate time on the progress bar
                if (audio.currentTime != previousTime) {

                    previousTime = audio.currentTime;

                    $('#currentTime').html(processTime(time));

                    let percent = time / totalTime * 100;

                    $('#progress').css("width", percent + "%");
                }
                else {
                    time = parseInt(audio.currentTime * 1000);
                    if (time > 100) time = time - 100;
                    if (play == 1) {
                        audio.pause();
                        if (audio.readyState == 4) {
                            audio.play();
                        }
                    }
                }

            }

            function loadSong() {

                $('#audioFile').attr('src', indexing.song);

                processing(data);
                totalTime = NaN;
                stopTimer = setInterval(function () {
                    updateTimer(data);
                }, 1000);

            }
            loadSong();

            $('#prev').on('click', prevSong);
            $('#next').on('click', nextSong);
            $('#play').on('click', playSong);
            $('#repeat').on('click', toggleRepeat);
            $('#shuffle').on('click', toggleShuffle);

            function playSongAtIndex(data) {


                if (data == index)
                    return;
                if (index >= playlist.length)
                    return;
                if (abort_other_json) {
                    abort_other_json.abort();
                    reset();
                    clearInterval(stopTimer);
                    timeList = [];
                    previousTime = 0;
                    counter = 0;
                }
                index = data;
                indexing = playlist[index];
                $('#audioFile').attr('src', indexing.song);
                loadSong();
            }

            function addToPlayList(data, index) {

                let html = "";
                // html = $('.show-list').html();
                html +=
                    `<tr class="float-song-card" data-index=${index}>
                    <th scope="row">${index}</th>
                    <td><img class="album-art" 
                        src="${playlist[index].image}"></td>
                    <td><h2 class="song">${playlist[index].title}</h2></td>
                     <td><h4 class="artist">${playlist[index].artist}</h4></td>
                    </tr>`
                $('.musicLibrary').hide();
                $(".songList").show();
                $("#show-list").append(html);
                $('#playlist').css("display", "inline");

                $('.float-song-card').on('click', function () {
                    playSongAtIndex($(this).attr("data-index"));
                });
            }


            function setPlaylist() {
                for (let i = 0; i < playlist.length; i++) {


                    addToPlayList(data, i)

                }
            }
            setPlaylist();
        });

    });


    //this
    $('#search').keyup(function () {
        let toSearch = $(this).val();
        $('.float-song-card').css("display", "none");
        $('.float-song-card:contains(' + toSearch + ')'
        ).css("display", "flex");
    });



    $(document).on('click', "#albumLink", function () {
        $('.musicLibrary').show();
        $(".songList").hide();
        location.reload(true); //look after all functionality
    });

    $(document).on('click', "#recentlyLink", function () {
        $('.musicLibrary').show();
        $(".songList").hide(); //look after all functionality
        location.reload(true);
    });

    $(document).on('click', "#artistsLink", function () {
        $('.musicLibrary').show();
        $(".songList").hide(); //look after all functionality
        location.reload(true);
    });

});