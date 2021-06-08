import fabric from 'fabric';
import React from 'react';
import ReactDOM from 'react-dom';
import { FormalLanguageEditorBase, FormalLanguageModel, EditorProps } from '../../shared/js/formalLanguageEditorBase';
import { NewLanguageEditor } from './newLanguageEditor';

export { FormalLanguageEditor };




class FormalLanguageEditor extends FormalLanguageEditorBase {

  constructor(props: EditorProps) {
    super(props);
    this._oldState = this.state;
    this.canvas = props.canvas;
    this.editor = new NewLanguageEditor(this);
  }

  _oldState: string;
  editor: FormalLanguageModel;


  toolbar() {
    return (
      <div className="editorToolbar">
        <input type="button" value="New" onClick={this.newLanguage} />
        <input type="button" value="Load" onClick={this.loadLanguage} />
        <input type="button" value="Save" onClick={this.saveLanguage} disabled={this.editor==null} />
      </div>
    );
  }

  newLanguage() {
    this.state = 'new';
  }
  loadLanguage() {
    this.state = 'loading';
  }
  saveLanguage() {
    this._oldState = this.state;
    this.state = 'saving';
  }

  render() {
    const nop = <span></span>;
    const editorDOM = (this.editor != null)? this.editor.render() : nop;
    return (
      <div className="editorView">
        {this.toolbar()}
        {editorDOM}
      </div>
    );
  }

  /**
   * Create a new automaton and set up the automaton editor.
   */
  newFA() {
    console.log("in newFA");
  }
}