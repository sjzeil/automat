import { fabric } from 'fabric';
import React, { DOMElement } from 'react';
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
import { LanguageRendering } from '../../shared/js/renderedLanguage';
import { RenderedLanguageFactory } from '../../shared/js/renderedLanguageFactory';
import { RegularExpression } from '../../shared/js/regularExpression';
import { BadLanguage } from '../../shared/js/badLanguage';
import { AutomatonRendering } from '../../shared/js/renderedAutomaton';
import { BadLanguageRendering } from '../../shared/js/renderedBadLanguage';
import { GrammarRendering } from '../../shared/js/renderedGrammar';
import { RegularExpressionRendering } from '../../shared/js/renderedRegularExpression';


export class MouseLoc {
  x: number;
  y: number;

  constructor(x0: number, y0: number) {
    this.x = x0;
    this.y = y0;
  }
}



export
  interface FLEProps {
  canvas: fabric.Canvas,
  docURL: string;
  user: string;
  problemID: string;
  lock: string;
  creatorName: any;
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

    this.rendering = new LanguageRendering(props.canvas, props.user, props.problemID);

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
          thisFLE.clicked(eventDetails.offsetX - vpt[4], eventDetails.offsetY - vpt[5]);
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
    this.gradeReport = this.gradeReport.bind(this);

    this.loadEncodedLang(props.docURL);

    if (props.creatorName) {
      props.creatorName.innerHTML = this.rendering.language.createdBy;
    }

    
  }

  rendering: LanguageRendering;
  

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
        gButton = (<input type="button" value="Grade Report"
          onClick={this.gradeReport}
          disabled={this.state.status == "new"} />);
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

  gradeReport() {
    let trimmedURL = this.props.docURL.split('?')[0];
    const queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    urlParams.delete('lang');
    if (this.rendering != null) {
      let encoded = this.rendering.encodeLanguage();
      urlParams.append('lang', encoded);
      urlParams.delete('action');
      urlParams.append('action', 'grading');
      let newURL = trimmedURL + '?' + urlParams.toString();
      window.location.href = newURL;
    }
  }

  loadEncodedLang(encoded: string) {
    const queryString = encoded.split('?')[1];
    this.rendering = new LanguageRendering(this.props.canvas, this.props.user, this.props.problemID);
    if (queryString) {
      let urlParams = new URLSearchParams(queryString);
      if (urlParams.has('lang')) {
        let lang = urlParams.get('lang');
        if (lang) {
          let factory = new RenderedLanguageFactory(this.props.canvas, this.props.user);
          this.rendering = factory.load(lang);
          this.state = {
            status: this.rendering.language.specification,
            oldStatus: "new",
            editing: null,
            clicked: null,
          }
        }

      }
    }
  }

  encodeLanguage() {
    if (this.rendering != null) {
      return this.rendering.encodeLanguage();
    } else {
      return "";
    }
  }

  render() {
    console.log("FormalLanguageEditor rendering");
    let selectedEditor = () => {
      let selected;
      if (this.state.status == "new") {
        selected = (<NewLanguageEditor parent={this} />);
      } else if (this.state.status == "automaton") {
        selected = (<AutomatonEditor parent={this} selected={this.state.editing} language={this.rendering} />);
      } else if (this.state.status == "grammar") {
        selected = (<GrammarEditor parent={this} selected={this.state.editing} language={this.rendering} />);
      } else if (this.state.status == "regexp") {
        selected = (<RegularExpressionEditor parent={this} selected={null} language={this.rendering} />);
      } else if (this.state.status == "saving") {
        selected = (<SaveEditor parent={this} language={this.rendering} />);
      } else if (this.state.status == "badLang") {
        selected = (<BadLanguageEditor parent={this} selected={null} language={this.rendering} />);
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
    this.rendering = new AutomatonRendering(this.props.canvas, this.props.user, this.props.problemID);
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
    this.rendering = new BadLanguageRendering(this.props.canvas, this.props.user, "PDAs are not yet implemented");
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
    this.rendering = new GrammarRendering(this.props.canvas, this.props.user, this.props.problemID);
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
    this.rendering = new RegularExpressionRendering(this.props.canvas, this.props.user, this.props.problemID);
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