# Automat

A JS-based editor for constructing automata, grammars, and regular
expressions.

Automat will require no access to local storage, but will allow saving
and transmission of automata via encoded URLs.  It should be
compatible with restricted or locked-down browsers when
administering tests.

This is a work in progress. Some examples:

* A [context free grammar](https://www.cs.odu.edu/~zeil/automat/editor.html?lang=eyJzcGVjaWZpY2F0aW9uIjoiZ3JhbW1hciIsInByb2R1Y8QXcyI6W3sibGhzIjoiUyIsInLFCkFTQSJ9LNIYyxVByi1h1RdhIn1dLCJkZXJpducAgVt7InN5bWJvbCI6LTHsAIXEEMRDyB4wzh0w2xwy2xwzfV19) with an incomplete derivation and its parse tree
* A [finite state automaton](https://www.cs.odu.edu/~zeil/automat/editor.html?lang=eyJzcGVjaWZpY2F0aW9uIjoiYXV0b21hdG9uIiwic3RhdGVzIjpbeyJsYWJlbCI6IjAiLCJsZWZ0IjoxNDMsInRvcCI6MTExLCJpbml0aWFsIjp0cnVlLCJmaW7EDWZhbHNlfSzKQDHJQDI4OcdAMjU2y0DFM9pBMslBNDDpAIEzNdlB5ACPfV0sInRyYW5zaeQA5eYA0WZyb23nANB0b8hYx2QxIsRy0CLlALvHIjDMIsQZ3yLfZsYZ0SIwXG4xIn1dfQ==)

Still to be implemented:

* regular expressions
* engines for simulating finite automata, push-down-automata, and Turing machines
