function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

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
            if (citation_num == refNumber) {
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


function extractCitationNumber(citation) {
    const match = citation.match(/^\[?(\d+)\]?\.?/);
    if (match) {
        return parseInt(match[1], 10);
    }
    return null;
}


function setupRedirectButton() {
    const redirectButton = document.getElementById('redirect-button');
    const redirectUrl = localStorage.getItem("url"); // Change this to your desired URL
    redirectButton.addEventListener('click', () => {
        window.location.href = redirectUrl;
    });
}

window.onload = () => {
    loadReferenceContent();
    setupRedirectButton();
};
