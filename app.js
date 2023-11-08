require('dotenv').config();
const TwitterPackage = require('twitter');
const {createCanvas, Canvas} = require('canvas');
const { Image } = require('canvas');
const unicharadata = require("unicharadata");
const notifier = require('node-notifier');
const fs = require('fs');
const schedule = require('node-schedule');

const colors = ["rgba(231,76,60,0.7)","rgba(230,126,34,0.7)","rgba(241,196,15,0.7)","rgba(26,188,156,0.7)","rgba(46,204,113,0.7)","rgba(52,152,219,0.7)","rgba(155,89,182,0.7)"];

const descs = {
    intros: ["Please give a warm welcome to ","A round of applause for ","Put your hands together for ","Join us as we welcome ","Please welcome to the stage ","Let's give it up for ","It's time to show your appreciation for ","Let's make some noise for ","Say hello to ","Raise a glass to ","Let's hear it for "],
    middlos: ["","the one, the only, ","our old friend ","the very special ","the one-of-a-kind ","the one and only ","our friend ","the brilliant ","the fantastic ","the exquisite ","the super "],
    outros: ["","You rock!","You're amazing!","We love you!","Keep up the good work.","You're incredible!","You rule!","You're the best!"]
}

const notos = ["Color Emoji","Kufi Arabic","Mono","Naskh Arabic","Naskh Arabic UI","Nastaliq Urdu","Sans","Sans Adlam","Sans Adlam Unjoined","Sans Anatolian Hieroglyphs","Sans Arabic","Sans Arabic UI","Sans Armenian","Sans Avestan","Sans Bamum","Sans Batak","Sans Bengali","Sans Bengali UI","Sans Buhid","Sans Canadian Aboriginal","Sans Carian","Sans Chakma","Sans Cham","Sans Cherokee","Sans CJK JP","Sans CJK KR","Sans CJK SC","Sans CJK TC","Sans Cuneiform","Sans Cypriot","Sans Deseret","Sans Devanagari","Sans Devanagari UI","Sans Display","Sans Egyptian Hieroglyphs","Sans Ethiopic","Sans Georgian","Sans Glagolitic","Sans Gothic","Sans Gujarati","Sans Gujarati UI","Sans Gurmukhi","Sans Gurmukhi UI","Sans Hanunoo","Sans Hebrew","Sans Imperial Aramaic","Sans Inscriptional Pahlavi","Sans Inscriptional Parthian","Sans Javanese","Sans Kannada","Sans Kannada UI","Sans Kayah Li","Sans Khmer","Sans Khmer UI","Sans Lao","Sans Lao UI","Sans Linear B","Sans Lisu","Sans Lycian","Sans Lydian","Sans Malayalam","Sans Malayalam UI","Sans Mandaic","Sans Mono","Sans Mono CJK JP","Sans Mono CJK KR","Sans Mono CJK SC","Sans Mono CJK TC","Sans Myanmar","Sans Myanmar UI","Sans New Tai Lue","Sans NKo","Sans Ogham","Sans Ol Chiki","Sans Old Italic","Sans Old Persian","Sans Old South Arabian","Sans Old Turkic","Sans Oriya","Sans Oriya UI","Sans Osage","Sans Osmanya","Sans Phoenician","Sans Runic","Sans Samaritan","Sans Shavian","Sans Sinhala","Sans Sinhala UI","Sans Symbols","Sans Symbols2","Sans Syriac Eastern","Sans Syriac Estrangela","Sans Syriac Western","Sans Tai Tham","Sans Tamil","Sans Tamil UI","Sans Telugu","Sans Telugu UI","Sans Thaana","Sans Thai","Sans Thai UI","Sans Tibetan","Sans Tifinagh","Sans Ugaritic","Sans Vai","Sans Yi"];

var secret = {
    consumer_key:process.env.CONSUMER_KEY,
    consumer_secret:process.env.CONSUMER_SECRET,
    access_token_key:process.env.ACCESS_KEY,
    access_token_secret:process.env.ACCESS_SECRET
}
var Twitter = new TwitterPackage(secret);

