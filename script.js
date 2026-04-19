// 🔥 Helper
const $ = id => document.getElementById(id);

// 🔥 Elements
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

const loader = $('loader');

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

// 🌙 Dark Mode (FIXED + SAVE)
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
  toggleBtn.innerText = "☀️";
}

toggleBtn.onclick = () => {
  document.body.classList.toggle('light');

  const isLight = document.body.classList.contains('light');
  toggleBtn.innerText = isLight ? "☀️" : "🌙";

  localStorage.setItem("theme", isLight ? "light" : "dark");
};

// 📊 BMI Calculation
calculateBtn.onclick = () => {
  const weight = parseFloat($('weight').value);
  const height = parseFloat($('height').value);

  if (!weight || !height) {
    showError("⚠️ Enter valid weight & height");
    return;
  }

  loader.classList.remove("hidden");

  setTimeout(() => {
    const bmi = (weight / ((height / 100) ** 2)).toFixed(2);
    const category = getCategory(bmi);

    const resultDiv = $('bmiResult');
    resultDiv.classList.remove("hidden");

    resultDiv.innerHTML = `
      <h2>${bmi}</h2>
      <p>${category}</p>
      <small>${getMessage(category)}</small>
    `;

    // Show sections
    $('goalSection').classList.remove("hidden");
    $('tipsSection').classList.remove("hidden");
    $('aiSection').classList.remove("hidden");

    tabs.style.display = "none";
    tipsBox.innerHTML = `<p class="empty-state">Select your goal 👇</p>`;

    animateMeter(bmi);
    renderChart(bmi);

    loader.classList.add("hidden");
  }, 700);
};

// 📊 Category
function getCategory(bmi) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

// 💬 Message
function getMessage(category) {
  return {
    Underweight: "You need more nutrition 💪",
    Normal: "Perfect! Maintain your lifestyle 👌",
    Overweight: "Time to get active 🔥",
    Obese: "Focus on health seriously ❤️"
  }[category];
}

// 🚨 Error
function showError(msg) {
  const resultDiv = $('bmiResult');
  resultDiv.classList.remove("hidden");
  resultDiv.innerHTML = `<p style="color:#ef4444">${msg}</p>`;
}

// 📈 Meter
function animateMeter(bmi) {
  const meter = $('meterFill');
  meter.parentElement.classList.remove("hidden");

  meter.style.width = "0%";

  setTimeout(() => {
    meter.style.width = Math.min((bmi / 40) * 100, 100) + "%";
  }, 200);
}

// 📊 Chart
function renderChart(bmi) {
  const chartBox = document.querySelector('.chart-box');
  chartBox.classList.remove("hidden");

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
        borderRadius: 12
      }]
    },
    options: {
      animation: { duration: 1200 },
      plugins: { legend: { display: false } },
      scales: { y: { display: false } }
    }
  });
}

// 🎯 Goal Selection
gainBtn.onclick = () => selectGoal('gain');
loseBtn.onclick = () => selectGoal('lose');

function selectGoal(goal) {
  currentGoal = goal;

  tabs.style.display = "flex";
  tipsBox.innerHTML = "👉 Select category above";

  gainBtn.classList.toggle('active', goal === 'gain');
  loseBtn.classList.toggle('active', goal === 'lose');
}

// 📂 Tabs (UPDATED FOR PREMIUM JSON)
document.querySelectorAll('#categoryTabs button').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('#categoryTabs button')
      .forEach(b => b.classList.remove('active'));

    btn.classList.add('active');

    const type = btn.dataset.type;
    const data = tipsData[currentGoal]?.[type];

    if (!data) {
      tipsBox.innerHTML = "No tips available";
      return;
    }

    let html = `
      <h3>${data.title}</h3>
      <p class="tips-desc">${data.description}</p>
      <ul class="premium-list">
    `;

    data.tips.forEach(tip => {
      html += `<li>${tip.icon} ${tip.text}</li>`;
    });

    html += "</ul>";

    tipsBox.innerHTML = html;
  };
});

// 🍽 Diet Modal (UPDATED)
dietBtn.onclick = () => {
  if (!currentGoal) return showError("⚠️ Select goal first");

  const diet = extraData[currentGoal]?.diet;
  if (!diet) return;

  let html = `<h2>🍽 Diet Plan</h2>`;

  for (let meal in diet) {
    const mealData = diet[meal];

    html += `
      <div class="plan-card">
        <h4>${meal}</h4>
        <p class="calories">${mealData.calories}</p>
        <ul>
          ${mealData.items.map(i => `<li>${i}</li>`).join("")}
        </ul>
        <small>${mealData.tip}</small>
      </div>
    `;
  }

  openModal(html);
};

// 🏋️ Workout Modal (UPDATED)
workoutBtn.onclick = () => {
  if (!currentGoal) return showError("⚠️ Select goal first");

  const workout = extraData[currentGoal]?.workout;
  if (!workout) return;

  let html = `<h2>🏋️ Workout Plan</h2>`;

  for (let day in workout) {
    const w = workout[day];

    html += `
      <div class="plan-card">
        <h4>${day}</h4>
        <p><strong>${w.plan || ""}</strong></p>
        <p>${w.exercises || ""}</p>
        <small>⏱ ${w.duration || ""} | 🔥 ${w.intensity || ""}</small>
      </div>
    `;
  }

  openModal(html);
};

// 💡 Modal
function openModal(content) {
  modalBody.innerHTML = content;
  modal.classList.add("show");
}

// ❌ Close Modal
closeModal.onclick = () => modal.classList.remove("show");
window.onclick = e => {
  if (e.target === modal) modal.classList.remove("show");
};

// 🧹 Clear
clearBtn.onclick = () => {
  $('weight').value = '';
  $('height').value = '';

  $('bmiResult').innerHTML = '';
  $('bmiResult').classList.add("hidden");

  $('meterFill').style.width = "0%";
  document.querySelector('.meter').classList.add("hidden");
  document.querySelector('.chart-box').classList.add("hidden");

  $('goalSection').classList.add("hidden");
  $('tipsSection').classList.add("hidden");
  $('aiSection').classList.add("hidden");

  tabs.style.display = "none";
  tipsBox.innerHTML = "";

  currentGoal = "";

  if (chart) chart.destroy();
};

// 📥 Download
downloadBtn.onclick = () => {
  const text = $('bmiResult').innerText;

  if (!text) return showError("⚠️ Calculate first");

  const blob = new Blob([text], { type: 'text/plain' });
  const link = document.createElement('a');

  link.download = 'BMI_Result.txt';
  link.href = URL.createObjectURL(blob);
  link.click();
};
