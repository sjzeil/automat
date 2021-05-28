var canvas = new fabric.Canvas('automatonDemo');

var autom = new Automaton(canvas);

canvas.on('mouse:down', function(event) {
    if (event.target) {
        console.log ('clicked on ' + event.target.type + ": " + event.target.label);
    }
  });



{
    let s = autom.addState();
    console.log ("Added " + s + " with label " + s.label);
    autom.addState(200 * Math.random(), 200 * Math.random());
    autom.addState(200 * Math.random(), 200 * Math.random());
    autom.addState(200 * Math.random(), 200 * Math.random());
}

{
    let i;
    let j;
    for (i = 0; i < 4; ++i) {
        for (j = 0; j < 4; j+=2) {
            let tr = autom.addTransition(""+i, ""+j, "" + i + "=>" + j);
            if (tr == null) {
                console.log("Failed adding transition from " + i + " to " + j);
            }
        }
    }
}


canvas.renderAll();

