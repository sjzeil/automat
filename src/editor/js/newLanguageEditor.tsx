import React from 'react';
import ReactDOM from 'react-dom';
import { EditorProps, EditorState } from './formalLanguageEditor';


export
    class NewLanguageEditor extends React.Component<EditorProps, EditorState> {
    /**
     * Base class for specific formal language editors.
     * 
     * @param parent0         the master FL editor 
     */
    constructor(props: EditorProps) {
        super(props);
    }

    /**
     * 
     * @returns {ReactNode} HTML representation for this editor
     */
    render() {
        let mainEditor = this.props.parent as any; // FormalLanguageEditor
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

