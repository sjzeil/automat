/**
 * grader standalone executable
 * 
 * Usage: node grader.ts --problem=path-to-problem.ini --lang=encoded-formal-language
 */


import { ExternalsPlugin } from 'webpack';
import {FormalLanguage, SampleResults, TestResult} from '../../../../formalLangLib/src/js/formalLanguage';
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
    //console.log(div("warnings", message));
}


function info(message:string) {
    console.log(div("info", message));
}

function readStrings(path:string): string[] {
    dbg("attempting to read from " + path);
        const data = fs.readFileSync(path, 'utf8');
        if (data !== undefined ) {
            let strippedData = data.replace(/\n$/,'');
            let lines = strippedData.split("\n");
            if (lines[lines.length-1] == '') {
                lines.pop();
            }
            return lines;
        } else {
            return [];
        }
}

function li(contents: string): string {
    return '<li>' + contents + '</li>\n';
}

function printExamples (strings: string[]): string {
    let output = '\n<ul>\n';
    for (let i = 0; i < 4; ++i) {
        if (i < strings.length) {
            output += li('"' + strings[i] + '"');
        }
    }
    if (strings.length >= 10) {
        output += li('"' + strings[Math.round(strings.length / 2)] + '"');
    }
    if (strings.length >= 5) {
        output += li('"' + strings[strings.length  - 1] + '"');
    }
    output += '</ul>\n';
    return output;
}


function printOutputExample (results: SampleResults, i: number): string {
    let output = '<tr><td>' + results.acceptedFailed[i] + "</td><td>"
        + results.expected[i] + "</td><td>"
        + + results.actual[i] + "</td></tr>"
        ;
    return output;
}

function printOutputExamples (results: SampleResults): string {
    let output = '\n<table border="1">\n<tr><th>Input</th><th>Expected Output</th><th>Actual Output</th></tr>';
    for (let i = 0; i < 4; ++i) {
        if (i < results.acceptedFailed.length) {
            output += printOutputExample (results, i);
            // output += '<li>' + results.acceptedFailed[i] + '</li>\n';
        }
    }
    if (results.acceptedFailed.length >= 10) {
        output += printOutputExample (results, Math.round(results.acceptedFailed.length / 2));
    }
    if (results.acceptedFailed.length >= 5) {
        output += printOutputExample (results, Math.round(results.acceptedFailed.length  - 1));
    }
    output += '</table>\n';
    return output;
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



let factory = new LanguageFactory(user);
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
    
    urlParams = new URLSearchParams(queryString);
    urlParams.delete('action');
    urlParams.append('action', 'release');
    urlParams.append('release', language.createdBy);
    let releaseURL=urlParts[0] + '?' + urlParams.toString();

    if (lock == '0') {
        info("This problem is unlocked.")
    } else {
        info (`<a target='blank' href='${releaseURL}'>Release this report to ${language.createdBy}</a>`);
        info (`or give them <a target='blank' href='${unlockedURL}'>this URL</a>.`);
    }
}

dbg("solution=" + solution);
let solutionParts = solution.split('?');
let solutionParams = new URLSearchParams(solutionParts[1]);
let solutionLang = solutionParams.get('lang');
let solutionLanguage = factory.load(solutionLang);

if (language.specification !== solutionLanguage.specification) {
    error (`Expected ${solutionLanguage.specification}, but submission is ${language.specification}.`);
    //process.exit(1);
} else {
    //info (language.specification);
}

if (language.canBeCheckedForEquivalence()) {
    if (language.equivalentTo(solutionLanguage)) {
        info ("Student's language is equivalent to the instructor's.");
    } else {
        warning ("Student's language is not equivalent to the instructor's.");
    }
}

dbg("baseDir is " + baseDir);
// Try to read the list of strings that should be accepted.
let accept = [] as string[];
try {
    accept = readStrings(`${baseDir}/${problem}/accept.dat`);
} catch(err){
    error(`Could not read accepted strings from ${baseDir}/${problem}/accept.dat<br/>\n${err}`);
}
dbg("read " + accept.length + " accept strings");


// Try to read the list of strings that should be rejected.
let reject = [] as string[];
try {
    reject = readStrings(`${baseDir}/${problem}/reject.dat`);
} catch(err){
    error(`Could not read reject strings from ${baseDir}/${problem}/reject.dat<br/>\n${err}`);
}
dbg("read " + reject.length + " reject strings");

let expected = [] as string[];
let expectedAvailable = false;
if (language.producesOutput()) {
    try {
        expected = readStrings(`${baseDir}/${problem}/expected.dat`);
        expectedAvailable = true;
        dbg("read " + expected.length + " expected strings");
        if (expected.length != accept.length) {
            error("accept.dat and expected.dat must be the same length.");
        }
    } catch (err) {
        expectedAvailable = false;
    }
}

let acceptResults = (expectedAvailable)?  language.testOnSamplesWithOutput(accept, expected) : language.testOnSamples(accept);
let rejectResults = language.testOnSamples(reject);

let acceptAccuracy = 100.0;
if (accept.length > 0) {
    acceptAccuracy = 100.0 * acceptResults.acceptedPassed.length / accept.length;
    if (expectedAvailable && language.producesOutput()) {
        console.log(
            div('results', 'Accepted and produced correct output for '
            + acceptResults.acceptedPassed.length + ' out of ' + accept.length + ' strings')
        );
    } else {
        console.log(
            div('results', 'Correctly accepted ' + acceptResults.acceptedPassed.length
            + ' out of ' + accept.length + ' strings')
        );
    }
}



let rejectAccuracy = 100.0;
if (reject.length > 0) {
    rejectAccuracy = 100.0 * rejectResults.rejected.length / reject.length;
    console.log(div('results', 'Correctly rejected ' 
        + rejectResults.rejected.length + ' out of ' + reject.length + ' strings'));
}

if (acceptResults.rejected.length > 0) {
    console.log(div('results', 'Some examples of strings that your language rejected but should have accepted:'
       + printExamples(acceptResults.rejected)));
}
if (expectedAvailable && acceptResults.acceptedFailed.length > 0) {
    console.log(div('results', 'Some examples of strings on which your automaton produced incorrect outputs are:' 
       + printOutputExamples(acceptResults)));
}
if (rejectResults.acceptedPassed.length > 0) {
    console.log(div('results', 'Some examples of strings that your language accepted but should have rejected:'
       + printExamples(rejectResults.acceptedPassed)));
}

let accuracy = Math.round((rejectAccuracy < acceptAccuracy) ? rejectAccuracy : acceptAccuracy);

if (accept.length > 0 || reject.length > 0) {
    console.log(div('results', 'Overall accuracy: ' + accuracy + '%'));
} else {
    warning('No test data was found for this problem.');
}


process.exit(0);