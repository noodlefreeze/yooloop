# YooLoop

A browser extension for YouTube that adds subtitle interaction and video looping features.

## Features

- **Video Looping**: Set start/end points and loop video segments
- **Interactive Subtitles**: Click subtitles to jump to specific times or set loop points
- **Subtitle Highlighting**: Current subtitle is highlighted and auto-scrolled
- **Language Selection**: Switch between available subtitle tracks
- **Lights Off**: Dim the page for focused viewing

## Installation

```bash
# Clone and install
git clone https://github.com/noodlefreeze/yooloop.git
cd yooloop
pnpm install

# Build extension
pnpm build

# Load the dist/ folder as unpacked extension in Chrome
```

## Usage

1. Go to any YouTube video with subtitles
2. Select subtitle language from dropdown
3. Click "start loop" and "end loop" buttons on subtitles to set loop points
4. Toggle the loop button in header to enable/disable looping
5. Click subtitle timestamps to navigate video

## Development

- **Tech**: WXT + React + TypeScript + Jotai
- **Dev**: `pnpm dev` 
- **Build**: `pnpm build`
- **Check**: `pnpm compile`

## Structure

```
components/     # React UI components  
entrypoints/    # Extension entry points
utils/          # State management & helpers
assets/         # Styles
```

Built for language learning and educational video study.