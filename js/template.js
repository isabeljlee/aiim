var started = false;
var mute = false;
var textCtr = 0;
var embyCtr = 0;

var rcv = document.createElement('audio');
rcv.setAttribute('src', 'assets/imrcv.wav');
var send = document.createElement('audio');
send.setAttribute('src', 'assets/imsend.wav');


document.addEventListener('keyup', function(){
    if (!started)
        start();
});

function start(){
    started = true;
    newctr = chapterText.length;
    $(".text-box").empty();
    setTimeout(iterate, pauses[textCtr]);
}

function iterate(){ //main loop
    if (textCtr < chapterText.length){
        addtext(textCtr).then(() => {
            setTimeout(iterate, pauses[textCtr]);
            textCtr++;
        });
    }
}

function addtext(textCtr){
    return new Promise (function(resolve){
        var character = getCharacter(chapterText[textCtr]); //parses for character name
        var text = getText(chapterText[textCtr]); //parses for actual text
        console.log(character, text);
        
        if (character == "emby" || character == "mb739"){
            console.log("emby");
            embyCtr = 0;
            type(text);
        }
        else{
            $(".text-box").append(chapterText[textCtr]/* + " " + (textCtr+1)*/);
            movedown();
            if (!mute){
                rcv.play();
            }
        }
        console.log("resolving");
        resolve();
    });

}

function movedown(){
    var elem = document.getElementById('text-box');
    elem.scrollTop = elem.scrollHeight;
}

function getCharacter(text){
    var startindex = text.indexOf("'>");
    if (startindex != -1){
        return text.substring(startindex+2, text.indexOf("</span>")-1);
    }
    else return 0;
}

function getText(text){
    return text.substring(text.indexOf("</span>") + 8, text.lastIndexOf("<"));
}

function type(text){
    if (embyCtr < text.length){
        document.getElementById("user-input").innerHTML += text.charAt(embyCtr);
        embyCtr++;
        setTimeout(type(text), 50);
    }
    else{ //end
        $(".user-input").empty();
        setTimeout(function (){
            $(".text-box").append(chapterText[textCtr-1]);
            movedown();
            if (!mute){
                send.play();
            }
        }, 100);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    
    $('.menu').draggable({
        stack: ".active"},  {
        stack: ".type-wrap"}, 
        {
        containment: "window",
        handle: ".header-bar"
    });

    $('.active').draggable({
        stack: ".menu"},  {
        stack: ".type-wrap"}, 
        {
        containment: "window",
        handle: ".header-bar"
    });

    $('.type-wrap').draggable({
        stack: ".menu"},  {
        stack: ".active"}, 
        {
        containment: "window",
        handle: ".header-bar"
    });
});