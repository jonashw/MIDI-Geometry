import "./styles.css";
import { useObservable } from "rxjs-hooks";
import midiKeysObservable from "./midi-keys-observable";
import { detect, chordScales, extended, reduced } from "@tonaljs/chord";
import { midiToNoteName } from "@tonaljs/midi";
import AbcNotation from "@tonaljs/abc-notation";
import { Notation } from "react-abc";
import Note from "@tonaljs/note";

import CircleOfFifths from "./circle-of-fifths";
export default function App() {
  const keys = useObservable(() => midiKeysObservable());

  const midiKeys = keys || [];
  const notes = midiKeys.map(midiToNoteName);
  const chords = detect(notes);
  const abcChord = chords.length >= 1 ? chords[0] : "";
  let abcNotes = notes.map(AbcNotation.scientificToAbcNotation);
  let abcChordNotation = `${
    abcChord === "" ? "" : '"' + abcChord + '"'
  }[${abcNotes.join("")}]`;
  const json = (o) => <pre>{JSON.stringify(o, null, 2)}</pre>;
  return (
    <div className="App">
      <div style={{ float: "right" }}>
        <CircleOfFifths
          baseNote={"C"}
          accidentals="b"
          notes={notes.map(Note.pitchClass)}
          width={window.innerWidth / 2}
          height={200}
        />
      </div>
      <div>Notes:</div>
      {json(notes.join(" "))}
      <div>ABC notation:</div>
      {json(abcNotes.join(" "))}
      <Notation notation={abcChordNotation} />
      <div>Chords:</div>
      {json(chords.join(" "))}
      <div>Reduced chords:</div>
      {json(detect(notes).map((c) => reduced(c).join(" ")))}
      <div>Extended chords:</div>
      {json(detect(notes).map((c) => extended(c).join(" ")))}
      <div>Scales:</div>
      {json(detect(notes).map(chordScales))}
    </div>
  );
}
