var canvas = new fabric.Canvas('editorView');




class Editor {
    constructor(canvas) {
        this._canvas = canvas;
        this._automaton = new Automaton();
        this._automaton.addState();
        this._automaton.addState();
        this._automaton.addTransition("0", "1", "0 => 1");
        this._automaton.addTransition("1", "0", "1 => 0");
        this._automaton.addTransition("1", "1", "1 => 1");
    }

    render() {
        this._automaton.render(this._canvas);
        this._canvas.renderAll();
    }


    selected(target) {
        if (target.type == "State") {
            this.startStateEditor(target);
        } else if (target.type == "Transition") {
            this.startTransitionEditor(target);
        }
    }

    startStateEditor(state) {

    }

    startTransitionEditor(transition) {

    }
}

var editor = new Editor(canvas);

canvas.on('mouse:down', function(event) {
    if (event.target) {
        console.log ('clicked on ' + event.target.type + ": " + event.target.label);
        editor.selected(event.target);
    }
  });

editor.render();
