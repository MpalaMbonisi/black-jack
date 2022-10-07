// defining the games object 
let blackJackGame = {
    "you": { "scoreSpan": "#player-blackjack-score", "div": "#player-box", "score": 0 },
    "ai": { "scoreSpan": "#ai-blackjack-score", "div": "#ai-box", "score": 0 },
    "cards": [
        "2a", "2b", "2c", "2d",
        "3a", "3b", "3c", "3d",
        "4a", "4b", "4c", "4d",
        "5a", "5b", "5c", "5d",
        "6a", "6b", "6c", "6d",
        "7a", "7b", "7c", "7d",
        "8a", "8b", "8c", "8d",
        "9a", "9b", "9c", "9d",
        "10a", "10b", "10c", "10d",
        "ace1", "ace2", "ace3", "ace4",
        "jack1", "jack2", "jack3", "jack4",
        "queen1", "queen2", "queen3", "queen4",
        "king1", "king2", "king3", "king4"

    ],
    "cardsMap": {
        "2a": 2, "2b": 2, "2c": 2, "2d": 2,
        "3a": 3, "3b": 3, "3c": 3, "3d": 3,
        "4a": 4, "4b": 4, "4c": 4, "4d": 4,
        "5a": 5, "5b": 5, "5c": 5, "5d": 5,
        "6a": 6, "6b": 6, "6c": 6, "6d": 6,
        "7a": 7, "7b": 7, "7c": 7, "7d": 7,
        "8a": 8, "8b": 8, "8c": 8, "8d": 8,
        "9a": 9, "9b": 9, "9c": 9, "9d": 9,
        "10a": 10, "10b": 10, "10c": 10, "10d": 10,
        "ace1": [1, 11], "ace2": [1, 11], "ace3": [1, 11], "ace4": [1, 11],
        "jack1": 10, "jack2": 10, "jack3": 10, "jack4": 10,
        "queen1": 10, "queen2": 10, "queen3": 10, "queen4": 10,
        "king1": 10, "king2": 10, "king3": 10, "king4": 10,
    },
    "wins": 0,
    "losses": 0,
    "draws": 0,
    "isStand": false,
    "turnsOver": false,
}


// create an object to make it easier to assess 
const You = blackJackGame['you'];
const Ai = blackJackGame['ai'];

// defining a variable to hold sounds 
const hitSound = new Audio('static/sounds/swoosh.mp3');
const winSound = new Audio('static/sounds/cash.mp3');
const tieSound = new Audio('static/sounds/tie.mp3');
const lostSound = new Audio('static/sounds/lost.mp3');

// hit button functionality 
document.querySelector("#hit-button").addEventListener("click", hitButton);

function hitButton() {
    if (blackJackGame["isStand"] === false) {
        let card = randomCard();
        showCard(You, card);
        updateScore(You, card);
        showScore(You);
    }
}

function showCard(activePlayer, card) {
    if (activePlayer["score"] <= 21) {
        let cardImage = document.createElement("img");
        cardImage.src = `static/images/${card}.png`
        document.querySelector(activePlayer["div"]).appendChild(cardImage);
        hitSound.play();
    }
}

// the deal functionality
document.querySelector("#deal-button").addEventListener("click", dealButton);

function dealButton() {
    if (blackJackGame["turnsOver"] === true) {

        let yourImages = document.querySelector("#player-box").querySelectorAll("img");
        let aiImages = document.querySelector("#ai-box").querySelectorAll("img");

        for (i = 0; i < yourImages.length; i++) {
            yourImages[i].remove();
        }

        for (i = 0; i < aiImages.length; i++) {
            aiImages[i].remove();
        }

        // reseting the score back-end  
        You["score"] = 0;
        Ai["score"] = 0;
        // reseting the score front-end 
        document.querySelector("#player-blackjack-score").textContent = 0;
        document.querySelector("#ai-blackjack-score").textContent = 0;
        // changing the text color back to white
        document.querySelector("#player-blackjack-score").style.color = "white";
        document.querySelector("#ai-blackjack-score").style.color = "white";
        // changing the sub-title back to let's play 
        document.querySelector("#subtitle").textContent = "Let's Play";
        document.querySelector("#subtitle").style.color = "black";
        // reseting the turn's over and isStand values in blackJackGame
        blackJackGame["isStand"] = false;
        blackJackGame["turnsOver"] = true;
        // enabling the stand button
        document.getElementById("stand-button").disabled = false;
        // change the color of the deal button to white
        document.querySelector("#deal-button").style.color = "white";
        getElementById("stand-button").disabled = true;
    }
}

