import React from 'react';
import ReactDOM from 'react-dom';

import {FLEditorState} from '../../shared/js/fLEditorState.ts'


class FLEToolBar extends React.Component {
	  render() {
	    return (
	      <div className="editorToolbar">
		     {"toolbar"}
		  </div>
		);
	  }
}

class FLEComponentEditor extends React.Component {
	  render() {
	    return (
	      <div>
		     {"component editor"}
		  </div>
		);
	  }
}


class FormalLanguageEditor extends React.Component {
	  render() {
	    return (
	      <div className="editorView">
		     <FLEToolBar/>
			 <FLEComponentEditor/>
		  </div>
		);
	  }
}

// ========================================

var fLCanvas = document.getElementById('editorView');
var fles = new FLEditorState( fLCanvas );
console.log (fles.state);


ReactDOM.render(
  <FormalLanguageEditor />,
  document.getElementById('react-entry-point')
);
