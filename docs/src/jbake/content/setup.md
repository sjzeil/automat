title=Overview
type=page
manual=instructor
sequence=1
prev=instructorsManual
status=published
~~~~~~

## Modes of Operation

The Automat editor can function in three disiotnct modes:

1. A *free-form* editor, for use in preparing formal languages not tied to a specific problem, and (probably) not requiring students to log in.
2. A *self-assessment* editor, in which students have been directed to solve a specific problem and may request immediate feedback on how well they have done, including viewing a sample solution (provided by hte instructor).
3. A *graded problem* editor, in which students are be directed to solve a specific problem and to submit their work for grading. The sample solution and feedback are withheld until released by an instructor or grader.

The self-assessment and graded problems modes require that students be logged in. Logging in is optional for free-form editing.

User authentication (logging in) is handled outside of Automat, presumbly by Apache-style `.htaccess` files.

It is possible to use a single installation of Automat (at a single URL) for all three modes of operation or to use separate installations and URL's for each mode.

## Directory Structures

### Free-form Editing

To set up for free-form editing, the basic Automat distribution files can be unpacked into any directory served by a web server with Perl CGI support.   The resulting structure will look like:

```
directory-on-webserver
|-- automat.cgi
|-- editor.bundle.js
|-- editor.template
|-- generator.bundle.js
|-- grader.bundle.js
|-- grading.css
|-- grading.template
|-- help
|   |-- ... contents of help/ directory ...
|-- metadata.bundle.js
|-- summary.template
```


### Self-assessment and Graded Problem Modes

To set up for self-assessment and graded problem editing, you will need a directory served by the web server and a problem set directory that, for security reasons, should generally be in a directory readable by the server but not actually mapped onto URLs.

#### On the web server

```
directory-on-webserver
|-- .htaccess
|-- automat.cgi
|-- automat.ini
|-- editor.bundle.js
|-- editor.template
|-- generator.bundle.js
|-- grader.bundle.js
|-- grading.css
|-- grading.template
|-- help
|   |-- ... contents of help/ directory ...
|-- metadata.bundle.js
|-- summary.template
```

This is the same as the free-form directory, with two additions:

* A `.htaccess` or similar file forcing student logins.
* An `automat.ini` file contaiining property assignments. This file _must_ have the property

    `base=`_path-to-problem-set_

    indicating the location ofthe problem set directory.   It may also include the property

    `instructors=`_name1,name2,..._

    though this can also be provided in lower-level `.ini` files as well.   This property provides a comma-separated list of
    login names for instructors, TAs, graders, and others who will need the ability to set up new problems, edit existing problems, and/or to grade student submissions.

#### The Problem Set

The problem set directory, usually located outside of the directory tree directly served by the web server,
will contain another `automat.ini` file and one or more problem directories.

```
|-- problem-set
|   |-- automat.ini
|   |-- problem1
|   |   |-- accept.dat
|   |   |-- notes.md
|   |   |-- reject.dat
|   |   `-- problem1.ini
|   `-- problem2
|   |   |-- accept.dat
|   |   |-- expected.dat
|   |   |-- reject.dat
|   |   `-- problem2.ini
.   .
.   .
```


The `automat.ini` file in the problem set provides properties that are shared by all of the problems.  

* In particular, this is the usual locations for the 

    `instructors=`_name1,name2,..._

    property described earlier.

* If all problems in this problem set are supposed to be self-assessments, then add the property

    `lock=0`

    to this file.  This means that grade reports will be unlocked by default, allowing students immediate access to feedback on their submissions.

    If the `lock` property is missing, it can be supplied in the individual problem `.ini` files, allowing self-assessment and graded problems to be mingled within a single problem set.

The problem directories may have any legal directory name. The name serves as a unique ID for each problem.  For example, if I wanted to set my students the problem of designing a determnistic finite automaton to accept strings over ${0,1}$ that contain only zeros, I might name the directory `DFA-all-zeros`.

Each problem set directory can contain the following:

* A `.ini` file, usually carrying the same name as the directory, with the contents

    `title=`_a name for this problem_
    `solution=`_URL of the instructor's sample solution_

    This file can also have a `lock` property, as described earlier. If a `lock` of zero is not provided, Automat will randomly
    generate a non-zero lock value. When a problem has a non-zero lock, grade reports will only be viewable by students after release by the instructor, and the "release" action stamps the report with the lock value.  Changing the lock value later will render any previously released grade reports unviewable.

* `accept.dat` and `reject.dat`, lists of strings, one per line, that should be accepted by a correct solution and rejected by a correct solution, respectively.

* `expected.dat`, an optional file used only with Turing machines to indicate the desired contents of tape 0 upon reachign an accepting state.

* `notes.md`, an optional file containing any content that the instructor wishes deplayed together with the sample solution, e.g., an explanation of how the solution works.  The content of this file will be in Markdown.


Automat provides interactive means for instructors to create everything in a problem directory except for the `notes.md` file, though sometimes it may be easier to edit these files directly with an ordinary text editor.
