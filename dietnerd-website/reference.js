/**
 * Retrieves the value of the specified query parameter from the URL.
 *
 * @param {string} name - The name of the query parameter to retrieve.
 * @return {string} The value of the specified query parameter.
 */
function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

/**
 * Replaces specific text patterns in the input text and returns the formatted text.
 *
 * @param {string} input - The input text to be formatted.
 * @return {string} The formatted text after replacing specific patterns.
 */
const formatText = (input) => {
    // Replace \n with <br>
    let formattedText = input.replace(/\n/g, '<br>');

    // Replace **text** with <strong>text</strong>
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    //Replace ### text with bold
    formattedText = formattedText.replace(/### (.*?)(<br>|$)/g, '<strong>$1</strong>$2');


    // Replace "-" with <li> and wrap in <ul>
    formattedText = formattedText.replace(/- (.*?)(<br>|$)/g, '<li>$1</li>');

    return formattedText;
}

/**
 * Parses a citation string into its components.
 *
 * @param {string} citation - The citation string to be parsed.
 * @return {Array} An array containing the authors, title, and journal of the citation.
 */
function parseCitation(citation) {
    // Split the citation into its components using regex
    citation = citation.slice(1);
    const firstDotIndex = citation.indexOf('.');
    const secondDotIndex = citation.indexOf('.', firstDotIndex + 1);
    const authors = citation.substring(3, firstDotIndex).trim();
    const title = citation.substring(firstDotIndex + 1, secondDotIndex).trim();
    const journal = citation.substring(secondDotIndex + 1).trim();
    return [authors, title, journal];
}


/**
 * Loads the content of a reference based on the reference number provided in the query parameter.
 *
 * @return {void} This function does not return anything.
 */
function loadReferenceContent() {
    const refNumber = getQueryParameter('ref');
    const referenceObject = JSON.parse(localStorage.getItem('referenceObject'));
    
    let summary = 'Reference content not found';
    let authors = '';
    let title = '';
    let journal = '';
    let PMCID = '';
    if (referenceObject) {
        // Assuming the referenceObject has the needed structure
        console.log(referenceObject);
        for (citation in referenceObject) {
            let citation_num = extractCitationNumber(citation);
            console.log(citation_num)
            console.log(refNumber)
            if (`[${citation_num}]` == refNumber || citation_num == refNumber) {
                console.log('Found Match')
                console.log(citation)
                const info = parseCitation(citation)
                console.log(info)
                authors = info[0];
                title = info[1];
                journal = info[2];
                summary = referenceObject[citation]['Summary'];
                PMCID = referenceObject[citation]['PMCID']
                url = referenceObject[citation]["URL"];
                console.log(url);
                localStorage.setItem('url', url);
                break;
            }
        }

        
        let content = summary || 'Reference content not found.';

        let fullText;
        if (PMCID == 'None') {
            fullText = false;
        } else {
            fullText = true;
        }
        
        content = `<strong><a href=${url} target="_blank">${title}</a></br>${authors}<br>${journal}</strong><br><br>${content}`
        document.getElementById('reference-content').innerHTML = formatText(content);
    } else {
        document.getElementById('reference-content').innerText = 'No reference data found.';
    }
}


/**
 * Extracts the citation number from the citation string.
 *
 * @param {string} citation - The citation string to extract the number from.
 * @return {number|null} The extracted citation number or null if not found.
 */
function extractCitationNumber(citation) {
    const match = citation.match(/^\[?(\d+)\]?\.?/);
    if (match) {
        return parseInt(match[1], 10);
    }
    return null;
}


/**
 * Sets up the redirect button functionality.
 */
function setupRedirectButton() {
    const redirectButton = document.getElementById('redirect-button');
    const redirectUrl = localStorage.getItem("url"); // Change this to your desired URL
    redirectButton.addEventListener('click', () => {
        window.location.href = redirectUrl;
    });
}

/**
 * Executes when the window has finished loading.
 * Calls the functions to load reference content and set up the redirect button.
 *
 * @return {void} No return value.
 */
window.onload = () => {
    loadReferenceContent();
    setupRedirectButton();
};

