const weightInput = document.getElementById('weight');
const heightInput = document.getElementById('height');
const resultDiv = document.getElementById('bmiResult');
const clearBtn = document.getElementById('clearBtn');
const downloadBtn = document.getElementById('downloadBtn');

let debounceTimer;

// Auto calculate
weightInput.addEventListener('input', autoCalculate);
heightInput.addEventListener('input', autoCalculate);

function autoCalculate() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(calculateBMI, 300);
}

function calculateBMI() {
  const weight = parseFloat(weightInput.value);
  const heightCm = parseFloat(heightInput.value);

  if (!weight || !heightCm) {
    resultDiv.className = 'output-box';
    resultDiv.innerText = '⚠️ Please enter both weight and height.';
    return;
  }

  const heightM = heightCm / 100;
  const bmi = (weight / (heightM * heightM)).toFixed(2);

  let category = '', className = '', suggestion = '';

  if (bmi < 18.5) {
    category = 'Underweight';
    className = 'bmi-underweight';
    suggestion = 'Increase healthy calories with proteins & carbs.';
  } else if (bmi < 25) {
    category = 'Normal';
    className = 'bmi-normal';
    suggestion = 'Perfect! Keep exercising and eating balanced.';
  } else if (bmi < 30) {
    category = 'Overweight';
    className = 'bmi-overweight';
    suggestion = 'Consider more physical activity.';
  } else {
    category = 'Obese';
    className = 'bmi-obese';
    suggestion = 'Consult a health professional.';
  }

  const ideal = (heightM * heightM * 22);
  const idealMin = (ideal - 2.5).toFixed(1);
  const idealMax = (ideal + 2.5).toFixed(1);

  resultDiv.className = 'output-box ' + className;
  resultDiv.innerHTML = `
    <strong>Your BMI:</strong> ${bmi} (${category})<br>
    💡 Ideal Weight: ${idealMin} kg – ${idealMax} kg<br>
    🧠 <em>${suggestion}</em>
  `;
}

// Clear
clearBtn.addEventListener('click', () => {
  weightInput.value = '';
  heightInput.value = '';
  resultDiv.innerHTML = '';
  resultDiv.className = 'output-box';
});

// Download
downloadBtn.addEventListener('click', () => {
  const text = resultDiv.innerText;

  if (!text) {
    alert('⚠️ Please calculate BMI first.');
    return;
  }

  const blob = new Blob([text], { type: 'text/plain' });
  const link = document.createElement('a');
  link.download = 'BMI_Result.txt';
  link.href = URL.createObjectURL(blob);
  link.click();
});
