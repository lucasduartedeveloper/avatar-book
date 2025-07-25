var uploadAlert = new Audio("audio/ui-audio/upload-alert.wav");
var warningBeep = new Audio("audio/beep.wav");

var sw = 360; //window.innerWidth;
var sh = 669; //window.innerHeight;

var gridSize = 10;

if (window.innerWidth > window.innerHeight) {
    sw = window.innerWidth;
    sh = window.innerHeight;
    gridSize = 20;
}

var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
if (urlParams.has("height"))
sh = parseInt(urlParams.get("height"));

var audioBot = true;
var playerId = new Date().getTime();

var canvasBackgroundColor = "rgba(255,255,255,1)";
var backgroundColor = "rgba(50,50,65,1)";
var buttonColor = "rgba(75,75,90,1)";

var audioStream = 
new Audio("audio/music/stream-0.wav");

// Botão de gravação
$(document).ready(function() {
    $("html, body").css("overscroll-behavior", "none");
    $("html, body").css("overflow", "hidden");
    $("html, body").css("background", "#000");

    $("#title").css("font-size", "15px");
    $("#title").css("color", "#fff");
    $("#title").css("top", "10px");
    $("#title").css("z-index", "25");

    // O outro nome não era [  ]
    // Teleprompter
    $("#title")[0].innerText = ""; //"PICTURE DATABASE"; 
    $("#title")[0].onclick = function() {
        var text = prompt();
        sendText(text);
    };

    tileSize = (sw/7);

    document.body.style.overflow = "hidden";

    canvasView = 
    document.createElement("canvas");
    canvasView.style.position = "absolute";
    canvasView.style.left = ((sw/2)-64)+"px";
    canvasView.style.top = (10)+"px";
    canvasView.width = (128);
    canvasView.height = (128);
    canvasView.style.width = (128)+"px";
    canvasView.style.height = (128)+"px";
    canvasView.style.zIndex = "15";
    document.body.appendChild(canvasView);

    nameView = 
    document.createElement("input");
    nameView.style.position = "absolute";
    nameView.style.color = "#000";
    nameView.style.background = "#fff";
    nameView.placeholder = "input name";
    nameView.style.left = (10)+"px";
    nameView.style.top = (148)+"px";
    nameView.style.width = (sw-120)+"px";
    nameView.style.height = (20)+"px";
    nameView.style.zIndex = "15";
    document.body.appendChild(nameView);

    saveView = 
    document.createElement("button");
    saveView.style.position = "absolute";
    saveView.style.color = "#fff";
    saveView.style.background = "#336";
    saveView.innerText = "save";
    saveView.style.font = "10px Arial";
    saveView.style.left = (sw-110)+"px";
    saveView.style.top = (148)+"px";
    saveView.style.width = (100)+"px";
    saveView.style.height = (20)+"px";
    saveView.style.zIndex = "15";
    document.body.appendChild(saveView);

    saveView.onclick = function() {
        var name = nameView.value;
        if (name == "")
        return;

        user.name = name;

        showLoading();
        updateUser(function() {
            getUsers(function() {
                drawUsers();
                hideLoading();

                ws.send("PAPER|"+
                playerId+"|update");
            });
        });
    };

    hairLeftView = 
    document.createElement("button");
    hairLeftView.style.position = "absolute";
    hairLeftView.style.color = "#000";
    hairLeftView.innerText = "<";
    hairLeftView.style.lineHeight = "20px";
    hairLeftView.style.left = (10)+"px";
    hairLeftView.style.top = (10)+"px";
    hairLeftView.style.width = (30)+"px";
    hairLeftView.style.height = (20)+"px";
    hairLeftView.style.zIndex = "15";
    document.body.appendChild(hairLeftView);

    hairLeftView.onclick = function() {
        var max = hairs.length-1;
        var value = user.hair - 1;
        if (value < 0)
        value = max;

        user.hair = value;
    };

    hairRightView = 
    document.createElement("button");
    hairRightView.style.position = "absolute";
    hairRightView.style.color = "#000";
    hairRightView.innerText = ">";
    hairRightView.style.lineHeight = "20px";
    hairRightView.style.left = (sw-40)+"px";
    hairRightView.style.top = (10)+"px";
    hairRightView.style.width = (30)+"px";
    hairRightView.style.height = (20)+"px";
    hairRightView.style.zIndex = "15";
    document.body.appendChild(hairRightView);

    hairRightView.onclick = function() {
        var max = hairs.length-1;
        var value = user.hair + 1;
        if (value > max)
        value = 0;

        user.hair = value;
    };

    eyeLeftView = 
    document.createElement("button");
    eyeLeftView.style.position = "absolute";
    eyeLeftView.style.color = "#000";
    eyeLeftView.innerText = "<";
    eyeLeftView.style.lineHeight = "20px";
    eyeLeftView.style.left = (10)+"px";
    eyeLeftView.style.top = (40)+"px";
    eyeLeftView.style.width = (30)+"px";
    eyeLeftView.style.height = (20)+"px";
    eyeLeftView.style.zIndex = "15";
    document.body.appendChild(eyeLeftView);

    eyeLeftView.onclick = function() {
        var max = eyes.length-1;
        var value = user.eye - 1;
        if (value < 0)
        value = max;

        user.eye = value;
    };

    eyeRightView = 
    document.createElement("button");
    eyeRightView.style.position = "absolute";
    eyeRightView.style.color = "#000";
    eyeRightView.innerText = ">";
    eyeRightView.style.lineHeight = "20px";
    eyeRightView.style.left = (sw-40)+"px";
    eyeRightView.style.top = (40)+"px";
    eyeRightView.style.width = (30)+"px";
    eyeRightView.style.height = (20)+"px";
    eyeRightView.style.zIndex = "15";
    document.body.appendChild(eyeRightView);

    eyeRightView.onclick = function() {
        var max = eyes.length-1;
        var value = user.eye + 1;
        if (value > max)
        value = 0;

        user.eye = value;
    };

    noseLeftView = 
    document.createElement("button");
    noseLeftView.style.position = "absolute";
    noseLeftView.style.color = "#000";
    noseLeftView.innerText = "<";
    noseLeftView.style.lineHeight = "20px";
    noseLeftView.style.left = (10)+"px";
    noseLeftView.style.top = (70)+"px";
    noseLeftView.style.width = (30)+"px";
    noseLeftView.style.height = (20)+"px";
    noseLeftView.style.zIndex = "15";
    document.body.appendChild(noseLeftView);

    noseLeftView.onclick = function() {
        var max = noses.length-1;
        var value = user.nose - 1;
        if (value < 0)
        value = max;

        user.nose = value;
    };

    noseRightView = 
    document.createElement("button");
    noseRightView.style.position = "absolute";
    noseRightView.style.color = "#000";
    noseRightView.innerText = ">";
    noseRightView.style.lineHeight = "20px";
    noseRightView.style.left = (sw-40)+"px";
    noseRightView.style.top = (70)+"px";
    noseRightView.style.width = (30)+"px";
    noseRightView.style.height = (20)+"px";
    noseRightView.style.zIndex = "15";
    document.body.appendChild(noseRightView);

    noseRightView.onclick = function() {
        var max = noses.length-1;
        var value = user.nose + 1;
        if (value > max)
        value = 0;

        user.nose = value;
    };

    mouthLeftView = 
    document.createElement("button");
    mouthLeftView.style.position = "absolute";
    mouthLeftView.style.color = "#000";
    mouthLeftView.innerText = "<";
    mouthLeftView.style.lineHeight = "20px";
    mouthLeftView.style.left = (10)+"px";
    mouthLeftView.style.top = (100)+"px";
    mouthLeftView.style.width = (30)+"px";
    mouthLeftView.style.height = (20)+"px";
    mouthLeftView.style.zIndex = "15";
    document.body.appendChild(mouthLeftView);

    mouthLeftView.onclick = function() {
        var max = mouths.length-1;
        var value = user.mouth - 1;
        if (value < 0)
        value = max;

        user.mouth = value;
    };

    mouthRightView = 
    document.createElement("button");
    mouthRightView.style.position = "absolute";
    mouthRightView.style.color = "#000";
    mouthRightView.innerText = ">";
    mouthRightView.style.lineHeight = "20px";
    mouthRightView.style.left = (sw-40)+"px";
    mouthRightView.style.top = (100)+"px";
    mouthRightView.style.width = (30)+"px";
    mouthRightView.style.height = (20)+"px";
    mouthRightView.style.zIndex = "15";
    document.body.appendChild(mouthRightView);

    mouthRightView.onclick = function() {
        var max = mouths.length-1;
        var value = user.mouth + 1;
        if (value > max)
        value = 0;

        user.mouth = value;
    };

    showLoading();
    loadImages(function() {
        getUsers(function() {
            drawUsers();
            hideLoading();
        });
    });

    ws.onmessage = function(e) {
        var msg = e.data.split("|");
        if (msg[0] == "PAPER" &&
            msg[1] != playerId &&
            msg[2] == "update") {
            getUsers(function() {
                drawUsers();
            });
        }
    };

    window.requestAnimationFrame(animate);
});

