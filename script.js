function calculateBMI() {
  let height = document.getElementById("height").value;
  let weight = document.getElementById("weight").value;
  let unit = document.getElementById("unit").value;
  let result = document.getElementById("result");

  if (height === "" || weight === "") {
    result.innerHTML = "⚠️ Please enter all values";
    return;
  }

  let bmi;

  if (unit === "metric") {
    height = height / 100;
    bmi = weight / (height * height);
  } else {
    bmi = (weight / (height * height)) * 703;
  }

  bmi = bmi.toFixed(2);

  let category = "";
  let className = "";

  if (bmi < 18.5) {
    category = "Underweight";
    className = "underweight";
  } else if (bmi < 24.9) {
    category = "Normal weight";
    className = "normal";
  } else if (bmi < 29.9) {
    category = "Overweight";
    className = "overweight";
  } else {
    category = "Obese";
    className = "obese";
  }

  result.innerHTML = `
    Your BMI is ${bmi} <br>
    <span class="category ${className}">${category}</span>
  `;
}
