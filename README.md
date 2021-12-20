# Automat

A JS-based editor for constructing automata, grammars, and regular
expressions.

Automat will require no access to local storage, but will allow saving
and transmission of automata via encoded URLs.  It should be
compatible with restricted or locked-down browsers when
administering tests.

This is a work in progress. Some examples:

* A [context free grammar](https://www.cs.odu.edu/~zeil/automat/automat.cgi?lang=eyJzcGVjaWZpY2F0aW9uIjoiZ3JhbW1hciIsImNyZWF0ZWRCeSI6IkFub255bW91cyIsInByb2JsZW1JRCI6IiIsInVubG9ja8YMcHJvZHVjxEpzIjpbeyJsaHMiOiJTIiwicsUKQVNBIn0s0hhiyxZByRZhIn1dLCJkZXJpducAnlt7InN5bWJvbCI6LTHMb8QQxEPIHjDOHTDbHDLMHM9VzTjPHDJ9XX0%3D) with an incomplete derivation and its parse tree
* A [finite state automaton](https://www.cs.odu.edu/~zeil/automat/automat.cgi?lang=eyJzcGVjaWZpY2F0aW9uIjoiYXV0b21hdG9uRkEiLCJjcmVhdGVkQnkiOiJBbm9ueW1vdXMiLCJwcm9ibGVtSUQiOiIiLCJ1bmxvY2vGDHN0YXRlcyI6W3sibGFiZWwiOiIwIiwiaW5pdGlhbCI6dHJ1ZSwiZmluxA1mYWxzZSwieCI6MjEzLCJ5IjoxMzZ9LMo7Mcw7xy7HPMZJeCI6Mzg3xjs2NX1dLCJ0cmFuc2nkAM%2FmAIZmcm9t5wCFdG%2FHU8pfxG3QIsQJyCIwIn1dfQ%3D%3D)
* A [regular expression](https://www.cs.odu.edu/~zeil/automat/automat.cgi?lang=eyJzcGVjaWZpY2F0aW9uIjoicmVnZXhwIiwiY3JlYXRlZEJ5IjoiQW5vbnltb3VzIiwicHJvYmxlbUlEIjoiIiwidW5sb2NrxgzHPDoiKGErYikqYyJ9)
* A [pushdown automaton](https://www.cs.odu.edu/~zeil/automat/automat.cgi?lang=eyJzcGVjaWZpY2F0aW9uIjoiYXV0b21hdG9uUERBIiwiY3JlYXRlZEJ5IjoiQW5vbnltb3VzIiwicHJvYmxlbUlEIjoiIiwidW5sb2NrxgxzdGF0ZXMiOlt7ImxhYmVsIjoiMCIsImluaXRpYWwiOnRydWUsImZpbsQNZmFsc2UsIngiOjEzNiwieSI6MTg0fSzKOzHMO8cu0TwzMzHFPDIwM8w8Mto85gCFeCI6MjY5xjs4OX1dLCJ0cmFuc2nkAQzmAMJmcm9t5wDBdG%2FHCchfMCxALzBcbjEsQC8xIsR40C3kALzILUAsQC9AzCbEHdEmMCwwL0DEUzHXLeQA08pTWi9aIn1dfQ%3D%3D)

Still to be implemented:

* engines for simulating push-down-automata and Turing machines
