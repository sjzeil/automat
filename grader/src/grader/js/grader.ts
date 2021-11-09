/**
 * grader standalone executable
 * 
 * Usage: node grader.ts --problem=path-to-problem.ini --lang=encoded-formal-language
 */


import { ExternalsPlugin } from 'webpack';
import {FormalLanguage} from '../../../../formalLangLib/src/js/formalLanguage';
import {LanguageFactory} from '../../../../formalLangLib/src/js/languageFactory';
import fs from 'fs';
 


const args = require('minimist')(process.argv.slice(2))

const user = args['user']
const lang = args['lang']
const solution = args['solution']
const problem = args['problem']
const unlockKey = args['unlockKey']
const lock = args['lock'];
const baseDir = args['base'];
const thisURL = args['thisURL'];



function div(className: string, message: string): string {
    return `<div class='${className}'>${message}</div>\n`;
}

function span(className: string, message: string): string {
    return `<span class='${className}'>${message}</span>\n`;
}

function error(message:string) {
    console.log(div("errors", "Error: " + message));
}

function warning(message:string) {
    console.log(div("message", span("warnings", "Warning: ") + message));
}

function dbg(message:string) {
    console.log(div("warnings", message));
}


function info(message:string) {
    console.log(div("info", message));
}

function readStrings(path:string): string[] {
        const data = fs.readFileSync(path, 'utf8');
        return data.split("\n");
}

/////// Begin main routine  ///////////


if (problem === "") {
    error("Cannot issue a grading report - no problem has been specified.");
    process.exit(1);
}
if (lang === "") {
    error("Cannot issue a grading report - no formal language has been supplied.");
    process.exit(1);
}



let factory = new LanguageFactory(null, user);
let language = factory.load(lang);
if (problem !== language.problemID) {
    warning("This language was created for problem " + language.problemID 
       + ", but is being graded for problem " + problem);
}

if (user === "Instructor") {
    let languageUnlocked = lang;
    if (lock !== "0") {
        if (language.unlock !== unlockKey) {
            language.unlock = unlockKey;
            languageUnlocked = language.encodeLanguage();
        }
    }
    let urlParts = args['thisURL'].split('?');
    const queryString = urlParts[1];
    let urlParams = new URLSearchParams(queryString);
    urlParams.delete('lang');
    urlParams.append('lang', languageUnlocked);
    let unlockedURL = urlParts[0] + '?' + urlParams.toString();
    
    info (`Release this report to students by giving them <a target='blank' href='${unlockedURL}'>this URL</a>.`);
}

let solutionParts = solution.split('?');
let solutionParams = new URLSearchParams(solutionParts[1]);
let solutionLang = solutionParams.get('lang');
let solutionLanguage = factory.load(solutionLang);

if (language.specification !== solutionLanguage.specification) {
    error (`Expected ${solutionLanguage.specification}, but submission is ${language.specification}.`);
    //process.exit(1);
} else {
    info (language.specification);
}

if (language.canBeCheckedForEquivalence()) {
    if (language.equivalentTo(solutionLanguage)) {
        info ("Student's language is equivalent to the instructor's.");
    } else {
        warning ("Student's language is not equivalent to the instructor's.");
    }
}

warning("baseDir is " + baseDir);
// Try to read the list of strings that should be accepted.
let accepted = [] as String[];
try {
    accepted = readStrings(`${baseDir}/${problem}/accept.dat`);
} catch(err){
    error(`Could not read accepted strings from ${baseDir}/${problem}/accept.dat<br/>\n{$err}`);
}
warning("read " + accepted.length + " accepted strings");

process.exit(0);