title=Creating a New Problem
type=page
manual=instructor
sequence=1
prev=directories
status=published
~~~~~~

The files that make up a problem directory can be created manually, but it's usually easier to use Automat itself to set up most of the information.  Then, if desired, you can manually edit the lists of accept and reject strings to refine your problem checking.

Suppose, for the sake of example, you wanted to create a problem in which students were asked to create a FA recognizing hte language over {0,1} of strings ending with a 1.

1. Browse to the base address of the Automat editor: `https://`...`/automat.cgi`

2. Create a unique label for your problem. This will be used as a directory name, so limit it to alphabetic character, numeric digits, hyphens and underscores. Let's use, for the sake of example, "FA-ends-with-1".

3. In your browser modify your URL by adding "?problem=" and your label to the end.  You should wind up with something like `https://`...`/automat.cgi?problem=FA-ends-with-1`

4. Now go ahead and create your solution to this problem. 

5. When you are happy with your solution, click the `Grade Report` button.

    You will receive a grade report that shows your automaton as the "Student's Submission", but has nothing under the "Instructor's Solution".

    <img src='images/editTheProblem.png' style='float: right;'/>

6. Scroll down to the `Edit the Problem" area.



## Free-form Editing

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


## Self-assessment and Graded Problem Modes

To set up for self-assessment and graded problem editing, you will need a directory served by the web server and a problem set directory that, for security reasons, should generally be in a directory readable by the server but not actually mapped onto URLs.

### On the web server

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
* An `automat.ini` file containing property assignments. This file _must_ have the property

    `base=`_path-to-problem-set_

    indicating the location of the problem set directory.   It may also include the property

    `instructors=`_name1,name2,..._

    though this can also be provided in lower-level `.ini` files as well.   This property provides a comma-separated list of
    login names for instructors, TAs, graders, and others who will need the ability to set up new problems, edit existing problems, and/or to grade student submissions.

### The Problem Set

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

#### automat.ini

The `automat.ini` file in the problem set provides properties that are shared by all of the problems.  

* In particular, this is the usual locations for the 

    `instructors=`_name1,name2,..._

    property described earlier.

* If all problems in this problem set are supposed to be self-assessments, then add the property

    `lock=0`

    to this file.  This means that grade reports will be unlocked by default, allowing students immediate access to feedback on their submissions.

    If the `lock` property is missing, it can be supplied in the individual problem `.ini` files, allowing self-assessment and graded problems to be mingled within a single problem set.

The problem directories may have any legal directory name. The name serves as a unique ID for each problem.  For example, if I wanted to set my students the problem of designing a deterministic finite automaton to accept strings over ${0,1}$ that contain only zeros, I might name the directory `DFA-all-zeros`.


#### Problem Directories

Each problem directory can contain the following:

* A `.ini` file, usually carrying the same name as the directory, with the contents

    `title=`_a name for this problem_
    `solution=`_URL of the instructor's sample solution_

    This file can also have a `lock` property, as described earlier. If a `lock` of zero is not provided, Automat will randomly
    generate a non-zero lock value. When a problem has a non-zero lock, grade reports will only be viewable by students after release by the instructor, and the "release" action stamps the report with the lock value.  Changing the lock value later will render any previously released grade reports unviewable.

* `accept.dat` and `reject.dat`, lists of strings, one per line, that should be accepted by a correct solution and rejected by a correct solution, respectively.

* `expected.dat`, an optional file used only with Turing machines to indicate the desired contents of tape 0 upon reaching an accepting state.

* `notes.md`, an optional file containing any content that the instructor wishes deployed together with the sample solution, e.g., an explanation of how the solution works.  The content of this file will be in Markdown.


Automat provides interactive means for instructors to create everything in a problem directory except for the `notes.md` file, though sometimes it may be easier to edit these files directly with an ordinary text editor.
