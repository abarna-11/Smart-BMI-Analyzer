const calculateBtn = document.getElementById('calculateBtn');
const clearBtn = document.getElementById('clearBtn');
const downloadBtn = document.getElementById('downloadBtn');
const toggleBtn = document.getElementById('toggleMode');

const gainBtn = document.getElementById('gainBtn');
const loseBtn = document.getElementById('loseBtn');
const goalSection = document.getElementById('goalSection');

const tabs = document.getElementById('categoryTabs');
const tipsBox = document.getElementById('tipsBox');

const dietBtn = document.getElementById('dietBtn');
const workoutBtn = document.getElementById('workoutBtn');
const extraOutput = document.getElementById('extraOutput');
const extraSection = document.getElementById('extraSection');

let chart;
let tipsData = {};
let extraData = {};
let currentGoal = "";

// Load JSON
fetch('tips.json').then(res => res.json()).then(data => tipsData = data);
fetch('dietWorkout.json').then(res => res.json()).then(data => extraData = data);

// Dark mode
toggleBtn.onclick = () => document.body.classList.toggle('dark');

// BMI
calculateBtn.onclick = () => {
  const weight = document.getElementById('weight').value;
  const height = document.getElementById('height').value;

  const bmi = (weight / ((height/100)**2)).toFixed(2);

  document.getElementById('bmiResult').innerHTML =
    `<strong>BMI:</strong> ${bmi}`;

  goalSection.style.display = "flex";

  document.getElementById("meterFill").style.width =
    Math.min((bmi/40)*100,100)+"%";

  const ctx = document.getElementById('bmiChart').getContext('2d');
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type:'bar',
    data:{
      labels:['Underweight','Normal','Overweight','Obese'],
      datasets:[{
        data:[
          bmi<18.5?bmi:0,
          bmi>=18.5&&bmi<25?bmi:0,
          bmi>=25&&bmi<30?bmi:0,
          bmi>=30?bmi:0
        ]
      }]
    },
    options:{plugins:{legend:{display:false}}}
  });
};

// Goal
gainBtn.onclick=()=>selectGoal('gain');
loseBtn.onclick=()=>selectGoal('lose');

function selectGoal(goal){
  currentGoal=goal;
  tabs.style.display="flex";
  extraSection.style.display="flex";
}

// Tabs
document.querySelectorAll('#categoryTabs button').forEach(btn=>{
  btn.onclick=()=>{
    let data=tipsData[currentGoal][btn.dataset.type];
    let html="<ul>";
    data.forEach(t=>html+=`<li>${t}</li>`);
    html+="</ul>";
    tipsBox.innerHTML=html;
  }
});

// Diet
dietBtn.onclick=()=>{
  let d=extraData[currentGoal].diet;
  let html="";
  for(let m in d){
    html+=`<strong>${m}</strong><ul>`;
    d[m].forEach(i=>html+=`<li>${i}</li>`);
    html+="</ul>";
  }
  extraOutput.innerHTML=html;
};

// Workout
workoutBtn.onclick=()=>{
  let w=extraData[currentGoal].workout;
  let html="<ul>";
  for(let d in w){
    html+=`<li>${d}: ${w[d]}</li>`;
  }
  html+="</ul>";
  extraOutput.innerHTML=html;
};

// Clear
clearBtn.onclick=()=>{
  location.reload();
};

// Download
downloadBtn.onclick=()=>{
  let text=document.getElementById('bmiResult').innerText;
  let blob=new Blob([text]);
  let link=document.createElement('a');
  link.download='bmi.txt';
  link.href=URL.createObjectURL(blob);
  link.click();
};

// Active tab effect
document.querySelectorAll('#categoryTabs button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#categoryTabs button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});
