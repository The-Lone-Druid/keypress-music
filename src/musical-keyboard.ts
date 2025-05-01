import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import * as THREE from 'three';
import * as Tone from 'tone';

@customElement("musical-keyboard")
export class MusicalKeyboard extends LitElement {
  @property({ type: Boolean })
  isPlaying = false;

  @property({ type: Boolean })
  isAutoPlaying = false;

  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private particles: THREE.Points | null = null;
  private synth: Tone.PolySynth | null = null;
  private animationFrameId: number | null = null;
  private lastFrameTime: number = 0;
  private particleVelocity: Float32Array | null = null;
  private activeNotes: Set<string> = new Set();
  private autoPlaySequence: Tone.Sequence | null = null;
  private currentMelodyIndex = 0;

  // Predefined melodies
  private melodies = [
    {
      name: "Twinkle Twinkle",
      notes: ["C4", "C4", "G4", "G4", "A4", "A4", "G4", "F4", "F4", "E4", "E4", "D4", "D4", "C4"],
      durations: ["4n", "4n", "4n", "4n", "4n", "4n", "2n", "4n", "4n", "4n", "4n", "4n", "4n", "2n"]
    },
    {
      name: "Happy Birthday",
      notes: ["C4", "C4", "D4", "C4", "F4", "E4", "C4", "C4", "D4", "C4", "G4", "F4"],
      durations: ["4n", "4n", "2n", "2n", "2n", "1n", "4n", "4n", "2n", "2n", "2n", "1n"]
    },
    {
      name: "Jingle Bells",
      notes: ["E4", "E4", "E4", "E4", "E4", "E4", "E4", "G4", "C4", "D4", "E4"],
      durations: ["4n", "4n", "2n", "4n", "4n", "2n", "4n", "4n", "4n", "4n", "1n"]
    }
  ];

  constructor() {
    super();
    this.setupAudio();
    this.setupKeyboardListeners();
  }

  firstUpdated() {
    this.initThreeJS();
    this.startAnimation();
  }

  private initThreeJS() {
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    // Create camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.shadowRoot?.appendChild(this.renderer.domElement);

    // Create particles
    const particleCount = 2000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    this.particleVelocity = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      colors[i * 3] = Math.random();
      colors[i * 3 + 1] = Math.random();
      colors[i * 3 + 2] = Math.random();

      // Initialize velocities
      this.particleVelocity[i * 3] = (Math.random() - 0.5) * 0.02;
      this.particleVelocity[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      this.particleVelocity[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    this.particles = new THREE.Points(particles, particleMaterial);
    this.scene.add(this.particles);

    // Handle window resize
    window.addEventListener('resize', () => {
      if (this.camera && this.renderer) {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      }
    });
  }

  private setupAudio() {
    // Initialize Tone.js with better settings
    this.synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: "sine"
      },
      envelope: {
        attack: 0.001,
        decay: 0.1,
        sustain: 0.3,
        release: 0.1
      }
    }).toDestination();

