const $ = id => document.getElementById(id);

const calculateBtn = $('calculateBtn');
const clearBtn = $('clearBtn');
const downloadBtn = $('downloadBtn');
const toggleBtn = $('toggleMode');

const gainBtn = $('gainBtn');
const loseBtn = $('loseBtn');

const tabs = $('categoryTabs');
const tipsBox = $('tipsBox');

const dietBtn = $('dietBtn');
const workoutBtn = $('workoutBtn');

const modal = $('modal');
const modalBody = $('modalBody');
const closeModal = $('closeModal');

let chart;
let tipsData = {};
let extraData = {};
let currentGoal = "";

// Load JSON
fetch('tips.json').then(res => res.json()).then(data => tipsData = data);
fetch('dietWorkout.json').then(res => res.json()).then(data => extraData = data);

// 🌙 Toggle Mode
toggleBtn.onclick = () => {
  document.body.classList.toggle('dark');

  toggleBtn.innerText =
    document.body.classList.contains('dark') ? "🌙" : "☀️";
};

// 📊 Calculate
calculateBtn.onclick = () => {
  const weight = parseFloat($('weight').value);
  const height = parseFloat($('height').value);

  if (!weight || !height) {
    $('bmiResult').innerText = "⚠️ Enter valid data";
    return;
  }

  const bmi = (weight / ((height / 100) ** 2)).toFixed(2);

  let category = "";
  if (bmi < 18.5) category = "Underweight";
  else if (bmi < 25) category = "Normal";
  else if (bmi < 30) category = "Overweight";
  else category = "Obese";

  $('bmiResult').innerHTML = `<h2>${bmi}</h2><p>${category}</p>`;

  // Show only goal section
  $('goalSection').style.display = "block";
  tabs.style.display = "none";
  document.querySelector('.extra-section').style.display = "none";
  tipsBox.innerHTML = "";

  // Meter
  const meter = $('meterFill');
  meter.style.width = "0%";
  setTimeout(() => {
    meter.style.width = Math.min((bmi / 40) * 100, 100) + "%";
  }, 200);

  // Chart
  const ctx = $('bmiChart').getContext('2d');
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Under', 'Normal', 'Over', 'Obese'],
      datasets: [{
        data: [
          bmi < 18.5 ? bmi : 0,
          (bmi >= 18.5 && bmi < 25) ? bmi : 0,
          (bmi >= 25 && bmi < 30) ? bmi : 0,
          bmi >= 30 ? bmi : 0
        ],
        borderRadius: 10
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { display: false } }
    }
  });
};

// 🎯 Goal
function selectGoal(goal) {
  currentGoal = goal;

  tabs.style.display = "flex";
  document.querySelector('.extra-section').style.display = "block";

  tipsBox.innerHTML = "👉 Select a category";

  gainBtn.classList.remove('active');
  loseBtn.classList.remove('active');
  goal === 'gain'
    ? gainBtn.classList.add('active')
    : loseBtn.classList.add('active');
}

gainBtn.onclick = () => selectGoal('gain');
loseBtn.onclick = () => selectGoal('lose');

// 📂 Tabs
document.querySelectorAll('#categoryTabs button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#categoryTabs button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const type = btn.dataset.type;

    if (!tipsData[currentGoal]?.[type]) {
      tipsBox.innerHTML = "No tips available";
      return;
    }

    let html = "<ul>";
    tipsData[currentGoal][type].forEach(t => html += `<li>✔ ${t}</li>`);
    html += "</ul>";

    tipsBox.innerHTML = html;
  });
});

// 🍽 Modal
dietBtn.onclick = () => openPlan('diet');
workoutBtn.onclick = () => openPlan('workout');

function openPlan(type) {
  if (!currentGoal) return alert("Select goal first");

  let data = extraData[currentGoal][type];
  let html = `<h3>${type.toUpperCase()}</h3>`;

  for (let key in data) {
    html += `<strong>${key}</strong><ul>`;
    data[key].forEach(item => html += `<li>${item}</li>`);
    html += "</ul>";
  }

  modalBody.innerHTML = html;
  modal.style.display = "flex";
}

// Close Modal
closeModal.onclick = () => modal.style.display = "none";
window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };

// Clear
clearBtn.onclick = () => {
  $('weight').value = '';
  $('height').value = '';
  $('bmiResult').innerHTML = '';
  $('meterFill').style.width = "0%";

  $('goalSection').style.display = "none";
  tabs.style.display = "none";
  document.querySelector('.extra-section').style.display = "none";

  tipsBox.innerHTML = "";

  if (chart) chart.destroy();
};

// Download
downloadBtn.onclick = () => {
  const text = $('bmiResult').innerText;
  if (!text) return alert("Calculate first");

  const blob = new Blob([text], { type: 'text/plain' });
  const link = document.createElement('a');
  link.download = 'BMI_Result.txt';
  link.href = URL.createObjectURL(blob);
  link.click();
};
