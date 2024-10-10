# Enhanced Interactive Music Grid

This project is an interactive music grid that uses webcam input to create a unique musical experience. Users can create music by moving in front of their webcam, with different areas of the grid corresponding to different musical notes.

## Features
- Webcam-based interaction
- Customizable musical scales and keys
- Multiple instrument options
- Adjustable volume
- Different visual themes
- Grid and Theremin modes
- Responsive design

## Technologies Used
- Typescript
- HTML5
- CSS3
- JavaScript
- p5.js for webcam processing and canvas manipulation
- Tone.js for audio synthesis and playback

## How to Use
1. Open the HTML file in a web browser that supports webcam access.
2. Click the "Start" button to begin.
3. Move in front of your webcam to trigger different notes on the grid.
4. Use the controls to adjust various settings:
   - **Volume**: Adjust the overall volume
   - **Scale**: Choose between Major, Minor, Blues, Pentatonic, and Chromatic scales
   - **Key**: Select the root note for the scale
   - **Instrument**: Choose from a wide variety of instruments
   - **Theme**: Switch between Dark, Light, and Colorful visual themes
   - **Mode**: Toggle between Grid and Theremin modes

## Grid Mode
In Grid mode, the screen is divided into a grid of cells. Each cell corresponds to a specific note in the chosen scale. Movement detected in a cell will trigger its associated note.

## Theremin Mode
In Theremin mode, the entire screen acts as a theremin-like instrument. Horizontal movement controls pitch, while vertical movement affects volume.

## Customization
The code allows for easy customization of various elements:
- **Grid size**: Adjust `gridRows` and `gridCols` variables
- **Movement sensitivity**: Modify `movementThreshold` in the `Cell` class
- **Note duration**: Adjust `minDuration` and `maxDuration` in the `playNote` method
- **Color schemes**: Modify the `generateColors` function
- 

## Browser Compatibility
This application should work in most modern browsers that support WebRTC for webcam access. Please ensure your browser is up to date for the best experience.

## Note
For privacy reasons, make sure to grant webcam permissions to the application when prompted by your browser.

Enjoy creating music with your movements!
