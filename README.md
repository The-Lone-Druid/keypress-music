# KeyPress Music 🎹

An interactive musical keyboard application that creates beautiful visualizations with Three.js and produces piano-like sounds using Tone.js. Play melodies with your keyboard or let the app play them automatically!

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-purple.svg)](https://vitejs.dev/)

## Features

- 🎵 Play piano-like sounds with your keyboard
- 🎨 Beautiful 3D particle animations with Three.js
- 🎹 Multiple octaves of notes available
- 🔄 Auto-play mode with predefined melodies
- 🎨 Smooth visual effects synchronized with sound
- 🎯 Responsive design that works on all devices

## Demo

[Live Demo](https://your-demo-url.com) (Add your deployment URL here)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/keypress-music.git
   cd keypress-music
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Keyboard Controls

- **A-K**: Higher octave notes (C4-C5)
- **Z-M**: Lower octave notes (C3-C4)
- **W, E, T, Y, U**: Sharp notes (C#4, D#4, F#4, G#4, A#4)

### Auto-Play Mode

1. Click the "Start Auto-Play" button to begin playing predefined melodies
2. Use the "Next Melody" button to switch between different songs
3. Click "Stop Auto-Play" to stop the automatic playback

## Development

### Project Structure

```
keypress-music/
├── src/
│   ├── musical-keyboard.ts    # Main application component
│   ├── index.css              # Global styles
│   └── assets/                # Static assets
├── public/                    # Public assets
├── package.json               # Project dependencies
└── README.md                  # Project documentation
```

### Available Scripts

- `pnpm dev`: Start development server
- `pnpm build`: Build for production
- `pnpm preview`: Preview production build

### Technologies Used

- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Three.js](https://threejs.org/)
- [Tone.js](https://tonejs.github.io/)
- [Lit](https://lit.dev/)

## Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Roadmap

- [ ] Add more predefined melodies
- [ ] Implement volume control
- [ ] Add visual keyboard representation
- [ ] Support for custom melodies
- [ ] Mobile touch support
- [ ] Recording and playback functionality

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Three.js](https://threejs.org/) for the amazing 3D graphics library
- [Tone.js](https://tonejs.github.io/) for the powerful audio framework
- [Lit](https://lit.dev/) for the lightweight web components framework

## Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/your-username/keypress-music](https://github.com/your-username/keypress-music)

---

Made with ❤️ by [Your Name](https://github.com/your-username)