var showLoading = function() {
    loadingView = 
    document.createElement("div");
    loadingView.style.position = "absolute";
    loadingView.style.background = "rgba(0,0,0,0.5)";
    loadingView.style.color = "#fff";
    loadingView.innerText = "Wait...";
    loadingView.style.textAlign = "center";
    loadingView.style.fontSize = "48px";
    loadingView.style.lineHeight = (sh)+"px";
    loadingView.style.left = (0)+"px";
    loadingView.style.top = (0)+"px";
    loadingView.style.width = (sw)+"px";
    loadingView.style.height = (sh)+"px";
    loadingView.style.zIndex = "15";
    document.body.appendChild(loadingView);
};

var hideLoading = function() {
    loadingView.remove();
};

var users = [
    { name: "other", body: 0, hair: 0, eye: 0, nose: 0, mouth: 0, likes: 23 },
    { name: "newuser", body: 0, hair: 0, eye: 0, nose: 0, mouth: 0, likes: 0 }
];

var drawUsers = function() {
    if (typeof(listView) != "undefined")
    listView.remove();

    listView = 
    document.createElement("div");
    listView.style.position = "absolute";
    listView.style.left = (0)+"px";
    listView.style.top = (178)+"px";
    listView.style.width = (sw)+"px";
    listView.style.height = (sh-178)+"px";
    listView.style.overflowY = "scroll";
    listView.style.zIndex = "15";
    document.body.appendChild(listView);

    for (var n = 0; n < users.length; n++) {
        var itemView = 
        document.createElement("div");
        itemView.style.position = "absolute";
        itemView.style.background = "#333";
        itemView.style.left = (0)+"px";
        itemView.style.top = (n*42)+"px";
        itemView.style.width = (sw)+"px";
        itemView.style.height = (32)+"px";
        itemView.style.zIndex = "15";
        listView.appendChild(itemView);

        var canvasView = 
        document.createElement("canvas");
        canvasView.style.position = "absolute";
        canvasView.style.background = "#555";
        canvasView.style.left = (0)+"px";
        canvasView.style.top = (0)+"px";
        canvasView.width = (32);
        canvasView.height = (32);
        canvasView.style.width = (32)+"px";
        canvasView.style.height = (32)+"px";
        canvasView.style.zIndex = "15";
        itemView.appendChild(canvasView);

        var canvas = canvasView;
        var ctx = canvas.getContext("2d");

        ctx.imageSmoothingEnabled = false;

        ctx.clearRect(0, 0, sw, sh);

        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "#555";
        ctx.fillStyle = "#555";

        ctx.fillRect(0, 0, 32, 32);

        if (imagesLoaded) {
            ctx.drawImage(
            imgList[bodies[users[n].body].img].elem, 
            0, 0, 32, 32);

            ctx.drawImage(
            imgList[hairs[users[n].hair].img].elem, 
            0, 0, 32, 32);

            ctx.drawImage(
            imgList[eyes[users[n].eye].img].elem, 
            0, 0, 32, 32);

            ctx.drawImage(
            imgList[noses[users[n].nose].img].elem, 
            0, 0, 32, 32);

            ctx.drawImage(
            imgList[mouths[users[n].mouth].img].elem, 
            0, 0, 32, 32);
        };

        var nameView = 
        document.createElement("span");
        nameView.style.position = "absolute";
        nameView.n = n;
        nameView.style.color = "#fff";
        nameView.innerText = users[n].name;
        nameView.style.lineHeight = "32px";
        nameView.style.left = (42)+"px";
        nameView.style.top = (0)+"px";
        nameView.style.width = (150)+"px";
        nameView.style.height = (32)+"px";
        nameView.style.zIndex = "15";
        itemView.appendChild(nameView);

        nameView.onclick = function() {
            showLoading();
            getUser(users[this.n].name, function() {
                window.nameView.value = user.name;
                hideLoading();
            });
        };

        var likesView = 
        document.createElement("span");
        likesView.style.position = "absolute";
        likesView.style.color = "#fff";
        likesView.style.textAlign = "right";
        likesView.innerText = users[n].likes+" likes";
        likesView.style.lineHeight = "32px";
        likesView.style.left = (sw-140)+"px";
        likesView.style.top = (0)+"px";
        likesView.style.width = (70)+"px";
        likesView.style.height = (32)+"px";
        likesView.style.zIndex = "15";
        itemView.appendChild(likesView);

        var likeView = 
        document.createElement("button");
        likeView.style.position = "absolute";
        likeView.n = n;
        likeView.style.color = "#fff";
        likeView.style.background = "#336";
        likeView.innerText = "like";
        likeView.style.font = "10px Arial";
        likeView.style.left = (sw-60)+"px";
        likeView.style.top = (6)+"px";
        likeView.style.width = (50)+"px";
        likeView.style.height = (20)+"px";
        likeView.style.zIndex = "15";
        itemView.appendChild(likeView);

        likeView.onclick = function() {
            var likes = users[this.n].likes + 1;
            users[this.n].likes = likes;

            showLoading();
            updateLikes(users[this.n], function() {
                getUsers(function() {
                    drawUsers();
                    hideLoading();

                    ws.send("PAPER|"+
                    playerId+"|update");
                });
            });
        };
    }
};

