# Keypress Music 🎵

A beautiful web application that creates musical sounds and dynamic visual effects with keyboard interactions. Built with Lit, TypeScript, and Web Audio API.

## Features ✨

- 🎹 Generate musical sounds on keypress
- 🎨 Dynamic gradient background that changes with each keystroke
- 🌈 Smooth color transitions and animations
- 🖥️ Glassmorphic UI design
- 🎵 Random musical notes between A3 (220Hz) and A5 (880Hz)
- 🎨 Responsive design that works on all screen sizes

## Live Demo 🌐

[View the live demo](https://your-demo-url.com)

## Getting Started 🚀

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/keypress-music.git
cd keypress-music
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

## How It Works 🔧

### Sound Generation

- Uses Web Audio API for sound synthesis
- Generates random frequencies between 220Hz (A3) and 880Hz (A5)
- Implements smooth attack and decay for natural sound
- Supports multiple waveforms (sine, triangle)

### Visual Effects

- Dynamic gradient background that changes on each keystroke
- Smooth color transitions using HSL color space
- Glassmorphic UI elements with backdrop filters
- Responsive animations and hover effects

## Contributing 🤝

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add comments for complex logic
- Update documentation as needed
- Test your changes thoroughly
- Ensure all tests pass

### Code Style

- Use TypeScript for type safety
- Follow Lit component patterns
- Use meaningful variable and function names
- Keep functions focused and small
- Add proper error handling

## Project Structure 📁

```
keypress-music/
├── src/
│   ├── assets/          # Static assets
│   ├── musical-keyboard.ts  # Main component
│   ├── index.css        # Global styles
│   └── vite-env.d.ts    # TypeScript declarations
├── public/              # Public assets
├── index.html          # Main HTML file
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

## Technologies Used 🛠️

- [Lit](https://lit.dev/) - For web components
- [TypeScript](https://www.typescriptlang.org/) - For type safety
- [Vite](https://vitejs.dev/) - For build tooling
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) - For sound synthesis

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- Thanks to the Lit team for the amazing web components library
- Web Audio API documentation and examples
- All contributors who help improve this project

## Support 💖

If you find this project helpful, please consider:

- Starring the repository
- Reporting bugs
- Contributing code or documentation
- Sharing with others

---

Made with ❤️ by [Your Name]
