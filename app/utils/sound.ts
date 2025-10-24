class SoundManager {
  private static instance: SoundManager;
  private backgroundMusic: HTMLAudioElement | null = null;
  private isBackgroundMusicPlaying = false;
  private isInitialized = false;

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
    this.isInitialized = true;
  }

  // Start background music
  startBackgroundMusic() {
    if (!this.backgroundMusic || this.isBackgroundMusicPlaying) return;

    this.backgroundMusic
      .play()
      .then(() => {
        this.isBackgroundMusicPlaying = true;
      })
      .catch((error) => {
        console.warn("Could not play background music:", error);
      });
  }

  // Stop background music
  stopBackgroundMusic() {
    if (!this.backgroundMusic || !this.isBackgroundMusicPlaying) return;

    this.backgroundMusic.pause();
    this.backgroundMusic.currentTime = 0;
    this.isBackgroundMusicPlaying = false;
  }

  // Play click sound
  playClickSound() {
    const clickSound = new Audio("/sounds/click_ok.wav");
    clickSound.volume = 0.5;
    clickSound.play().catch((error) => {
      console.warn("Could not play click sound:", error);
    });
  }

  // Play cancel sound
  playCancelSound() {
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
}

export const soundManager = SoundManager.getInstance();
