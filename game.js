document.addEventListener("DOMContentLoaded", () => {
    // Get DOM elements
    const homeContainer = document.getElementById("home-container");
    const gameContainer = document.getElementById("game-container");
    const gameGrid = document.getElementById("game-grid");
    const counter = document.getElementById("counter");
    const restartButton = document.getElementById("restart-button");
    const startButton = document.getElementById("start-button");
    
    let bombsDefused = 0;
    let bombsRemaining = 20;
    let gameInterval;
    let explosionInterval;
    let lives = 3;
    let difficultyLevel = 1;
    let bombFrequency = 500; // Starting frequency in milliseconds

    // Add start button listener
    startButton.addEventListener("click", () => {
        homeContainer.style.display = "none";
        gameContainer.style.display = "block";
        startGame();
    });

    function updateLifeDisplay() {
        const lifeBoxes = document.querySelectorAll(".life-box");
        for (let i = 0; i < lifeBoxes.length; i++) {
            if (i >= lives) {
                lifeBoxes[i].remove();
            }
        }
    }

    function resetLifeDisplay() {
        const lifeContainer = document.querySelector(".life-container");
        const lifeBoxes = document.querySelectorAll(".life-box");
        
        // First remove existing boxes
        lifeBoxes.forEach(box => box.remove());
        
        // Then create 3 new life boxes
        for (let i = 0; i < 3; i++) {
            const lifeBox = document.createElement("div");
            lifeBox.classList.add("life-box");
            lifeContainer.appendChild(lifeBox);
        }
        
        // Reset lives counter
        lives = 3;
    }
    
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
                updateDifficulty();
            }
        }
    });

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
        counter.textContent = `Bombs Defused: ${bombsDefused}`;
    }

    function restartGame() {
        clearInterval(gameInterval);
        clearInterval(explosionInterval);
        bombsDefused = 0;
        bombsRemaining = 20;
        difficultyLevel = 1; // Reset difficulty
        bombFrequency = 500; // Reset frequency
        initGrid();
        updateCounter();
        resetLifeDisplay();
        startGame();
    }

    function startGame() {
        if (explosionInterval) {
            clearInterval(explosionInterval);
        }
        
        initGrid();
        updateCounter();
        difficultyLevel = 1; // Reset difficulty
        bombFrequency = 500; // Reset frequency
        
        explosionInterval = setInterval(() => {
            if (lives <= 0) {
                clearInterval(gameInterval);    // Stop the game interval
                clearInterval(explosionInterval); // Stop the explosion interval
                return;  // Exit the function early
            }
        }, 100);
        
        startGameInterval();
    }

    function startGameInterval() {
        gameInterval = setInterval(() => {
            // Add a check for lives at the start of the interval
            if (lives <= 0) {
                return;  // Don't create new red bombs if no lives left
            }

            // Only spawn one bomb, remove the difficulty level loop
            const bombs = document.querySelectorAll(".bomb");
            const randomBomb = bombs[Math.floor(Math.random() * bombs.length)];
            
            if (randomBomb.dataset.status === "green") {
                randomBomb.classList.remove("green");
                randomBomb.classList.add("red");
                randomBomb.dataset.status = "red";
                randomBomb.dataset.redTime = Date.now();
                
                setTimeout(() => {
                    if (lives <= 0) {
                        return;  // Don't process explosions if no lives left
                    }

                    if (randomBomb.dataset.status === "red" && 
                        Date.now() - randomBomb.dataset.redTime >= 2000) {
                        randomBomb.classList.remove("red");
                        randomBomb.classList.add("yellow");
                        randomBomb.dataset.status = "yellow";
                        updateCounter();
                        lives--;  // Decrease life when a bomb explodes
                        updateLifeDisplay();

                        // After 500ms, reset the bomb to green
                        setTimeout(() => {
                            if (lives <= 0) {
                                return;  // Don't reset to green if no lives left
                            }

                            if (randomBomb.dataset.status === "yellow") {
                                randomBomb.classList.remove("yellow");
                                randomBomb.classList.add("green");
                                randomBomb.dataset.status = "green";
                                bombsRemaining++;
                            }
                        }, 500);  // After 500ms, reset the bomb to green
                    }
                }, 2000);  // Set a timeout to turn the bomb yellow (explode) if not clicked within 2 seconds
            }
        }, bombFrequency);
    }

    function updateDifficulty() {
        if (bombsDefused > 0 && bombsDefused % 50 === 0) {
            difficultyLevel++;
            // Make the frequency decrease more gradually
            bombFrequency = Math.max(300, 540 - (difficultyLevel * 20)); // Adjusted values
            
            // Restart the game interval with new frequency
            clearInterval(gameInterval);
            startGameInterval();
        }
    }
});
