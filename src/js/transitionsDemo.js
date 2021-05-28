var canvas = new fabric.Canvas('transitionsDemo');

var state1 = new AutomatonState("0", canvas, {left: 100, top: 100});

var state2 = new AutomatonState("9999", canvas, {left: 200, top: 300});

var state3 = new AutomatonState("abc", canvas, {left: 250, top: 100});

var transition13 = new Transition(state1, state3, {label: "text", curved: false} );
var transition21 = new Transition(state2, state1, {label: "a\nb\nc", curved: false} );
var transition23 = new Transition(state2, state3, {label: "99->abc", curved: true} );
var transition32 = new Transition(state3, state2, {label: "abc->99", curved: true} );

var transition11 = new AutomatonTransition("1->1", state1, state1, canvas);


canvas.add(transition13);
canvas.add(transition21);
canvas.add(transition23);
canvas.add(transition32);

canvas.renderAll();

