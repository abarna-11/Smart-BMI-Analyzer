const calculateBtn = document.getElementById('calculateBtn');
const clearBtn = document.getElementById('clearBtn');
const downloadBtn = document.getElementById('downloadBtn');

let chart;

// CLICK EVENT (no auto now)
calculateBtn.addEventListener('click', calculateBMI);

function calculateBMI() {
  const weight = parseFloat(document.getElementById('weight').value);
  const heightCm = parseFloat(document.getElementById('height').value);
  const age = parseInt(document.getElementById('age').value);
  const gender = document.querySelector('input[name="gender"]:checked').value;
  const resultDiv = document.getElementById('bmiResult');

  if (!weight || !heightCm) {
    resultDiv.innerText = "⚠️ Enter weight & height";
    return;
  }

  const heightM = heightCm / 100;
  const bmi = (weight / (heightM * heightM)).toFixed(2);

  let category = "", color = "green";

  if (bmi < 18.5) {
    category = "Underweight"; color = "#3498db";
  } else if (bmi < 25) {
    category = "Normal"; color = "#2ecc71";
  } else if (bmi < 30) {
    category = "Overweight"; color = "#f39c12";
  } else {
    category = "Obese"; color = "#e74c3c";
  }

  resultDiv.innerHTML = `
    <strong>BMI:</strong> ${bmi} (${category})
  `;

  // 🔥 BMI METER
  const meter = document.getElementById("meterFill");
  const percentage = Math.min((bmi / 40) * 100, 100);
  meter.style.width = percentage + "%";
  meter.style.background = color;

  // 🔥 GRAPH (Chart.js)
  const ctx = document.getElementById('bmiChart').getContext('2d');

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Underweight', 'Normal', 'Overweight', 'Obese'],
      datasets: [{
        label: 'BMI Level',
        data: [
          bmi < 18.5 ? bmi : 0,
          (bmi >= 18.5 && bmi < 25) ? bmi : 0,
          (bmi >= 25 && bmi < 30) ? bmi : 0,
          bmi >= 30 ? bmi : 0
        ]
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// CLEAR
clearBtn.addEventListener('click', () => {
  document.getElementById('weight').value = '';
  document.getElementById('height').value = '';
  document.getElementById('age').value = '';
  document.getElementById('bmiResult').innerHTML = '';
  document.getElementById('meterFill').style.width = "0%";

  if (chart) chart.destroy();
});

// DOWNLOAD
downloadBtn.addEventListener('click', () => {
  const text = document.getElementById('bmiResult').innerText;

  if (!text) return alert("⚠️ Calculate first");

  const blob = new Blob([text], { type: 'text/plain' });
  const link = document.createElement('a');
  link.download = 'BMI_Result.txt';
  link.href = URL.createObjectURL(blob);
  link.click();
});
