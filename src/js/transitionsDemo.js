var canvas = new fabric.Canvas('transitionsDemo');

var state1 = new State({label: "0", left: 100, top: 100, initial: true});

var state2 = new State({label: "9999", left: 200, top: 300, final: true});

var state3 = new State({label: "abc", left: 250, top: 100, selected: true, annotation: "Look\nhere!"});

var transition13 = new Transition(state1, state3, {label: "text", curved: false} );
var transition21 = new Transition(state2, state1, {label: "a\nb\nc", curved: false} );
var transition23 = new Transition(state2, state3, {label: "99->abc", curved: true} );
var transition32 = new Transition(state3, state2, {label: "abc->99", curved: true} );


canvas.add(state1);
canvas.add(state2);
canvas.add(state3);
canvas.add(transition13);
canvas.add(transition21);
canvas.add(transition23);
canvas.add(transition32);


canvas.renderAll();

