const calculateBtn = document.getElementById('calculateBtn');
const clearBtn = document.getElementById('clearBtn');
const downloadBtn = document.getElementById('downloadBtn');
const toggleBtn = document.getElementById('toggleMode');

let chart;

// Dark Mode Toggle
toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// Calculate
calculateBtn.addEventListener('click', () => {
  const weight = parseFloat(document.getElementById('weight').value);
  const height = parseFloat(document.getElementById('height').value);
  const resultDiv = document.getElementById('bmiResult');

  if (!weight || !height) {
    resultDiv.innerText = "⚠️ Enter values";
    return;
  }

  const bmi = (weight / ((height/100) ** 2)).toFixed(2);

  let category = "", suggestion = "";

  if (bmi < 18.5) {
    category = "Underweight";
    suggestion = "Eat more nutritious food.";
  } else if (bmi < 25) {
    category = "Normal";
    suggestion = "Keep your lifestyle balanced.";
  } else if (bmi < 30) {
    category = "Overweight";
    suggestion = "Exercise regularly.";
  } else {
    category = "Obese";
    suggestion = "Consult a health expert.";
  }

  resultDiv.innerHTML = `
    <strong>BMI:</strong> ${bmi} (${category})<br>
    🧠 ${suggestion}
  `;

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
});

// Clear
clearBtn.addEventListener('click', () => {
  document.getElementById('weight').value = '';
  document.getElementById('height').value = '';
  document.getElementById('bmiResult').innerHTML = '';
  document.getElementById('meterFill').style.width = "0%";
  if (chart) chart.destroy();
});

// Download
downloadBtn.addEventListener('click', () => {
  const text = document.getElementById('bmiResult').innerText;
  if (!text) return alert("Calculate first");

  const blob = new Blob([text], { type: 'text/plain' });
  const link = document.createElement('a');
  link.download = 'BMI_Result.txt';
  link.href = URL.createObjectURL(blob);
  link.click();
});
