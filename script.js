let tipsData={}, extraData={}, goal="";
let chart;

// LOAD JSON
fetch('tips.json')
.then(res=>res.json())
.then(data=>tipsData=data);

fetch('dietWorkout.json')
.then(res=>res.json())
.then(data=>extraData=data);

// BMI
document.getElementById('calc').onclick=()=>{
  let w=weight.value;
  let h=height.value;

  let bmi=(w/((h/100)**2)).toFixed(2);

  result.innerHTML="BMI: "+bmi;

  goals.style.display="block";

  fill.style.width=(bmi/40*100)+"%";

  if(chart) chart.destroy();

  chart=new Chart(chartCanvas.getContext('2d'),{
    type:'bar',
    data:{
      labels:['U','N','O','OB'],
      datasets:[{
        data:[
          bmi<18?bmi:0,
          bmi>=18&&bmi<25?bmi:0,
          bmi>=25&&bmi<30?bmi:0,
          bmi>=30?bmi:0
        ]
      }]
    }
  });
};

// GOAL
function setGoal(g){
  goal=g;
  tabs.style.display="block";
}

// TIPS
function showTips(type){
  let arr=tipsData[goal][type];
  tips.innerHTML=arr.map(t=>"<li>"+t+"</li>").join("");
}

// DIET
function showDiet(){
  let d=extraData[goal].diet;
  let html="";
  for(let m in d){
    html+=m+": "+d[m].join(",")+"<br>";
  }
  openModal(html);
}

// WORKOUT
function showWorkout(){
  let w=extraData[goal].workout;
  let html="";
  for(let d in w){
    html+=d+": "+w[d]+"<br>";
  }
  openModal(html);
}

// MODAL
function openModal(html){
  modalBody.innerHTML=html;
  modal.style.display="flex";
}

function closeModal(){
  modal.style.display="none";
}
