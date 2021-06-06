import React from 'react';
import ReactDOM from 'react-dom';

export {FLEditorState, FLLanguageModel};

class FLLanguageModel {
    representation : string;

    constructor(repr : string) {
        this.representation = repr;
    }
}

class FLEditorState {
    canvas: HTMLElement  | null;
    formalLanguage: FLLanguageModel;
    state: string;
    cEState: string;
    beingEdited: any;

    constructor(canvas : HTMLElement ) {
        this.canvas = canvas;
        this.formalLanguage = null;
        this.state = "new";
        this.cEState = "";
        this.beingEdited = null;
    }
}

