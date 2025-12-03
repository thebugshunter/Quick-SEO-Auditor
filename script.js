const API_BASE_URL = "https://qa-auditor-api.onrender.com/"; 

const form = document.getElementById('audit-form');
const resultsDiv = document.getElementById('results');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error-msg');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // 1. Reset UI
    const url = document.getElementById('url-input').value;
    resultsDiv.innerHTML = '';
    resultsDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');
    loadingDiv.classList.remove('hidden');

    try {
        // 2. Call the Python Backend
        const response = await fetch(`${API_BASE_URL}/audit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url })
        });

        const data = await response.json();

        // 3. Handle Errors from Backend
        if (!response.ok) {
            throw new Error(data.error || 'Server error occurred');
        }

        // 4. Render Results nicely
        loadingDiv.classList.add('hidden');
        resultsDiv.classList.remove('hidden');

        // Loop through the Python Dictionary and create cards
        for (const [key, value] of Object.entries(data)) {
            createResultCard(key, value);
        }

    } catch (err) {
        loadingDiv.classList.add('hidden');
        errorDiv.textContent = `Error: ${err.message}`;
        errorDiv.classList.remove('hidden');
    }
});

function createResultCard(key, value) {
    const card = document.createElement('div');
    card.className = 'result-card';

    // Formating the Key (e.g. "http_status" -> "HTTP STATUS")
    const cleanKey = key.replace(/_/g, ' ');

    // Determine visual style based on content
    // If the Python string contains "✅", add green class. 
    // If "❌", add red class.
    if (String(value).includes("✅") || String(value).includes("200")) {
        card.classList.add('pass');
    } else if (String(value).includes("❌") || String(value).includes("FAIL")) {
        card.classList.add('fail');
    }

    card.innerHTML = `
        <span class="result-key">${cleanKey}</span>
        <span class="result-value">${value}</span>
    `;
    
    resultsDiv.appendChild(card);
}
