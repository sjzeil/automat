import React from 'react';
import ReactDOM from 'react-dom';
import { FormalLanguageEditorBase, FormalLanguageModel } from '../../shared/js/formalLanguageEditorBase';


export
    class NewLanguageEditor extends FormalLanguageModel {
    /**
     * Base class for specific formal language editors.
     * 
     * @param parent0         the master FL editor 
     */
    constructor(parent0: FormalLanguageEditorBase) {
        super("newLanguage", parent0);
    }

    /**
     * 
     * @returns {ReactNode} HTML representation for this editor
     */
    render() {
        let mainEditor = this.parent as any; // FormalLanguageEditor
        return (
            <div className="editors">
                Create a new...
                <div className="centered">
                    <input type="button" value="Finite Automaton" onClick={mainEditor.newFA} />
                    <input type="button" value="Regular Expression" onClick={mainEditor.newRE} /><br />
                    <input type="button" value="Context-Free Grammar" onClick={mainEditor.newCFG} />
                    <input type="button" value="Push-Down Automaton" onClick={mainEditor.newPDA} /><br />
                    <input type="button" value="Turing Machine" onClick={mainEditor.newTM} />
                </div>
            </div>
        );
    }

}

