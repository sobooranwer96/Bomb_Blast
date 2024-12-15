document.addEventListener("DOMContentLoaded", () => {
    const gameGrid = document.getElementById("game-grid");
    const counter = document.getElementById("counter");
    const restartButton = document.getElementById("restart-button");
    
    let bombsDefused = 0;
    let bombsExploded = 0;
    let bombsRemaining = 20;
    let gameInterval;
    let explosionInterval;
    
    // Initialize the grid
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
    startGame();
    // // Randomly turn bombs red every 100ms
    // gameInterval = setInterval(() => {
    //     const bombs = document.querySelectorAll(".bomb");
    //     const randomBomb = bombs[Math.floor(Math.random() * bombs.length)];
        
    //     // Only turn a bomb red if it's green (idle)
    //     if (randomBomb.dataset.status === "green") {
    //         randomBomb.classList.remove("green");
    //         randomBomb.classList.add("red");
    //         randomBomb.dataset.status = "red";
            
    //         // Set a timeout to turn the bomb yellow (explode) if not clicked within 2 seconds
    //         setTimeout(() => {
    //             if (randomBomb.dataset.status === "red") {
    //                 randomBomb.classList.remove("red");
    //                 randomBomb.classList.add("yellow");
    //                 randomBomb.dataset.status = "yellow";
    //                 bombsExploded++;
    //                 updateCounter();

    //                 // After 200ms, reset the bomb to green
    //                 setTimeout(() => {
    //                     if (randomBomb.dataset.status === "yellow") {
    //                         randomBomb.classList.remove("yellow");
    //                         randomBomb.classList.add("green");
    //                         randomBomb.dataset.status = "green";
    //                         bombsRemaining++;
    //                     }
    //                 }, 200); // Bomb turns back green after 200ms
    //             }
    //         }, 2000); // 2 seconds before explosion
    //     }
    // }, 500); // Bomb turns red every 100ms

    // Check if game over (if 3 bombs exploded)
    explosionInterval = setInterval(() => {
        if (bombsExploded === 3) {
            alert("Game Over!");
            clearInterval(gameInterval);
            clearInterval(explosionInterval);
        }
    }, 1000);

    // Restart the game
    function restartGame() {
        clearInterval(gameInterval);
        clearInterval(explosionInterval);
        bombsDefused = 0;
        bombsExploded = 0;
        bombsRemaining = 20;
        initGrid();
        updateCounter();
        startGame();
    }

    // Start the game (again after restart)
    function startGame() {
        gameInterval = setInterval(() => {
            const bombs = document.querySelectorAll(".bomb");
            const randomBomb = bombs[Math.floor(Math.random() * bombs.length)];
            
            // Only turn a bomb red if it's green (idle)
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

                        // After 200ms, reset the bomb to green
                        setTimeout(() => {
                            if (randomBomb.dataset.status === "yellow") {
                                randomBomb.classList.remove("yellow");
                                randomBomb.classList.add("green");
                                randomBomb.dataset.status = "green";
                                bombsRemaining++;
                            }
                        }, 500); // Bomb turns back green after 200ms
                    }
                }, 2000); // 2 seconds before explosion
            }
        }, 500); // Bomb turns red every 100ms
    }
     // Check if game over (if 3 bombs exploded)
     explosionInterval = setInterval(() => {
        if (bombsExploded === 3) {
            alert("Game Over!");
            clearInterval(gameInterval);
            clearInterval(explosionInterval);
        }
    }, 100);
});
