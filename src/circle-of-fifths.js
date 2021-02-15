import Note from "@tonaljs/note";
import { Transform } from "konva";
import React from "react";
import { Stage, Layer, Text, Circle, Group, Line } from "react-konva";
export default ({ baseNote, notes, width, height, accidentals }) => {
  const r = Math.min(width, height) / 2 - 5;
  //const notes = ["B", "G", "Eb"];
  const fifths = Array(12)
    .fill(null)
    .map((_, i) => Note.transposeFifths(baseNote, i))
    .map(Note.simplify)
    .map((f, i) => {
      let enharmonics = Array.from(new Set([f, Note.enharmonic(f)]));
      var rotation = 180 + (i * 360) / 12;

      let t = new Transform();

      t.rotate((Math.PI * rotation) / 180);
      return {
        i,
        rotation,
        p: t.point({ x: 0, y: r - 25 }),
        enharmonics,
        chroma: Note.chroma(f),
        label:
          enharmonics.length === 1
            ? enharmonics[0]
            : (accidentals !== "b" && accidentals !== "#"
                ? enharmonics
                : enharmonics.filter((e) => e.indexOf(accidentals) > -1)
              ).join("/")
      };
    });

  let playingFifths = fifths.filter((f) =>
    f.enharmonics.some((e) => notes.indexOf(e) > -1)
  );

  const coords = playingFifths.map((f) => f.p);
  const edges = coords.reduce(
    (state, c) => {
      if (state.last) {
        state.pairs.push([state.last, c]);
      }
      state.last = c;
      return state;
    },
    {
      last: coords.length <= 1 ? undefined : coords[coords.length - 1],
      pairs: []
    }
  ).pairs;

  return (
    <div>
      <Stage height={height} width={width}>
        <Layer>
          <Group x={width / 2} y={height / 2}>
            {edges.map(([a, b]) => (
              <Line
                points={[a.x, a.y, b.x, b.y]}
                stroke={"blue"}
                strokeWidth={1}
                lineJoin="round"
              />
            ))}
          </Group>

          <Circle
            radius={r - 25}
            x={width / 2}
            y={height / 2}
            strokeWidth={1}
            stroke={"black"}
          />

          {fifths.map((f, i) => {
            var rotation = f.rotation;
            let w = 45;
            let h = 20;
            let playing = f.enharmonics.some((e) => notes.indexOf(e) > -1);
            return (
              <Group rotation={rotation} key={i} x={width / 2} y={height / 2}>
                {playing && (
                  <Circle
                    stroke="blue"
                    strokeWidth={1}
                    fill="white"
                    radius={6}
                    y={r - 25}
                  />
                )}

                <Group x={0} y={r - 15}>
                  <Text
                    x={0}
                    y={10}
                    height={h}
                    width={w}
                    offsetX={w / 2}
                    offsetY={h / 2}
                    align="center"
                    verticalAlign="middle"
                    rotation={-rotation}
                    fontSize={12}
                    text={f.label}
                    fill={"black"}
                  />
                </Group>
              </Group>
            );
          })}
        </Layer>
      </Stage>
      {/*
      <pre>{JSON.stringify(edges, null, 2)}</pre>
      */}
    </div>
  );
};
