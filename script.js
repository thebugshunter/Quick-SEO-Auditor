// Wait for the page to load
document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.getElementById('audit-form');
    const urlInput = document.getElementById('url-input');
    const resultsContainer = document.getElementById('results-container');
    const loadingSpinner = document.getElementById('loading-spinner');

    form.addEventListener('submit', async (event) => {
        // Prevent the page from reloading
        event.preventDefault(); 
        
        const urlToAudit = urlInput.value;
        
        // Show loading spinner and clear old results
        loadingSpinner.classList.remove('hidden');
        resultsContainer.textContent = '';

        try {
            // Send the URL to Python back-end API
            const response = await fetch('https://qa-auditor-api.onrender.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: urlToAudit }) // Send the URL as JSON
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Get the JSON results from the back-end
            const results = await response.json();
            
            // Format and display the results
            // 'results' is the dictionary Python script returned
            resultsContainer.textContent = JSON.stringify(results, null, 2);

        } catch (error) {
            resultsContainer.textContent = `Error: ${error.message}`;
        } finally {
            // Hide loading spinner
            loadingSpinner.classList.add('hidden');
        }
    });
});
