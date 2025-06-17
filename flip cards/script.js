class MemoryGame {
  constructor() {
    this.cards = [];
    this.flippedCards = [];
    this.moves = 0;
    this.isGameComplete = false;
    this.cardValues = ["🎯", "🎮", "🎸", "🎨", "🎭", "🎪", "🎲", "🎳"];

    this.gameGrid = document.getElementById("game-grid");
    this.movesDisplay = document.getElementById("moves");
    this.newGameBtn = document.getElementById("new-game-btn");
    this.gameCompleteDiv = document.getElementById("game-complete");
    this.finalMovesSpan = document.getElementById("final-moves");

    this.initializeGame();
    this.setupEventListeners();
  }

  initializeGame() {
    this.cards = [];
    this.flippedCards = [];
    this.moves = 0;
    this.isGameComplete = false;

    // Create pairs of cards
    this.cardValues.forEach((value, index) => {
      this.cards.push(
        { id: index * 2, value, isFlipped: false, isMatched: false },
        { id: index * 2 + 1, value, isFlipped: false, isMatched: false }
      );
    });

    // Shuffle cards
    this.shuffleCards();

    // Update display
    this.updateMovesDisplay();
    this.hideGameComplete();

    // Render cards
    this.renderCards();
  }

  shuffleCards() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  renderCards() {
    this.gameGrid.innerHTML = "";

    this.cards.forEach((card) => {
      const cardElement = this.createCardElement(card);
      this.gameGrid.appendChild(cardElement);
    });
  }

  createCardElement(card) {
    const cardDiv = document.createElement("div");
    cardDiv.className = "memory-card";
    cardDiv.dataset.cardId = card.id;

    cardDiv.innerHTML = `
            <div class="memory-card-inner ${
              card.isFlipped || card.isMatched ? "flipped" : ""
            }">
                <div class="memory-card-front">?</div>
                <div class="memory-card-back ${
                  card.isMatched ? "matched" : ""
                }">${card.value}</div>
            </div>
        `;

    cardDiv.addEventListener("click", () => this.handleCardClick(card.id));

    return cardDiv;
  }

  handleCardClick(cardId) {
    const card = this.cards.find((c) => c.id === cardId);

    if (
      !card ||
      card.isFlipped ||
      card.isMatched ||
      this.flippedCards.length === 2
    ) {
      return;
    }

    // Flip the card
    card.isFlipped = true;
    this.flippedCards.push(cardId);

    // Update the visual
    this.updateCardVisual(cardId);

    // Check if two cards are flipped
    if (this.flippedCards.length === 2) {
      this.moves++;
      this.updateMovesDisplay();
      this.checkForMatch();
    }
  }

  updateCardVisual(cardId) {
    const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
    const cardInner = cardElement.querySelector(".memory-card-inner");
    const card = this.cards.find((c) => c.id === cardId);

    if (card.isFlipped || card.isMatched) {
      cardInner.classList.add("flipped");
    } else {
      cardInner.classList.remove("flipped");
    }

    if (card.isMatched) {
      const cardBack = cardElement.querySelector(".memory-card-back");
      cardBack.classList.add("matched");
    }
  }

  checkForMatch() {
    const [firstId, secondId] = this.flippedCards;
    const firstCard = this.cards.find((card) => card.id === firstId);
    const secondCard = this.cards.find((card) => card.id === secondId);

    if (firstCard.value === secondCard.value) {
      // Match found
      firstCard.isMatched = true;
      secondCard.isMatched = true;

      // Update visuals
      this.updateCardVisual(firstId);
      this.updateCardVisual(secondId);

      this.flippedCards = [];
      this.checkForGameComplete();
    } else {
      // No match - flip back after 1 second
      setTimeout(() => {
        firstCard.isFlipped = false;
        secondCard.isFlipped = false;

        this.updateCardVisual(firstId);
        this.updateCardVisual(secondId);

        this.flippedCards = [];
      }, 1000);
    }
  }

  checkForGameComplete() {
    const matchedCards = this.cards.filter((card) => card.isMatched);
    if (matchedCards.length === 16) {
      this.isGameComplete = true;
      this.showGameComplete();
    }
  }

  updateMovesDisplay() {
    this.movesDisplay.textContent = this.moves;
  }

  showGameComplete() {
    this.finalMovesSpan.textContent = this.moves;
    this.gameCompleteDiv.classList.remove("hidden");
  }

  hideGameComplete() {
    this.gameCompleteDiv.classList.add("hidden");
  }

  setupEventListeners() {
    this.newGameBtn.addEventListener("click", () => {
      this.initializeGame();
    });
  }
}

// Initialize the game when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new MemoryGame();
});