function control(han){
    console.log("CONTROL");
    var char = pickCharacter();
    var charCode = char[0][0];
    var charSymb = char[0][1];
    var charName = char[1]; 
    
    console.log(char);
    
    let kDefinition;
    let charUtf16Code = charCode.toString(16).toUpperCase();
    if(han[charUtf16Code]) kDefinition = han[charUtf16Code]; 
    
    if(kDefinition == "") kDefinition = null;
    
    var canvases = draw(charSymb,charCode,kDefinition).then( canvases => {
        var c = canvases[0];
        var d = canvases[1];
        if(!c){
            console.log("No font");
            control(han);
            return;
        }
        else{    
            fs.writeFile(__dirname + "/latest.png", c.toBuffer(), function(err) {
                if(err) {
                    error(err,han);
                    return console.log(err);
                }
                poster(c,charSymb,charName,charCode,han);
            }); 

        }
    });
}

function draw(charSymb,charCode, kDefinition){
    return new Promise( (resolve,reject) => {
        var c = createCanvas(2880,1800);
        var ctx = c.getContext('2d');

        ctx.beginPath();
        ctx.fillStyle = gradient(ctx);
        ctx.fillRect(0,0,2880,1800);
        ctx.fill();
        ctx.closePath();

        var spot = ctx.createLinearGradient(0,0,0,1800);
        spot.addColorStop(0,"rgba(255,255,255,0.4)");
        spot.addColorStop(1,"rgba(255,255,255,0.1)");
        ctx.beginPath();
        ctx.moveTo(1296,0);
        ctx.lineTo(1584,0);
        ctx.lineTo(2600,1800);
        ctx.lineTo(280,1800);
        ctx.lineTo(1296,0);
        ctx.fillStyle = spot;
        ctx.fill();
        ctx.closePath();

        var fontFace = findFont(charCode);
        if(!fontFace) resolve(false);

        var d = new Canvas(500,500);
        var dtx = d.getContext('2d');
        dtx.fillStyle = "black";
        dtx.font = "500px " + fontFace;
        dtx.textAlign = "center";
        dtx.textBaseline = "middle"; 
        dtx.fillText(charSymb,250,250);

        ctx.font = '650px ' + fontFace;
        console.log("650px " + fontFace);

        ctx.textAlign = "center";
        ctx.textBaseline = "middle"; 

        confetti(ctx);
        //snow(ctx);

        if(kDefinition){
            ctx.font = '100px Noto Sans, Arial, sans-serif';

            let lines = Math.ceil(ctx.measureText(kDefinition).width/2600);
            let words = kDefinition.split(" ");
            let length = words.length;
            let y = 1350 - 100*(Math.max(lines - 3,0));
            let iter = 0;


            while(words.length > 0){
                let line = "";
                for(i=0;i<length;i++){
                    let space = "";
                    if(i > 0) space = " ";
                    line += space + words[i];
                }
                if(ctx.measureText(line).width <= 2600 || length == 0){
                    if(length == 0) length = 1;
                    ctx.fillStyle = "black";
                    ctx.fillText(line,1442,y+2,2600);
                    ctx.fillStyle = "white";
                    ctx.fillText(line,1440,y,2600);

                    y += 100;
                    words.splice(0,length);
                    length = words.length;

                }
                else length -=1;
            }

            ctx.textBaseline = "bottom"; 
            ctx.font = '650px ' + fontFace;
            ctx.fillStyle = "black";
            ctx.fillText(charSymb,1444,1350 - 100*(Math.max(lines - 3,0)) - 14);
            ctx.fillStyle = "white";
            ctx.fillText(charSymb,1440,1350 - 100*(Math.max(lines - 3,0)) - 14);
        
            resolve([c,d]);

        }
        else if(fontFace != "Apple Color Emoji"){
            ctx.textBaseline = "middle"; 
            ctx.fillStyle = "black";
            ctx.fillText(charSymb,1444,904);
            ctx.fillStyle = "white";
            ctx.fillText(charSymb,1440,900);
            
            resolve([c,d]);
        }
        else{
            let img = new Image();
            img.onload = function() {
                // draw the image onto the canvas
                ctx.drawImage(img, 1140, 600, 600, 600);
                resolve([c,d]);
            }
            img.src = findEmoji(charCode);

        }
    });
}

function old_gradient(ctx){
    var grd = ctx.createLinearGradient(0,0,0,1800);
    
    var hsl1 = Math.round(Math.random()*359);
    var hsl2 = (hsl1 + 50) % 360;
    
    grd.addColorStop(0,"hsl(" + hsl1 + ",100%,50%");
    grd.addColorStop(1,"hsl(" + hsl2 + ",100%,50%");
    return grd;
}

