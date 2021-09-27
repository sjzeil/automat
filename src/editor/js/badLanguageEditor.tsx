import React from 'react';
import { FormalLanguage } from '../../shared/js/formalLanguage';
import { FormalLanguageEditor, MouseLoc } from './formalLanguageEditor';
import { BadLanguage } from '../../shared/js/badLanguage';
import { fabric } from 'fabric';




interface BadLanguageEditorProps {
    parent: FormalLanguageEditor;
    selected: fabric.Object | null;
    language: FormalLanguage;
}

interface BadLanguageEditorState {
    status: string;
    partialInput: string;
    error: string;
}


export
    class BadLanguageEditor extends React.Component<BadLanguageEditorProps, BadLanguageEditorState> {

    /**
     * Editor for a regular expression
     * @param props editor properties
     */
    constructor(props: BadLanguageEditorProps) {
        super(props);
        console.log("BadLanguageEditor constructed");

        this.state = {
            status: "new",
            partialInput: "",
            error: "",
        };
        this.parent = props.parent;
        this.startTest = this.startTest.bind(this);
        this.language = this.props.language as BadLanguage;
    }

    parent: FormalLanguageEditor;
    language: BadLanguage;

    componentDidMount() {
        console.log("BadLanguageEditor mounted");
    }

    componentDidUpdate() {
        console.log("BadLanguageEditor updated");
    }

    componentWillUnmount() {
        console.log("BadLanguageEditor unmounting");
    }

    
    /**
     * 
     * @returns {ReactNode} HTML representation for this editor
     */
    render() {
        console.log("BadLanguageEditor rendering");
        return (
            <React.Fragment>
                <div className="editors">
                    <h2>Error</h2>
                    <div className="regexp">
                        {this.language.render()}
                    </div>
                    
                    <div className="errors">
                        {this.state.error}
                    </div>
                </div>
            </React.Fragment>
        );
    }



    startTest() {

    }





}

