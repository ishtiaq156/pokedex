class SoundManager {
  private static instance: SoundManager;
  private backgroundMusic: HTMLAudioElement | null = null;
  private isBackgroundMusicPlaying = false;
  private isInitialized = false;
  private hasUserInteracted = false;
  private pendingBackgroundMusicStart = false;

  private constructor() {}

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  // Initialize background music
  initializeBackgroundMusic() {
    if (this.isInitialized) return;

    this.backgroundMusic = new Audio("/sounds/103_walk.wav");
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.3; // Set a reasonable volume

    // Add event listeners for better error handling
    this.backgroundMusic.addEventListener("canplaythrough", () => {
      if (this.pendingBackgroundMusicStart) {
        this.startBackgroundMusic();
      }
    });

    this.backgroundMusic.addEventListener("error", (e) => {
      console.warn("Background music failed to load:", e);
    });

    this.isInitialized = true;
  }

  // Start background music
  startBackgroundMusic() {
    if (!this.backgroundMusic || this.isBackgroundMusicPlaying) return;

    // If user hasn't interacted yet, mark as pending
    if (!this.hasUserInteracted) {
      this.pendingBackgroundMusicStart = true;
      return;
    }

    this.backgroundMusic
      .play()
      .then(() => {
        this.isBackgroundMusicPlaying = true;
        this.pendingBackgroundMusicStart = false;
      })
      .catch((error) => {
        console.warn("Could not play background music:", error);
        this.pendingBackgroundMusicStart = false;
      });
  }

  // Stop background music
  stopBackgroundMusic() {
    if (!this.backgroundMusic || !this.isBackgroundMusicPlaying) return;

    this.backgroundMusic.pause();
    this.backgroundMusic.currentTime = 0;
    this.isBackgroundMusicPlaying = false;
  }

  // Mark user interaction and start background music if pending
  markUserInteraction() {
    this.hasUserInteracted = true;
    if (this.pendingBackgroundMusicStart) {
      this.startBackgroundMusic();
    }
  }

  // Play click sound
  playClickSound() {
    this.markUserInteraction();
    const clickSound = new Audio("/sounds/click_ok.wav");
    clickSound.volume = 0.5;
    clickSound.play().catch((error) => {
      console.warn("Could not play click sound:", error);
    });
  }

  // Play cancel sound
  playCancelSound() {
    this.markUserInteraction();
    const cancelSound = new Audio("/sounds/click_cancel.wav");
    cancelSound.volume = 0.5;
    cancelSound.play().catch((error) => {
      console.warn("Could not play cancel sound:", error);
    });
  }

  // Check if background music is playing
  isBackgroundMusicActive(): boolean {
    return this.isBackgroundMusicPlaying;
  }

  // Toggle background music on/off
  toggleBackgroundMusic() {
    if (this.isBackgroundMusicPlaying) {
      this.stopBackgroundMusic();
    } else {
      this.startBackgroundMusic();
    }
  }
}

export const soundManager = SoundManager.getInstance();