function gradient(ctx){
    var grd = ctx.createLinearGradient(0,0,0,1800);
    
    var hsl1 = Math.round(Math.random()*359);
    let hslD = Math.max(50, 40 + Math.round(Math.random()*110));
    var hsl2 = (hsl1 + hslD) % 360;
    
    let s1 = Math.round(Math.random()*70 + 30);
    let s2 = Math.round(Math.random()*70 + 30);
    
    let l1 = Math.round(Math.random()*25 + 40);
    let l2 = Math.round(Math.random()*25 + 40);
    
    grd.addColorStop(0,"hsl(" + hsl1 + "," + s1 + "%," + l1 + "%)");
    grd.addColorStop(1,"hsl(" + hsl2 + "," + s2 + "%," + l2 + "%)");
        
    return grd;
}

function confetti(ctx){
    for(i=0;i<1000;i++){
        var confetto = {
            x: Math.round(Math.random()*2880),
            y: Math.round(Math.random()*1800),
            angle: (Math.random()*Math.PI/2) - Math.PI/4,
            w: Math.round(Math.random()*30+10),
            h: Math.round(Math.random()*30+10),
            color: colors[Math.round(Math.random()*(colors.length-1))]
        }
        
        ctx.save();
        ctx.translate(confetto.x,confetto.y);
        ctx.rotate(confetto.angle);
        
        ctx.fillStyle = confetto.color;
        ctx.fillRect(confetto.x,confetto.y,confetto.w,confetto.h);
        
        ctx.restore();
    }
}

