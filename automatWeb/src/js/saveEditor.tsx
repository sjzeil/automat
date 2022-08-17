import React from 'react';
import { FormalLanguage } from '../../../formalLangLib/src/js/formalLanguage';
import { FormalLanguageEditor, MouseLoc } from './formalLanguageEditor';
import { fabric } from 'fabric';
import LZUTF8 from 'lzutf8';
import { LanguageRendering } from './renderings/renderedLanguage';




interface SaveEditorProps {
    parent: FormalLanguageEditor;
    language: LanguageRendering;
}

interface SaveEditorState {
    status: string;
}


export
    class SaveEditor extends React.Component<SaveEditorProps, SaveEditorState> {

    /**
     * Editor for saving a formal language 
     * @param props editor properties
     */
    constructor(props: SaveEditorProps) {
        super(props);
        console.log("SaveEditor constructed");

        this.state = {
            status: "new",
        };
        this.parent = props.parent;
        this.goBack = this.goBack.bind(this);
    }

    parent: FormalLanguageEditor;

    componentDidMount() {
        console.log("SaveEditor mounted");
    }

    componentDidUpdate() {
        console.log("SaveEditor updated");
    }

    componentWillUnmount() {
        console.log("SaveEditor unmounting");
    }

    /**
     * 
     * @returns {ReactNode} HTML representation for this editor
     */
    render() {
        console.log("SaveEditor rendering");
        let saveURL = this.saveLanguage(window.location.href);
        if (this.parent.props.problemID != "") {
            return (
                <div>
                    Click the OK button to save your current language
                    for this problem and to make it available to the course
                    instructor for review. (This will replace any previously
                    saved language for the same problem.)
                    <div>
                        <input type="button" value="OK" onClick={this.goBack} />
                    </div>
                    <div> You can retrieve it later via the <i>Load</i> button
                    and can also access it at
                    <a href={saveURL} target="_blank"> this link address</a>.
                    </div>
                </div> 
            );
        } else {
            return (
                <div>
                    <div>
                        Save your formal language by right-clicking and copying
                        <a href={saveURL} target="_blank"> this link address </a>
                        and bookmarking it or pasting it into a document of your choice.
                    </div>
                    <div>
                        <input type="button" value="OK" onClick={this.goBack} />
                    </div>
                    <div className="wrapped">Or copy-and paste this URL directly: <br />{saveURL} </div>
                </div>
            );
        }
    }

    goBack() {
        /*
        this.parent.setState({
            status: this.parent.state.oldStatus,
        });
        */
        let url = this.parent.saveLanguageURL(window.location.href);
        window.location.replace(url);
    }

    saveLanguage(url: string) {
        let trimmedURL = url.split('?')[0];
        const queryString = window.location.search;
        let urlParams = new URLSearchParams(queryString);
        urlParams.delete('lang');
        if (this.parent.rendering != null) {
            let encoded = this.parent.encodeLanguage();
            urlParams.append('lang', encoded);
            urlParams.append('saved', '1');
            let newURL = trimmedURL + '?' + urlParams.toString();
            return newURL;
        } else {
            return trimmedURL;
        }
    }
}

