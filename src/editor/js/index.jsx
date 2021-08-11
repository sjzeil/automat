import React from 'react';
import ReactDOM from 'react-dom';
import { fabric } from 'fabric';

import {FormalLanguageEditor} from './formalLanguageEditor';
import "../css/editor.css";



// ========================================

var flCanvas = new fabric.Canvas('editorView');


ReactDOM.render(
  (<FormalLanguageEditor canvas={flCanvas} docURL={document.URL}/>),
  document.getElementById('react-entry-point')
);