function snow(ctx){
    for(i=0;i<1000;i++){
        
        var flake = {
            x: Math.round(Math.random()*2880),
            y: Math.round(Math.random()*1800),
            angle: (Math.random()*Math.PI/2) - Math.PI/4,
            w: Math.round(Math.random()*30+10)*1.2,
            color: colors[Math.round(Math.random()*(colors.length-1))]
        }
        
        flake.color = "rgba(255,255,255,0.7)";
        
        let lightenedColor = flake.color.split("(");
        lightenedColor = lightenedColor[1];
        lightenedColor = lightenedColor.split(",");
        
        //flake.color = "rgb(" + Math.min(255,parseInt(lightenedColor[0]) + 50) + "," + Math.min(255,parseInt(lightenedColor[1]) + 50) + "," + Math.min(255,parseInt(lightenedColor[2]) + 50) + ")";
        //console.log(flake.color);
        flake.color = "rgba(" + Math.min(255,parseInt(lightenedColor[0]) + 50) + "," + Math.min(255,parseInt(lightenedColor[1]) + 50) + "," + Math.min(255,parseInt(lightenedColor[2]) + 50) + ", 0.55)";
        
        function drawFlake(flake,color){
    
            ctx.save();
            ctx.translate(flake.x,flake.y);
            ctx.rotate(flake.angle);

            //ctx.fillStyle = flake.color;
            //ctx.fillRect(flake.x,flake.y,flake.w,flake.h);


            ctx.strokeStyle = color;
            ctx.lineWidth = 3.5;
            ctx.beginPath();

            ctx.moveTo(flake.x, flake.y - flake.w/2);
            ctx.lineTo(flake.x, flake.y + flake.w/2);

            ctx.moveTo(flake.x + Math.sqrt(3)*flake.w/4, flake.y - flake.w/4);
            ctx.lineTo(flake.x - Math.sqrt(3)*flake.w/4, flake.y + flake.w/4);

            ctx.moveTo(flake.x + Math.sqrt(3)*flake.w/4, flake.y + flake.w/4);
            ctx.lineTo(flake.x - Math.sqrt(3)*flake.w/4, flake.y - flake.w/4);

            //Vertical spokes
            ctx.moveTo(flake.x, flake.y - (flake.w/2)/3);
            ctx.lineTo(flake.x + Math.sqrt(2)*flake.w/12, flake.y - (flake.w/2)/3 - Math.sqrt(2)*flake.w/12);
            ctx.moveTo(flake.x, flake.y - (flake.w/2)/3);
            ctx.lineTo(flake.x - Math.sqrt(2)*flake.w/12, flake.y - (flake.w/2)/3 - Math.sqrt(2)*flake.w/12);

            ctx.moveTo(flake.x, flake.y - 2*(flake.w/2)/3);
            ctx.lineTo(flake.x + Math.sqrt(2)*flake.w/16, flake.y - 2*(flake.w/2)/3 - Math.sqrt(2)*flake.w/16);
            ctx.moveTo(flake.x, flake.y - 2*(flake.w/2)/3);
            ctx.lineTo(flake.x - Math.sqrt(2)*flake.w/16, flake.y - 2*(flake.w/2)/3 - Math.sqrt(2)*flake.w/16);

            ctx.moveTo(flake.x, flake.y + (flake.w/2)/3);
            ctx.lineTo(flake.x + Math.sqrt(2)*flake.w/12, flake.y + (flake.w/2)/3 + Math.sqrt(2)*flake.w/12);
            ctx.moveTo(flake.x, flake.y + (flake.w/2)/3);
            ctx.lineTo(flake.x - Math.sqrt(2)*flake.w/12, flake.y + (flake.w/2)/3 + Math.sqrt(2)*flake.w/12);

            ctx.moveTo(flake.x, flake.y + 2*(flake.w/2)/3);
            ctx.lineTo(flake.x + Math.sqrt(2)*flake.w/16, flake.y + 2*(flake.w/2)/3 + Math.sqrt(2)*flake.w/16);
            ctx.moveTo(flake.x, flake.y + 2*(flake.w/2)/3);
            ctx.lineTo(flake.x - Math.sqrt(2)*flake.w/16, flake.y + 2*(flake.w/2)/3 + Math.sqrt(2)*flake.w/16);

            //Angled spokes
            let sin15 = Math.sin(15/360 * 2 * Math.PI);
            let cos15 = Math.cos(15/360 * 2 * Math.PI);

            ctx.moveTo(flake.x + Math.sqrt(3)/3*flake.w/4, flake.y - (flake.w/4)/3);
            ctx.lineTo(flake.x + Math.sqrt(3)/3*flake.w/4 + cos15*flake.w/6, flake.y - (flake.w/4)/3 + sin15*flake.w/6);
            ctx.moveTo(flake.x + Math.sqrt(3)/3*flake.w/4, flake.y - (flake.w/4)/3);
            ctx.lineTo(flake.x + Math.sqrt(3)/3*flake.w/4 + sin15*flake.w/6, flake.y - (flake.w/4)/3 - cos15*flake.w/6);

            ctx.moveTo(flake.x + 2*Math.sqrt(3)/3*flake.w/4, flake.y - 2*(flake.w/4)/3);
            ctx.lineTo(flake.x + 2*Math.sqrt(3)/3*flake.w/4 + cos15*flake.w/8, flake.y - 2*(flake.w/4)/3 + sin15*flake.w/8);
            ctx.moveTo(flake.x + 2*Math.sqrt(3)/3*flake.w/4, flake.y - 2*(flake.w/4)/3);
            ctx.lineTo(flake.x + 2*Math.sqrt(3)/3*flake.w/4 + sin15*flake.w/8, flake.y - 2*(flake.w/4)/3 - cos15*flake.w/8);


            ctx.moveTo(flake.x - Math.sqrt(3)/3*flake.w/4, flake.y + (flake.w/4)/3);
            ctx.lineTo(flake.x - Math.sqrt(3)/3*flake.w/4 - sin15*flake.w/6, flake.y + (flake.w/4)/3 + cos15*flake.w/6);
            ctx.moveTo(flake.x - Math.sqrt(3)/3*flake.w/4, flake.y + (flake.w/4)/3);
            ctx.lineTo(flake.x - Math.sqrt(3)/3*flake.w/4 - cos15*flake.w/6, flake.y + (flake.w/4)/3 - sin15*flake.w/6);

            ctx.moveTo(flake.x - 2*Math.sqrt(3)/3*flake.w/4, flake.y + 2*(flake.w/4)/3);
            ctx.lineTo(flake.x - 2*Math.sqrt(3)/3*flake.w/4 - sin15*flake.w/8, flake.y + 2*(flake.w/4)/3 + cos15*flake.w/8);
            ctx.moveTo(flake.x - 2*Math.sqrt(3)/3*flake.w/4, flake.y + 2*(flake.w/4)/3);
            ctx.lineTo(flake.x - 2*Math.sqrt(3)/3*flake.w/4 - cos15*flake.w/8, flake.y + 2*(flake.w/4)/3 - sin15*flake.w/8);


            ctx.moveTo(flake.x - Math.sqrt(3)/3*flake.w/4, flake.y - (flake.w/4)/3);
            ctx.lineTo(flake.x - Math.sqrt(3)/3*flake.w/4 - cos15*flake.w/6, flake.y - (flake.w/4)/3 + sin15*flake.w/6);
            ctx.moveTo(flake.x - Math.sqrt(3)/3*flake.w/4, flake.y - (flake.w/4)/3);
            ctx.lineTo(flake.x - Math.sqrt(3)/3*flake.w/4 - sin15*flake.w/6, flake.y - (flake.w/4)/3 - cos15*flake.w/6);

            ctx.moveTo(flake.x - 2*Math.sqrt(3)/3*flake.w/4, flake.y - 2*(flake.w/4)/3);
            ctx.lineTo(flake.x - 2*Math.sqrt(3)/3*flake.w/4 - cos15*flake.w/8, flake.y - 2*(flake.w/4)/3 + sin15*flake.w/8);
            ctx.moveTo(flake.x - 2*Math.sqrt(3)/3*flake.w/4, flake.y - 2*(flake.w/4)/3);
            ctx.lineTo(flake.x - 2*Math.sqrt(3)/3*flake.w/4 - sin15*flake.w/8, flake.y - 2*(flake.w/4)/3 - cos15*flake.w/8);


            ctx.moveTo(flake.x + Math.sqrt(3)/3*flake.w/4, flake.y + (flake.w/4)/3);
            ctx.lineTo(flake.x + Math.sqrt(3)/3*flake.w/4 + sin15*flake.w/6, flake.y + (flake.w/4)/3 + cos15*flake.w/6);
            ctx.moveTo(flake.x + Math.sqrt(3)/3*flake.w/4, flake.y + (flake.w/4)/3);
            ctx.lineTo(flake.x + Math.sqrt(3)/3*flake.w/4 + cos15*flake.w/6, flake.y + (flake.w/4)/3 - sin15*flake.w/6);

            ctx.moveTo(flake.x + 2*Math.sqrt(3)/3*flake.w/4, flake.y + 2*(flake.w/4)/3);
            ctx.lineTo(flake.x + 2*Math.sqrt(3)/3*flake.w/4 + sin15*flake.w/8, flake.y + 2*(flake.w/4)/3 + cos15*flake.w/8);
            ctx.moveTo(flake.x + 2*Math.sqrt(3)/3*flake.w/4, flake.y + 2*(flake.w/4)/3);
            ctx.lineTo(flake.x + 2*Math.sqrt(3)/3*flake.w/4 + cos15*flake.w/8, flake.y + 2*(flake.w/4)/3 - sin15*flake.w/8);

            ctx.closePath();
            ctx.stroke();

            ctx.restore();
            
        }
        
        drawFlake(flake, flake.color);
        //drawFlake(flake, "rgba(255,255,255,0.5)");
        
        
    }
    
}

