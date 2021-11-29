import React from 'react';
import { FormalLanguage } from '../../../formalLangLib/src/js/formalLanguage';
import { FormalLanguageEditor, MouseLoc } from './formalLanguageEditor';
import { BadLanguage } from '../../../formalLangLib/src/js/badLanguage';
import { fabric } from 'fabric';
import { LanguageRendering } from './renderings/renderedLanguage';
import { BadLanguageRendering } from './renderings/renderedBadLanguage';




interface BadLanguageEditorProps {
    parent: FormalLanguageEditor;
    selected: fabric.Object | null;
    language: LanguageRendering;
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
        this.rendering = this.props.language as BadLanguageRendering;
    }

    parent: FormalLanguageEditor;
    rendering: BadLanguageRendering;

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
                        {this.rendering.render()}
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

