var canvas = new fabric.Canvas('editorView');

class ComponentEditor {
    constructor(editor,formalLanguage) {
        this.editor = editor;
        this.formalLanguage = formalLanguage;
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

class StateAdder extends ComponentEditor {
    constructor(editor,formalLanguage) {
        super(editor,formalLanguage);
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
        let newState = this.formalLanguage.addState(x,y);
        this.editor.selected(newState.rendering);
    }
}

class StateEditor extends  ComponentEditor {
    constructor(editor,formalLanguage) {
        super(editor,formalLanguage);
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
            this.formalLanguage.removeState(this.editor.editing);
            this.editor.reset();
            this.editor.displayMessage("Removed state " + removed.label);
            this.editor.render();
        }
    }
}


class TransitionAdder extends ComponentEditor {
    constructor(editor,formalLanguage) {
        super(editor,formalLanguage);
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
            let tr = this.formalLanguage.findTransition(this.from,this.to);
            if (!tr) {
                tr = this.formalLanguage.addTransition(this.from.label, this.to.label, '?');
            }
            this.editor.selected(tr.getRendering());
            this.from = this.to = null;    
        }
    }
}


class TransitionEditor extends  ComponentEditor {
    constructor(editor,formalLanguage) {
        super(editor,formalLanguage);
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
            this.formalLanguage.removeTransition(removed);
            this.editor.reset();
            this.editor.displayMessage("Removed transition from " + removed.from.label + " to " + removed.to.label);
            this.editor.render();

        }
        this.editor.render();
    }

}


class URLLoader extends ComponentEditor {
    constructor(editor,formalLanguage) {
        super(editor,formalLanguage);
        this.type = this.appliesTo();
    }



    appliesTo() {
        return 'SavedURL';
    }

    reveal(rendering) {
        let transitionEditor = document.getElementById('urlLoader');
        transitionEditor.style.display = 'block';
        this.editor.displayMessage("Paste a saved language description into the box above and click Apply.");
    }

    hide() {
        let transitionEditor = document.getElementById('urlLoader');
        transitionEditor.style.display = 'none';
    }

    
    fill() {
    }

    apply() {
        let urlBox = document.getElementById('savedURLText');
        let savedURL = urlBox.value;
        let pattern = '?lang=';
        debugger;
        let dataStart = savedURL.indexOf(pattern);
        if (dataStart >= 0) {
            savedURL = savedURL.substring(dataStart + pattern.length);
        }
        let decoded = LZUTF8.decompress(savedURL, {inputEncoding: "Base64"});
        let langObject = JSON.parse(decoded);
        this.editor.load(langObject);
        this.status = 'new';
        this.editor.selected(this.editor);
    }
}


class Editor {
    constructor(canvas) {
        this._canvas = canvas;
        this._formalLanguage = new Automaton(canvas);
        this._editors = {};

        this._editors.stateEditor = new StateEditor(this, this._formalLanguage);
        this._editors.transitionEditor =  new TransitionEditor(this, this._formalLanguage);
        this._editors.stateAdder = new StateAdder(this, this._formalLanguage);
        this._editors.transitionAdder = new TransitionAdder(this, this._formalLanguage);
        this._editors.urlLoader = new URLLoader(this, this._formalLanguage);
        this.status = 'new';
        this.activeEditor = null;
        this.selected(this);

        this._formalLanguage.addState(100, 100);
        this._formalLanguage.addState(200, 200);
        this._formalLanguage.addTransition("0", "1", "0 => 1");
        this._formalLanguage.addTransition("1", "0", "1 => 0");
        this._formalLanguage.addTransition("1", "1", "1 => 1");
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

    clicked(x, y) {
        if (this.awaitingClick) {
            this.activeEditor.clicked(x,y);
            this.awaitingClick = false;
        }
    }

    clickedOnState(state) {
        if (this.awaitingState) {
            this.awaitingState = false;
            this.activeEditor.clickedOnState(state);
        }
    }

    displayMessage(msg) {
        let msgsDiv = document.getElementById('messages');
        msgsDiv.innerHTML = msg;
    }


    addState()
    {
        this.selected(this._editors.stateAdder);
    }

    addTransition()
    {
        this.selected(this._editors.transitionAdder);
    }

    saveLanguage(url) {
        let json = this._formalLanguage.toJSon();
        let trimmedURL = url.split('?')[0];
        let encoded = LZUTF8.compress(json, {outputEncoding: "Base64"});
        let newURL = trimmedURL + '?lang=' + encoded;
        let msg = "<div>Save your language description by bookmarking this link for your <a href='"
            + newURL + "'>" + this._formalLanguage.representation() + "</a> or by right-clicking on" 
            + " it, copying the link URL, and then pasting it into a document of your choice."
            + "</div>"
            + "<div style='overflow-wrap: break-word;'>" + newURL + "</div>";
        this.displayMessage(msg);
    }

    loadLanguage() {
        this.selected(this._editors.urlLoader);
    }

    load(json) {
        this._formalLanguage.clear();
        if (json.representation == 'formalLanguage') {
            this._formalLanguage = new Automaton(this._canvas);
            this._formalLanguage.fromJSon(json);
        }
    }
}

var editor = new Editor(canvas);


canvas.on('mouse:down', function(event) {
    if (event.target) {
        if (editor.awaitingState && event.target.type == 'State') {
            editor.clickedOnState(event.target);
        } else {
            editor.selected(event.target);
        }
    } else {
        editor.clicked(event.e.offsetX, event.e.offsetY);
    }
  });

editor.render();
