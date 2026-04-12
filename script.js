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
  toggleBtn.innerText = document.body.classList.contains('dark') ? "🌙" : "☀️";
};

// 📊 Calculate
calculateBtn.onclick = () => {
  const weight = parseFloat($('weight').value);
  const height = parseFloat($('height').value);

  if (!weight || !height) {
    $('bmiResult').innerText = "⚠️ Enter values";
    return;
  }

  const bmi = (weight / ((height/100)**2)).toFixed(2);

  let category = bmi < 18.5 ? "Underweight" :
                 bmi < 25 ? "Normal" :
                 bmi < 30 ? "Overweight" : "Obese";

  $('bmiResult').innerHTML = `<h2>${bmi}</h2><p>${category}</p>`;

  $('goalSection').style.display = "block";
  tabs.style.display = "none";
  document.querySelector('.extra-section').style.display = "none";

  // Meter
  $('meterFill').style.width = Math.min((bmi/40)*100,100) + "%";

  // Chart
  const ctx = $('bmiChart').getContext('2d');
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Under','Normal','Over','Obese'],
      datasets: [{
        data: [
          bmi<18.5?bmi:0,
          bmi>=18.5&&bmi<25?bmi:0,
          bmi>=25&&bmi<30?bmi:0,
          bmi>=30?bmi:0
        ]
      }]
    },
    options: { plugins:{legend:{display:false}} }
  });
};

// 🎯 Goal
gainBtn.onclick = () => selectGoal('gain');
loseBtn.onclick = () => selectGoal('lose');

function selectGoal(goal){
  currentGoal = goal;

  tabs.style.display = "flex";
  document.querySelector('.extra-section').style.display = "block";

  tipsBox.innerHTML = "👉 Select a category";
}

// 📂 Tabs
document.querySelectorAll('#categoryTabs button').forEach(btn=>{
  btn.onclick = ()=>{
    document.querySelectorAll('#categoryTabs button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');

    const type = btn.dataset.type;

    if(!tipsData[currentGoal]?.[type]){
      tipsBox.innerHTML="No tips";
      return;
    }

    let html="<ul>";
    tipsData[currentGoal][type].forEach(t=> html+=`<li>${t}</li>`);
    html+="</ul>";

    tipsBox.innerHTML=html;
  };
});

// 🍽 Diet
dietBtn.onclick = ()=>{
  if(!currentGoal) return alert("Select goal");

  let d = extraData[currentGoal].diet;
  let html="<h3>Diet Plan</h3>";

  for(let m in d){
    html+=`<b>${m}</b><ul>`;
    d[m].forEach(i=>html+=`<li>${i}</li>`);
    html+="</ul>";
  }

  modalBody.innerHTML=html;
  modal.style.display="flex";
};

// 🏋️ Workout
workoutBtn.onclick = ()=>{
  if(!currentGoal) return alert("Select goal");

  let w = extraData[currentGoal].workout;
  let html="<h3>Workout Plan</h3><ul>";

  for(let d in w){
    html+=`<li>${d}: ${w[d]}</li>`;
  }

  html+="</ul>";

  modalBody.innerHTML=html;
  modal.style.display="flex";
};

// Close modal
closeModal.onclick = ()=> modal.style.display="none";

// Clear
clearBtn.onclick = ()=>{
  $('weight').value='';
  $('height').value='';
  $('bmiResult').innerHTML='';
  $('meterFill').style.width="0%";
  tipsBox.innerHTML="";
  tabs.style.display="none";
  document.querySelector('.extra-section').style.display="none";
  $('goalSection').style.display="none";

  if(chart) chart.destroy();
};

// Download
downloadBtn.onclick = ()=>{
  let text = $('bmiResult').innerText;
  if(!text) return alert("Calculate first");

  let blob = new Blob([text]);
  let a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download="BMI.txt";
  a.click();
};
