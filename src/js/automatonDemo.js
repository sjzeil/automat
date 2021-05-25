var canvas = new fabric.Canvas('automatonDemo');

var autom = new Automaton();

canvas.on('mouse:down', function(event) {
    if (event.target) {
        console.log ('clicked on ' + event.target.type + ": " + event.target.label);
    }
  });



{
    let s = autom.addState();
    console.log ("Added " + s + " with label " + s.label);
    autom.addState();
    autom.addState();
    autom.addState();
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

autom.render(canvas);

canvas.renderAll();

