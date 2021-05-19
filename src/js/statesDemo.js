var canvas = new fabric.Canvas('statesDemo');

var state1 = new State({label: "0", left: 100, top: 100, initial: true});
console.log("state1: " + state1);

var state2 = new State({label: "9999", left: 200, top: 200, selected: true, final: true});


canvas.add(state1);
canvas.add(state2);


canvas.renderAll();

