import React from 'react';
import ReactDOM from 'react-dom';
import { fabric } from 'fabric';

import {FormalLanguageEditor} from './formalLanguageEditor';
import "../css/editor.css";



// ========================================

var flCanvas = new fabric.Canvas('editorView');
fabric.Object.prototype.objectCaching = false;

if (window.location.href.indexOf('&saved=1') !== -1) {
  let newLoc = window.location.href.replace('&saved=1', '');
  window.location.replace(newLoc);
}


const creatorName = document.getElementById('creatorName');

ReactDOM.render(
  (<FormalLanguageEditor canvas={flCanvas} creatorName={creatorName} docURL={document.languageURL}
        user={document.username} problemID={document.problem} lock={document.lock}/>),
  document.getElementById('react-entry-point')
);



