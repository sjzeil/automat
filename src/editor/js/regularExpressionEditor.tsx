import React from 'react';
import { FormalLanguage } from '../../shared/js/formalLanguage';
import { FormalLanguageEditor, MouseLoc } from './formalLanguageEditor';
import { RegularExpression } from '../../shared/js/regularExpression';
import { fabric } from 'fabric';




interface RegularExpressionEditorProps {
    parent: FormalLanguageEditor;
    selected: fabric.Object | null;
    language: FormalLanguage;
}

interface RegularExpressionEditorState {
    status: string;
    partialInput: string;
    error: string;
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
        };
        this.parent = props.parent;
        this.startTest = this.startTest.bind(this);
        this.inputChanged = this.inputChanged.bind(this);
        this.language = this.props.language as RegularExpression;
    }

    parent: FormalLanguageEditor;
    language: RegularExpression;

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
        this.language.regexp = newRE;
        this.setState({
            partialInput: newRE,
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
                        {this.language.render()}
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

