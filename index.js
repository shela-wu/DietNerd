
const baseURL = window.env.API_URL;  // Adjust the base URL as needed
const disclaimer = `
DietNerd is an exploratory tool designed to enrich your conversations with a registered dietitian or registered dietitian nutritionist, who can then review your profile before providing recommendations.
Please be aware that the insights provided by DietNerd may not fully take into consideration all potential medication interactions or pre-existing conditions.
To find a local expert near you, use this website: https://www.eatright.org/find-a-nutrition-expert
`
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
// Query Generation endpoint
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

// Collect Articles endpoint
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

// Article Matching endpoint
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

// Reliability Analysis Processing endpoint
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

// Write Articles to DB endpoint
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

// Function to generate an answer if not found in the database
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


// Function to format references as clickable links
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


// Event listener for the submit button
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


