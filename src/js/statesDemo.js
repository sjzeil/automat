var canvas = new fabric.Canvas('statesDemo');

var state1 = new State({label: "0", left: 100, top: 100, initial: true});
console.log("state1: " + state1);

var state2 = new State({label: "9999", left: 200, top: 200, selected: true, final: true});

var state3 = new State({label: "abc", left: 250, top: 100, annotation: "Look\nhere!"});


canvas.add(state1);
canvas.add(state2);
canvas.add(state3);

var state4 = new AutomatonState("4", canvas, {left: 100, top: 300});
state4.selected = true;


canvas.renderAll();

