import React from 'react';
import ReactDOM from 'react-dom';
import { fabric } from 'fabric';

import {FormalLanguageEditor} from './formalLanguageEditor'




// ========================================

var flCanvas = new fabric.Canvas('editorView');
console.log("set up canvas");

ReactDOM.render(
  <FormalLanguageEditor canvas={flCanvas} docURL={document.URL}/>,
  document.getElementById('react-entry-point')
);
