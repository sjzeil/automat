import React from 'react';
import ReactDOM from 'react-dom';
import { EditorProps, EditorState, FormalLanguageEditor } from './formalLanguageEditor';


export
    class AutomatonEditor extends React.Component<EditorProps,EditorState> {
    
        /**
         * Editor for an automaton
         * @param props editor properties
         */
    constructor(props: EditorProps) {
        super(props);
        this.state = {
            status: "new",
            selected1: null,
            selected2: null
        };
        this.parent = props.parent;
    }

    parent: FormalLanguageEditor;

    /**
     * 
     * @returns {ReactNode} HTML representation for this editor
     */
    render() {
        let mainEditor = this.parent; 
        return (
            <div className="editors">
                <div id="addAutomata" className="editorToolBar">
                    <input type="button" value="+State" onClick={this.addState} />
                    <input type="button" value="+Transition" onClick={this.addTransition} 
                       disabled={/*this.automaton.states.length > 0*/false}/>
                    <input type="button" value="Test" onClick={this.startTest} 
                       disabled={/*this.automaton.states.length > 0*/true}/>
                </div>
            </div>
        );
    }

    addState() {
        console.log("addState");
    }

    addTransition() {
        console.log("addTransition");
    }

    startTest() {

    }


}