    // Start the audio context on first user interaction
    const startAudio = () => {
      Tone.start();
      document.removeEventListener('click', startAudio);
      document.removeEventListener('keydown', startAudio);
    };
    document.addEventListener('click', startAudio);
    document.addEventListener('keydown', startAudio);
  }

  private setupKeyboardListeners() {
    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener("keyup", this.handleKeyUp.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (!this.synth || !this.particles || event.repeat) return;

    // Map keyboard keys to musical notes (expanded range)
    const keyToNote: { [key: string]: string } = {
      'a': 'C4', 'w': 'C#4', 's': 'D4', 'e': 'D#4', 'd': 'E4',
      'f': 'F4', 't': 'F#4', 'g': 'G4', 'y': 'G#4', 'h': 'A4',
      'u': 'A#4', 'j': 'B4', 'k': 'C5',
      'l': 'C#5', ';': 'D5', "'": 'D#5',
      'z': 'C3', 'x': 'D3', 'c': 'E3', 'v': 'F3', 'b': 'G3',
      'n': 'A3', 'm': 'B3', ',': 'C4', '.': 'D4', '/': 'E4'
    };

    const note = keyToNote[event.key.toLowerCase()];
    if (note && !this.activeNotes.has(note)) {
      // Play the note and keep it playing
      this.synth.triggerAttack(note);
      this.activeNotes.add(note);

      // Enhanced particle animation
      const positions = this.particles.geometry.attributes.position.array as Float32Array;
      const velocities = this.particleVelocity!;
      
      // Apply stronger force to particles
      for (let i = 0; i < positions.length; i += 3) {
        velocities[i] += (Math.random() - 0.5) * 0.1;
        velocities[i + 1] += (Math.random() - 0.5) * 0.1;
        velocities[i + 2] += (Math.random() - 0.5) * 0.1;
      }

      // Update colors with smoother transitions
      const colors = this.particles.geometry.attributes.color.array as Float32Array;
      const targetColor = {
        r: Math.random(),
        g: Math.random(),
        b: Math.random()
      };

      for (let i = 0; i < colors.length; i += 3) {
        colors[i] = targetColor.r;
        colors[i + 1] = targetColor.g;
        colors[i + 2] = targetColor.b;
      }

      this.particles.geometry.attributes.color.needsUpdate = true;
      this.particles.geometry.attributes.position.needsUpdate = true;

      this.isPlaying = true;
    }
  }

  private handleKeyUp(event: KeyboardEvent) {
    if (!this.synth) return;

    const keyToNote: { [key: string]: string } = {
      'a': 'C4', 'w': 'C#4', 's': 'D4', 'e': 'D#4', 'd': 'E4',
      'f': 'F4', 't': 'F#4', 'g': 'G4', 'y': 'G#4', 'h': 'A4',
      'u': 'A#4', 'j': 'B4', 'k': 'C5',
      'l': 'C#5', ';': 'D5', "'": 'D#5',
      'z': 'C3', 'x': 'D3', 'c': 'E3', 'v': 'F3', 'b': 'G3',
      'n': 'A3', 'm': 'B3', ',': 'C4', '.': 'D4', '/': 'E4'
    };

    const note = keyToNote[event.key.toLowerCase()];
    if (note && this.activeNotes.has(note)) {
      // Stop the note
      this.synth.triggerRelease(note);
      this.activeNotes.delete(note);

      if (this.activeNotes.size === 0) {
        this.isPlaying = false;
      }
    }
  }

  private toggleAutoPlay() {
    if (this.isAutoPlaying) {
      this.stopAutoPlay();
    } else {
      this.startAutoPlay();
    }
  }

  private startAutoPlay() {
    if (!this.synth) return;

    this.isAutoPlaying = true;
    const melody = this.melodies[this.currentMelodyIndex];

    // Stop any existing sequence
    if (this.autoPlaySequence) {
      this.autoPlaySequence.stop();
      this.autoPlaySequence.dispose();
    }

    // Create a new sequence
    this.autoPlaySequence = new Tone.Sequence(
      (time, note) => {
        this.synth!.triggerAttackRelease(note, "8n", time);
        
        // Animate particles for each note
        if (this.particles) {
          const positions = this.particles.geometry.attributes.position.array as Float32Array;
          const velocities = this.particleVelocity!;
          
          for (let i = 0; i < positions.length; i += 3) {
            velocities[i] += (Math.random() - 0.5) * 0.1;
            velocities[i + 1] += (Math.random() - 0.5) * 0.1;
            velocities[i + 2] += (Math.random() - 0.5) * 0.1;
          }

          const colors = this.particles.geometry.attributes.color.array as Float32Array;
          const targetColor = {
            r: Math.random(),
            g: Math.random(),
            b: Math.random()
          };

          for (let i = 0; i < colors.length; i += 3) {
            colors[i] = targetColor.r;
            colors[i + 1] = targetColor.g;
            colors[i + 2] = targetColor.b;
          }

          this.particles.geometry.attributes.color.needsUpdate = true;
          this.particles.geometry.attributes.position.needsUpdate = true;
        }
      },
      melody.notes,
      "8n"
    );

    // Set the sequence to loop
    this.autoPlaySequence.loop = true;
    
    // Start the transport and sequence
    Tone.Transport.bpm.value = 120;
    Tone.Transport.start();
    this.autoPlaySequence.start(0);
  }

  private stopAutoPlay() {
    if (this.autoPlaySequence) {
      this.autoPlaySequence.stop();
      this.autoPlaySequence.dispose();
      this.autoPlaySequence = null;
    }
    Tone.Transport.stop();
    this.isAutoPlaying = false;
  }

  private nextMelody() {
    this.currentMelodyIndex = (this.currentMelodyIndex + 1) % this.melodies.length;
    if (this.isAutoPlaying) {
      this.stopAutoPlay();
      this.startAutoPlay();
    }
  }

  private startAnimation() {
    if (this.scene && this.camera && this.renderer && this.particles) {
      const animate = (currentTime: number) => {
        this.animationFrameId = requestAnimationFrame(animate);
        
        // Calculate delta time for smooth animation
        const deltaTime = (currentTime - this.lastFrameTime) / 1000;
        this.lastFrameTime = currentTime;

        // Smooth particle movement
        const positions = this.particles!.geometry.attributes.position.array as Float32Array;
        const velocities = this.particleVelocity!;

        for (let i = 0; i < positions.length; i += 3) {
          // Update position based on velocity
          positions[i] += velocities[i] * deltaTime * 60;
          positions[i + 1] += velocities[i + 1] * deltaTime * 60;
          positions[i + 2] += velocities[i + 2] * deltaTime * 60;

          // Apply damping to velocity
          velocities[i] *= 0.99;
          velocities[i + 1] *= 0.99;
          velocities[i + 2] *= 0.99;

          // Keep particles within bounds
          if (Math.abs(positions[i]) > 10) positions[i] *= -0.9;
          if (Math.abs(positions[i + 1]) > 10) positions[i + 1] *= -0.9;
          if (Math.abs(positions[i + 2]) > 10) positions[i + 2] *= -0.9;
        }

        this.particles!.geometry.attributes.position.needsUpdate = true;

        // Smooth rotation
        this.particles!.rotation.x += 0.0002 * deltaTime * 60;
        this.particles!.rotation.y += 0.0002 * deltaTime * 60;

        this.renderer!.render(this.scene!, this.camera!);
      };

      this.lastFrameTime = performance.now();
      animate(this.lastFrameTime);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.synth) {
      this.synth.dispose();
    }
    if (this.autoPlaySequence) {
      this.autoPlaySequence.dispose();
    }
    window.removeEventListener("keydown", this.handleKeyDown.bind(this));
    window.removeEventListener("keyup", this.handleKeyUp.bind(this));
  }

  render() {
    return html`
      <div class="controls">
        <button 
          class="control-button ${this.isAutoPlaying ? 'active' : ''}" 
          @click=${this.toggleAutoPlay}
        >
          ${this.isAutoPlaying ? 'Stop Auto-Play' : 'Start Auto-Play'}
        </button>
        <button 
          class="control-button" 
          @click=${this.nextMelody}
        >
          Next Melody
        </button>
        <div class="current-melody">
          Current: ${this.melodies[this.currentMelodyIndex].name}
        </div>
      </div>
      <div class="instructions">
        <p>Press and hold keys to play notes (A-K for higher octave, Z-M for lower octave)</p>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      width: 100vw;
      height: 100vh;
      position: fixed;
      top: 0;
      left: 0;
      overflow: hidden;
    }

    .controls {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 10px;
      align-items: center;
      background: rgba(0, 0, 0, 0.3);
      padding: 10px 20px;
      border-radius: 20px;
    }

    .control-button {
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 8px 16px;
      border-radius: 10px;
      cursor: pointer;
      font-family: Arial, sans-serif;
      font-size: 14px;
      transition: all 0.3s ease;
    }

    .control-button:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .control-button.active {
      background: rgba(255, 255, 255, 0.4);
    }

    .current-melody {
      color: white;
      font-family: Arial, sans-serif;
      font-size: 14px;
      margin-left: 10px;
    }

    .instructions {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      color: white;
      font-family: Arial, sans-serif;
      font-size: 14px;
      opacity: 0.7;
      pointer-events: none;
      text-align: center;
      background: rgba(0, 0, 0, 0.3);
      padding: 10px 20px;
      border-radius: 20px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "musical-keyboard": MusicalKeyboard;
  }
}
