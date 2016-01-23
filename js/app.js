var lastHighlighted = document.getElementById('c1');
var color = '#B71C1C';
var point = 0;
var lastPoint = 0;
var misses = 0;
var db;
var scoreInGame = 0;

window.onload = function () {
    addScoreToDOM(1);
    addMissesToDOM(1);

    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

    var DBOpenRequest = window.indexedDB.open("rgdb", 1);

    DBOpenRequest.onerror = function (event) {
        console.log("ERROR loading database.");
    };

    DBOpenRequest.onsuccess = function (event) {
        console.log("Database initialised.");
        db = DBOpenRequest.result;
    };

    DBOpenRequest.onupgradeneeded = function (event) {
        var db = event.target.result;

        db.onerror = function (event) {
            console.log('Error loading database.');
        };

        var rgObjectStore = db.createObjectStore("highScores", {keyPath: "id", autoIncrement: true});

        console.log("SUCCESS: Tables created.");

        rgObjectStore.createIndex("score", "score", {unique: false});

        console.log("SUCCESS: Table \"highScores\" fields created.");
    };
};

function saveScore() {

    var newItem = [
        {score: scoreInGame}
    ];

    var transaction = db.transaction(["highScores"], "readwrite");

    transaction.oncomplete = function (event) {
        console.log("Adding high score transaction completed.");
    };
    transaction.onerror = function (event) {
        console.log("Adding transaction failed!");
    };
    var objStore = transaction.objectStore("highScores");
    var objectStoreRequest = objStore.add(newItem[0]);

    objectStoreRequest.onsuccess = function (event) {
        console.log("Added one high score successfully.");
    };
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addPoint() {
    point++;
    addScoreToDOM(point);
}

function addScoreToDOM(scoreToAdd) {
    var pScore = document.getElementById("score");
    pScore.innerHTML = scoreToAdd;
}

function addMissesToDOM(missesToAdd) {
    var pMisses = document.getElementById("misses");
    pMisses.innerHTML = missesToAdd;
}

function highlightCell() {
    lastHighlighted.style.background = '#ffffff';
    var number = getRandomInt(1, 25);
    var cid = 'c' + number;
    var targ = document.getElementById(cid);
    targ.addEventListener("click", addPoint);
    if (lastPoint === point) {
        misses++;
        addMissesToDOM(misses);
    }
    if (misses > 3) {
        clearInterval(timerId);
        scoreInGame = point;
        saveScore();
        scoreInGame = 0;
        window.location.href = "gameover.html";

    }
    console.log(point);
    targ.style.background = color;
    lastHighlighted = targ;
    lastPoint = point;
}

var timerId = setInterval(highlightCell, 500);