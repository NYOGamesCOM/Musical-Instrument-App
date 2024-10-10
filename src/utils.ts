import * as Tone from 'tone';

export function getScaleNotes(scale: string, key: string): string[] {
  let notes: string[] = [];
  let baseFreq = Tone.Frequency(key).toFrequency();
  switch (scale) {
    case 'major':
      notes = Tone.Frequency(baseFreq).harmonize([0, 2, 4, 5, 7, 9, 11, 12]).map(n => n.toNote());
      break;
    case 'minor':
      notes = Tone.Frequency(baseFreq).harmonize([0, 2, 3, 5, 7, 8, 10, 12]).map(n => n.toNote());
      break;
    case 'blues':
      notes = Tone.Frequency(baseFreq).harmonize([0, 3, 5, 6, 7, 10, 12]).map(n => n.toNote());
      break;
    case 'pentatonic':
      notes = Tone.Frequency(baseFreq).harmonize([0, 2, 4, 7, 9, 12, 14, 16]).map(n => n.toNote());
      break;
    case 'chromatic':
      notes = Tone.Frequency(baseFreq).harmonize([...Array(13).keys()]).map(n => n.toNote());
      break;
    default:
      notes = [key];
  }
  return notes;
}

export function generateColors(count: number): string[] {
  let colors: string[] = [];
  for (let i = 0; i < count; i++) {
    let hue = (i * (360 / count)) % 360;
    colors.push(`hsla(${hue}, 100%, 50%, 0.5)`);
  }
  return colors;
}