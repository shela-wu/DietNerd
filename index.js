
const baseURL = window.env.API_URL;  // Adjust the base URL as needed
const disclaimer = `
DietNerd is an exploratory tool designed to enrich your conversations with a registered dietitian or registered dietitian nutritionist, who can then review your profile before providing recommendations.
Please be aware that the insights provided by DietNerd may not fully take into consideration all potential medication interactions or pre-existing conditions.
To find a local expert near you, use this website: https://www.eatright.org/find-a-nutrition-expert
`

/**
 * Asynchronously checks if a given user query is valid.
 *
 * @param {string} userQuery - The user query to be checked.
 * @return {Promise<Object>} A Promise that resolves to the response object.
 * @throws {Error} If the network response is not ok.
 */
async function check_valid(userQuery) {
    console.log("Checking valid");
    try {
        const response = await fetch(`${baseURL}/check_valid/${userQuery}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log('Check if valid response:', result);
        return result;
    } catch (error) {
        console.error('Error in query_generation:', error);
    }
}

/**
 * Asynchronously generates a query based on the provided user query.
 *
 * @param {string} userQuery - The user query to generate a query from.
 * @return {Promise<Object>} A Promise that resolves to the generated query object.
 * @throws {Error} If the network response is not ok.
 */
async function queryGeneration(userQuery) {
    try {
        const response = await fetch(`${baseURL}/query_generation/${userQuery}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log('Query Generation Response:', result);
        return result;
    } catch (error) {
        console.error('Error in query_generation:', error);
    }
}

/**
 * Asynchronously collects articles based on the provided query list.
 *
 * @param {Array} queryList - The list of queries to collect articles for.
 * @return {Promise<Object>} A Promise that resolves to the result object containing the collected articles.
 * @throws {Error} If the network response is not ok.
 */
async function collectArticles(queryList) {
    try {
        const response = await fetch(`${baseURL}/collect_articles/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(queryList)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log('Collect Articles Response:', result);
        return result;
    } catch (error) {
        console.error('Error in collect_articles:', error);
    }
}

/**
 * Asynchronously sends a POST request to the article_matching endpoint with the provided deduplicated articles.
 *
 * @param {Array} deduplicatedArticlesCollected - The list of deduplicated articles to send in the request.
 * @return {Promise<Object>} A Promise that resolves to the result object returned by the server.
 * @throws {Error} If the network response is not ok.
 */
async function articleMatching(deduplicatedArticlesCollected) {
    try {
        const response = await fetch(`${baseURL}/article_matching/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(deduplicatedArticlesCollected)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log('Article Matching Response:', result);
        return result;
    } catch (error) {
        console.error('Error in article_matching:', error);
    }
}

/**
 * Asynchronously sends a POST request to the get_all_articles endpoint with the provided relevant article summaries and matched articles.
 *
 * @param {Array} relevant_article_summaries - The list of relevant article summaries to send in the request.
 * @param {Array} matched_articles - The list of matched articles to send in the request.
 * @return {Promise<Object>} A Promise that resolves to the result object returned by the server.
 * @throws {Error} If the network response is not ok.
 */
async function getAllArticles(relevant_article_summaries, matched_articles) {
    try {
        const response = await fetch(`${baseURL}/get_all_articles/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                relevant_article_summaries: relevant_article_summaries, 
                matched_articles: matched_articles
            })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log('Get All Article Matching Response:', result);
        return result;
    } catch (error) {
        console.error('Error in article_matching:', error);
    }
}

/**
 * Asynchronously performs reliability analysis processing on a list of articles.
 *
 * @param {Array} articlesToProcess - The list of articles to process.
 * @param {string} user_query - The user query for the analysis.
 * @return {Promise<Object>} A Promise that resolves to the result object containing the processed articles.
 * @throws {Error} If the network response is not ok.
 */
async function reliabilityAnalysisProcessing(articlesToProcess, user_query) {
    try {
        const response = await fetch(`${baseURL}/reliability_analysis_processing/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                articles_to_process: articlesToProcess,
                user_query: user_query
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log('Reliability Analysis Processing Response:', result);
        return result;
    } catch (err) {
        console.error('Fetch error:', err);
        throw err;
    }
}

/**
 * Asynchronously writes the relevant article summaries to the database.
 *
 * @param {Array} relevantArticleSummaries - The list of relevant article summaries to be written to the database.
 * @return {Promise<Object>} A Promise that resolves to the result object returned by the server.
 */  
async function writeArticlesToDb(relevantArticleSummaries) {
    try {
        const response = await fetch(`${baseURL}/write_articles_to_db/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(relevantArticleSummaries)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log('Write Articles to DB Response:', result);
        return result;
    } catch (error) {
        console.error('Error in write_articles_to_db:', error);
    }
}

/**
 * Asynchronously generates the final response based on all relevant articles and user query input.
 *
 * @param {Array} allRelevantArticles - The list of relevant articles to generate the response.
 * @param {string} user_query - The user query input for generating the response.
 * @return {Promise<Object>} A Promise that resolves to the final response generated.
 */
async function generateFinalResponse(allRelevantArticles, user_query) {
    try {
        const response = await fetch(`${baseURL}/generate_final_response/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                all_relevant_articles: allRelevantArticles,
                user_query: user_query
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log('Generate Final Response:', result);
        return result;
    } catch (err) {
        console.error('Fetch error:', err);
        throw err;
    }
}

/**
 * Retrieves an answer from the server based on the provided question.
 *
 * @param {string} question - The question to be asked.
 * @return {Promise<string>} The answer to the question.
 * @throws {Error} If the network response is not ok.
 */
const getAnswer = async (question) => {
    try {
        const queryUrl = `${baseURL}/db_get/${encodeURIComponent(question)}`;
        const response = await fetch(queryUrl);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log(result)
        let output = JSON.parse(result[0][1]).end_output;
        output = output.replace(/(^|\n)(\d+)\.\s/g, '\n\n$2. ');

        const citations_obj = JSON.parse(result[0][1]).citations_obj;
        let citations = JSON.parse(result[0][1])
        citations = JSON.stringify(citations.citations)
        console.log(citations_obj)
        // Assuming the result has the reference information you need
        localStorage.setItem('referenceObject', JSON.stringify(citations_obj));
        localStorage.setItem('citations', citations);


        return output;
    } catch (err) {
        console.error('Fetch error:', err);
        throw err;
    }
};

/**
 * Generates an answer based on the given question.
 *
 * @param {string} question - The question to generate an answer for.
 * @return {Promise<Object>} A Promise that resolves to the generated answer.
 * @throws {Error} If the network response is not ok.
 */
const generate = async (question) => {
    try {
        const queryUrl = `${baseURL}/generate/${encodeURIComponent(question)}`;
        const response = await fetch(queryUrl);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        return result;
    } catch (err) {
        console.error('Fetch error:', err);
        throw err;
    }
};

/**
 * Retrieves a similarity search result from the server based on the provided question.
 *
 * @param {string} question - The question to be searched.
 * @return {Promise<Object>} A promise that resolves to the similarity search result object.
 * @throws {Error} If the network response is not ok.
 */
const get_sim = async (question) => {
    console.log("Getting Sim")
    try {
        const queryUrl = `${baseURL}/db_sim_search/${encodeURIComponent(question)}`;
        console.log(queryUrl)
        const response = await fetch(queryUrl);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log(result)
        return result;
    } catch (err) {
        console.error('Fetch error:', err);
        throw err;
    }
};

/**
 * Split the citation into its components using regex
 *
 * @param {string} citation - The citation to be parsed
 * @return {Array} An array containing the authors, title, and journal of the citation
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



const getFullOutput = () => {
    //TO DO
}



/**
 * Formats references in the given output as clickable links.
 *
 * @param {string} output - The output containing references.
 * @return {string} The formatted references as a string.
 */
const formatReferences = (output) => {
    console.log("Formatting References");
    const citationString = localStorage.getItem('citations')
    const citationObj = JSON.parse(localStorage.getItem('referenceObject'))
    const citations = JSON.parse(citationString)
    const referenceRegex = /(\[\d+\]|\d+\.)/g;
    const reference_split = output.split("References:")[1];
    const references = reference_split.match(referenceRegex);
    if (!references) {
        return 'No references available.';
    }


    // Create a list of clickable references
    const uniqueReferences = [...new Set(references)];
    console.log("Unique Ref : " + uniqueReferences)
    const referenceList = uniqueReferences.map(ref => {
        const refNumber = ref.match(/\d+/)[0];
        const citation = citations.find(citation =>  
            citation.startsWith(`[${refNumber}]`) || citation.startsWith(`${refNumber}.`)
        );
        console.log(citations);
        console.log("Citation:" + citation + " : " + refNumber)
        if (citation == undefined) {
            console.log("Undefined citation, skipping");
            return;
        };
        console.log(citationObj)
        if (citationObj[citation] == undefined) {
            return;
        }
        const PMCID = citationObj[citation]["PMCID"];
        let fullText;
        if (PMCID == 'None') {
            fullText = false;
        } else {
            fullText = true;
        }

        const iconStyle = 'width: 16px; height: 16px; vertical-align: middle; margin-right: 4px;'; // Adjust size as needed
        
        let analysisText;
        if (fullText) {
            analysisText = `<span style="color: black; font-weight: bold; border: 1px solid green; padding: 2px 4px; background-color: rgba(0, 128, 0, 0.1); display: inline-flex; align-items: center;"><img src="assets/full_text.png" alt="Full Text" style="${iconStyle}"><img src="assets/full_text.png" alt="Full Text" style="${iconStyle}">Full Text Analysis</span>`;
        } else {
            analysisText = `<span style="color: black; font-weight: bold; border: 1px solid yellow; padding: 2px 4px; background-color: rgba(255, 255, 0, 0.2); display: inline-flex; align-items: center;"><img src="assets/abstract.png" alt="Abstract Only" style="${iconStyle}">Abstract Only Analysis</span>`;
        }

        const citationInfo = parseCitation(citation);
        const authors = citationInfo[0];
        const title = citationInfo[1];
        const journal = citationInfo[2];

        citationToDisplay = `<strong>[${refNumber}] ${title}</br>${authors}<br>${journal}</strong>`;
        return `<a href="reference.html?ref=${refNumber}" target="_blank">${citationToDisplay}</a> - ${analysisText}`;
    }).filter(Boolean).join('<br><br>');

    return `<b>References:</b><br><br> ${referenceList}`;
};


/**
 * Formats the input text by replacing newline characters with `<br>`,
 * double asterisks with `<strong>`, triple hashes with `<strong>`,
 * and hyphens or asterisks with `<li>`.
 *
 * @param {string} input - The input text to be formatted.
 * @param {string} disclaimer - The disclaimer to be appended to the formatted text.
 * @return {string} The formatted text.
 */
const formatText = (input,disclaimer) => {
    // Replace \n with <br>
    let formattedText = input.replace(/\n/g, '<br>');
    // Replace **text** with <strong>text</strong>
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Replace ###
    formattedText = formattedText.replace(/### (.*?)(<br>|$)/g, '<strong>$1</strong>$2');
    // Replace "-" with <li> 
    formattedText = formattedText.replace(/[-*] (.*?)(<br>|$)/g, '<li>$1</li>');
    return formattedText;
}

/**
 * Generates a PDF document based on the formatted text content.
 */
const generatePDF = () => {
    const script = document.createElement('script');
    const text = localStorage.getItem("rawOutput");
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    document.body.appendChild(script);

    script.onload = function() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const lineHeight = 7;
        let y = 20;
        let listItemIndent = 10;
        const maxWidth = 180;
        const pageHeight = doc.internal.pageSize.height;

        // Format the text
        let formattedText = text;
        formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '**$1**');
        formattedText = formattedText.replace(/### (.*?)(\n|$)/g, '**$1**$2');
        formattedText = formattedText.replace(/^[-*] /gm, '• ');

        const lines = formattedText.split('\n');

        lines.forEach(line => {
            let x = 15;
            const isListItem = line.startsWith('• ');
            if (isListItem) {
                x += listItemIndent;
                line = line.substring(2);
            }

            const parts = line.split(/(\*\*.*?\*\*)/);

            parts.forEach(part => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    doc.setFont("helvetica", "bold");
                    part = part.slice(2, -2);
                } else {
                    doc.setFont("helvetica", "normal");
                }

                doc.setFontSize(12);
                const words = part.split(' ');
                let currentLine = '';

                words.forEach(word => {
                    const testLine = currentLine + (currentLine ? ' ' : '') + word;
                    const testWidth = doc.getTextWidth(testLine);

                    if (testWidth > maxWidth - x + 15) {
                        if (y > pageHeight - 20) {
                            doc.addPage();
                            y = 20;
                        }
                        if (isListItem && currentLine === '') {
                            doc.text('•', 15, y);
                        }
                        doc.text(currentLine, x, y);
                        y += lineHeight;
                        currentLine = word;
                        x = isListItem ? 15 + listItemIndent : 15;
                    } else {
                        currentLine = testLine;
                    }
                });

                if (currentLine) {
                    if (y > pageHeight - 20) {
                        doc.addPage();
                        y = 20;
                    }
                    if (isListItem && x === 15 + listItemIndent) {
                        doc.text('•', 15, y);
                    }
                    doc.text(currentLine, x, y);
                    x += doc.getTextWidth(currentLine) + 1;
                }
            });

            y += lineHeight;
            if (y > pageHeight - 20) {
                doc.addPage();
                y = 20;
            }
        });

        doc.save("Output.pdf");
    };
};

/**
 * Runs the generation process for the given user query.
 *
 * @param {string} userQuery - The user query to generate the search phrases for.
 * @return {Promise<void>} - A promise that resolves when the generation process is complete.
 */
async function runGeneration(userQuery) {
    const answerElement = document.getElementById('output');
    console.log("Running Generation");
    const queryInfo = await queryGeneration(userQuery);
    const queryList = queryInfo["query_list"];

    answerElement.innerText += "Generated search phrases...\n";

    const deduplicatedArticlesCollectedInfo = await collectArticles(queryList);
    const deduplicatedArticlesCollected = deduplicatedArticlesCollectedInfo["deduplicated_articles_collected"];
    const articleInfo = await articleMatching(deduplicatedArticlesCollected);
    const matchedArticles = articleInfo["matched_articles"];

    answerElement.innerText += "Matched " + matchedArticles.length + " articles already in our database...\n";

    const articlesToProcess = articleInfo["articles_to_process"];

    answerElement.innerText += "Processing " + articlesToProcess.length + " articles...\n";

    const reliabilityInfo = await reliabilityAnalysisProcessing(articlesToProcess, userQuery);
    const relevantArticleSummaries = reliabilityInfo["relevant_article_summaries"];

    await writeArticlesToDb(relevantArticleSummaries);

    const allArticleInfo = await getAllArticles(relevantArticleSummaries, matchedArticles);
    const allRelevantArticles = allArticleInfo["all_relevant_articles"];

    answerElement.innerText += "Synthesizing articles to build an answer for your question...\n";

    const finalOutputInfo = await generateFinalResponse(allRelevantArticles, userQuery);
    const finalOutput = finalOutputInfo["final_output"];
    const response_obj = finalOutputInfo["response_obj"];
}


/**
 * Handles the click event of the submit button.
 * 
 * @returns {Promise<void>} A Promise that resolves when the function completes.
 */
document.getElementById('submit').addEventListener('click', async (event) => {
    const question = document.getElementById('question').value.trim();
    const answerElement = document.getElementById('output');
    const referencesElement = document.getElementById('references');
    const resultsElement = document.getElementById('results');
    const similarQuestionsContainer = document.getElementById('similarQuestions');
    const hintElement = document.querySelector('.hint')
    const generatePdfButton = document.getElementById('generate-pdf-button');

    generatePdfButton.classList.add("hidden");

     // Get the results element
    resultsElement.style.display = 'none'
    similarQuestionsContainer.style.display = 'none'
    if (question) {
        answerElement.innerHTML = '';
        referencesElement.innerHTML = '';
        try {
            const answer = await getAnswer(question);
            console.log("Retrieved Answer:" + answer);
            resultsElement.style.display = 'flex';
            const formattedAnswer = formatText(answer);
            const formattedReferences = formatReferences(answer);
            localStorage.setItem('rawOutput', answer);
            answerElement.innerHTML = formattedAnswer;
            referencesElement.innerHTML = formattedReferences;
            hintElement.textContent = '';
            generatePdfButton.classList.remove("hidden");
        } catch (error) {
            console.log(error)
            console.log('Not in database, retrieving similiar queries...');
            hintElement.textContent = `Generating your answer may take up to 2 minutes. For an instant response, choose from the similar questions below.. If you'd prefer to proceed with generating your answer, click "Generate My Original Question"`
            similarQuestionsContainer.style.display = 'flex'
            const similar_q = await get_sim(question);
            similarQuestionsContainer.innerHTML = ''
            similar_q.forEach((similarQuestion, index) => {
                const button = document.createElement('button');
                button.textContent = similarQuestion[1];
                button.addEventListener('click', () => {
                    document.getElementById('question').value = similarQuestion[1];
                    document.getElementById('submit').click();
                });
                similarQuestionsContainer.appendChild(button);
            });

            const currentQuestionButton = document.createElement('button');
            if (similar_q.length == 0) {
                currentQuestionButton.textContent = 'We have no answers for questions that are similiar to the one you pose. It will take about 2 minutes to generate an answer. If you like us to do that, please click this button.';
            } else {
                currentQuestionButton.textContent = 'Generate an answer to my original question. This may take a minute.';

            }

            currentQuestionButton.addEventListener('click', async () => {
                try {
                    resultsElement.style.display = 'flex'
                    similarQuestionsContainer.style.display = 'none'
                    hintElement.textContent = ''
                    answerElement.innerHTML = `<textarea readonly placeholder="Answer will load here, please wait. This may take a minute. Please do not close or refresh this page...."></textarea>`;
                    referencesElement.innerHTML = `<label for="references" class="visually-hidden">References will appear here...</label><textarea id="references" readonly placeholder="References will appear here..."></textarea>`;
                    // const generatedAnswer = await generate(question);
                    // console.log("Got answer" + generatedAnswer)
                    const checkValid = await check_valid(question);
                    const checkValidResponse = checkValid["response"];
                    console.log("Check valid response: " + checkValidResponse);
                    if (checkValidResponse != "good") {
                        answerElement.innerText = checkValidResponse;
                        return;
                    }
                    await runGeneration(question)
                    document.getElementById('question').value = question;
                    document.getElementById('submit').click();


                } catch (err) {
                    console.log(err)
                    answerElement.innerHTML = '<textarea readonly placeholder="Error generating the answer. Please try again."></textarea>';
                }
            });
            similarQuestionsContainer.appendChild(currentQuestionButton);
            
        } finally {
            console.log("done");
        }
    } else {
        answerElement.innerHTML = '<textarea readonly placeholder="Please enter a question."></textarea>';
    }
});


document.getElementById('generate-pdf-button').addEventListener('click', async(event) => {
    generatePDF();
});

// Event listener for the enter key on the input field
document.getElementById('question').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default form submission behavior
        document.getElementById('submit').click();
    }
});




