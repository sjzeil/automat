import React from 'react';
import { FormalLanguage } from '../../../formalLangLib/src/js/formalLanguage';
import { FormalLanguageEditor, MouseLoc } from './formalLanguageEditor';
import { RegularExpression } from '../../../formalLangLib/src/js/regularExpression';
import { fabric } from 'fabric';
import { LanguageRendering } from './renderings/renderedLanguage';
import { RegularExpressionRendering } from './renderings/renderedRegularExpression';




interface RegularExpressionEditorProps {
    parent: FormalLanguageEditor;
    selected: fabric.Object | null;
    language: LanguageRendering;
}

interface RegularExpressionEditorState {
    status: string;
    partialInput: string;
    error: string;
    testInput: string;
    testResult: string;
}


export
    class RegularExpressionEditor extends React.Component<RegularExpressionEditorProps, RegularExpressionEditorState> {

    /**
     * Editor for a regular expression
     * @param props editor properties
     */
    constructor(props: RegularExpressionEditorProps) {
        super(props);
        console.log("RegularExpressionEditor constructed");

        this.state = {
            status: "new",
            partialInput: "",
            error: "",
            testInput: "",
            testResult: "",
        };
        this.parent = props.parent;
        this.startTest = this.startTest.bind(this);
        this.inputChanged = this.inputChanged.bind(this);
        this.testInputChanged = this.testInputChanged.bind(this);
        this.runTest = this.runTest.bind(this);
        this.rendering = this.props.language as RegularExpressionRendering;
    }

    parent: FormalLanguageEditor;
    rendering: RegularExpressionRendering;

    componentDidMount() {
        console.log("RegularExpressionEditor mounted");
    }

    componentDidUpdate() {
        console.log("RegularExpressionEditor updated");
    }

    componentWillUnmount() {
        console.log("RegularExpressionEditor unmounting");
    }

    inputChanged(newRE: string) {
        console.log("RegularExpressionEditor inputChanged");
        this.rendering.language.regexp = newRE;
        this.setState({
            partialInput: newRE,
        });
    }

    testInputChanged(newInput: string) {
        this.setState({
            testInput: newInput,
        });
    }

    runTest() {
        let result = this.rendering.language.test(this.state.testInput);
        let announcement = this.state.testInput + " was ";
        if (result.passed) {
            announcement = announcement + "accepted."
        } else {
            announcement = announcement + "rejected."
        }
        this.setState ({
            testResult: announcement,
        });
    }

    /**
     * 
     * @returns {ReactNode} HTML representation for this editor
     */
    render() {
        console.log("RegularExpressionEditor rendering");
        return (
            <React.Fragment>
                <div className="editors">
                    <h2>Regular expression</h2>
                    <div className="regexp">
                        {this.rendering.render()}
                    </div>
                    <div>
                        <input type="text" id="regexp_in" name="regexp_in" 
                                    onChange={(ev: React.ChangeEvent<HTMLInputElement>): void => this.inputChanged(ev.target.value)}
                                    value={this.state.partialInput}
                                    className="regexpIn"
                                    maxLength={100}
                                    />
                    </div>
                    <div className="explanation">
                        Enter a regular expression. Permitted characters are alphanumerics, '_', parentheses,
                        and the operators '*' and '+'. Type '@' to enter an &#x03B5;.
                    </div>
                    <div className="testing">
                        <h3>Testing</h3>
                        <div>
                            Input text:
                            <input type="text" id="regexp_text_in" name="regexp_text_in" 
                                    onChange={(ev: React.ChangeEvent<HTMLInputElement>): 
                                        void => this.testInputChanged(ev.target.value)}
                                    value={this.state.testInput}
                                    className="regexpIn"
                                    maxLength={100}
                                    />
                        </div>
                        <div>
                            <input type="button" value="Test" onClick={this.runTest}/>
                            <span> </span>
                            <span className="testResult">{this.state.testResult}</span>
                        </div>
                    </div>
                    <div className="errors">
                        {this.rendering.language.validate().errors}
                    </div>
                </div>
            </React.Fragment>
        );
    }



    startTest() {

    }





}

