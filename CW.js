class KnotsAndCrosses {
    constructor(element) {
        this.container = element;
        this.complete = false;
        this.makeGameboard();
        this.calculatingScore();
        this.score = {
            player: 0,
            COM: 0
        };
/*reference inspiration taken from:  https://github.com/Archianne/noughts-and-crosses - date accessed 02/05/24*/
        this.win = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
            [1, 4, 7],
            [2, 5, 8],
            [3, 6, 9],
            [1, 5, 9],
            [3, 5, 7]
        ];
        this.BeginGame();
    }
/*reference inspiration taken from:  https://www.reddit.com/r/learnjavascript/comments/dynhmv/logic_of_tic_tac_toe_with_simple_ai_in_javascript/?rdt=52236 - Date accessed 01/05/24*/
    calculatingScore() {
        const div = document.createElement("div");
        div.classList.add("game-scoreboard");
        div.innerHTML = `
            <div class="sides">
                <div class="side sideA">
                    <span class="score">0</span>
                </div>
                <div class="side sideB">
                    <span class="score">0</span>
                </div>
            </div>
            <div><button onclick="game.BeginGame()">New Game</button></div>
            <div id="debug"></div>
        `;
        this.container.appendChild(div);
        this.resetButton = this.container.querySelector("button");
        this.debug = this.container.querySelector("#debug");
        this.sideA = this.container.querySelector(".sideA");
        this.sideB = this.container.querySelector(".sideB");
    }

    winCondition() {
        let winner, row;
        const check = side => {
            this.win.forEach(x => {
                if (x.every(y => this[side].includes(y))) {
                    winner = side;
                    row = x;
                }
            });
        };
        check("player");
        check("COM");
        if (winner) {
            row.forEach(x => {
                const square = document.querySelector("[data-id='" + x + "']");
                square.classList.add("win");
            });
            this.complete = true;
            return winner;
        } else if (this.COM.length + this.player.length === 9) {
            this.complete = true;
            return "draw";
        }
    }

    setTurn() {
        if (this.move === true) {
            this.sideA.classList.add("moving");
            this.sideB.classList.remove("moving");
        } else {
            this.sideB.classList.add("moving");
            this.sideA.classList.remove("moving");
        }
    }

    showResult(winner) {
        if (winner === "COM" || winner === "player") this.score[winner]++;
        this.output.innerHTML =
            winner === "COM"
                ? "Opponent Wins"
                : winner === "draw"
                ? "Game Tied"
                : "You have Won!";
        this.resetButton.classList.add("active");
        this.container.querySelector(".sideA .score").innerHTML = this.score["player"];
        this.container.querySelector(".sideB .score").innerHTML = this.score["COM"];

        //get player name when they win 
        if (winner === "player") {
            const playerName = prompt("Congratulations! You won the game. Please enter your name:");
            if (playerName) {
                this.updateScoreTable(playerName);
            }
        }
    }

    updateScoreTable(playerName) {
        //get existing score 
        const scores = JSON.parse(sessionStorage.getItem("scores")) || {};

        //Update the score 
        scores[playerName] = scores[playerName] ? scores[playerName] + 1 : 1;

        //put scores into session storage 
        sessionStorage.setItem("scores", JSON.stringify(scores));

       
        window.location.href = "score.html";
    }

    BeginGame() {
		// User always goes first
        this.output.innerHTML = "";
        this.move = true;
        this.setTurn();
        this.complete = false;
        this.COM = [];
        this.player = [];
        this.resetButton.classList.remove("active");
        document.querySelectorAll(".game-grid > div").forEach(square => {
            square.innerHTML = "";
            square.className = "";
        });
        this.updateDisplay();
        if (this.move === false) this.calculating().then(() => this.COMMove());
    }

    updateDisplay() {
        this.output.innerHTML = "";
        let winner = this.winCondition();
        if (winner) this.showResult(winner);
        else this.setTurn();
    }
/*reference inspiration taken from: https://github.com/Archianne/noughts-and-crosses - Date accessed 03/05/24*/
    makeGameboard() {
        const grid = document.createElement("div");
        grid.classList.add("game-grid");
        for (let i = 0; i < 9; i++) {
            const div = document.createElement("div");
            div.setAttribute("data-id", i + 1);
            grid.appendChild(div);
        }
        grid.addEventListener("click", this.playerMove.bind(this));
        this.container.appendChild(grid);

        const output = document.createElement("div");
        output.classList.add("output");
        this.output = this.container.appendChild(output);
    }

    playerMove(ev) {
        if (
            this.move === false ||
            this.complete === true ||
            ev.target.classList.contains("selected")
        )
            return false;
        const square = parseInt(ev.target.dataset.id, 10);
        this.player.push(square);
        ev.target.innerHTML = "X";
        ev.target.classList.add("selected");
        this.move = false;
        this.updateDisplay();
        this.calculating().then(() => this.COMMove());
    }

    calculating() {
        let ms = Math.floor(Math.random() * 2000) + 100;
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, ms);
        });
    }
/*reference https://www.reddit.com/r/learnjavascript/comments/dynhmv/logic_of_tic_tac_toe_with_simple_ai_in_javascript/?rdt=52236 - Date accessed 01/05/24*/
    COMMove() {
        if (this.complete === true || this.move === true) return false;
        let moves = [],
            selection;
        const initialMove = () => {
            if (this.player.length === 0) moves = [1, 3, 5, 7, 9];
            else if ([1, 3, 7, 9].includes(this.player[0])) selection = 5;
            else moves = [1, 3, 7, 9];
        };
        const checkWin = side => {
            let other = side === "COM" ? "player" : "COM";
            console.log("Running checkWin for " + side);
            this.win.forEach(x => {
                let count = 0;
                this[side].forEach(y => {
                    if (x.includes(y)) count++;
                    if (count == 2 && !selection)
                        selection = x.filter(
                            f => !this.COM.includes(f) && !this.player.includes(f)
                        )[0];
                });
                console.log(
                    side.toUpperCase() +
                        ": Win " +
                        x.toString() +
                        " has " +
                        count +
                        " matches"
                );
            });
        };
        const generalMove = () => {
            console.log("Running generalMove");
            let potentials = new Set();
            this.win.forEach(x => {
                x.forEach(y => {
                    if (this.player.includes(y)) return true;
                });

                this.COM.forEach(y => {
                    if (x.includes(y)) {
                        x.filter(
                            f => !this.COM.includes(f) && !this.player.includes(f)
                        ).forEach(h => potentials.add(h));
                    }
                });
            });
            moves = [...potentials];
        };

        if (this.COM.length === 0) initialMove();
        else {
            checkWin("COM");
            if (!selection) checkWin("player");
            if (!selection) generalMove();
        }

        let error = 0;
        while (
            error < 20 &&
            (!selection ||
                this.player.includes(selection) ||
                this.COM.includes(selection))
        ) {
            selection = moves[Math.floor(Math.random() * moves.length)];
            error++;
        }
        if (error >= 10) alert("Error");

        this.COM.push(selection);
        const square = document.querySelector("[data-id='" + selection + "']");
        square.innerHTML = "O";
        square.classList.add("selected");
        this.move = true;
        this.updateDisplay();
    }
}

const container = document.querySelector(".game-container");
const game = new KnotsAndCrosses(container);
