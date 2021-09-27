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
import { BadLanguageEditor } from './badLanguageEditor';
import { FormalLanguage } from '../../shared/js/formalLanguage';
import LZUTF8 from 'lzutf8';
import { RegularExpression } from '../../shared/js/regularExpression';
import { BadLanguage } from '../../shared/js/badLanguage';


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
  user: string;
  problemID: string;
  lock: string;
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

    this.language = new FormalLanguage(props.canvas, props.user);

    let thisFLE = this;

    props.canvas.on('mouse:down', function (this: fabric.Canvas, event: any) {
      let evt = event.e as any;
      if (evt.altKey === true) {
        let thisCanvas = this as any;
        thisCanvas.isDragging = true;
        thisCanvas.selection = false;
        thisCanvas.lastPosX = evt.clientX;
        thisCanvas.lastPosY = evt.clientY;
      } else {
        if (event.target) {
          thisFLE.selected(event.target);
        } else {
          let thisCanvas = this as any;
          let eventDetails = event.e as any;
          var vpt = thisCanvas.viewportTransform;
          thisFLE.clicked(eventDetails.offsetX-vpt[4], eventDetails.offsetY-vpt[5]);
        }
      }
    });

    props.canvas.on('mouse:move', function (this: fabric.Canvas, opt: any) {
      let thisCanvas = this as any;
      if (thisCanvas.isDragging) {
        var e = opt.e as any;
        var vpt = thisCanvas.viewportTransform;
        let dx = e.clientX - thisCanvas.lastPosX;
        let dy = e.clientY - thisCanvas.lastPosY;
        vpt[4] += dx;
        if (vpt[4] > 0) vpt[4] = 0;
        vpt[5] += dy;
        if (vpt[5] > 0) vpt[5] = 0;
        thisCanvas.requestRenderAll();
        thisCanvas.lastPosX = e.clientX;
        thisCanvas.lastPosY = e.clientY;
      }
    });
    props.canvas.on('mouse:up', function (this: fabric.Canvas, opt: any) {
      // on mouse up we want to recalculate new interaction
      // for all objects, so we call setViewportTransform
      let thisCanvas = this as any;
      thisCanvas.setViewportTransform(thisCanvas.viewportTransform);
      thisCanvas.isDragging = false;
      thisCanvas.selection = true;
    });


    this.newCFG = this.newCFG.bind(this);
    this.newFA = this.newFA.bind(this);
    this.newRE = this.newRE.bind(this);
    this.newPDA = this.newPDA.bind(this);
    this.newLanguage = this.newLanguage.bind(this);
    this.clicked = this.clicked.bind(this);
    this.selected = this.selected.bind(this);
    this.saveLanguage = this.saveLanguage.bind(this);
    this.loadLanguage = this.loadLanguage.bind(this);

    this.loadEncodedLang(props.docURL);

    this.blocked = false;
    if (this.language.createdBy != '' && this.props.user != 'Instructor' && this.language.createdBy != this.props.user) {
      this.blocked = !this.language.unlocked;
    }

  }

  language: FormalLanguage;
  blocked: boolean;


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
    let gradeButton = () => {
      let gButton = (<span></span>);
      if (this.props.problemID != "") {
          if ((this.props.user === "Instructor") || (this.props.lock == "")) {
            gButton = (<input type="button" value="Grade Report"
                        onClick={this.loadLanguage} 
                        disabled={this.state.status == "new"} />);
          }
        }
      return gButton;
      };
    return (
      <div className="editorToolbar">
        <input type="button" value="New" onClick={this.newLanguage} disabled={this.state.status == "new"} />
        <input type="button" value="Save" onClick={this.saveLanguage} disabled={this.state.status == "new"} />
        {gradeButton()}
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
    const queryString = encoded.split('?')[1];
    this.language = new FormalLanguage(this.props.canvas, this.props.user);
    if (queryString) {
      let urlParams = new URLSearchParams(queryString);
      if (urlParams.has('lang')) {
        let lang = urlParams.get('lang');
        let decoded = LZUTF8.decompress(lang, { inputEncoding: "Base64" });
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
      let lang = new Grammar(this.props.canvas, this.props.user);
      lang.fromJSon(jsonObj);
      this.state = {
        status: "grammar",
        oldStatus: "new",
        editing: null,
        clicked: null,
      }
      return lang;
    } else if (jsonObj.specification == "regexp") {
      let lang = new RegularExpression(this.props.canvas, this.props.user);
      lang.fromJSon(jsonObj);
      this.state = {
        status: "regexp",
        oldStatus: "new",
        editing: null,
        clicked: null,
      }
      return lang;
    }
    return new FormalLanguage(this.props.canvas, this.props.user);
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
      } else if (this.state.status == "badLang") {
        selected = (<BadLanguageEditor parent={this} selected={null} language={this.language as FormalLanguage} />);
      } else {
        selected = (<div>Bad status: {this.state.status}</div>);
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
    this.props.canvas.clear();
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
   newPDA() {
    console.log("in newPDA");
    this.props.canvas.clear();
    this.language = new BadLanguage(this.props.canvas, this.props.user, "PDAs are not yet implemented");
    this.setState({
      status: "badLang",
      editing: null,
      clicked: null,
    });
  }

  /**
     * Create a new automaton and set up the automaton editor.
     */
  newCFG() {
    console.log("in newCFG");
    this.props.canvas.clear();
    this.language = new Grammar(this.props.canvas, this.props.user);
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
    this.props.canvas.clear();
    this.language = new RegularExpression(this.props.canvas, this.props.user);
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