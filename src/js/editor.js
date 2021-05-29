var canvas = new fabric.Canvas('editorView');

class ComponentEditor {
    constructor(editor,automaton) {
        this.editor = editor;
        this.automaton = automaton;
    }

    appliesTo() {
        return 'None';
    }

    activateEditorFor(rendering) {
        if (rendering.type == this.appliesTo()) {
            if (this.editor.status != this.appliesTo) {
                this.reveal(rendering);
            }
            return true;
        } else {
            this.hide();
            return false;
        }
    }

    fill(rendering) {

    }

    apply() {

    }

}

class StateEditor extends  ComponentEditor {
    constructor(editor,automaton) {
        super(editor,automaton);
    }

    appliesTo() {
        return 'State';
    }

    reveal(rendering) {
        let stateEditor = document.getElementById('stateEditor');
        stateEditor.style.display = 'block';
        this.editor.displayMessage("State: " + rendering.label);
    }

    hide() {
        let stateEditor = document.getElementById('stateEditor');
        stateEditor.style.display = 'none';
    }

    
    fill() {
        let state = this.editor.editing;
        document.getElementById('state_label').value = state.label;
        document.getElementById('stateIsFinal').checked = state.final;
        document.getElementById('stateIsInitial').checked = state.initial;
    }

    apply() {
        let s = this.editor.editing;
        s.label = document.getElementById('state_label').value;
        s.final = document.getElementById('stateIsFinal').checked;
        s.initial = document.getElementById('stateIsInitial').checked;
        this.editor.render();
    }

    deleteState() {
        if (this.editor.editing) {
            let removed = this.editor.editing;
            this.automaton.removeState(this.editor.editing);
            this.editor.reset();
            this.editor.displayMessage("Removed state " + removed.label);
            this.editor.render();
        }
    }
}



class TransitionEditor extends  ComponentEditor {
    constructor(editor,automaton) {
        super(editor,automaton);
    }

    appliesTo() {
        return 'Transition';
    }

    reveal(rendering) {
        let transitionEditor = document.getElementById('transitionEditor');
        transitionEditor.style.display = 'block';
        this.editor.displayMessage("From " + rendering.from.label + " to " + rendering.to.label);
    }

    hide() {
        let transitionEditor = document.getElementById('transitionEditor');
        transitionEditor.style.display = 'none';
    }

    
    fill() {
        let label = this.editor.editing.label;
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




    apply() {
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
            this.editor.editing.label = label;
        } else {
            let removed = this.editor.editing;
            this.automaton.removeTransition(removed);
            this.editor.reset();
            this.editor.displayMessage("Removed transition from " + removed.from.label + " to " + removed.to.label);
            this.editor.render();

        }
        this.editor.render();
    }

}




class Editor {
    constructor(canvas) {
        this._canvas = canvas;
        this._automaton = new Automaton(canvas);
        this._editors = {};

        this._editors.stateEditor = new StateEditor(this, this._automaton);
        this._editors.transitionEditor =  new TransitionEditor(this, this._automaton);
        this.status = 'new';
        this.activeEditor = null;
        this.selected(this);

        this._automaton.addState(100, 100);
        this._automaton.addState(200, 200);
        this._automaton.addTransition("0", "1", "0 => 1");
        this._automaton.addTransition("1", "0", "1 => 0");
        this._automaton.addTransition("1", "1", "1 => 1");
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

    reset() {
        let editor;
        for (const editor in this._editors) {
            this._editors[editor].hide();
        }
        this.editing = null;
        this.activeEditor = null;
        this.status = '';
    }

    selected(target) {
        let editor;
        for (const editor in this._editors) {
            let componentEditor = this._editors[editor];
            if (componentEditor) {
               let active = componentEditor.activateEditorFor(target);
                if (active) {
                    this.status = componentEditor.appliesTo();
                    this.activeEditor = componentEditor;
                    this.editing = target.renderingOf;
                    componentEditor.fill();
                }
            }
        }
    }

    displayMessage(msg) {
        let msgsDiv = document.getElementById('messages');
        msgsDiv.innerHTML = msg;
    }

}

var editor = new Editor(canvas);


canvas.on('mouse:down', function(event) {
    if (event.target) {
        editor.selected(event.target);
    }
  });

editor.render();
