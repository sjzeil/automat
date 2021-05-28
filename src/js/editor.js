var canvas = new fabric.Canvas('editorView');




class Editor {
    constructor(canvas) {
        this._canvas = canvas;
        this._automaton = new Automaton(canvas);
        this._automaton.addState(100, 100);
        this._automaton.addState(200, 200);
        this._automaton.addTransition("0", "1", "0 => 1");
        this._automaton.addTransition("1", "0", "1 => 0");
        this._automaton.addTransition("1", "1", "1 => 1");
        this._status = 'new';
    }

    render() {
        this._canvas.renderAll();
    }

    logCanvasContents() {
        let ctr = 0;
        this._canvas.getObjects().forEach (
            function (targ) {
                ++ctr;
            }
        );
        console.log("Canvas has " + ctr + " objects");
    }

    selected(target) {
        if (target.type == "State") {
            this.startStateEditor(target);
        } else if (target.type == "Transition") {
            this.startTransitionEditor(target);
        }
    }

    displayMessage(msg) {
        let msgsDiv = document.getElementById('messages');
        msgsDiv.innerHTML = msg;
    }

    startStateEditor(state) {
        if (this._status != 'stateEditor') {
            this._status = 'stateEditor';
            let stateEditor = document.getElementById('stateEditor');
            let transitionEditor = document.getElementById('transitionEditor');
            stateEditor.style.display = 'block';
            transitionEditor.style.display = 'none';
            this.displayMessage("Add, delete, or change states.");
        }

        this._editing = state.renderingOf;
        this.fillStateEditor ();
        this.render();
    }

    
    fillStateEditor() {
        document.getElementById('state_label').value = this._editing.label;
        document.getElementById('stateIsFinal').checked = this._editing.final;
        document.getElementById('stateIsInitial').checked = this._editing.initial;
    }

    applyStateChanges() {
        let s = this._editing;
        s.label = document.getElementById('state_label').value;
        s.final = document.getElementById('stateIsFinal').checked;
        s.initial = document.getElementById('stateIsInitial').checked;
        this.render();
    }

    deleteState() {
        if (this._editing) {
            let removed = this._editing;
            this._automaton.removeState(this._editing);
            this._editing = null;
            let stateEditor = document.getElementById('stateEditor');
            stateEditor.style.display = 'none';
            this.displayMessage("Removed state " + removed.label);
            this._status = "";
            this._canvas.renderAll();
        }
    }

    startTransitionEditor(transition) {
        if (this._status != 'transitionEditor') {
            this._status = 'transitionEditor';
            let stateEditor = document.getElementById('stateEditor');
            let transitionEditor = document.getElementById('transitionEditor');
            stateEditor.style.display = 'none';
            transitionEditor.style.display = 'block';
            this.displayMessage("Add, delete, or change transitions.");
        }

    }
}

var editor = new Editor(canvas);


canvas.on('mouse:down', function(event) {
    if (event.target) {
        editor.selected(event.target);
    }
  });

editor.render();
