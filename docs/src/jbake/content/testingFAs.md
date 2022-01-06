title=Testing an FA
type=page
manual=student
sequence=3
prev=savingYourWork
next=selfAssessments
status=published
~~~~~~

You can "test" your FA by simulating its execution on an input string.

Below the main editing area for your FA, you can see the testing area:

![](testingArea.png)

1. Type any alphanumeric string into the "Input text:" box, and click on Start.

    ![](testingFA1.png)

    * In the drawing area, you will see the initial state highlighted as active. The active state (state 0) is indicated by a color change and by a small marker placed below the state.
    * In the editing area, you will see the input test listed with a "|" dividing the portion of the input processed so far from the portion remaining to be processed. In this case, because none of the input characters have been processed yet, the bar is on the far left of the text.

2. You can now advance the execution one character at a time by using the `Step` button.  In this example, clicking it once would yield:
   
    ![](testingFA2.png)

    * You can see that state 1 is now highlighted in the drawing area, both by a color change and by writing the portion of the input that brought us to that state underneath it.
    * You cna also see in the editing area that our input string is shown as "0|01", indicating that the leading zero has been processed.

3. You can continue using the `Step` button to advance until all the characters of the input have been processed, at which time you will be told whether the string was accepted or rejected.

    Or you can use the `Finish` button to skip all the way to the end and see immediately whether the strign will be accepted or not.
