// Buttons
const calculateBtn = document.getElementById('calculateBtn');
const clearBtn = document.getElementById('clearBtn');
const downloadBtn = document.getElementById('downloadBtn');
const toggleBtn = document.getElementById('toggleMode');

const gainBtn = document.getElementById('gainBtn');
const loseBtn = document.getElementById('loseBtn');

const tabs = document.getElementById('categoryTabs');
const tipsBox = document.getElementById('tipsBox');

const dietBtn = document.getElementById('dietBtn');
const workoutBtn = document.getElementById('workoutBtn');

// Modal
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');

// Data
let chart;
let tipsData = {};
let extraData = {};
let currentGoal = "";

// Load JSON
fetch('tips.json').then(res => res.json()).then(data => tipsData = data);
fetch('dietWorkout.json').then(res => res.json()).then(data => extraData = data);

// 🌙 Dark mode
toggleBtn.onclick = () => {
  document.body.classList.toggle('dark');
};

// 📊 Calculate BMI
calculateBtn.onclick = () => {
  const weight = parseFloat(document.getElementById('weight').value);
  const height = parseFloat(document.getElementById('height').value);
  const resultDiv = document.getElementById('bmiResult');

  if (!weight || !height) {
    resultDiv.innerText = "⚠️ Please enter weight and height.";
    return;
  }

  const bmi = (weight / ((height / 100) ** 2)).toFixed(2);

  let category = "";
  if (bmi < 18.5) category = "Underweight";
  else if (bmi < 25) category = "Normal";
  else if (bmi < 30) category = "Overweight";
  else category = "Obese";

  resultDiv.innerHTML = `<strong>BMI:</strong> ${bmi} (${category})`;

  // Show sections
  document.getElementById('goalSection').style.display = "flex";
  tabs.style.display = "none";
  tipsBox.innerHTML = "";

  // Meter animation
  const meter = document.getElementById("meterFill");
  meter.style.width = "0%";
  setTimeout(() => {
    meter.style.width = Math.min((bmi / 40) * 100, 100) + "%";
  }, 200);

  // Graph
  const ctx = document.getElementById('bmiChart').getContext('2d');
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Underweight', 'Normal', 'Overweight', 'Obese'],
      datasets: [{
        data: [
          bmi < 18.5 ? bmi : 0,
          (bmi >= 18.5 && bmi < 25) ? bmi : 0,
          (bmi >= 25 && bmi < 30) ? bmi : 0,
          bmi >= 30 ? bmi : 0
        ]
      }]
    },
    options: {
      plugins: { legend: { display: false } }
    }
  });
};

// 🎯 Select Goal
gainBtn.onclick = () => selectGoal('gain');
loseBtn.onclick = () => selectGoal('lose');

function selectGoal(goal) {
  currentGoal = goal;
  tabs.style.display = "flex";
  tipsBox.innerHTML = "👉 Select a category";
}

// 📂 Tabs (Diet / Workout / Lifestyle tips)
document.querySelectorAll('#categoryTabs button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#categoryTabs button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const type = btn.dataset.type;

    if (!tipsData[currentGoal] || !tipsData[currentGoal][type]) {
      tipsBox.innerHTML = "No tips available";
      return;
    }

    let html = `<h3>${type.toUpperCase()} TIPS</h3><ul>`;
    tipsData[currentGoal][type].forEach(tip => {
      html += `<li>${tip}</li>`;
    });
    html += "</ul>";

    tipsBox.innerHTML = html;
  });
});

// 🍽 Diet Plan (MODAL)
dietBtn.onclick = () => {
  if (!currentGoal || !extraData[currentGoal]) {
    alert("⚠️ Select goal first");
    return;
  }

  let diet = extraData[currentGoal].diet;
  let html = `<h3>🍽 Diet Plan</h3>`;

  for (let meal in diet) {
    html += `<strong>${meal}</strong><ul>`;
    diet[meal].forEach(item => html += `<li>${item}</li>`);
    html += "</ul>";
  }

  modalBody.innerHTML = html;
  modal.style.display = "flex";
};

// 🏋️ Workout Plan (MODAL)
workoutBtn.onclick = () => {
  if (!currentGoal || !extraData[currentGoal]) {
    alert("⚠️ Select goal first");
    return;
  }

  let workout = extraData[currentGoal].workout;
  let html = `<h3>🏋️ Weekly Workout Plan</h3><ul>`;

  for (let day in workout) {
    html += `<li><strong>${day}:</strong> ${workout[day]}</li>`;
  }

  html += "</ul>";

  modalBody.innerHTML = html;
  modal.style.display = "flex";
};

// ❌ Close Modal
closeModal.onclick = () => modal.style.display = "none";
window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

// 🧹 Clear
clearBtn.onclick = () => {
  document.getElementById('weight').value = '';
  document.getElementById('height').value = '';
  document.getElementById('bmiResult').innerHTML = '';
  document.getElementById('meterFill').style.width = "0%";
  tipsBox.innerHTML = "";
  tabs.style.display = "none";
  document.getElementById('goalSection').style.display = "none";

  if (chart) chart.destroy();
};

// 📥 Download
downloadBtn.onclick = () => {
  const text = document.getElementById('bmiResult').innerText;
  if (!text) return alert("⚠️ Calculate first");

  const blob = new Blob([text], { type: 'text/plain' });
  const link = document.createElement('a');
  link.download = 'BMI_Result.txt';
  link.href = URL.createObjectURL(blob);
  link.click();
};
