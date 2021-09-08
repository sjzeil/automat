
class NewEditor extends ComponentEditor {
    constructor(editor) {
        super(editor);
        this.type = this.appliesTo();
    }



    appliesTo() {
        return "new";
    }

    reveal(rendering) {
        let stateEditor = document.getElementById('newLanguageEditor');
        stateEditor.style.display = 'block';
        this.editor.displayMessage("");
    }

    hide() {
        let stateEditor = document.getElementById('newLanguageEditor');
        stateEditor.style.display = 'none';
    }

    
    fill() {
    }

   
}


class URLLoader extends ComponentEditor {
    constructor(editor) {
        super(editor);
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
        let dataStart = savedURL.indexOf(pattern);
        if (dataStart >= 0) {
            savedURL = savedURL.substring(dataStart + pattern.length);
        }
        this.loadEncoded(savedURL);
        this.editor.selectEditor(this.editor);
    }

    loadEncoded(encodedLanguage) {
        let decoded = LZUTF8.decompress(encodedLanguage, {inputEncoding: "Base64"});
        let langObject = JSON.parse(decoded);
        this.editor.load(langObject);
        this.status = '';
    }
}


class Editor {
    constructor(canvas) {
        this._canvas = canvas;
        this.formalLanguage = null;
        this._editors = {};

        this._editors.newLangEditor = new NewEditor(this);
        this._editors.stateEditor = new StateEditor(this);
        this._editors.transitionEditor =  new TransitionEditor(this);
        this._editors.stateAdder = new StateAdder(this);
        this._editors.transitionAdder = new TransitionAdder(this);
        this._editors.urlLoader = new URLLoader(this);
        this._editors.newFAEditor = new NewFAEditor(this);
        
        this.type = 'new';
        this.status = 'new';
        this.activeEditor = null;
        this.selectEditor(this._editors.newLangEditor);

    }

    render() {
        this._canvas.renderAll();
    }

    logCanvasContents() {
        let ctr = 0;
        this._canvas.getObjects().forEach (
            function (target) {
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
            if (target.type == componentEditor.appliesTo()) {
                this.selectEditor(componentEditor, target);
            }
        }
    }


    selectEditor(desiredEditor, rendering) {
        let editor;
        for (const editor in this._editors) {
            let componentEditor = this._editors[editor];
            if (!Object.is(componentEditor, desiredEditor)) {
                componentEditor.hide();
            }
        }

        desiredEditor.reveal(rendering);
        this.activeEditor = desiredEditor;
        
        this.status = desiredEditor.appliesTo();
        this.editing = (rendering == null) ? null : rendering.renderingOf;
        desiredEditor.fill();

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
        this.selectEditor(this._editors.stateAdder, null);
    }

    addTransition()
    {
        this.selectEditor(this._editors.transitionAdder, null);
    }

    saveLanguage(url) {
        let json = this.formalLanguage.toJSon();
        let trimmedURL = url.split('?')[0];
        let encoded = LZUTF8.compress(json, {outputEncoding: "Base64"});
        let newURL = trimmedURL + '?lang=' + encoded;
        let msg = "<div>Save your language description by bookmarking this link for your <a href='"
            + newURL + "'>" + this.formalLanguage.representation() + "</a> or by right-clicking on" 
            + " it, copying the link URL, and then pasting it into a document of your choice."
            + "</div>"
            + "<div style='overflow-wrap: break-word;'>" + newURL + "</div>";
        this.displayMessage(msg);
    }

    loadLanguage() {
        this.selectEditor(this._editors.urlLoader, null);
    }

    load(json) {
        this.formalLanguage.clear();
        if (json.representation == 'automaton') {
            this.formalLanguage = new Automaton(this._canvas);
            this.formalLanguage.fromJSon(json);
        }
    }

    newLanguage() {
        this.formalLanguage = null;
        this.selectEditor(this._editors.newLangEditor, null);
    }

    newFA() {
        this.formalLanguage = new Automaton(this._canvas);
        this.selectEditor(this._editors.newFAEditor, null);
    }
}

