import Note from "@tonaljs/note";
import { Transform } from "konva";
import React from "react";
import { Stage, Layer, Text, Circle, Group, Line } from "react-konva";
import parseColor from "parse-color";

export default ({
  scale,
  interval,
  baseNote,
  notes,
  width,
  height,
  accidentals
}) => {
  scale = scale || 1;
  const r = Math.min(width, height) / 2 - 5;
  //const notes = ["B", "G", "Eb"];
  const fifths = Array(12)
    .fill(null)
    .reduce(
      (ns, _, i) => {
        let prevNote = ns[ns.length - 1];
        ns.push(Note.transpose(prevNote, interval));
        return ns;
      },
      [baseNote]
    )
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
        playing: enharmonics.some((e) => notes.indexOf(e) > -1),
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
  console.log();
  let colorScheme = {
    tertiary: parseColor("hsla(50,70,70,1)").hex,
    primary: parseColor("hsla(00,70,70,1)").hex,
    secondary: parseColor("hsla(45,70,85,1)").hex
  };
  let points = coords.reduce((cs, c) => [...cs, c.x, c.y], []);
  return (
    <div>
      <Stage
        height={height}
        width={width}
        scale={((s) => ({ x: s, y: s }))(scale)}
      >
        <Layer>
          <Group x={width / 2} y={height / 2}>
            <Circle
              radius={r - 25}
              key="the-Circle"
              fill={colorScheme.secondary}
              strokeWidth={12}
              stroke={colorScheme.secondary}
            />

            <Line
              key="FILL"
              points={points}
              tension={0.0}
              closed
              strokeWidth={2}
              stroke={colorScheme.primary}
              fill={"white"}
              /*stroke={"black"}
              fillLinearGradientStartPoint={{ x: -50, y: -50 }}
              fillLinearGradientEndPoint={{ x: 50, y: 50 }}
              fillLinearGradientColorStops={[0, "red", 1, "yellow"]}
              */
            />

            {fifths.map((f, i) => {
              var rotation = f.rotation;

              let y = r / 1.33;
              return (
                <Group rotation={rotation} key={i}>
                  <Group x={0} y={y}>
                    <Circle
                      fill={
                        f.playing ? colorScheme.primary : colorScheme.secondary
                      }
                      radius={16}
                    />
                  </Group>
                </Group>
              );
            })}

            {fifths.map((f) => {
              let w = 45;
              let h = 20;
              return (
                <Text
                  x={f.p.x}
                  y={f.p.y}
                  height={h}
                  width={w}
                  fontStyle={f.playing ? "bold" : ""}
                  offsetX={w / 2}
                  offsetY={h / 2}
                  align="center"
                  verticalAlign="middle"
                  fontSize={12}
                  text={f.label}
                  fill={f.playing ? "white" : "black"}
                />
              );
            })}
          </Group>
        </Layer>
      </Stage>
      {/*
      <pre>{JSON.stringify(edges, null, 2)}</pre>
      */}
    </div>
  );
};
