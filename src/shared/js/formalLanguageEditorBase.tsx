import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';

export
class FormalLanguageModel {
    representation : string;
    parent: FormalLanguageEditorBase;
    state: string;

    /**
     * Base class for specific formal language editors.
     * 
     * @param representation0 a string indicating whether this is an automaton, grammar,
     *                        regexp, or other specialized type
     * @param parent0         the master FL editor 
     */
    constructor(representation0 : string, parent0: FormalLanguageEditorBase) {
        this.representation = representation0;
        this.parent = parent0;
        this.state = "new";
    }

    /**
     * 
     * @returns {ReactNode} HTML representation for this editor
     */
    render() {
        return (<span>Override</span>);
    }
}

export
type EditorProps = {
    canvas: fabric.Canvas,
    docURL: string;
    user: string | null;
    problemID: string | null;
};

/**
 * Base class for the main editor container.
 */
export
class FormalLanguageEditorBase extends React.Component {
    canvas: fabric.Canvas;
    formalLanguage: FormalLanguageModel | null;
    state: string;
    innerState: string;
    beingEdited: fabric.Object | null;

    constructor(props :  EditorProps) {
        super(props);
        this.canvas = props.canvas;
        this.formalLanguage = null;
        this.state = "new";
        this.innerState = "";
        this.beingEdited = null;
    }
}
