import React from 'react';
import { FormalLanguage } from '../../shared/js/formalLanguage';
import { FormalLanguageEditor, MouseLoc } from './formalLanguageEditor';
import { fabric } from 'fabric';
import LZUTF8 from 'lzutf8';
import { LanguageRendering } from '../../shared/js/renderedLanguage';




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
        return (
            <div>
                <div>
                    Save your formal language by right-clicking and copying  
                    <a href={saveURL} target="_blank"> this link address </a>
                    and bookmarking it or pasting it into a document of your choice.
                </div>
                <div className="wrapped">
                    {saveURL}
                </div>
                <div>
                    <input type="button" value="Back" onClick={this.goBack} />
                </div>
            </div>
        );
    }

    goBack() {
        this.parent.setState({
            status: this.parent.state.oldStatus,
        });
    }

    saveLanguage(url: string) {
        let trimmedURL = url.split('?')[0];
        const queryString = window.location.search;
        let urlParams = new URLSearchParams(queryString);
        urlParams.delete('lang');
        if (this.parent.rendering != null) {
            let encoded = this.parent.encodeLanguage();
            urlParams.append('lang', encoded);
            let newURL = trimmedURL + '?' + urlParams.toString();
            return newURL;
        } else {
            return trimmedURL;
        }
    }
}

