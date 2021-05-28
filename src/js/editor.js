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
        }
        this.displayMessage("State: " + state.label);
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
        }
        this.displayMessage("From " + transition.from.label + " to " + transition.to.label);
        this._editing = transition.renderingOf;
        this.fillTransitionEditor ();
        this.render();
    }

    fillTransitionEditor() {
        let label = this._editing.label;
        let options = label.split("\n");
        let selector = document.getElementById('transition_selection');
        while (selector.hasChildNodes()) {
            selector.removeChild(selector.lastChild);
        }
        let trigger;
        for (trigger of options) {
            let newOption = document.createElement('option');
            selector.appendChild(newOption);
            newOption.innerHTML = trigger;
        }
    }

    selectedTransitionOption() {
        let selector = document.getElementById('transition_selection');
        let selectedValue = selector.options[selector.selectedIndex].value;
        let labelBox = document.getElementById('transition_label');
        labelBox.value = selectedValue;
    }

    addTransitionOption() {
        let selector = document.getElementById('transition_selection');
        let selectedOption = selector.options[selector.selectedIndex];
        let labelBox = document.getElementById('transition_label');
        if (labelBox.value != '')
        {
            let newOption = document.createElement('option');
            selector.appendChild(newOption);
            newOption.innerHTML = labelBox.value;
        }
    }

    replaceTransitionOption() {
        let selector = document.getElementById('transition_selection');
        let selectedOption = selector.options[selector.selectedIndex];
        let labelBox = document.getElementById('transition_label');
        if (labelBox.value == '')
        {
            this.removeTransitionOption();
        } else {
            selectedOption.innerHTML = labelBox.value;
        }
    }

    removeTransitionOption() {
        let selector = document.getElementById('transition_selection');
        let selectedOption = selector.options[selector.selectedIndex];
        let labelBox = document.getElementById('transition_label');
        selector.removeChild(selectedOption);
        labelBox.value="";
    }

    applyTransitionChanges() {
        let selector = document.getElementById('transition_selection');
        let options = selector.childNodes;
        let option;
        let label="";
        let first=true;
        for (option of options) {
            if (!first) {
                label += "\n";
            }
            first = false;
            label += option.innerHTML;
        }
        if (label != '') {
            this._editing.label = label;
        } else {
            this._automaton.removeTransition(this._editing);
        }
        this.render();
    }
}

var editor = new Editor(canvas);


canvas.on('mouse:down', function(event) {
    if (event.target) {
        editor.selected(event.target);
    }
  });

editor.render();
