"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var fs = require("node:fs");
var https = require("https");
var unicharadata = require("unicharadata");
var fontkit = require("fontkit");
var canvas_1 = require("canvas");
var node_schedule_1 = require("node-schedule");
var twitter_api_v2_1 = require("twitter-api-v2");
var instagram_graph_api_1 = require("instagram-graph-api");
var notos = ["Kufi Arabic", "Mono", "Naskh Arabic", "Naskh Arabic UI", "Nastaliq Urdu", "Sans", "Sans Adlam", "Sans Adlam Unjoined", "Sans Anatolian Hieroglyphs", "Sans Arabic", "Sans Arabic UI", "Sans Armenian", "Sans Avestan", "Sans Bamum", "Sans Batak", "Sans Bengali", "Sans Bengali UI", "Sans Buhid", "Sans Canadian Aboriginal", "Sans Carian", "Sans Chakma", "Sans Cham", "Sans Cherokee", "Sans CJK JP", "Sans CJK KR", "Sans CJK SC", "Sans CJK TC", "Sans Cuneiform", "Sans Cypriot", "Sans Deseret", "Sans Devanagari", "Sans Devanagari UI", "Sans Display", "Sans Egyptian Hieroglyphs", "Sans Ethiopic", "Sans Georgian", "Sans Glagolitic", "Sans Gothic", "Sans Gujarati", "Sans Gujarati UI", "Sans Gurmukhi", "Sans Gurmukhi UI", "Sans Hanunoo", "Sans Hebrew", "Sans Imperial Aramaic", "Sans Inscriptional Pahlavi", "Sans Inscriptional Parthian", "Sans Javanese", "Sans Kannada", "Sans Kannada UI", "Sans Kayah Li", "Sans Khmer", "Sans Khmer UI", "Sans Lao", "Sans Lao UI", "Sans Linear B", "Sans Lisu", "Sans Lycian", "Sans Lydian", "Sans Malayalam", "Sans Malayalam UI", "Sans Mandaic", "Sans Mono", "Sans Mono CJK JP", "Sans Mono CJK KR", "Sans Mono CJK SC", "Sans Mono CJK TC", "Sans Myanmar", "Sans Myanmar UI", "Sans New Tai Lue", "Sans NKo", "Sans Ogham", "Sans Ol Chiki", "Sans Old Italic", "Sans Old Persian", "Sans Old South Arabian", "Sans Old Turkic", "Sans Oriya", "Sans Oriya UI", "Sans Osage", "Sans Osmanya", "Sans Phoenician", "Sans Runic", "Sans Samaritan", "Sans Shavian", "Sans Sinhala", "Sans Sinhala UI", "Sans Symbols", "Sans Symbols2", "Sans Syriac Eastern", "Sans Syriac Estrangela", "Sans Syriac Western", "Sans Tai Tham", "Sans Tamil", "Sans Tamil UI", "Sans Telugu", "Sans Telugu UI", "Sans Thaana", "Sans Thai", "Sans Thai UI", "Sans Tibetan", "Sans Tifinagh", "Sans Ugaritic", "Sans Vai", "Sans Yi"];
var twitterClient = new twitter_api_v2_1.TwitterApi({
    appKey: process.env.TWITTER_CONSUMER_KEY,
    appSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET
});
var instagramClient = new instagram_graph_api_1.Client(process.env.INSTAGRAM_ACCESS_TOKEN, process.env.INSTAGRAM_PAGE_ID);
function createPost(han, retryCount) {
    if (retryCount === void 0) { retryCount = 0; }
    return __awaiter(this, void 0, void 0, function () {
        var character, typeface, imageBuffer, text, post;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (retryCount >= 5)
                        return [2 /*return*/];
                    character = getCharacter();
                    if (character.utf16Code in han)
                        character.definition = han[character.utf16Code];
                    typeface = getTypeface(character);
                    if (!typeface)
                        return [2 /*return*/, createPost(han)];
                    return [4 /*yield*/, draw(character, typeface)];
                case 1:
                    imageBuffer = _a.sent();
                    text = getText(character);
                    return [4 /*yield*/, postToInstagram(imageBuffer, text)];
                case 2:
                    post = _a.sent();
                    if (!post)
                        setTimeout(function () {
                            createPost(han, retryCount + 1);
                        }, 120000);
                    return [2 /*return*/];
            }
        });
    });
}
function getCharacter() {
    var code = plannedSequence() || Math.round(Math.random() * 129535);
    var symbol = String.fromCodePoint(code);
    var name = unicharadata.name(symbol);
    if (name == '')
        return getCharacter();
    return { code: code, utf16Code: code.toString(16).toUpperCase(), symbol: symbol, name: name };
}
function plannedSequence() {
    var sequenceFile = fs.readFileSync('planned-sequence.txt', 'utf8');
    var plannedSequence = sequenceFile.split(",");
    if (plannedSequence.length >= 1 && plannedSequence[0] != "") {
        var newPlannedSequence = "";
        for (var seq = 1; seq < plannedSequence.length; seq++) {
            newPlannedSequence += plannedSequence[seq] + ",";
        }
        newPlannedSequence = newPlannedSequence.substring(0, newPlannedSequence.length - 1);
        fs.writeFileSync('planned-sequence.txt', newPlannedSequence);
        return parseInt(plannedSequence[0]) || false;
    }
    else
        return false;
}
function getTypeface(character) {
    //Check each Noto font
    for (var i = 0; i < notos.length; i++) {
        var font_1 = fontkit.openSync(getNotoDir(notos[i]));
        if (font_1 && font_1.characterSet.indexOf(character.code) != -1)
            return "'Noto " + notos[i] + "'";
    }
    ;
    //Then try emojis
    if (emojiExistsFor(character.utf16Code))
        return "Apple Color Emoji";
    //If not try font for math symbols
    var font = fontkit.openSync("fonts/Cambria Math.ttf");
    if (font && font.characterSet.indexOf(character.code) != -1)
        return "'Cambria Math'";
    //No font
    return false;
}
function emojiExistsFor(utf16Code) {
    var u = 'emoji/u' + utf16Code;
    var standard = fs.existsSync(u + '.png');
    var yellow = fs.existsSync(u + '.0.png');
    return (standard || yellow) ? true : false;
}
function draw(character, typeface) {
    return __awaiter(this, void 0, void 0, function () {
        var canvas, ctx, spotlight, lines, words, length_1, y, line, i, space, img_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    canvas = (0, canvas_1.createCanvas)(2880, 1800);
                    ctx = canvas.getContext('2d');
                    ctx.fillStyle = getGradient(ctx);
                    ctx.beginPath();
                    ctx.fillRect(0, 0, 2880, 1800);
                    ctx.fill();
                    ctx.closePath();
                    spotlight = ctx.createLinearGradient(0, 0, 0, 1800);
                    spotlight.addColorStop(0, "rgba(255,255,255,0.4)");
                    spotlight.addColorStop(1, "rgba(255,255,255,0.1)");
                    ctx.beginPath();
                    ctx.moveTo(1296, 0);
                    ctx.lineTo(1584, 0);
                    ctx.lineTo(2600, 1800);
                    ctx.lineTo(280, 1800);
                    ctx.lineTo(1296, 0);
                    ctx.fillStyle = spotlight;
                    ctx.fill();
                    ctx.closePath();
                    if ((new Date()).getMonth() == 11)
                        applySnowTo(ctx);
                    else
                        applyConfettiTo(ctx);
                    ctx.font = '650px ' + typeface;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    if (!character.definition) return [3 /*break*/, 1];
                    ctx.font = '100px Noto Sans, Arial, sans-serif';
                    lines = Math.ceil(ctx.measureText(character.definition).width / 2600);
                    words = character.definition.split(" ");
                    length_1 = words.length;
                    y = 1350 - 100 * (Math.max(lines - 3, 0));
                    while (words.length > 0) {
                        line = "";
                        for (i = 0; i < length_1; i++) {
                            space = "";
                            if (i > 0)
                                space = " ";
                            line += space + words[i];
                        }
                        if (ctx.measureText(line).width <= 2600 || length_1 == 0) {
                            if (length_1 == 0)
                                length_1 = 1;
                            ctx.fillStyle = "black";
                            ctx.fillText(line, 1442, y + 2, 2600);
                            ctx.fillStyle = "white";
                            ctx.fillText(line, 1440, y, 2600);
                            y += 100;
                            words.splice(0, length_1);
                            length_1 = words.length;
                        }
                        else
                            length_1 -= 1;
                    }
                    ctx.textBaseline = "bottom";
                    ctx.font = '650px ' + typeface;
                    ctx.fillStyle = "black";
                    ctx.fillText(character.symbol, 1444, 1350 - 100 * (Math.max(lines - 3, 0)) - 14);
                    ctx.fillStyle = "white";
                    ctx.fillText(character.symbol, 1440, 1350 - 100 * (Math.max(lines - 3, 0)) - 14);
                    return [3 /*break*/, 4];
                case 1:
                    if (!(typeface != "Apple Color Emoji")) return [3 /*break*/, 2];
                    ctx.textBaseline = "middle";
                    ctx.fillStyle = "black";
                    ctx.fillText(character.symbol, 1444, 904);
                    ctx.fillStyle = "white";
                    ctx.fillText(character.symbol, 1440, 900);
                    return [3 /*break*/, 4];
                case 2:
                    img_1 = new canvas_1.Image();
                    return [4 /*yield*/, new Promise(function (resolve) {
                            img_1.onload = function () {
                                ctx.drawImage(img_1, 1140, 600, 600, 600);
                                resolve();
                            };
                            img_1.src = emojiFileFor(character.utf16Code);
                        })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/, canvas.toBuffer('image/jpeg')];
            }
        });
    });
}
function getGradient(ctx) {
    var grd = ctx.createLinearGradient(0, 0, 0, 1800);
    var hsl1 = Math.round(Math.random() * 359);
    var hslD = Math.max(50, 40 + Math.round(Math.random() * 110));
    var hsl2 = (hsl1 + hslD) % 360;
    var s1 = Math.round(Math.random() * 70 + 30);
    var s2 = Math.round(Math.random() * 70 + 30);
    var l1 = Math.round(Math.random() * 25 + 40);
    var l2 = Math.round(Math.random() * 25 + 40);
    grd.addColorStop(0, "hsl(" + hsl1 + "," + s1 + "%," + l1 + "%)");
    grd.addColorStop(1, "hsl(" + hsl2 + "," + s2 + "%," + l2 + "%)");
    return grd;
}
function applyConfettiTo(ctx) {
    var colors = ["rgba(231,76,60,0.7)", "rgba(230,126,34,0.7)", "rgba(241,196,15,0.7)", "rgba(26,188,156,0.7)", "rgba(46,204,113,0.7)", "rgba(52,152,219,0.7)", "rgba(155,89,182,0.7)"];
    for (var i = 0; i < 1000; i++) {
        var confetto = {
            x: Math.round(Math.random() * 2880),
            y: Math.round(Math.random() * 1800),
            angle: (Math.random() * Math.PI / 2) - Math.PI / 4,
            w: Math.round(Math.random() * 30 + 10),
            h: Math.round(Math.random() * 30 + 10),
            color: colors[Math.round(Math.random() * (colors.length - 1))]
        };
        ctx.save();
        ctx.translate(confetto.x, confetto.y);
        ctx.rotate(confetto.angle);
        ctx.fillStyle = confetto.color;
        ctx.fillRect(confetto.x, confetto.y, confetto.w, confetto.h);
        ctx.restore();
    }
}
function applySnowTo(ctx) {
    for (var i = 0; i < 1000; i++) {
        var flake = {
            x: Math.round(Math.random() * 2880),
            y: Math.round(Math.random() * 1800),
            angle: (Math.random() * Math.PI / 2) - Math.PI / 4,
            w: Math.round(Math.random() * 30 + 10) * 1.2,
            color: "rgba(255,255,255,0.55)"
        };
        ctx.save();
        ctx.translate(flake.x, flake.y);
        ctx.rotate(flake.angle);
        ctx.strokeStyle = flake.color;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(flake.x, flake.y - flake.w / 2);
        ctx.lineTo(flake.x, flake.y + flake.w / 2);
        ctx.moveTo(flake.x + Math.sqrt(3) * flake.w / 4, flake.y - flake.w / 4);
        ctx.lineTo(flake.x - Math.sqrt(3) * flake.w / 4, flake.y + flake.w / 4);
        ctx.moveTo(flake.x + Math.sqrt(3) * flake.w / 4, flake.y + flake.w / 4);
        ctx.lineTo(flake.x - Math.sqrt(3) * flake.w / 4, flake.y - flake.w / 4);
        //Vertical spokes
        ctx.moveTo(flake.x, flake.y - (flake.w / 2) / 3);
        ctx.lineTo(flake.x + Math.sqrt(2) * flake.w / 12, flake.y - (flake.w / 2) / 3 - Math.sqrt(2) * flake.w / 12);
        ctx.moveTo(flake.x, flake.y - (flake.w / 2) / 3);
        ctx.lineTo(flake.x - Math.sqrt(2) * flake.w / 12, flake.y - (flake.w / 2) / 3 - Math.sqrt(2) * flake.w / 12);
        ctx.moveTo(flake.x, flake.y - 2 * (flake.w / 2) / 3);
        ctx.lineTo(flake.x + Math.sqrt(2) * flake.w / 16, flake.y - 2 * (flake.w / 2) / 3 - Math.sqrt(2) * flake.w / 16);
        ctx.moveTo(flake.x, flake.y - 2 * (flake.w / 2) / 3);
        ctx.lineTo(flake.x - Math.sqrt(2) * flake.w / 16, flake.y - 2 * (flake.w / 2) / 3 - Math.sqrt(2) * flake.w / 16);
        ctx.moveTo(flake.x, flake.y + (flake.w / 2) / 3);
        ctx.lineTo(flake.x + Math.sqrt(2) * flake.w / 12, flake.y + (flake.w / 2) / 3 + Math.sqrt(2) * flake.w / 12);
        ctx.moveTo(flake.x, flake.y + (flake.w / 2) / 3);
        ctx.lineTo(flake.x - Math.sqrt(2) * flake.w / 12, flake.y + (flake.w / 2) / 3 + Math.sqrt(2) * flake.w / 12);
        ctx.moveTo(flake.x, flake.y + 2 * (flake.w / 2) / 3);
        ctx.lineTo(flake.x + Math.sqrt(2) * flake.w / 16, flake.y + 2 * (flake.w / 2) / 3 + Math.sqrt(2) * flake.w / 16);
        ctx.moveTo(flake.x, flake.y + 2 * (flake.w / 2) / 3);
        ctx.lineTo(flake.x - Math.sqrt(2) * flake.w / 16, flake.y + 2 * (flake.w / 2) / 3 + Math.sqrt(2) * flake.w / 16);
        //Angled spokes
        var sin15 = Math.sin(15 / 360 * 2 * Math.PI), cos15 = Math.cos(15 / 360 * 2 * Math.PI);
        ctx.moveTo(flake.x + Math.sqrt(3) / 3 * flake.w / 4, flake.y - (flake.w / 4) / 3);
        ctx.lineTo(flake.x + Math.sqrt(3) / 3 * flake.w / 4 + cos15 * flake.w / 6, flake.y - (flake.w / 4) / 3 + sin15 * flake.w / 6);
        ctx.moveTo(flake.x + Math.sqrt(3) / 3 * flake.w / 4, flake.y - (flake.w / 4) / 3);
        ctx.lineTo(flake.x + Math.sqrt(3) / 3 * flake.w / 4 + sin15 * flake.w / 6, flake.y - (flake.w / 4) / 3 - cos15 * flake.w / 6);
        ctx.moveTo(flake.x + 2 * Math.sqrt(3) / 3 * flake.w / 4, flake.y - 2 * (flake.w / 4) / 3);
        ctx.lineTo(flake.x + 2 * Math.sqrt(3) / 3 * flake.w / 4 + cos15 * flake.w / 8, flake.y - 2 * (flake.w / 4) / 3 + sin15 * flake.w / 8);
        ctx.moveTo(flake.x + 2 * Math.sqrt(3) / 3 * flake.w / 4, flake.y - 2 * (flake.w / 4) / 3);
        ctx.lineTo(flake.x + 2 * Math.sqrt(3) / 3 * flake.w / 4 + sin15 * flake.w / 8, flake.y - 2 * (flake.w / 4) / 3 - cos15 * flake.w / 8);
        ctx.moveTo(flake.x - Math.sqrt(3) / 3 * flake.w / 4, flake.y + (flake.w / 4) / 3);
        ctx.lineTo(flake.x - Math.sqrt(3) / 3 * flake.w / 4 - sin15 * flake.w / 6, flake.y + (flake.w / 4) / 3 + cos15 * flake.w / 6);
        ctx.moveTo(flake.x - Math.sqrt(3) / 3 * flake.w / 4, flake.y + (flake.w / 4) / 3);
        ctx.lineTo(flake.x - Math.sqrt(3) / 3 * flake.w / 4 - cos15 * flake.w / 6, flake.y + (flake.w / 4) / 3 - sin15 * flake.w / 6);
        ctx.moveTo(flake.x - 2 * Math.sqrt(3) / 3 * flake.w / 4, flake.y + 2 * (flake.w / 4) / 3);
        ctx.lineTo(flake.x - 2 * Math.sqrt(3) / 3 * flake.w / 4 - sin15 * flake.w / 8, flake.y + 2 * (flake.w / 4) / 3 + cos15 * flake.w / 8);
        ctx.moveTo(flake.x - 2 * Math.sqrt(3) / 3 * flake.w / 4, flake.y + 2 * (flake.w / 4) / 3);
        ctx.lineTo(flake.x - 2 * Math.sqrt(3) / 3 * flake.w / 4 - cos15 * flake.w / 8, flake.y + 2 * (flake.w / 4) / 3 - sin15 * flake.w / 8);
        ctx.moveTo(flake.x - Math.sqrt(3) / 3 * flake.w / 4, flake.y - (flake.w / 4) / 3);
        ctx.lineTo(flake.x - Math.sqrt(3) / 3 * flake.w / 4 - cos15 * flake.w / 6, flake.y - (flake.w / 4) / 3 + sin15 * flake.w / 6);
        ctx.moveTo(flake.x - Math.sqrt(3) / 3 * flake.w / 4, flake.y - (flake.w / 4) / 3);
        ctx.lineTo(flake.x - Math.sqrt(3) / 3 * flake.w / 4 - sin15 * flake.w / 6, flake.y - (flake.w / 4) / 3 - cos15 * flake.w / 6);
        ctx.moveTo(flake.x - 2 * Math.sqrt(3) / 3 * flake.w / 4, flake.y - 2 * (flake.w / 4) / 3);
        ctx.lineTo(flake.x - 2 * Math.sqrt(3) / 3 * flake.w / 4 - cos15 * flake.w / 8, flake.y - 2 * (flake.w / 4) / 3 + sin15 * flake.w / 8);
        ctx.moveTo(flake.x - 2 * Math.sqrt(3) / 3 * flake.w / 4, flake.y - 2 * (flake.w / 4) / 3);
        ctx.lineTo(flake.x - 2 * Math.sqrt(3) / 3 * flake.w / 4 - sin15 * flake.w / 8, flake.y - 2 * (flake.w / 4) / 3 - cos15 * flake.w / 8);
        ctx.moveTo(flake.x + Math.sqrt(3) / 3 * flake.w / 4, flake.y + (flake.w / 4) / 3);
        ctx.lineTo(flake.x + Math.sqrt(3) / 3 * flake.w / 4 + sin15 * flake.w / 6, flake.y + (flake.w / 4) / 3 + cos15 * flake.w / 6);
        ctx.moveTo(flake.x + Math.sqrt(3) / 3 * flake.w / 4, flake.y + (flake.w / 4) / 3);
        ctx.lineTo(flake.x + Math.sqrt(3) / 3 * flake.w / 4 + cos15 * flake.w / 6, flake.y + (flake.w / 4) / 3 - sin15 * flake.w / 6);
        ctx.moveTo(flake.x + 2 * Math.sqrt(3) / 3 * flake.w / 4, flake.y + 2 * (flake.w / 4) / 3);
        ctx.lineTo(flake.x + 2 * Math.sqrt(3) / 3 * flake.w / 4 + sin15 * flake.w / 8, flake.y + 2 * (flake.w / 4) / 3 + cos15 * flake.w / 8);
        ctx.moveTo(flake.x + 2 * Math.sqrt(3) / 3 * flake.w / 4, flake.y + 2 * (flake.w / 4) / 3);
        ctx.lineTo(flake.x + 2 * Math.sqrt(3) / 3 * flake.w / 4 + cos15 * flake.w / 8, flake.y + 2 * (flake.w / 4) / 3 - sin15 * flake.w / 8);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
}
function getText(character) {
    var fragments = {
        intro: ["Please give a warm welcome to ", "A round of applause for ", "Put your hands together for ", "Join us as we welcome ", "Please welcome to the stage ", "Let's give it up for ", "It's time to show your appreciation for ", "Let's make some noise for ", "Say hello to ", "Raise a glass to ", "Let's hear it for "],
        description: ["", "the one, the only, ", "our old friend ", "the very special ", "the one-of-a-kind ", "the one and only ", "our friend ", "the brilliant ", "the fantastic ", "the exquisite ", "the super "],
        outro: ["", "You rock!", "You're amazing!", "We love you!", "Keep up the good work.", "You're incredible!", "You rule!", "You're the best!"]
    };
    var characterDescription = character.symbol + " U+" + character.utf16Code + " " + character.name;
    var maxLength = 280 - characterDescription.length;
    var intro, description, punctuation, outro;
    while (!intro || intro.length + description.length + punctuation.length + outro.length > maxLength) {
        intro = fragments.intro[Math.floor(Math.random() * fragments.intro.length)];
        description = fragments.description[Math.floor(Math.random() * fragments.description.length)];
        punctuation = Math.random() < 0.5 ? ". " : "! ";
        outro = fragments.outro[Math.floor(Math.random() * fragments.outro.length)];
    }
    return intro + description + characterDescription + punctuation + outro;
}
function emojiFileFor(utf16Code) {
    var u = 'emoji/u' + utf16Code;
    if (fs.existsSync(u + '.png'))
        return u + '.png';
    else if (fs.existsSync(u + '.0.png'))
        return u + '.0.png';
}
function postToTwitter(image, text) {
    return __awaiter(this, void 0, void 0, function () {
        var mediaId, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, twitterClient.v1.uploadMedia(image, { mimeType: "image/png" })];
                case 1:
                    mediaId = _a.sent();
                    return [4 /*yield*/, twitterClient.v2.tweet({
                            text: text,
                            media: { media_ids: [mediaId] }
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, true];
                case 3:
                    error_1 = _a.sent();
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function postToTennessine(image) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var postData = JSON.stringify({
                        'image': image.toString('base64'),
                        'access_token': process.env.SERVER_ACCESS_TOKEN
                    });
                    var options = {
                        hostname: "tennessine.co.uk",
                        post: 443,
                        path: "/unicode/upload.php",
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                            'Content-Length': postData.length
                        }
                    };
                    var uploadRequest = https.request(options, function (response) {
                        var body = "";
                        response.on("data", function (chunk) {
                            body += chunk;
                        });
                        response.on("end", function () {
                            if (response.statusCode == 200)
                                resolve();
                            else {
                                console.log(response.statusCode + " " + body);
                                reject(response.statusCode);
                            }
                        });
                    });
                    uploadRequest.write(postData);
                    uploadRequest.end();
                })];
        });
    });
}
function postToInstagram(image, text) {
    return __awaiter(this, void 0, void 0, function () {
        var statusCode_1, url, mediaRequest, mediaResponse_1, queryContainerReadiness_1, isReady, publishRequest, error_2;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, postToTennessine(image)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    statusCode_1 = _a.sent();
                    return [2 /*return*/, false];
                case 3:
                    url = "https://tennessine.co.uk/unicode/next_image.jpg?cache=" + Date.now();
                    mediaRequest = instagramClient.newPostPagePhotoMediaRequest(url, text);
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 8, , 9]);
                    return [4 /*yield*/, mediaRequest.execute()];
                case 5:
                    mediaResponse_1 = _a.sent();
                    queryContainerReadiness_1 = function (n) {
                        if (n === void 0) { n = 0; }
                        return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                            var containerRequest, containerResponse;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        containerRequest = instagramClient.newGetContainerRequest(mediaResponse_1.getId());
                                        return [4 /*yield*/, containerRequest.execute()];
                                    case 1:
                                        containerResponse = _a.sent();
                                        if (!containerResponse || !containerResponse.getContainerStatusCode() || containerResponse.getContainerStatusCode() != "FINISHED") {
                                            if (n >= 5)
                                                resolve(false);
                                            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                                var newQuery;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4 /*yield*/, queryContainerReadiness_1(n + 1)];
                                                        case 1:
                                                            newQuery = _a.sent();
                                                            resolve(newQuery);
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            }); }, 60000);
                                        }
                                        else
                                            resolve(true);
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    };
                    return [4 /*yield*/, queryContainerReadiness_1()];
                case 6:
                    isReady = _a.sent();
                    if (!isReady)
                        throw new Error("Upload failed");
                    publishRequest = instagramClient.newPostPublishMediaRequest(mediaResponse_1.getId());
                    return [4 /*yield*/, publishRequest.execute()];
                case 7:
                    _a.sent();
                    return [2 /*return*/, true];
                case 8:
                    error_2 = _a.sent();
                    return [2 /*return*/, false];
                case 9: return [2 /*return*/];
            }
        });
    });
}
function importUnihanReadings() {
    var han = {};
    var db = fs.readFileSync('unihan-readings.txt', 'utf8');
    db.split(/\r?\n/).forEach(function (h) {
        if (h.split(/\t/)[0].substr(0, 2) == "U+") {
            var row = h.split(/\t/);
            var char = row[0].substr(2, row[0].length);
            if (row[1] == "kDefinition")
                han[char] = row[2];
        }
    });
    return han;
}
function registerFonts() {
    notos.forEach(function (noto) { (0, canvas_1.registerFont)(getNotoDir(noto), { family: 'Noto ' + noto }); });
    (0, canvas_1.registerFont)('fonts/Cambria Math.ttf', { family: 'Cambria Math' });
}
function getNotoDir(name) {
    if (name.indexOf("CJK") != -1) {
        return 'fonts/Noto' + (name.slice(0, name.length - 2) + name.slice(name.length - 2, name.length).toLowerCase()).replace(/ /g, '') + '-Regular.otf';
    }
    else
        return 'fonts/Noto' + name.replace(/ /g, '') + '-Regular.ttf';
}
function init() {
    var han = importUnihanReadings();
    registerFonts();
    (0, node_schedule_1.scheduleJob)('0 */3 * * *', function () {
        createPost(han);
    });
    createPost(han);
}
init();
