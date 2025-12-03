import requests
from bs4 import BeautifulSoup

def run_audit(url):
    """
    Performs the audit and returns a dictionary of results.
    """
    results = {} # Create a dictionary to hold results
    headers = { 'User-Agent': 'Mozilla/5.0 ...' }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        results['http_status'] = f"[{response.status_code}] {response.reason}"
        
        if response.status_code != 200:
            return results # Return early if page failed to load

        soup = BeautifulSoup(response.text, 'html.parser')

        # --- Title Tag Check ---
        title_tag = soup.find('title')
        if title_tag and title_tag.string:
            results['title'] = f"✅ [PASS] Length: {len(title_tag.string)}. Content: {title_tag.string.strip()}"
        else:
            results['title'] = "❌ [FAIL] <title> tag is missing or empty."

        # --- H1 Tag Check ---
        h1_tags = soup.find_all('h1')
        if len(h1_tags) == 1:
            results['h1_check'] = f"✅ [PASS] Exactly one <h1> found."
        else:
            results['h1_check'] = f"❌ [FAIL] Found {len(h1_tags)} <h1> tags (Expected 1)."
        
        # ... (add your other checks here) ...

    except requests.exceptions.RequestException as e:
        results['error'] = f"❌ [FAIL] Could not connect to URL. Error: {e}"
    
    return results # Return the final dictionary
