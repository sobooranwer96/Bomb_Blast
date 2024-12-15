document.addEventListener("DOMContentLoaded", () => {
    console.log("Game Loaded!");
    const gameContainer = document.getElementById("game-container");
    const gameGrid = document.getElementById("game-grid");
    const counter = document.getElementById("counter");
    const restartButton = document.getElementById("restart-button");
    const startButton = document.getElementById("start-button");
    
    let bombsDefused = 0;
    let bombsExploded = 0;
    let bombsRemaining = 20;
    let gameInterval;
    let explosionInterval;
    
    // Start the game
    startButton.addEventListener("click", startGame);
    
    // Restart the game
    restartButton.addEventListener("click", restartGame);
    
    // Function to initialize the grid
    function initGrid() {
        gameGrid.innerHTML = "";
        for (let i = 0; i < 20; i++) {
            const bomb = document.createElement("div");
            bomb.classList.add("bomb", "green");
            bomb.dataset.status = "green";  // Initially green
            gameGrid.appendChild(bomb);
        }
    }
    
    // Update the counter
    function updateCounter() {
        counter.textContent = `Bombs Defused: ${bombsDefused} | Bombs Exploded: ${bombsExploded}`;
    }
    
    // Start the game
    function startGame() {
        gameContainer.style.display = "block";
        document.getElementById("home-container").style.display = "none";
        bombsDefused = 0;
        bombsExploded = 0;
        bombsRemaining = 20;
        initGrid();
        updateCounter();
        
        // Bomb click handler
        gameGrid.addEventListener("click", (event) => {
            const bomb = event.target;
            
            if (bomb.classList.contains("bomb")) {
                const status = bomb.dataset.status;
                if (status === "red") {
                    // Defuse the bomb (turn red back to green)
                    bomb.classList.remove("red");
                    bomb.classList.add("green");
                    bomb.dataset.status = "green";
                    bombsDefused++;
                    bombsRemaining--;
                    updateCounter();
                }
            }
        });
        
        // Randomly turn a bomb red every second
        gameInterval = setInterval(() => {
            const bombs = document.querySelectorAll(".bomb");
            const randomBomb = bombs[Math.floor(Math.random() * bombs.length)];
            
            if (randomBomb.dataset.status === "green") {
                randomBomb.classList.remove("green");
                randomBomb.classList.add("red");
                randomBomb.dataset.status = "red";
                
                // Set a timeout to turn the bomb yellow (explode) if not clicked within 2 seconds
                setTimeout(() => {
                    if (randomBomb.dataset.status === "red") {
                        randomBomb.classList.remove("red");
                        randomBomb.classList.add("yellow");
                        randomBomb.dataset.status = "yellow";
                        bombsExploded++;
                        updateCounter();
                    }
                }, 2000); // 2 seconds before explosion
            }
        }, 1000); // Bomb turns red every second
        
        // Check if game over (if all bombs exploded or defused)
        explosionInterval = setInterval(() => {
            if (bombsRemaining === 0 || bombsExploded === 20) {
                alert("Game Over!");
                clearInterval(gameInterval);
                clearInterval(explosionInterval);
            }
        }, 1000);
    }
    
    // Restart the game
    function restartGame() {
        clearInterval(gameInterval);
        clearInterval(explosionInterval);
        startGame();
    }
});
