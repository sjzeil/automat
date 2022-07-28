# Automat

A JS-based editor for constructing and formal languages.

Automat requires no access to local file storage, but will allow saving
and transmission of automata via encoded URLs.  It should be
compatible with restricted on-line testing environments and locked-down
browsers.

Automat supports the following formal languages:

* Deterministic and non-deterministic automata
* Regular expressions
* Push-down automata
* Context-free grammars
* Turing machines (single and multi-tape)

Automat can be run in two modes:

* In _free mode_, the user can select any of the available
formal language types and work on whatever language they want.

    * The user can "run" their formal language on strings of his or her
      own choosing to see if they are accepted or rejected. In automata types
      of language descriptions, single-stepping though the state changes is
      permitted.

* In _problem mode_, the user is expected to use a particular formal
   language type to describe a specific language (specified elsewhere by the
   instructor).   
   
    A "Grade Report" button will check the student's formal language
    description against an instructor-supplied list of strings that should be
    accepted and a list that should be rejected.  The grade report includes the
    percentage score, a list of sample strings on which the wrong result was
    obtained, and the instructor's own solution to the problem.

    * In _self-assessment mode_, this Grade Report is always available.
    * In _graded mode_, the grade report is only available to the instructor
       until the instructor releases the solution to the student.

Some examples:

* A [finite state automaton](https://www.cs.odu.edu/~zeil/automat/automat.cgi?lang=eyJzcGVjaWZpY2F0aW9uIjoiYXV0b21hdG9uRkEiLCJjcmVhdGVkQnkiOiJBbm9ueW1vdXMiLCJwcm9ibGVtSUQiOiIiLCJ1bmxvY2vGDHN0YXRlcyI6W3sibGFiZWwiOiIwIiwiaW5pdGlhbCI6dHJ1ZSwiZmluxA1mYWxzZSwieCI6MjEzLCJ5IjoxMzZ9LMo7Mcw7xy7HPMZJeCI6Mzg3xjs2NX1dLCJ0cmFuc2nkAM%2FmAIZmcm9t5wCFdG%2FHU8pfxG3QIsQJyCIwIn1dfQ%3D%3D)
* A [regular expression](https://www.cs.odu.edu/~zeil/automat/automat.cgi?lang=eyJzcGVjaWZpY2F0aW9uIjoicmVnZXhwIiwiY3JlYXRlZEJ5IjoiQW5vbnltb3VzIiwicHJvYmxlbUlEIjoiIiwidW5sb2NrxgzHPDoiKGErYikqYyJ9)
* A [context free grammar](https://www.cs.odu.edu/~zeil/automat/automat.cgi?lang=eyJzcGVjaWZpY2F0aW9uIjoiZ3JhbW1hciIsImNyZWF0ZWRCeSI6IkFub255bW91cyIsInByb2JsZW1JRCI6IiIsInVubG9ja8YMcHJvZHVjxEpzIjpbeyJsaHMiOiJTIiwicsUKQVNBIn0s0hhiyxZByRZhIn1dLCJkZXJpducAnlt7InN5bWJvbCI6LTHMb8QQxEPIHjDOHTDbHDLMHM9VzTjPHDJ9XX0%3D) with an incomplete derivation and its parse tree
* A [pushdown automaton](https://www.cs.odu.edu/~zeil/automat/automat.cgi?lang=eyJzcGVjaWZpY2F0aW9uIjoiYXV0b21hdG9uUERBIiwiY3JlYXRlZEJ5IjoiQW5vbnltb3VzIiwicHJvYmxlbUlEIjoiIiwidW5sb2NrxgxzdGF0ZXMiOlt7ImxhYmVsIjoiMCIsImluaXRpYWwiOnRydWUsImZpbsQNZmFsc2UsIngiOjEzNiwieSI6MTg0fSzKOzHMO8cu0TwzMzHFPDIwM8w8Mto85gCFeCI6MjY5xjs4OX1dLCJ0cmFuc2nkAQzmAMJmcm9t5wDBdG%2FHCchfMCxALzBcbjEsQC8xIsR40C3kALzILUAsQC9AzCbEHdEmMCwwL0DEUzHXLeQA08pTWi9aIn1dfQ%3D%3D)
* A [Turing machine](https://www.cs.odu.edu/~zeil/automat/automat.cgi?lang=eyJzcGVjaWZpY2F0aW9uIjoiYXV0b21hdG9uVE0iLCJjcmVhdGVkQnkiOiJBbm9ueW1vdXMiLCJwcm9ibGVtSUQiOiIiLCJ1bmxvY2vGDHN0YXRlcyI6W3sibGFiZWwiOiIwIiwiaW5pdGlhbCI6dHJ1ZSwiZmluxA1mYWxzZSwieCI6MTYwLCJ5IjoxNzh9LMo7Mcw7xy7RPDI5NsY8NDHMPDLaPOYAhXgiOjM4McY7ODB9XSwidHJhbnNp5AEL5gDCZnJvbecAwXRvxwnIXzAvMSxSXG4xL3gsUiLEeNAt5AC8yC1AL0AsTMwmxB3RJngvMCxMxFMx1y3kANPMU1IifV19&saved=1)