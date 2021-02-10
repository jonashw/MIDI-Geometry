import Note from "@tonaljs/note";
import { Stage, Layer, Text, Circle, Group } from "react-konva";
export default ({ baseNote, notes, width, height }) => {
  const fifths = Array(12)
    .fill(null)
    .map((_, i) => Note.transposeFifths(baseNote, i))
    .map(Note.simplify)
    .map((f) => {
      let enharmonics = Array.from(new Set([f, Note.enharmonic(f)]));
      return {
        enharmonics,
        label: enharmonics.join("/")
      };
    });
  const r = Math.min(width, height) / 2 - 5;
  return (
    <Stage height={height} width={width}>
      <Layer>
        <Circle radius={r - 25} x={width / 2} y={height / 2} stroke={"black"} />
        {fifths.map((f, i) => {
          var rotation = i * (360 / fifths.length);
          let w = 45;
          let h = 20;
          let playing = f.enharmonics.some((e) => notes.indexOf(e) > -1);
          return (
            <Group rotation={rotation} key={i} x={width / 2} y={height / 2}>
              {playing && <Circle fill="#ddddff" radius={10} y={r - 25} />}
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
  );
};
