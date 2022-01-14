/**
 * grader standalone executable
 * 
 * Usage: node grader.ts --problem=path-to-problem.ini --lang=encoded-formal-language
 */


import { ExternalsPlugin } from 'webpack';
import { FormalLanguage, SampleResults, TestResult } from '../../../../formalLangLib/src/js/formalLanguage';
import { LanguageFactory } from '../../../../formalLangLib/src/js/languageFactory';
import fs from 'fs';



const parseArgs = require('minimist');
var args = parseArgs(process.argv.slice(2), { string: 'alphabet' })

const user = args['user']
const solution = args['solution']
const problem = args['problem']
const baseDir = args['base'];
const alphabet = args['alphabet'];
const stringLen = args['stringlen'];
const genAccept = args['genAccept'];
const genReject = args['genReject'];
const genExpect = args['genExpect'];



function div(className: string, message: string): string {
    return `<div class='${className}'>${message}</div>\n`;
}

function span(className: string, message: string): string {
    return `<span class='${className}'>${message}</span>\n`;
}

function error(message: string) {
    console.log(div("errors", "Error: " + message));
}

function warning(message: string) {
    console.log(div("message", span("warnings", "Warning: ") + message));
}

function dbg(message: string) {
    //console.log(div("warnings", message));
}


function info(message: string) {
    console.log(div("info", message));
}

function readStrings(path: string): string[] {
    dbg("attempting to read from " + path);
    const data = fs.readFileSync(path, 'utf8');
    if (data !== undefined) {
        let strippedData = data.replace(/\n$/, '');
        let lines = strippedData.split("\n");
        if (lines[lines.length - 1] == '') {
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

function printExamples(strings: string[]): string {
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
        output += li('"' + strings[strings.length - 1] + '"');
    }
    output += '</ul>\n';
    return output;
}


function printOutputExample(results: SampleResults, i: number): string {
    let output = li('Input: "' + results.acceptedFailed[i]
        + '"  Expected: "' + results.expected[i]
        + '"  Observed: "' + results.actual[i]
        + '"'
    );
    return output;
}

function printOutputExamples(results: SampleResults): string {
    let output = '\n<ul>\n';
    for (let i = 0; i < 4; ++i) {
        if (i < results.acceptedFailed.length) {
            output += '<li>' + results.acceptedFailed[i] + '</li>\n';
        }
    }
    if (results.acceptedFailed.length >= 10) {
        output += '<li>' + results.acceptedFailed[Math.round(results.acceptedFailed.length / 2)] + '</li>\n';
    }
    if (results.acceptedFailed.length >= 5) {
        output += '<li>' + results.acceptedFailed[results.acceptedFailed.length - 1] + '</li>\n';
    }
    output += '</ul>\n';
    return output;
}


/////// Begin main routine  ///////////

if (problem === "") {
    error("Cannot issue a grading report - no problem has been specified.");
    process.exit(1);
}
if (solution === "") {
    error("Cannot issue a grading report - no formal language has been supplied.");
    process.exit(1);
}



let factory = new LanguageFactory(user);

if (user === "Instructor") {

    dbg("solution=" + solution);
    let solutionParts = solution.split('?');
    let solutionParams = new URLSearchParams(solutionParts[1]);
    let solutionLang = solutionParams.get('lang');
    let solutionLanguage = factory.load(solutionLang);

    dbg("baseDir is " + baseDir);
    // Try to read the list of strings that should be accepted.
    let accept = [] as string[];
    let reject = [] as string[];
    let expected = [] as string[];

    info('alphabet is ' + alphabet);
    generate(alphabet, stringLen, solutionLanguage, accept, reject, expected);

    info('Accepted ' + accept.length + ' strings');
    info('Rejected ' + reject.length + ' strings');


    if (genAccept) {
        try {
            let path = `${baseDir}/${problem}/accept.dat`;
            fs.writeFileSync(path, accept.join('\n') + '\n', 'UTF-8');
            info('Wrote to ' + path);
        } catch (err) {
            error(`Could not write accepted strings to ${baseDir}/${problem}/accept.dat<br/>\n{$err}`)
        }
    }

    if (genReject) {
        try {
            let path = `${baseDir}/${problem}/reject.dat`;
            fs.writeFileSync(path, reject.join('\n') + '\n', 'UTF-8');
            info('Wrote to ' + path);
        } catch (err) {
            error(`Could not write rejected strings to ${baseDir}/${problem}/reject.dat<br/>\n{$err}`)
        }
    }

    if (genExpect && solutionLanguage.producesOutput()) {
        try {
            fs.writeFileSync(`${baseDir}/${problem}/expected.dat`, expected.join('\n') + '\n', 'UTF-8');
        } catch (err) {
            error(`Could not write expected strings to ${baseDir}/${problem}/expected.dat<br/>\n{$err}`)
        }
    }

} else {
    error(`Unauthorized user: ${user}`)
}

process.exit(0);

function generate(alphabet: string, stringLen: number, language: FormalLanguage, accept: string[], reject: string[], expected: string[]) {
    for (let k = 0; k <= stringLen; ++k) {
        generateRec('', alphabet, k, language, accept, reject, expected);
    }
}
function generateRec(generated: string, alphabet: string, k: number, language: FormalLanguage, accept: string[], reject: string[], expected: string[]) {
    if (k == 0) {
        let result = language.test(generated);
        if (result.passed) {
            accept.push(generated);
            if (result.output) {
                expected.push(result.output);
            }
        } else {
            reject.push(generated);
        }
    } else {
        for (let ch of alphabet) {
            generateRec(generated + ch, alphabet, k - 1, language, accept, reject, expected);
        }
    }
}

