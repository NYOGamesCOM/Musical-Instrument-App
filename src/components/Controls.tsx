import React from 'react';
import { Volume2, Grid, Music, Key } from 'lucide-react';

interface ControlsProps {
  started: boolean;
  currentMode: string;
  currentScale: string;
  currentKey: string;
  currentInstrument: string;
  volume: number;
  gridSize: { rows: number; cols: number };
  onStart: () => void;
  onStop: () => void;
  onModeChange: (mode: string) => void;
  onScaleChange: (scale: string) => void;
  onKeyChange: (key: string) => void;
  onInstrumentChange: (instrument: string) => void;
  onVolumeChange: (volume: number) => void;
  onGridSizeChange: (size: { rows: number; cols: number }) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  started,
  currentMode,
  currentScale,
  currentKey,
  currentInstrument,
  volume,
  gridSize,
  onStart,
  onStop,
  onModeChange,
  onScaleChange,
  onKeyChange,
  onInstrumentChange,
  onVolumeChange,
  onGridSizeChange,
}) => {
  return (
    <div className="w-64 bg-gray-200 p-2 flex flex-col space-y-2 overflow-y-auto">
      <h2 className="text-lg font-bold">Controls</h2>
      <button
        onClick={started ? onStop : onStart}
        className={`${
          started ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
        } text-white font-bold py-1 px-2 rounded text-sm`}
      >
        {started ? 'Stop' : 'Start'}
      </button>
      <div>
        <label className="block text-xs font-medium text-gray-700">Mode</label>
        <select
          value={currentMode}
          onChange={(e) => onModeChange(e.target.value)}
          className="mt-1 block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="grid">Grid</option>
          <option value="theremin">Theremin</option>
        </select>
      </div>
      {currentMode === 'grid' && (
        <>
          <div>
            <label className="block text-xs font-medium text-gray-700">Scale</label>
            <select
              value={currentScale}
              onChange={(e) => onScaleChange(e.target.value)}
              className="mt-1 block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="major">Major</option>
              <option value="minor">Minor</option>
              <option value="pentatonic">Pentatonic</option>
              <option value="blues">Blues</option>
              <option value="chromatic">Chromatic</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">Key</label>
            <select
              value={currentKey}
              onChange={(e) => onKeyChange(e.target.value)}
              className="mt-1 block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              {['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map((note) => (
                <option key={note} value={`${note}4`}>{note}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">Grid Size</label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={gridSize.rows}
                onChange={(e) => onGridSizeChange({ ...gridSize, rows: parseInt(e.target.value) })}
                className="mt-1 block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                min="1"
                max="8"
              />
              <input
                type="number"
                value={gridSize.cols}
                onChange={(e) => onGridSizeChange({ ...gridSize, cols: parseInt(e.target.value) })}
                className="mt-1 block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                min="1"
                max="12"
              />
            </div>
          </div>
        </>
      )}
      <div>
        <label className="block text-xs font-medium text-gray-700">Instrument</label>
        <select
          value={currentInstrument}
          onChange={(e) => onInstrumentChange(e.target.value)}
          className="mt-1 block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          {[
            "acoustic_grand_piano", "electric_piano_1", "violin", "cello", "flute", "clarinet",
            "trumpet", "alto_sax", "electric_guitar_clean", "electric_bass_pick", "percussion"
          ].map((instrument) => (
            <option key={instrument} value={instrument}>{instrument.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 flex items-center">
          <Volume2 className="mr-1 w-4 h-4" /> Volume
        </label>
        <input
          type="range"
          min="-60"
          max="0"
          value={volume}
          onChange={(e) => onVolumeChange(parseInt(e.target.value))}
          className="mt-1 block w-full"
        />
      </div>
    </div>
  );
};