var imagesLoaded = false;

var imgList = [
    { path: "img/body-0.png", elem: 0 },
    { path: "img/hair-0.png", elem: 0 },
    { path: "img/hair-1.png", elem: 0 },
    { path: "img/hair-2.png", elem: 0 },
    { path: "img/hair-3.png", elem: 0 },
    { path: "img/hair-4.png", elem: 0 },
    { path: "img/eye-0.png", elem: 0 },
    { path: "img/eye-1.png", elem: 0 },
    { path: "img/nose-0.png", elem: 0 },
    { path: "img/mouth-0.png", elem: 0 },
    { path: "img/mouth-1.png", elem: 0 },
    { path: "img/mouth-2.png", elem: 0 },
    { path: "img/mouth-3.png", elem: 0 }
];

var loadImages = function(callback) {
    var count = 0;

    var rnd = Math.random();

    for (var n = 0; n < imgList.length; n++) {
        var img = new Image();
        img.n = n;
        img.onload = function(e) {
            count = count + 1;
            imgList[this.n].elem = this;

            console.log("loaded "+
            imgList[this.n].path);

            if (count == imgList.length) {
                imagesLoaded = true;
                callback();
            }
        }.bind(img);
        img.src = imgList[n].path+"?rnd="+rnd;
    }
};

