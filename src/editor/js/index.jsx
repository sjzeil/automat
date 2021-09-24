import React from 'react';
import ReactDOM from 'react-dom';
import { fabric } from 'fabric';

import {FormalLanguageEditor} from './formalLanguageEditor';
import "../css/editor.css";



// ========================================

var flCanvas = new fabric.Canvas('editorView');

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

if (urlParams.has('test')) {
  document.username = '__' + urlParams.get('test');
}

ReactDOM.render(
  (<FormalLanguageEditor canvas={flCanvas} docURL={document.URL}
        user={document.username} problemID={document.problem} lock={document.lock}/>),
  document.getElementById('react-entry-point')
);