var skipFirstPost = 1;
function poster(c,charSymb,charName,charCode,han){
    charCode = charCode.toString(16).toUpperCase();
    var desc = getCharDesc(charSymb,charName,charCode);
    var intro = desc[0];
    var middlo = desc[1];
    
    var punctoChoice = Math.random();
    if(punctoChoice < 0.5) var puncto = ". ";
    else var puncto = "! ";
    
    var outro = desc[2];
    
    while(charCode.length < 4) charCode = "0" + charCode;
    
    var message = intro + middlo + charSymb + ' U+' + charCode + ' ' + charName + puncto + outro;
    
    
    var timeToNext = 3*60*60*1000 + (Math.round(Math.random()*0.5*60*60*1000) - 0.5*60*60*1000/2);
                        
                  
    /*if(skipFirstPost){
        timeToNext = 3*60*60*1000 - 10 - 180;
        skipFirstPost = 0;
        setTimeout(function(){ control(han) },timeToNext);
    }
    else{*/
        timeToNext = 3*60*60*1000 - 10;
        Twitter.post('media/upload', { media: c.toBuffer()}, function (err, media, response) {
        Twitter.post('statuses/update', { status: message, media_ids: media.media_id_string}, function (err, data, response) {
            console.log("Tweeted.");
            //setTimeout(function(){ control(han) },timeToNext);
        })
        });
    //}
    
}

function pickCharacter(){
    var charData = generateN();
    var n = charData[1];
    
    while(unicharadata.name(n) == '' || unicharadata.name(n).indexOf("CJK IDEOGRAPH LOL JUST KIDDING") != -1){
        charData = generateN();
        n = charData[1];
    }
    console.log(n,unicharadata.name(n));
    return [charData, unicharadata.name(n)];
}

