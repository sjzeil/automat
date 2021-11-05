# Notes on Different Entry Points to Automatat

Entry will be via CGI scripts or possibly PHP scripts.

* Each script has a base data directory `base` specified in some manner to be determines, most likely by a property in an `automat.ini` file in the same directory as the script.

The script may accept a problem identifier string as a parameter.

* When a new formal language is created, the problem identifier, if present, is added as a `problem` attribute.
* The `problem` value identifies a directory `base`/`problem` containing problem-specific information.
    * a `problem.ini` file containing
        * a short descriptive problem title
        * a solution URL for the instructor's solution
        * a boolean property `locked` (defaults to false).
        * login names for instructors/graders for this problem. 
            * Anyone 
        
        The last two items can alternatively be supplied in a `base`/automat.ini file that provides information common to
        all problems in the same base directory.

    * a file `accept.dat` containing examples of strings that are in the desired language 
    * a file `reject.dat` containing examples of strings that are not in the desired language 
    * an optional file `expected.dat` showing expected output tapes for Turing machines, corresponding to strings in `accept.dat`


Optional, & recommended, will be authentication applied to these scripts, so that a `username` is known when the script runs.


* If no authentication is applied, the `username` defaults to "anonymous".
* Anyone who is authenticated with one of the instructor names from the `.ini` file will receive the `username` "instructor".

# Entry Points

## New language editor

* When a new formal language is created, the `username` is added as a `createdBy` attribute.
* When a new formal language is created, the problem identifier is added as a `problem` attribute.
* A `Grade This` button is displayed if `problem` is non-empty and if the `username` is "instructor" or the problem is _unlocked_.
    * This button connects to the Grade report entry point.

## Load language editor

* This entry point may display or hide the language depending on the various properties.

|              | | | |
|--------------------------:|:------------:|:------------:|:------------|
| **createdBy:**            |   **username**                          |||
|                           | _anonymous_  | _instructor_ | _other_     |     
| _anonymous_               | display      |  display     | if unlocked |
| _instructor_              | if unlocked  | display      | if unlocked |
| _matches username_        | hide         | display      | display     |
| _does not match username_ | hide         | display      | hide        |

If the language is to be displayed, the `createdBy` and `problem` attributes are loaded from the saved language.

* A `Grade This` button is displayed if `problem` is non-empty and if the `username` is "instructor" or the problem is _unlocked_.

## Grade Report display

* This entry point may display or hide the grade report depending on the various properties.

|--------------------------:|:----------  |:----------:|:------------|
|                           |   **username**                       |||
| **createdBy:**            | anonymous   | instructor | other       |     
| anonymous                 | hide        | display    | if unlocked |
| instructor                | hide        | display    | if unlocked |
| matches username          | hide        | display    | if unlocked |
| does not match username   | hide        | display    | hide        |

* If the `username` is "instructor" a special URL is displayed for an identical language with an `unlocked` attribute. That attribute overrides the `.ini` locked attribute setting. 
    * It can therefore be pasted into a student's LMS test results to provide the student with access to the grade report.

## Graphic summary only

* Same as Grade Report.