var bodies = [
     { img: 0 }
];

var hairs = [
     { img: 1 },
     { img: 2 },
     { img: 3 },
     { img: 4 },
     { img: 5 }
];

var eyes = [
     { img: 6 },
     { img: 7 }
];

var noses = [
     { img: 8 }
];

var mouths = [
     { img: 9 },
     { img: 10 },
     { img: 11 },
     { img: 12 }
];

var user = {
    name: "", body: 0, hair: 0, eye: 0, nose: 0, 
    mouth: 0, likes: 0
};

var startTime = new Date().getTime();

var animate = function() {
    var currentTime = new Date().getTime();
    var elapsedTime = currentTime-startTime;

    var canvas = canvasView;
    var ctx = canvas.getContext("2d");

    ctx.imageSmoothingEnabled = false;

    ctx.clearRect(0, 0, sw, sh);

    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = "#555";
    ctx.fillStyle = "#555";

    ctx.fillRect(0, 0, 128, 128);

    if (imagesLoaded) {
        ctx.drawImage(
        imgList[bodies[user.body].img].elem, 
        0, 0, 128, 128);

        ctx.drawImage(
        imgList[hairs[user.hair].img].elem, 
        0, 0, 128, 128);

        ctx.drawImage(
        imgList[eyes[user.eye].img].elem, 
        0, 0, 128, 128);

        ctx.drawImage(
        imgList[noses[user.nose].img].elem, 
        0, 0, 128, 128);

        ctx.drawImage(
        imgList[mouths[user.mouth].img].elem, 
        0, 0, 128, 128);
    };

    window.requestAnimationFrame(animate);
};

var getUsers = function(callback) {
    $.ajax({
        url: "ajax/user_ab.php",
        method: "GET",
        datatype: "json"
    })
    .done(function(data, status, xhr) {
        var json = JSON.parse(data);
        users = json;

        if (callback)
        callback();
    });
};

var getUser = function(name, callback) {
    $.ajax({
        url: "ajax/user_ab.php?name="+name,
        method: "GET",
        datatype: "json"
    })
    .done(function(data, status, xhr) {
        var json = JSON.parse(data);
        user = json[0];

        callback();
    });
};

var updateUser = function(callback) {
    $.ajax({
        url: "ajax/user_ab.php",
        method: "POST",
        datatype: "json",
        data: { action: "update-user", user: user }
    })
    .done(function(data, status, xhr) {
        callback();
    });
};

var updateLikes = function(user, callback) {
    $.ajax({
        url: "ajax/user_ab.php",
        method: "POST",
        datatype: "json",
        data: { action: "update-likes", user: user }
    })
    .done(function(data, status, xhr) {
        callback();
    });
};

// 100 0-0.99 0.95 

var visibilityChange;
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
  visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  visibilityChange = "webkitvisibilitychange";
}
//^different browsers^

var backgroundMode = false;
document.addEventListener(visibilityChange, function(){
    backgroundMode = !backgroundMode;
    if (backgroundMode) {
        console.log("backgroundMode: "+backgroundMode);
    }
    else {
        console.log("backgroundMode: "+backgroundMode);
    }
}, false);