var back = 1;back=0;
function generateN(){
    var m;
    var plannedSequence = fs.readFileSync('planned-sequence.txt','utf8');
    plannedSequence = plannedSequence.split(",");
    
    if(plannedSequence.length >= 1 && plannedSequence[0] != ""){
        m = parseInt(plannedSequence[0]);
        let newPlannedSequence = "";
        for(seq=1;seq<plannedSequence.length;seq++){
            newPlannedSequence += plannedSequence[seq] + ",";   
        }
        newPlannedSequence = newPlannedSequence.substring(0,newPlannedSequence.length - 1);
        
        fs.writeFileSync('planned-sequence.txt',newPlannedSequence);
    }
    else{
        m = Math.round(Math.random()*129535);
        //m = 127877;
        if(back) {
            m = 127881; //party popper
            m = 27728; //night tides
            back = 0;
        }
    }
    var n = String.fromCodePoint(m);
    return [m,n];
}

function getCharDesc(charSymb,charName,charCode){
    var maxLength = 280 - charSymb.length - charName.length - 1 - charCode.length - 3 - 2;
    
    var i = Math.round( Math.random() * (descs.intros.length-1) );
    var j = Math.round( Math.random() * (descs.middlos.length-1) );
    var k = Math.round( Math.random() * (descs.outros.length-1) );
    
    while(descs.intros[i].length + descs.middlos[j].length + descs.outros[k].length > maxLength){
        i = Math.round( Math.random() * (descs.intros.length-1) );
        j = Math.round( Math.random() * (descs.middlos.length-1) );
        k = Math.round( Math.random() * (descs.outros.length-1) );
    }
    return [descs.intros[i],descs.middlos[j],descs.outros[k]];
    
}

function checkIfEmojiExists(m){
    let u = 'emoji/u' + m.toString(16).toUpperCase();
    
    let standard = fs.existsSync(u + '.png');
    let yellow = fs.existsSync(u + '.0.png');
    
    return ( standard || yellow ) ? true : false;
}

function findEmoji(m){
    let u = 'emoji/u' + m.toString(16).toUpperCase();
    if(fs.existsSync(u + '.png')) return u + '.png';
    else if(fs.existsSync(u + '.0.png')) return u + '.0.png';
}

function findFont(m){
    var fontkit = require('fontkit');
    
    for(i=0;i<notos.length;i++){
        //if(notos[i].indexOf("CJK") != -1) var dir = __dirname + '/noto/Noto' + (notos[i].slice(0,notos[i].length-2) + notos[i].slice(notos[i].length-2,notos[i].length).toLowerCase()).replace(/ /g,'') + "-Regular.otf";
        //else var dir = __dirname + '/noto/Noto' + notos[i].replace(/ /g,'') + "-Regular.ttf";
        
        if(notos[i].indexOf("CJK") != -1) var dir = '/home/pi/.fonts/Noto' + (notos[i].slice(0,notos[i].length-2) + notos[i].slice(notos[i].length-2,notos[i].length).toLowerCase()).replace(/ /g,'') + "-Regular.otf";
        else var dir = '/home/pi/.fonts/Noto' + notos[i].replace(/ /g,'') + "-Regular.ttf";
        
        var font = fontkit.openSync(dir);
        if(notos[i] == "Color Emoji"){
            let emoji = checkIfEmojiExists(m);
            if(emoji) return "Apple Color Emoji";
        }
        else if(font && font.characterSet.indexOf(m) != -1){
            return "'Noto " + notos[i] + "'";
        }
    }
    
    var font = fontkit.openSync("/home/pi/.fonts/Cambria Math.ttf");
    if(font && font.characterSet.indexOf(m) != -1) return "'Cambria Math'";
    
    return false;
}

function error(err,han){
    /*notifier.notify({
            title: "Error",
            message: err,
            sound: true,
            timeout: 9999
    });*/
    control(han);
}

function importUnihan(){
    var han = {};
    
    var db = fs.readFileSync('Unihan_Readings.txt','utf8');
    db.split(/\r?\n/).forEach( h => {
        if(h.split(/\t/)[0].substr(0,2) == "U+"){
            let row = h.split(/\t/);
            let char = row[0].substr(2,row[0].length);
            if(row[1] == "kDefinition") han[char] = row[2];
        }
    });
    
    return han;
}

function init(){
    let han = importUnihan();
    
    console.log("Scheduling...");
    
    schedule.scheduleJob('0 */3 * * *', function(){
        control(han);
    });
}

init();