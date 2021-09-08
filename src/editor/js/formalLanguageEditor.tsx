import { fabric } from 'fabric';
import React from 'react';
import ReactDOM from 'react-dom';
import { NewLanguageEditor } from './newLanguageEditor';
import { AutomatonEditor } from './automatonEditor';
import { GrammarEditor } from './grammarEditor';
import { SaveEditor } from './saveEditor';
import { Grammar } from '../../shared/js/grammar';
import { Automaton } from '../../shared/js/automaton';
import { RegularExpressionEditor } from './regularExpressionEditor';
import { FormalLanguage } from '../../shared/js/formalLanguage';
import LZUTF8 from 'lzutf8';
import { RegularExpression } from '../../shared/js/regularExpression';


export class MouseLoc {
  x: number;
  y: number;

  constructor(x0: number, y0: number) {
    this.x = x0;
    this.y = y0;
  }
}

/*
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
  editing: any;
}
*/

export
  interface FLEProps {
  canvas: fabric.Canvas,
  docURL: string;
  user: string | null;
  problemID: string | null;
};

export
  interface FLEState {
  status: string;
  oldStatus: string;
  editing: fabric.Object | null;
  clicked: MouseLoc | null;
}

export
  class FormalLanguageEditor extends React.Component<FLEProps, FLEState> {

  constructor(props: FLEProps) {
    super(props);
    console.log("FormalLanguageEditor constructed");

    this.state = {
      status: "new",
      oldStatus: "new",
      editing: null,
      clicked: null,
    }

    this.language = new FormalLanguage(props.canvas);

    let thisFLE = this;

    props.canvas.on('mouse:down', function (event) {
      if (event.target) {
        thisFLE.selected(event.target);
      } else {
        let eventDetails = event.e as any;
        thisFLE.clicked(eventDetails.offsetX, eventDetails.offsetY);
      }
    });

    this.newCFG = this.newCFG.bind(this);
    this.newFA = this.newFA.bind(this);
    this.newRE = this.newRE.bind(this);
    this.newLanguage = this.newLanguage.bind(this);
    this.clicked = this.clicked.bind(this);
    this.selected = this.selected.bind(this);
    this.saveLanguage = this.saveLanguage.bind(this);
    this.loadLanguage = this.loadLanguage.bind(this);

    this.loadEncodedLang(props.docURL);
  }

  language: FormalLanguage | null;


  componentDidMount() {
    console.log("FormalLanguageEditor mounted");
  }

  componentDidUpdate() {
    console.log("FormalLanguageEditor updated");
  }

  componentWillUnmount() {
    console.log("FormalLanguageEditor unmounted");
  }

  toolbar() {
    return (
      <div className="editorToolbar">
        <input type="button" value="New" onClick={this.newLanguage} disabled={this.state.status == "new"} />
        <input type="button" value="Load" onClick={this.loadLanguage} />
        <input type="button" value="Save" onClick={this.saveLanguage} disabled={this.state.status == "new"} />
      </div>
    );
  }

  newLanguage() {
    this.setState({ status: 'new' });
  }
  loadLanguage() {
    this.setState({ status: 'loading' });
  }
  saveLanguage() {
    this.setState({
      oldStatus: this.state.status,
      status: 'saving',
    });
  }

  loadEncodedLang(encoded: string) {
    let protocolMark = encoded.indexOf('://');
    this.language = new FormalLanguage(this.props.canvas);
    if (protocolMark >= 0 && protocolMark < 8) {
      let languageIndicator = "?lang=";
      if (encoded.includes(languageIndicator)) {
        encoded = encoded.substr(encoded.indexOf(languageIndicator) + languageIndicator.length);
        let decoded = LZUTF8.decompress(encoded, { inputEncoding: "Base64" });
        let langObject = JSON.parse(decoded);
        this.language = this.loadLanguageFromJSon(langObject);
      }
    }
  }

  loadLanguageFromJSon(jsonObj: any): FormalLanguage {
    if (jsonObj.specification == "automaton") {
      let lang = new Automaton(this.props.canvas);
      lang.fromJSon(jsonObj);
      this.state = {
        status: "automaton",
        oldStatus: "new",
        editing: null,
        clicked: null,
      }
      return lang;
    } else if (jsonObj.specification == "grammar") {
      let lang = new Grammar(this.props.canvas);
      lang.fromJSon(jsonObj);
      this.state = {
        status: "grammar",
        oldStatus: "new",
        editing: null,
        clicked: null,
      }
      return lang;
    } else if (jsonObj.specification == "regexp") {
      let lang = new RegularExpression(this.props.canvas);
      lang.fromJSon(jsonObj);
      this.state = {
        status: "regexp",
        oldStatus: "new",
        editing: null,
        clicked: null,
      }
      return lang;
    }
    return new FormalLanguage(this.props.canvas);
  }

  render() {
    console.log("FormalLanguageEditor rendering");
    let selectedEditor = () => {
      let selected;
      if (this.state.status == "new") {
        selected = (<NewLanguageEditor parent={this} />);
      } else if (this.state.status == "automaton") {
        selected = (<AutomatonEditor parent={this} selected={this.state.editing} language={this.language as FormalLanguage} />);
      } else if (this.state.status == "grammar") {
        selected = (<GrammarEditor parent={this} selected={this.state.editing} language={this.language as FormalLanguage} />);
      } else if (this.state.status == "regexp") {
        selected = (<RegularExpressionEditor parent={this} selected={null} language={this.language as FormalLanguage} />);
      } else if (this.state.status == "saving") {
        selected = (<SaveEditor parent={this} language={this.language as FormalLanguage} />);
      } else {
        selected = (<div>Bad status {this.state.status}</div>);
      }
      return selected;
    };

    return (
      <div className="editorView">
        <React.Fragment>
          {this.toolbar()}
          {selectedEditor()}
        </React.Fragment>
      </div>
    );
  }

  /**
   * Create a new automaton and set up the automaton editor.
   */
  newFA() {
    console.log("in newFA");
    this.language = new Automaton(this.props.canvas);
    this.setState({
      status: "automaton",
      editing: null,
      clicked: null,
    });
  }

/**
   * Create a new automaton and set up the automaton editor.
   */
 newCFG() {
  console.log("in newCFG");
  this.language = new Grammar(this.props.canvas);
  this.setState({
    status: "grammar",
    editing: null,
    clicked: null,
  });
}

/**
   * Create a new regular expression and set up the regexp editor.
   */
 newRE() {
  console.log("in newRE");
  this.language = new RegularExpression(this.props.canvas);
  this.setState({
    status: "regexp",
    editing: null,
    clicked: null,
  });
}

  selected(obj: fabric.Object) {
    this.setState({
      editing: obj,
    });
  }

  clicked(x: number, y: number) {
    this.setState({
      clicked: new MouseLoc(x, y),
    });
  }

}