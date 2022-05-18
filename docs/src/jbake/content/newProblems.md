title=Creating a New Problem
type=page
manual=instructor
sequence=3
prev=directories
next=notes
status=published
~~~~~~

The files that make up a problem directory can be created manually, but it's usually easier to use Automat itself to set up most of the information.  Then, if desired, you can manually edit the lists of accept and reject strings to refine your problem checking.

Suppose, for the sake of example, you wanted to create a problem in which students were asked to create a FA recognizing hte language over {0,1} of strings ending with a 1.

# Step 1: Create the problem

1. Browse to the base address of the Automat editor: `https://`...`/automat.cgi`

2. Create a unique label for your problem. This will be used as a directory name, so limit it to alphabetic character, numeric digits, hyphens and underscores. Let's use, for the sake of example, "FA-ends-with-1".

3. In your browser modify your URL by adding "?problem=" and your label to the end.  You should wind up with something like `https://`...`/automat.cgi?problem=FA-ends-with-1`


# Step 2: Create the instructor's solution

4. Now go ahead and create your solution to this problem. 

5. When you are happy with your solution, click the `Grade Report` button.

    You will receive a grade report that shows your automaton as the "Student's Submission", but has nothing under the "Instructor's Solution".

    <img src='images/editTheProblem.png' style='float: right;'/>

6. Scroll down to the `Edit the Problem" area.  Fill in the information in this section. 
 
    * Replace the title with something descriptive of the problem (without giving away the answer). For example, we might use "FA: ends with 1".
    * Click the `Use Submission as Solution`. This sets the language currently shown as the Student's Submission as the Instructor's Solution.
    * If this problem is intended to be self-assessment rather than a graded problem, check the `Self-assessed?` box.

9.  Click `Save & Submit`.

    You will receive a new Grade report page. This one will show the newly registered Instructor's Solution.

    It will also have some complaints near the top about missing test data files.  We'll create those next.


# Step 3: Add the test data

<img src='images/generateTestData.png' style='float: right;'/>

10. Scroll down to the "Generate Test Data" section. Fill in the information in this section.

    * For the "Alphabet", list the characters that can appear in this language. In our example, this would be '0' and '1'.
    * For the "Maximum string length", enter the length of the longest strings that you want to use as test data. 
  
        The generator will produce all strings of length less than or equal to that maximum value, using all possible arrangements of the characters from the alphabet. This gets large quickly. If you have _k_ letters in the alphabet and a maximum string length of _m_, there will be _k<sup>m+1</sup>_ strings generated.  
        
        You'll want to keep that number large enough to properly exercise a student's submission but low enough that, when generating a grade report, all of the inputs can be checked without the student's web browser timing out. 

        For our example, we might choose a maximum of, say, 8. 

    * Put a checkmark in the boxes indicating the data that you want kept. 
        * "Generate accept.dat" means that all strings accepted by the instructor's solution will be kept for testing students' submissions.
        * "Generate reject.dat" means that all strings rejected by the instructor's solution will be kept for testing students' submissions.
        * "Generate expected.dat" is used only with Turing machines and means that means that, in addition to check students submissions to be sure that they accept & reject the appropriate strings, the final contents of the tape when a string is accepted must match the contents left by the instructor's solution.
        * Click `Generate` to create the test data.
       
            Unless something has gone very wrong, you should receive a new grade report indicating that the student's submission (which, at this point is identical to the instructor' solution) passes all the tests.

If, at the end of this procedure, you are dissatisfied with the quality of the test data (e.g., your language is one for which you have thousands of rejected strings and only one or two accepted ones), you cna refine the data by

## Refining the Test data

1. Repeating the autoamtic generation process above, using different maximum lengths for the accepted and rejected strings, or
2. Manually edit the `accept.dat` and `reject.dat` files to add or remove test cases.
