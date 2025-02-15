// Simulated client data (for demonstration)
const clients = [
  { username: "admin", password: "admin" },
  { username: "client2", password: "password2" },
];

// Fetch SAR to PKR exchange rate
async function getExchangeRate() {
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/SAR');
    const data = await response.json();
    return data.rates.PKR;
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return 45; // Fallback rate if API fails
  }
}

// Show dialog box with results
function showDialog(content) {
  const dialog = document.getElementById('result-dialog');
  const resultContent = document.getElementById('result-content');
  resultContent.innerHTML = content;
  dialog.style.display = 'flex';
}

// Close dialog box
function closeDialog() {
  const dialog = document.getElementById('result-dialog');
  dialog.style.display = 'none';
}

// Toggle accommodation details visibility
function toggleAccommodationDetails() {
  const accommodationDetails = document.getElementById('accommodation-details');
  const isChecked = document.getElementById('accommodation-checkbox').checked;
  accommodationDetails.style.display = isChecked ? 'flex' : 'none';
}

// Calculate total cost
async function calculateCost() {
  const exchangeRate = await getExchangeRate();

  // Get additional services cost
  const flightCost = document.getElementById('flight-checkbox').checked ? parseFloat(document.getElementById('flight-cost').value) || 0 : 0;
  const visaCost = document.getElementById('visa-checkbox').checked ? parseFloat(document.getElementById('visa-cost').value) * exchangeRate || 0 : 0;

  // Check if accommodation is selected
  const isAccommodationChecked = document.getElementById('accommodation-checkbox').checked;

  let totalCost = flightCost + visaCost;
  let resultContent = '';

  if (isAccommodationChecked) {
    const makkahNights = parseInt(document.getElementById('makkah-nights').value) || 0;
    const medinaNights = parseInt(document.getElementById('medina-nights').value) || 0;

    // Get selected Makkah accommodation type and rate
    const makkahAccommodation = document.querySelector('input[name="makkah-accommodation"]:checked').value;
    const makkahRate = parseFloat(document.getElementById(`makkah-${makkahAccommodation}-rate`).value);

    // Get selected Medina accommodation type and rate
    const medinaAccommodation = document.querySelector('input[name="medina-accommodation"]:checked').value;
    const medinaRate = parseFloat(document.getElementById(`medina-${medinaAccommodation}-rate`).value);

    // Calculate accommodation costs
    const makkahCost = makkahNights * makkahRate * exchangeRate;
    const medinaCost = medinaNights * medinaRate * exchangeRate;

    totalCost += makkahCost + medinaCost;

    resultContent += `
      <p>Makkah Accommodation Charges: ${makkahCost.toFixed(2)} PKR</p>
      <p>Medina Accommodation Charges: ${medinaCost.toFixed(2)} PKR</p>
    `;
  }

  if (flightCost > 0) resultContent += `<p>Flight Charges: ${flightCost.toFixed(2)} PKR</p>`;
  if (visaCost > 0) resultContent += `<p>Visa Charges: ${visaCost.toFixed(2)} PKR</p>`;

  resultContent += `<p><strong>Total Charges: ${totalCost.toFixed(2)} PKR</strong></p>`;

  // Show results in dialog box
  showDialog(resultContent);

  // Save to backend (simulated using localStorage)
  localStorage.setItem('totalCost', totalCost.toFixed(2));
  console.log('Total cost saved to backend:', totalCost.toFixed(2));
}

// Handle login form submission
document.getElementById('login-form').addEventListener('submit', function (event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const client = clients.find(c => c.username === username && c.password === password);
  if (client) {
    //alert('Login successful!');
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('main-content').classList.remove('hidden');
    document.getElementById('logout-button').classList.remove('hidden');
  } else {
    alert('Invalid username or password.');
  }
});

// Handle logout
document.getElementById('logout-button').addEventListener('click', function () {
  //alert('Logged out successfully!');
  document.getElementById('login-section').classList.remove('hidden');
  document.getElementById('main-content').classList.add('hidden');
  document.getElementById('logout-button').classList.add('hidden');
});

// Toggle accommodation details on checkbox change
document.getElementById('accommodation-checkbox').addEventListener('change', toggleAccommodationDetails);

// Initialize accommodation details visibility
toggleAccommodationDetails();