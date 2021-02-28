import "./styles.css";
import { useObservable } from "rxjs-hooks";
import midiKeysObservable from "./midi-keys-observable";
import { detect, chordScales, extended, reduced } from "@tonaljs/chord";
import { midiToNoteName } from "@tonaljs/midi";
import AbcNotation from "@tonaljs/abc-notation";
import { Notation } from "react-abc";
import Note from "@tonaljs/note";
import React from "react";
import Harmonagon from "./harmonagon";
import parseColor from "parse-color";

export default function App() {
  const keys = useObservable(() => midiKeysObservable());
  const [interval, setInterval] = React.useState("P5");
  const midiKeys = keys || [];
  const notes = midiKeys.map(midiToNoteName);
  const chords = detect(notes);
  const abcChord = chords.length >= 1 ? chords[0] : "";
  let colorScheme = {
    tertiary: parseColor("hsla(50,70,70,1)").hex,
    primary: parseColor("hsla(00,70,70,1)").hex,
    secondary: parseColor("hsla(45,70,85,1)").hex
  };
  let abcNotes = notes.map(AbcNotation.scientificToAbcNotation);
  let abcChordNotation = `${
    abcChord === "" ? "" : '"' + abcChord + '"'
  }[${abcNotes.join("")}]`;
  let abcNotesNotation = `[${abcNotes.join("")}]`;
  return (
    <div className="App">
      <h1
        style={{
          color: "white",
          padding: "1em",
          background: colorScheme.primary,
          textAlign: "center",
          fontSize: "2em"
        }}
      >
        {chords.length === 0 ? "(No chord)" : chords.join(" or ")}
      </h1>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyItems: "center"
        }}
      >
        <div style={{ float: "none" }}>
          <Harmonagon
            interval={interval}
            baseNote={"C"}
            accidentals="b"
            scale={1}
            notes={notes.map(Note.pitchClass)}
            width={window.innerWidth / 2}
            height={200}
          />
          <div style={{ textAlign: "center", marginTop: "1em" }}>
            {["m2", "P5"].map((n) => (
              <label style={{ padding: "0.5em" }}>
                <input
                  type="radio"
                  name="interval"
                  value={n}
                  checked={n === interval}
                  onChange={(e) => {
                    setInterval(e.target.value);
                    console.log(e.target.value);
                  }}
                />
                {n}
              </label>
            ))}
          </div>
        </div>
        <div>
          <Notation
            engraverParams={{
              scale: 1.66
            }}
            notation={abcNotesNotation === "[]" ? "[' ']" : abcNotesNotation}
          />
        </div>
      </div>
    </div>
  );
}
