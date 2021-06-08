import {fabric} from 'fabric';
import React from 'react';
import ReactDOM from 'react-dom';
import { NewLanguageEditor } from './newLanguageEditor';
import { AutomatonEditor } from './automatonEditor';



export
interface FLEProps {
    canvas: fabric.Canvas,
    docURL: string;
    user: string | null;
    problemID: string | null;
};

export
interface FLEState {
    canvas: fabric.Canvas;
    status: string;
    oldStatus: string;
    editor: React.Component<EditorProps, EditorState>;
}

export
interface EditorProps {
  parent: FormalLanguageEditor;
  specification: string;
}

export
interface EditorState {
  status: string;
  selected1: fabric.Object | null;
  selected2: fabric.Object | null;
}

export
class FormalLanguageEditor extends React.Component<FLEProps, FLEState> {

  constructor(props: FLEProps) {
    super(props);
    this.state = {
      canvas: props.canvas,
      status: "new",
      editor: new NewLanguageEditor({parent: this, specification: ""}),
      oldStatus: "new",
    }
    this.newFA = this.newFA.bind(this);
  }

  


  toolbar() {
    return (
      <div className="editorToolbar">
        <input type="button" value="New" onClick={this.newLanguage} />
        <input type="button" value="Load" onClick={this.loadLanguage} />
        <input type="button" value="Save" onClick={this.saveLanguage} disabled={this.state.editor.props.specification=="newLanguage"} />
      </div>
    );
  }

  newLanguage() {
    this.setState ({ status: 'new'});
  }
  loadLanguage() {
    this.setState ({ status: 'loading'});
  }
  saveLanguage() {
    this.setState ({ 
      oldStatus: this.state.status,
      status: 'saving',
    });
  }

  render() {
    const nop = <span></span>;
    return (
      <div className="editorView">
        {this.toolbar()}
        {this.state.editor.render()}
      </div>
    );
  }

  /**
   * Create a new automaton and set up the automaton editor.
   */
  newFA() {
    this.setState({
      editor: new AutomatonEditor({parent: this, specification: "FA"}),
      status: this.state.editor.props.specification,
    });
  }
}