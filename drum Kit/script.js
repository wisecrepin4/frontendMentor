class DrumKit {
  constructor() {
    this.soundMap = {
      w: "sounds/crash.mp3",
      a: "sounds/kick-bass.mp3",
      s: "sounds/snare.mp3",
      d: "sounds/tom-1.mp3",
      j: "sounds/tom-2.mp3",
      k: "sounds/tom-3.mp3",
      l: "sounds/tom-4.mp3",
    };

    this.init();
  }

  init() {
    // Add event listeners for keyboard presses
    document.addEventListener("keydown", (event) => {
      this.playSound(event.key.toLowerCase());
    });

    // Add event listeners for button clicks
    const drumButtons = document.querySelectorAll(".drum");
    drumButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const key = button.getAttribute("data-key");
        this.playSound(key);
      });
    });
  }

  playSound(key) {
    // Check if the key is valid
    if (!this.soundMap[key]) {
      return;
    }

    // Find the corresponding button
    const button = document.querySelector(`[data-key="${key}"]`);
    if (!button) {
      return;
    }

    // Play the sound
    const audio = new Audio(this.soundMap[key]);
    audio.currentTime = 0; // Reset audio to beginning for rapid playing

    // Handle audio play with error catching
    audio.play().catch((error) => {
      console.log("Audio play failed:", error);
    });

    // Add pressed animation
    this.animateButton(button);
  }

  animateButton(button) {
    // Add pressed class
    button.classList.add("pressed");

    // Remove pressed class after a short delay
    setTimeout(() => {
      button.classList.remove("pressed");
    }, 150);
  }
}

// Initialize the drum kit when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new DrumKit();
});
