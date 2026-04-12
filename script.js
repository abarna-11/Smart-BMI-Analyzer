// 🔥 Elements
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

// 📊 State
let chart;
let tipsData = {};
let extraData = {};
let currentGoal = "";

// 📦 Load JSON
async function loadData() {
  try {
    const tipsRes = await fetch('tips.json');
    tipsData = await tipsRes.json();

    const extraRes = await fetch('dietWorkout.json');
    extraData = await extraRes.json();
  } catch (err) {
    console.error("JSON Load Error:", err);
  }
}
loadData();

// 🌙 Dark Mode
toggleBtn.onclick = () => {
  document.body.classList.toggle('dark');
  toggleBtn.innerText = document.body.classList.contains('dark') ? "☀️" : "🌙";
};

// 📊 BMI Calculation
calculateBtn.onclick = () => {
  const weight = parseFloat($('weight').value);
  const height = parseFloat($('height').value);
  const resultDiv = $('bmiResult');

  if (!weight || !height) {
    showError("⚠️ Enter valid weight & height");
    return;
  }

  const bmi = (weight / ((height / 100) ** 2)).toFixed(2);
  const category = getCategory(bmi);

  // 🎯 Result UI
  resultDiv.innerHTML = `
    <h2>${bmi}</h2>
    <p>${category}</p>
    <small>${getMessage(category)}</small>
  `;

  // Show sections
  $('goalSection').style.display = "block";
  tabs.style.display = "none";
  tipsBox.innerHTML = "";

  animateMeter(bmi);
  renderChart(bmi);
};

// 📊 Category
function getCategory(bmi) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

// 💬 Smart Message
function getMessage(category) {
  const messages = {
    Underweight: "You need more nutrition 💪",
    Normal: "Perfect! Maintain your lifestyle 👌",
    Overweight: "Time to get active 🔥",
    Obese: "Focus on health seriously ❤️"
  };
  return messages[category];
}

// 🚨 Error
function showError(msg) {
  const resultDiv = $('bmiResult');
  resultDiv.innerHTML = `<p style="color:#ef4444">${msg}</p>`;
}

// 📈 Meter Animation
function animateMeter(bmi) {
  const meter = $('meterFill');
  meter.style.width = "0%";

  setTimeout(() => {
    meter.style.width = Math.min((bmi / 40) * 100, 100) + "%";
  }, 200);
}

// 📊 Chart
function renderChart(bmi) {
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
      animation: {
        duration: 1000
      },
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          display: false
        }
      }
    }
  });
}

// 🎯 Goal Selection
gainBtn.onclick = () => selectGoal('gain');
loseBtn.onclick = () => selectGoal('lose');

function selectGoal(goal) {
  currentGoal = goal;

  tabs.style.display = "flex";
  tipsBox.innerHTML = "👉 Select a category";

  // Highlight active button
  gainBtn.classList.remove('active');
  loseBtn.classList.remove('active');
  goal === 'gain' ? gainBtn.classList.add('active') : loseBtn.classList.add('active');
}

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

    let html = `<h3>${type.toUpperCase()}</h3><ul class="premium-list">`;

    tipsData[currentGoal][type].forEach(tip => {
      html += `<li>✔ ${tip}</li>`;
    });

    html += "</ul>";

    tipsBox.innerHTML = html;
  });
});

// 🍽 Diet Plan Modal
dietBtn.onclick = () => {
  if (!currentGoal || !extraData[currentGoal]) {
    showError("⚠️ Select goal first");
    return;
  }

  const diet = extraData[currentGoal].diet;

  let html = `<h2>🍽 Diet Plan</h2>`;

  for (let meal in diet) {
    html += `
      <div class="plan-card">
        <h4>${meal}</h4>
        <ul>
          ${diet[meal].map(item => `<li>${item}</li>`).join("")}
        </ul>
      </div>
    `;
  }

  openModal(html);
};

// 🏋️ Workout Modal
workoutBtn.onclick = () => {
  if (!currentGoal || !extraData[currentGoal]) {
    showError("⚠️ Select goal first");
    return;
  }

  const workout = extraData[currentGoal].workout;

  let html = `<h2>🏋️ Workout Plan</h2><ul>`;

  for (let day in workout) {
    html += `<li><strong>${day}:</strong> ${workout[day]}</li>`;
  }

  html += "</ul>";

  openModal(html);
};

// 💡 Open Modal
function openModal(content) {
  modalBody.innerHTML = content;
  modal.style.display = "flex";

  modalBody.style.animation = "fadeIn 0.4s ease";
}

// ❌ Close Modal
closeModal.onclick = () => modal.style.display = "none";
window.onclick = e => {
  if (e.target === modal) modal.style.display = "none";
};

// 🧹 Clear
clearBtn.onclick = () => {
  $('weight').value = '';
  $('height').value = '';
  $('bmiResult').innerHTML = '';
  $('meterFill').style.width = "0%";
  tipsBox.innerHTML = "";
  tabs.style.display = "none";
  $('goalSection').style.display = "none";

  if (chart) chart.destroy();
};

// 📥 Download
downloadBtn.onclick = () => {
  const text = $('bmiResult').innerText;

  if (!text) {
    showError("⚠️ Calculate first");
    return;
  }

  const blob = new Blob([text], { type: 'text/plain' });
  const link = document.createElement('a');

  link.download = 'BMI_Result.txt';
  link.href = URL.createObjectURL(blob);
  link.click();
};
