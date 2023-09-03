const CodeForm = document.getElementById('Code-form');
const verificationInput = document.getElementById('verification');
const CodeList = document.getElementById('Code-list');
const alertMessage = document.getElementById('alertMessage');

async function fetchCodes() {
  const response = await fetch('/getCodes');
  const Codes = await response.json();
  return Codes;
}

async function displayCodes() {
  const Codes = await fetchCodes();
  CodeList.innerHTML = '';
  Codes.forEach(Code => {
    const CodeItem = document.createElement('li');
    const CodeLink = document.createElement('a');
    CodeLink.href = `/message/${Code.id}`;
    CodeLink.textContent = `${Code.author}`;
    CodeLink.classList.add('subject');
    CodeItem.appendChild(CodeLink);
    CodeList.appendChild(CodeItem);
  });
}

CodeForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get the verification value
  const verification = verificationInput.value;

  const formData = new FormData(CodeForm);
  formData.append('verification', verification); // Add verification to form data

  const response = await fetch('/addCode', {
    method: 'POST',
    body: JSON.stringify(Object.fromEntries(formData)),
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    alertMessage.textContent = ''; // Clear any previous alert message
    displayCodes();
    CodeForm.reset(); // Clear the form
  } else if (response.status === 403) {
    alertMessage.textContent = 'Verification failed. Secret word is incorrect. Please try again.';
  }
});

displayCodes();
// Define the search form and alert element
const searchForm = document.getElementById('search-form');
const searchAlertMessage = document.getElementById('search-alertMessage');

// Add an event listener to the search form
searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get the search parameters
  const searchAuthor = document.getElementById('search-author').value;
  const searchVerification = document.getElementById('search-verification').value;

  // Clear previous search results
  CodeList.innerHTML = '';

  // Fetch and display codes that match the search criteria
  const filteredCodes = await fetchCodes();
  filteredCodes.forEach((Code) => {
    if (Code.author === searchAuthor && Code.verification === searchVerification) {
      const CodeItem = document.createElement('li');
      const CodeLink = document.createElement('a');
      CodeLink.href = `/message/${Code.id}`;
      CodeLink.textContent = `${Code.author}`;

      // Add the 'subject' class to the anchor element
      CodeLink.classList.add('subject');

      CodeItem.appendChild(CodeLink);
      CodeList.appendChild(CodeItem);
    }
  });

  // Display a message if no matching codes were found
  if (CodeList.childElementCount === 0) {
    searchAlertMessage.textContent = 'No matching codes found.';
  } else {
    searchAlertMessage.textContent = ''; // Clear any previous alert message
  }
});
