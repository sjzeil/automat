import React from 'react';
import ReactDOM from 'react-dom';

class FLEToolBar extends React.Component {
	  render() {
	    return (
	      <div className="editorToobar">
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

ReactDOM.render(
  <FormalLanguageEditor />,
  document.getElementById('react-entry-point')
);
