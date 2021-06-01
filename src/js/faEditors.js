
class ComponentEditor {
    constructor(editor) {
        this.editor = editor;
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

    hide() {

    }

}


class NewFAEditor extends ComponentEditor {
    constructor(editor) {
        super(editor);
        this.type = this.appliesTo();
    }



    appliesTo() {
        return "newFA";
    }

    reveal(rendering) {
        let addToolBar = document.getElementById('addAutomata');
        addToolBar.style.display = 'block';
        this.editor.displayMessage("");
    }

    hide() {
        let addToolBar = document.getElementById('addAutomata');
        addToolBar.style.display = 'none';
    }

    
    fill() {
    }

   
}



class StateAdder extends ComponentEditor {
    constructor(editor) {
        super(editor);
        this.type = this.appliesTo();
    }



    appliesTo() {
        return 'StateAdder';
    }

    reveal(rendering) {
        this.editor.displayMessage("Click to position new state.");
    }

    hide() {
    }

    
    fill() {
        let state = this.editor.editing;
        this.editor.awaitingClick = true;
    }

    clicked(x, y) {
        let newState = this.editor.formalLanguage.addState(x,y);
        this.editor.selected(newState.rendering);
    }
}

class StateEditor extends  ComponentEditor {
    constructor(editor) {
        super(editor);
    }

    appliesTo() {
        return 'State';
    }

    reveal(rendering) {
        let stateEditor = document.getElementById('stateEditor');
        stateEditor.style.display = 'block';
        let addToolBar = document.getElementById('addAutomata');
        addToolBar.style.display = 'block';
        this.editor.displayMessage("State: " + rendering.label);
    }

    hide() {
        let stateEditor = document.getElementById('stateEditor');
        stateEditor.style.display = 'none';
        let addToolBar = document.getElementById('addAutomata');
        addToolBar.style.display = 'none';
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
            this.editor.formalLanguage.removeState(this.editor.editing);
            this.editor.reset();
            this.editor.displayMessage("Removed state " + removed.label);
            this.editor.render();
        }
    }
}


class TransitionAdder extends ComponentEditor {
    constructor(editor) {
        super(editor);
        this.type = this.appliesTo();
        this.from = null;
        this.to = null;
    }



    appliesTo() {
        return 'TransitionAdder';
    }

    reveal(rendering) {
        this.editor.displayMessage("Click on a state to select the source of this transition.");
    }

    hide() {
    }

    
    fill() {
        this.editor.awaitingState = true;
    }

    clickedOnState(state) {
        if (!this.from) {
            this.from = state.renderingOf;
            this.editor.displayMessage("Click on a state to select the destination of this transition.");
            this.editor.awaitingState = true;
        } else {
            this.to = state.renderingOf;
            let tr = this.editor.formalLanguage.findTransition(this.from,this.to);
            if (!tr) {
                tr = this.editor.formalLanguage.addTransition(this.from.label, this.to.label, '\u03B5');
            }
            this.editor.selected(tr.getRendering());
            this.from = this.to = null;    
        }
    }
}


class TransitionEditor extends  ComponentEditor {
    constructor(editor) {
        super(editor);
    }

    appliesTo() {
        return 'Transition';
    }

    reveal(rendering) {
        let transitionEditor = document.getElementById('transitionEditor');
        transitionEditor.style.display = 'block';
        let addToolBar = document.getElementById('addAutomata');
        addToolBar.style.display = 'block';
        this.editor.displayMessage("From " + rendering.from.label + " to " + rendering.to.label);
    }

    hide() {
        let transitionEditor = document.getElementById('transitionEditor');
        transitionEditor.style.display = 'none';
        let addToolBar = document.getElementById('addAutomata');
        addToolBar.style.display = 'none';
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
            this.editor.formalLanguage.removeTransition(removed);
            this.editor.reset();
            this.editor.displayMessage("Removed transition from " + removed.from.label + " to " + removed.to.label);
            this.editor.render();

        }
        this.editor.render();
    }

}