function randomCard() {
    let randomIndex = Math.floor(Math.random() * 52);
    return blackJackGame["cards"][randomIndex];
}

function updateScore(activePlayer, card) {
    // If adding 11 keeps the score below 21, add 11 . Else add 1
    if (card === "ace1" || card === "ace2" || card === "ace3" || card === "ace4") {
        if ((activePlayer["score"]) + blackJackGame["cardsMap"][card][1] <= 21) {

            activePlayer["score"] += blackJackGame["cardsMap"][card][1];
        }
        else {
            activePlayer["score"] += blackJackGame["cardsMap"][card][0];
        }
    } else {
        activePlayer["score"] += blackJackGame["cardsMap"][card];
    }
}

function showScore(activePlayer) {
    if (activePlayer["score"] > 21) {
        document.querySelector(activePlayer["scoreSpan"]).textContent = "BUST!";
        document.querySelector(activePlayer["scoreSpan"]).style.color = "red";
    }
    else {
        document.querySelector(activePlayer["scoreSpan"]).textContent = activePlayer["score"];
    }
}

// stand [ai logic] button functionality
document.querySelector("#stand-button").addEventListener('click', aiLogic);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function aiLogic() {
    // de-activating the button before the function excutes 
    blackJackGame["isStand"] = true;
    // while loop for the AI to loop through while playing 
    while (Ai["score"] < 16 && blackJackGame["isStand"] === true) {

        let card = randomCard();
        showCard(Ai, card);
        updateScore(Ai, card);
        showScore(Ai);
        await sleep(1000);
    }

    blackJackGame["turnsOver"] = true;
    showMessage(computeWinner());
    // change the color of the deal button to yellow
    document.querySelector("#deal-button").style.color = "yellow";
}

// function for finding the winner and update the wins, losses and draws
function computeWinner() {
    let winner;

    if (You["score"] <= 21) {
        if ((You["score"] > Ai["score"]) || (Ai["score"] > 21)) {
            blackJackGame["wins"]++;
            winner = You;

        } else if (You["score"] < Ai["score"]) {
            blackJackGame["losses"]++;
            winner = Ai;

        } else if (You["score"] === Ai["score"]) {
            blackJackGame["draws"]++;

        }
    } else if ((You["score"] > 21) && (Ai["score"] <= 21)) {
        winner = Ai;
        blackJackGame["losses"]++;

    } else if ((You["score"] > 21 && (Ai["score"] > 21))) {
        blackJackGame["draws"]++;
    }
    return winner;
}

function showMessage(winner) {
    let message, messageColor;
    if (blackJackGame["turnsOver"] === true) {


        if (winner === You) {
            document.querySelector("#wins").textContent = blackJackGame["wins"];
            message = "You won!";
            messageColor = 'green';
            winSound.play();

        } else if (winner == Ai) {
            document.querySelector("#losses").textContent = blackJackGame["losses"];
            message = "You Lost";
            messageColor = "red";
            lostSound.play();

        } else {
            document.querySelector("#draws").textContent = blackJackGame["draws"];
            message = "You Tied";
            messageColor = "blue";
            tieSound.play();
        }

        document.querySelector("#subtitle").textContent = message;
        document.querySelector("#subtitle").style.color = messageColor;

    }
}