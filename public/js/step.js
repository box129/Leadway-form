document.getElementById('previousButton').addEventListener('click', function() {
        // Tell the PARENT window to navigate to the /multi-form route for the previous step
        window.parent.location.href = '/multi-form?s=<%= currentStepNumber - 1 %>';
    });