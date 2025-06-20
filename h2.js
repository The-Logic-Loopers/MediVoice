// Navigation logic
const navLinks = document.querySelectorAll('.nav-link');
const pages = {
  home: document.getElementById('homePage'),
  appointments: document.getElementById('appointmentsPage'),
  doctors: document.getElementById('doctorsPage')
};
const pageTitle = document.getElementById('pageTitle');

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    Object.values(pages).forEach(page => page.style.display = 'none');
    const page = link.getAttribute('data-page');
    pages[page].style.display = '';
    pageTitle.textContent = link.textContent.replace(/^[^a-zA-Z]+/, '');
    if (page === "appointments") renderAppointments();
  });
});

// Voice input for individual fields
function startListening(fieldId) {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';

  recognition.onresult = function(event) {
    const speechText = event.results[0][0].transcript;
    document.getElementById(fieldId).value = speechText;
  };

  recognition.start();
}

// Appointment form submission with Local Storage
document.getElementById("appointmentForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const appointment = {
    name: document.getElementById("name").value,
    age: document.getElementById("age").value,
    department: document.getElementById("department").value,
    symptoms: document.getElementById("symptoms").value,
    time: document.getElementById("time").value,
    createdAt: new Date().toLocaleString()
  };

  // Local Storage
  let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
  appointments.push(appointment);
  localStorage.setItem("appointments", JSON.stringify(appointments));

  document.getElementById("confirmation").innerText = "Appointment booked successfully!";
  setTimeout(() => {
    document.getElementById("confirmation").innerText = "";
  }, 3000);
  document.getElementById("appointmentForm").reset();
  renderAppointments();
});

// Render appointments list
function renderAppointments() {
  const appointmentsList = document.getElementById("appointmentsList");
  let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
  if (appointments.length === 0) {
    appointmentsList.innerHTML = "";
    return;
  }
  let html = "<h3>Booked Appointments</h3>";
  appointments.slice().reverse().forEach(app => {
    html += `<div class="appointment-item">
      <strong>${app.name}</strong> (${app.age} yrs) - <em>${app.department}</em><br>
      <span>Symptoms: ${app.symptoms}</span><br>
      <span>Time: ${app.time}</span><br>
      <small>Booked at: ${app.createdAt}</small>
    </div>`;
  });
  appointmentsList.innerHTML = html;
}

// Show appointments on first load if on appointments page
if (pages.appointments.style.display !== "none") {
  renderAppointments();
}
