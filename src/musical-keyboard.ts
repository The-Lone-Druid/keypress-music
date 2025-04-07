import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("musical-keyboard")
export class MusicalKeyboard extends LitElement {
  @property({ type: Boolean })
  isPlaying = false;

  @property({ type: String })
  gradientColor1 = "#1a1a1a";

  @property({ type: String })
  gradientColor2 = "#2a2a2a";

  private audioContext: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNodes: GainNode[] = [];

  constructor() {
    super();
    this.setupAudio();
    this.setupKeyboardListener();
    this.updateGradientColors();
  }

  private updateGradientColors() {
    // Generate random HSL colors for smooth gradients
    const hue1 = Math.random() * 360;
    const hue2 = (hue1 + 60) % 360; // Complementary color

    this.gradientColor1 = `hsl(${hue1}, 70%, 20%)`;
    this.gradientColor2 = `hsl(${hue2}, 70%, 30%)`;

    // Apply gradient to body
    document.body.style.background = `linear-gradient(135deg, ${this.gradientColor1}, ${this.gradientColor2})`;
    document.body.style.transition = "background 0.5s ease";
  }

  private setupAudio() {
    this.audioContext = new AudioContext();
  }

  private setupKeyboardListener() {
    window.addEventListener("keydown", this.handleKeyPress.bind(this));
  }

  private handleKeyPress() {
    if (!this.audioContext) return;

    // Create oscillator
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    // Set random frequency between 220Hz (A3) and 880Hz (A5)
    const frequency = 220 * Math.pow(2, Math.random() * 2);
    oscillator.frequency.setValueAtTime(
      frequency,
      this.audioContext.currentTime
    );

    // Set random waveform
    const waveforms: OscillatorType[] = ["sine", "triangle", "sine"];
    oscillator.type = waveforms[Math.floor(Math.random() * waveforms.length)];

    // Set volume and attack/decay
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(
      0.3,
      this.audioContext.currentTime + 0.01
    );
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + 0.5
    );

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Start and stop
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.5);

    // Store references for cleanup
    this.oscillators.push(oscillator);
    this.gainNodes.push(gainNode);

    // Cleanup after sound finishes
    setTimeout(() => {
      const index = this.oscillators.indexOf(oscillator);
      if (index > -1) {
        this.oscillators.splice(index, 1);
        this.gainNodes.splice(index, 1);
      }
    }, 500);

    // Update colors on keypress
    this.updateGradientColors();
    this.isPlaying = true;
    setTimeout(() => {
      this.isPlaying = false;
    }, 500);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Cleanup all oscillators
    this.oscillators.forEach((osc) => osc.stop());
    this.oscillators = [];
    this.gainNodes = [];
    window.removeEventListener("keydown", this.handleKeyPress.bind(this));
    // Reset body background
    document.body.style.background = "";
    document.body.style.transition = "";
  }

  render() {
    return html`
      <div class="container">
        <h1>Musical Keyboard</h1>
        <p>Press any key to create beautiful sounds!</p>
        <div class="status ${this.isPlaying ? "playing" : ""}">
          ${this.isPlaying ? "🎵 Playing..." : "Press any key to start"}
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: flex;
      min-height: 100vh;
      width: 100%;
      position: relative;
      text-align: center;
      overflow: hidden;
      align-items: center;
      justify-content: center;
    }

    .container {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
      border: 1px solid rgba(255, 255, 255, 0.18);
      position: relative;
      max-width: 800px;
      width: 90%;
      margin: 0 auto;
      transition: all 0.3s ease;
    }

    .container:hover {
      transform: translateY(-5px);
      background: rgba(255, 255, 255, 0.15);
    }

    h1 {
      color: white;
      margin-bottom: 1rem;
      position: relative;
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
      animation: glow 2s ease-in-out infinite alternate;
    }

    p {
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 2rem;
      position: relative;
    }

    .status {
      font-size: 1.2em;
      padding: 1rem;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      transition: all 0.3s ease;
      position: relative;
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
    }

    .status.playing {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.05);
      border-color: rgba(255, 255, 255, 0.4);
      box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
    }

    @keyframes glow {
      from {
        text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
      }
      to {
        text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
      }
    }

    @media (prefers-color-scheme: light) {
      .container {
        background: rgba(255, 255, 255, 0.2);
      }

      .status {
        background: rgba(255, 255, 255, 0.15);
      }

      .status.playing {
        background: rgba(255, 255, 255, 0.25);
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "musical-keyboard": MusicalKeyboard;
  }
}
