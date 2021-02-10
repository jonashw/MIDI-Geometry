import { interval, BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";

const midiKeysObservable = () => {
  let state = [];
  const value = interval(500).pipe(map((val) => val * 3));
  let subject = new BehaviorSubject(state);
  value.subscribe((v) => {
    //subject.next([v]);
  });

  const getInputs = (access) => Array.from(access.inputs.values());
  const listenToKeys = (input) => {
    input.onmidimessage = (e) => {
      console.log("midi message", e.data);
      let d = e.data;
      let note = d[1];
      switch (d[0]) {
        case 158: //144 had worked
          state = [...state, note];
          break;
        case 142: //128 had worked
          state = state.filter((n) => n !== note);
          break;
        default:
          break;
      }
      subject.next(state.sort());
    };
  };
  navigator.requestMIDIAccess().then(function (access) {
    let initialInputs = getInputs(access);
    console.log("access", initialInputs);
    if (initialInputs.length === 1) {
      listenToKeys(initialInputs[0]);
    }
    access.onstatechange = function (e) {
      let inputs = getInputs(access);
      if (e.port.state === "connected" && inputs.length === 1) {
        listenToKeys(inputs[0]);
      }
      console.log(
        e.port.name,
        e.port.manufacturer,
        e.port.state,
        access.inputs,
        access.outputs
      );
    };
  });

  return subject.asObservable();

  // Get lists of available MIDI controllers

  const inputs = Array.from(access.inputs.values());
  const outputs = Array.from(access.outputs.values());
  inputs[0].onmidimessage = (e) => {
    console.log("midimessage", e.data);
    let d = e.data;
    switch (d[0]) {
      case 144:
        console.log("Note On: ", noteNameFromId(d[1]));
        break;
      case 128:
        console.log("Note Off:", noteNameFromId(d[1]));
    }
  };
};

export default midiKeysObservable;
