import React, { useState, useEffect, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import * as Tone from 'tone';
import { Music, Volume2, Grid, Wand2 } from 'lucide-react';
import { Cell } from './components/Cell';
import { Controls } from './components/Controls';
import { getScaleNotes, generateColors } from './utils';

const baseUrl = "https://gleitz.github.io/midi-js-soundfonts/MusyngKite/";

const instruments = [
  "acoustic_grand_piano", "electric_piano_1", "violin", "cello", "flute", "clarinet",
  "trumpet", "alto_sax", "electric_guitar_clean", "electric_bass_pick", "percussion"
];

function App() {
  const [started, setStarted] = useState(false);
  const [currentMode, setCurrentMode] = useState('grid');
  const [currentScale, setCurrentScale] = useState('major');
  const [currentKey, setCurrentKey] = useState('C4');
  const [currentInstrument, setCurrentInstrument] = useState(instruments[0]);
  const [volume, setVolume] = useState(-10);
  const [gridSize, setGridSize] = useState({ rows: 6, cols: 8 });
  const [cells, setCells] = useState<Cell[]>([]);

  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const samplerRef = useRef<Tone.Sampler | null>(null);
  const thereminSynthRef = useRef<Tone.Oscillator | null>(null);
  const animationFrameRef = useRef<number>();

  const createGrid = useCallback(() => {
    const notes = getScaleNotes(currentScale, currentKey);
    const colors = generateColors(notes.length);
    const newCells: Cell[] = [];

    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols; col++) {
        const index = (gridSize.rows - row - 1) % notes.length;
        newCells.push({
          row,
          col,
          note: notes[index],
          color: colors[index],
          triggered: false,
        });
      }
    }

    setCells(newCells);
  }, [currentScale, currentKey, gridSize]);

  useEffect(() => {
    if (started) {
      createGrid();
    }
  }, [started, createGrid]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const initAudio = async () => {
    await Tone.start();
    await loadInstrument(currentInstrument);
    if (currentMode === 'theremin') {
      thereminSynthRef.current = new Tone.Oscillator(440, "sine").toDestination();
      thereminSynthRef.current.volume.value = volume;
      thereminSynthRef.current.start();
    }
  };

  const loadInstrument = async (instrumentName: string) => {
    try {
      const urls: { [key: string]: string } = {};
      const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];

      notes.forEach(note => {
        urls[note] = `${note}.mp3`;
      });

      samplerRef.current = new Tone.Sampler({
        urls: urls,
        baseUrl: `${baseUrl}${instrumentName}-mp3/`,
        onload: () => {
          console.log(`${instrumentName} loaded!`);
        }
      }).toDestination();

      samplerRef.current.volume.value = volume;
    } catch (error) {
      console.error(`Error loading instrument ${instrumentName}:`, error);
    }
  };

  const detectMotion = useCallback((ctx: CanvasRenderingContext2D) => {
    const { width, height } = ctx.canvas;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    setCells(prevCells => {
      return prevCells.map(cell => {
        const cellWidth = width / gridSize.cols;
        const cellHeight = height / gridSize.rows;
        const startX = Math.floor(cell.col * cellWidth);
        const startY = Math.floor(cell.row * cellHeight);
        const endX = Math.floor((cell.col + 1) * cellWidth);
        const endY = Math.floor((cell.row + 1) * cellHeight);

        let totalBrightness = 0;
        let pixelCount = 0;

        for (let y = startY; y < endY; y += 10) {
          for (let x = startX; x < endX; x += 10) {
            const i = (y * width + x) * 4;
            const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
            totalBrightness += brightness;
            pixelCount++;
          }
        }

        const averageBrightness = totalBrightness / pixelCount;
        const threshold = 50;

        if (averageBrightness > threshold && !cell.triggered) {
          playNote(cell.note);
          return { ...cell, triggered: true };
        } else if (averageBrightness <= threshold && cell.triggered) {
          return { ...cell, triggered: false };
        }

        return cell;
      });
    });
  }, [gridSize]);

  const playNote = (note: string) => {
    if (samplerRef.current) {
      samplerRef.current.triggerAttackRelease(note, '8n');
    }
  };

  const startApp = async () => {
    await Tone.start();
    await initAudio();
    setStarted(true);

    const animate = () => {
      if (canvasRef.current && webcamRef.current?.video) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.drawImage(webcamRef.current.video, 0, 0, canvasRef.current.width, canvasRef.current.height);
          detectMotion(ctx);
        }
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();
  };

  const stopApp = () => {
    setStarted(false);
    if (thereminSynthRef.current) {
      thereminSynthRef.current.stop();
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const handleModeChange = (mode: string) => {
    setCurrentMode(mode);
    if (mode === 'theremin' && started) {
      thereminSynthRef.current?.start();
    } else {
      thereminSynthRef.current?.stop();
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
      <header className="bg-blue-600 text-white p-2">
        <h1 className="text-xl font-bold flex items-center">
          <Music className="mr-2" /> Musical Instrument App
        </h1>
      </header>
      <main className="flex-grow flex overflow-hidden">
        <div className="flex-grow relative">
          {started && (
            <>
              <Webcam
                ref={webcamRef}
                audio={false}
                width="100%"
                height="100%"
                className="absolute inset-0 object-cover mirror"
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 z-10"
                width={window.innerWidth}
                height={window.innerHeight}
              />
              {currentMode === 'grid' && (
                <div className="absolute inset-0 z-20 grid" style={{
                  gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`,
                  gridTemplateRows: `repeat(${gridSize.rows}, 1fr)`,
                }}>
                  {cells.map((cell, index) => (
                    <div
                      key={index}
                      className={`border border-white/30 flex items-center justify-center text-xs ${cell.triggered ? 'bg-opacity-50' : 'bg-opacity-20'}`}
                      style={{ backgroundColor: cell.color }}
                    >
                      {cell.note}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          {!started && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={startApp}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center"
              >
                <Wand2 className="mr-2" /> Start App
              </button>
            </div>
          )}
        </div>
        <Controls
          started={started}
          currentMode={currentMode}
          currentScale={currentScale}
          currentKey={currentKey}
          currentInstrument={currentInstrument}
          volume={volume}
          gridSize={gridSize}
          onStart={startApp}
          onStop={stopApp}
          onModeChange={handleModeChange}
          onScaleChange={setCurrentScale}
          onKeyChange={setCurrentKey}
          onInstrumentChange={setCurrentInstrument}
          onVolumeChange={setVolume}
          onGridSizeChange={setGridSize}
        />
      </main>
    </div>
  );
}

export default App;