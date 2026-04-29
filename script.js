// ============================================
// PREMIUM BMI ANALYZER PRO - COMPLETE SCRIPT
// Includes: 10+ APIs, Calculators, History, Voice, PDF, Share
// ============================================

// DOM Elements
const $ = id => document.getElementById(id);

// Get all elements
const calculateBtn = $('calculateBtn');
const clearBtn = $('clearBtn');
const downloadBtn = $('downloadBtn');
const toggleBtn = $('toggleMode');
const profileBtn = $('profileBtn');
const historyBtn = $('historyBtn');

const gainBtn = $('gainBtn');
const loseBtn = $('loseBtn');

const dietBtn = $('dietBtn');
const workoutBtn = $('workoutBtn');
const calorieBtn = $('calorieBtn');
const waterBtn = $('waterBtn');
const sleepBtn = $('sleepBtn');
const macroBtn = $('macroBtn');
const nutritionBtn = $('nutritionBtn');
const exerciseBtn = $('exerciseBtn');
const newsBtn = $('newsBtn');
const quoteBtn = $('quoteBtn');

const modal = $('modal');
const modalBody = $('modalBody');
const modalTitle = $('modalTitle');
const closeModal = $('closeModal');

// State
let chart, historyChart;
let currentBMI = null;
let currentCategory = null;
let currentGoal = "";
let bmiHistory = [];

// ============================================
// API CONFIGURATION (Get free keys from these services)
// ============================================
const API_KEYS = {
  weather: "3296cfeb3a797de075289485b245f880",      // Get from: openweathermap.org
  nutrition: "iC55LBbsCkZx88APO3EtR1sDH80z0GzgLL8kejn7",      // Get from: calorieninjas.com
  exercises: "iC55LBbsCkZx88APO3EtR1sDH80z0GzgLL8kejn7",         // Get from: api-ninjas.com
  news: "fc0e76a8b8cdb73a64388fb8aaf7aa30"                // Get from: gnews.io
};

// ============================================
// API 1: WEATHER API (Real-time workout recommendations)
// ============================================
async function getWeatherRecommendation() {
  if (!navigator.geolocation) return "Indoor workout recommended";
  
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${API_KEYS.weather}&units=metric`);
        const data = await response.json();
        const temp = data.main.temp;
        const condition = data.weather[0].main;
        
        if (temp > 30) resolve("☀️ Hot outside! Try indoor cardio or swimming pool");
        if (temp < 10) resolve("❄️ Cold weather! Warm up indoors with strength training");
        if (condition.includes("Rain")) resolve("🌧️ Rainy day perfect for indoor HIIT or yoga");
        resolve("🌤️ Great weather for outdoor walking, running, or cycling!");
      } catch { resolve("Check local weather before outdoor workout"); }
    }, () => resolve("Enable location for weather-based tips"));
  });
}

// ============================================
// API 2: NUTRITION API (Food calorie lookup)
// ============================================
async function searchNutrition() {
  const foodItem = prompt("🔍 Enter food name (e.g., 'apple', 'chicken breast', 'pizza'):");
  if (!foodItem) return;
  
  showToast(`Looking up ${foodItem}... 📊`);
  openModal('<div class="loader"></div>', 'Nutrition Facts');
  
  try {
    const response = await fetch(`https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(foodItem)}`, {
      headers: { 'X-Api-Key': API_KEYS.nutrition }
    });
    const data = await response.json();
    
    if (data.items?.length > 0) {
      const item = data.items[0];
      modalBody.innerHTML = `
        <div style="text-align:center">
          <h2>🍽️ ${item.name.toUpperCase()}</h2>
          <div class="plan-card">
            <h3>🔥 ${Math.round(item.calories)} calories</h3>
            <p>💪 Protein: ${item.protein_g}g | 🍚 Carbs: ${item.carbohydrates_total_g}g</p>
            <p>🥑 Fat: ${item.fat_total_g}g | 🧂 Serving: ${item.serving_size_g}g</p>
          </div>
          <small>Data from CalorieNinjas API</small>
        </div>
      `;
    } else {
      modalBody.innerHTML = `<p>❌ No data found for "${foodItem}"<br>Try: banana, rice, chicken, egg</p>`;
    }
  } catch {
    modalBody.innerHTML = `<p>⚠️ Demo mode:<br>🍎 Apple: 52 cal<br>🍗 Chicken: 165 cal<br>🥚 Egg: 155 cal</p>`;
  }
}

// ============================================
// API 3: EXERCISE API (Workout database)
// ============================================
async function getExerciseGuide() {
  const muscle = prompt("💪 Enter muscle group (chest, back, legs, arms, abs, cardio):");
  if (!muscle) return;
  
  showToast(`Finding ${muscle} exercises... 🏋️`);
  openModal('<div class="loader"></div>', 'Exercise Database');
  
  try {
    const response = await fetch(`https://api.api-ninjas.com/v1/exercises?muscle=${muscle.toLowerCase()}`, {
      headers: { 'X-Api-Key': API_KEYS.exercises }
    });
    const exercises = await response.json();
    
    if (exercises?.length > 0) {
      let html = `<h2>💪 Top ${muscle.toUpperCase()} Exercises</h2>`;
      exercises.slice(0, 8).forEach(ex => {
        html += `<div class="plan-card"><h4>${ex.name}</h4><p>📝 ${ex.instructions.substring(0, 120)}...</p><small>⚡ ${ex.difficulty} | 🛠️ ${ex.equipment}</small></div>`;
      });
      modalBody.innerHTML = html;
    } else {
      modalBody.innerHTML = `<p>Try: chest, back, legs, arms, abs, cardio, shoulder</p>`;
    }
  } catch {
    modalBody.innerHTML = `<h2>💪 Quick Exercises</h2>
      <div class="plan-card">🏋️ Push-ups: Chest & Triceps (3x12)</div>
      <div class="plan-card">🏃 Squats: Legs & Glutes (3x15)</div>
      <div class="plan-card">💪 Planks: Core (3x30 sec)</div>
      <div class="plan-card">🤸 Lunges: Legs (3x12 each)</div>`;
  }
}

// ============================================
// API 4: HEALTH NEWS API
// ============================================
async function getHealthNews() {
  showToast("Loading latest health news... 📰");
  openModal('<div class="loader"></div>', 'Health & Wellness News');
  
  try {
    const response = await fetch(`https://gnews.io/api/v4/search?q=fitness%20health%20wellness&lang=en&max=5&apikey=${API_KEYS.news}`);
    const data = await response.json();
    
    if (data.articles?.length > 0) {
      let html = `<h2>📰 Latest Health News</h2>`;
      data.articles.forEach(article => {
        html += `<div class="plan-card"><h4>${article.title}</h4><p>${article.description?.substring(0, 150)}...</p><a href="${article.url}" target="_blank" style="color: var(--accent)">Read more →</a></div>`;
      });
      modalBody.innerHTML = html;
    } else {
      modalBody.innerHTML = `<h3>📰 Today's Health Tips</h3>
        <div class="plan-card">💪 Exercise 30 minutes daily for heart health</div>
        <div class="plan-card">🥗 Eat 5 servings of vegetables daily</div>
        <div class="plan-card">😴 Sleep 7-8 hours for recovery</div>
        <div class="plan-card">💧 Drink 2-3 liters water for hydration</div>`;
    }
  } catch {
    modalBody.innerHTML = `<h3>📰 Health Tips</h3>
      <div class="plan-card">🏃 10,000 steps daily reduces disease risk</div>
      <div class="plan-card">🥑 Mediterranean diet is heart-healthy</div>
      <div class="plan-card">🧘 10 min meditation reduces stress by 30%</div>`;
  }
}

// ============================================
// API 5: MOTIVATIONAL QUOTE API
// ============================================
async function getMotivationalQuote() {
  showToast("Getting daily motivation... ✨");
  
  try {
    const response = await fetch('https://zenquotes.io/api/random');
    const data = await response.json();
    const quote = data[0].q;
    const author = data[0].a;
    
    openModal(`
      <div style="text-align:center; padding:20px;">
        <i class="fas fa-quote-left" style="font-size: 40px; opacity: 0.5;"></i>
        <p style="font-size: 1.3rem; margin: 20px 0; line-height: 1.6;">"${quote}"</p>
        <p style="opacity: 0.7;">— ${author}</p>
        <button onclick="getMotivationalQuote()" class="btn btn-primary" style="margin-top: 20px;">New Quote 🔄</button>
      </div>
    `, '✨ Daily Motivation');
  } catch {
    modalBody.innerHTML = `<h3>💪 Stay Motivated!</h3>
      <div class="plan-card">✨ "Believe you can and you're halfway there."</div>
      <div class="plan-card">🏃 "The only bad workout is the one that didn't happen."</div>
      <div class="plan-card">💪 "Your body can stand almost anything. It's your mind you have to convince."</div>`;
  }
}

// ============================================
// PREMIUM CALCULATORS
// ============================================

// Water Intake Calculator
function calculateWaterIntake() {
  const weight = parseFloat($('weight').value);
  if (!weight) { showToast("Enter weight first"); return; }
  
  const waterLiters = (weight * 0.033).toFixed(1);
  const waterGlasses = Math.round(waterLiters / 0.25);
  
  openModal(`
    <div style="text-align:center">
      <h2>💧 Daily Water Intake</h2>
      <div class="plan-card"><p style="font-size: 48px;">💧</p><h3>${waterLiters} Liters</h3><p>≈ ${waterGlasses} glasses (250ml each)</p></div>
      <div class="plan-card"><h4>💡 Hydration Tips:</h4><p>• Drink 1 glass every hour<br>• Add lemon for flavor<br>• Set hydration reminders</p></div>
    </div>
  `, 'Water Intake Guide');
}

// Sleep Calculator
function calculateSleep() {
  const age = parseInt($('userAge').value) || 25;
  const sleepHours = age < 18 ? "8-10" : (age < 60 ? "7-9" : "7-8");
  
  openModal(`
    <div style="text-align:center">
      <h2>😴 Optimal Sleep Duration</h2>
      <div class="plan-card"><p style="font-size:48px;">🛌</p><h3>${sleepHours} hours/night</h3><p>Based on age (${age} years)</p></div>
      <div class="plan-card"><h4>💤 Sleep Tips:</h4><p>• No screens 1 hour before bed<br>• Same bedtime daily<br>• Dark, cool room</p></div>
    </div>
  `, 'Sleep Guide');
}

// Macro Calculator
function calculateMacros() {
  const weight = parseFloat($('weight').value);
  if (!weight) { showToast("Enter weight first"); return; }
  
  const protein = Math.round(weight * (currentGoal === 'gain' ? 2.2 : 2.0));
  const carbs = Math.round(weight * (currentGoal === 'gain' ? 4 : 2.5));
  const fats = Math.round(weight * (currentGoal === 'gain' ? 1.2 : 0.8));
  
  openModal(`
    <div style="text-align:center">
      <h2>🥗 Daily Macro Goals</h2>
      <div class="plan-card"><h3>💪 Protein: ${protein}g</h3><p>${protein*4} calories | Builds muscle</p></div>
      <div class="plan-card"><h3>🍚 Carbs: ${carbs}g</h3><p>${carbs*4} calories | Energy source</p></div>
      <div class="plan-card"><h3>🥑 Fats: ${fats}g</h3><p>${fats*9} calories | Hormone health</p></div>
      <p><strong>Total: ${(protein*4)+(carbs*4)+(fats*9)} calories</strong></p>
    </div>
  `, 'Macro Split');
}

// ============================================
// BMI HISTORY (LocalStorage)
// ============================================
function loadHistory() {
  const saved = localStorage.getItem('bmiHistory');
  if (saved) {
    bmiHistory = JSON.parse(saved);
    updateHistoryDisplay();
  }
}

function saveToHistory(bmi, category) {
  const record = {
    date: new Date().toLocaleString(),
    bmi: parseFloat(bmi),
    category: category,
    weight: parseFloat($('weight').value),
    height: parseFloat($('height').value)
  };
  bmiHistory.unshift(record);
  if (bmiHistory.length > 10) bmiHistory.pop();
  localStorage.setItem('bmiHistory', JSON.stringify(bmiHistory));
  updateHistoryDisplay();
  showToast('BMI saved to history! 📊');
  getMotivationalQuote(); // Show quote after each calculation
}

function updateHistoryDisplay() {
  const historySection = $('historySection');
  const historyList = $('historyList');
  
  if (bmiHistory.length > 0) {
    historySection.classList.remove('hidden');
    historyList.innerHTML = bmiHistory.map(record => `
      <div class="history-item">
        <span>📅 ${record.date}</span>
        <span style="font-weight:bold">BMI: ${record.bmi}</span>
        <span style="color: ${getCategoryColor(record.category)}">${record.category}</span>
      </div>
    `).join('');
    renderHistoryChart();
  }
}

function renderHistoryChart() {
  const ctx = $('historyChart')?.getContext('2d');
  if (!ctx) return;
  if (historyChart) historyChart.destroy();
  
  const historyValues = bmiHistory.slice(0, 7).reverse();
  historyChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: historyValues.map((_, i) => `Entry ${i+1}`),
      datasets: [{ label: 'BMI Progress', data: historyValues.map(h => h.bmi), borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.1)', tension: 0.4, fill: true }]
    },
    options: { responsive: true, plugins: { legend: { labels: { color: getComputedStyle(document.body).getPropertyValue('--text') } } } }
  });
}

// ============================================
// USER PROFILE
// ============================================
function saveProfile() {
  const profile = { name: $('userName').value, age: $('userAge').value, gender: $('userGender').value };
  if (profile.name || profile.age) {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    showToast(`Profile saved! Welcome ${profile.name || 'User'} 👋`);
    profileDropdown.classList.remove('show');
  }
}

function loadProfile() {
  const saved = localStorage.getItem('userProfile');
  if (saved) {
    const profile = JSON.parse(saved);
    if ($('userName')) $('userName').value = profile.name || '';
    if ($('userAge')) $('userAge').value = profile.age || '';
    if ($('userGender')) $('userGender').value = profile.gender || 'Male';
    showToast(`Welcome back ${profile.name || 'User'}! 🌟`);
  }
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message, duration = 3000) {
  const existingToast = document.querySelector('.toast');
  if (existingToast) existingToast.remove();
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}

// ============================================
// VOICE INPUT
// ============================================
function initVoiceInput() {
  const voiceBtns = document.querySelectorAll('.voice-btn');
  voiceBtns.forEach(btn => {
    btn.onclick = () => {
      const field = btn.dataset.field;
      if (!('webkitSpeechRecognition' in window)) { showToast('Voice not supported'); return; }
      
      const recognition = new webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.start();
      recognition.onresult = (event) => {
        const value = parseFloat(event.results[0][0].transcript);
        if (!isNaN(value)) { $(field).value = value; showToast(`${field}: ${value} entered ✅`); }
        else showToast('Please speak a number');
      };
      recognition.onerror = () => showToast('Voice failed');
    };
  });
}

// ============================================
// SHARE FEATURES
// ============================================
function shareToWhatsApp() {
  if (!currentBMI) { showToast('Calculate first'); return; }
  window.open(`https://wa.me/?text=My%20BMI%20is%20${currentBMI}%20(${currentCategory})%20-%20BMI%20Analyzer%20Pro`, '_blank');
}

function shareToEmail() {
  if (!currentBMI) { showToast('Calculate first'); return; }
  window.location.href = `mailto:?subject=My%20BMI%20Report&body=My%20BMI%20is%20${currentBMI}%20(${currentCategory})%0AWeight: ${$('weight').value}kg%0AHeight: ${$('height').value}cm`;
}

function copyToClipboard() {
  if (!currentBMI) { showToast('Calculate first'); return; }
  navigator.clipboard.writeText(`BMI: ${currentBMI} (${currentCategory})`);
  showToast('Copied! 📋');
}

// ============================================
// BMI CALCULATION
// ============================================
async function calculateBMI() {
  const weight = parseFloat($('weight').value);
  const height = parseFloat($('height').value);
  
  if (!weight || !height || weight < 10 || weight > 500 || height < 50 || height > 300) {
    showToast("⚠️ Enter valid weight (10-500kg) & height (50-300cm)");
    return;
  }
  
  loader.classList.remove("hidden");
  
  setTimeout(async () => {
    const bmi = weight / ((height/100) ** 2);
    currentBMI = bmi.toFixed(2);
    currentCategory = getCategory(bmi);
    
    const weatherTip = await getWeatherRecommendation();
    
    $('bmiResult').innerHTML = `
      <h2>${currentBMI}</h2>
      <p style="font-size:20px; margin:10px 0">${currentCategory}</p>
      <small>${getMessage(currentCategory)}</small>
      ${getHealthRisk(currentCategory)}
      <div style="margin-top:15px; padding:10px; background:rgba(255,255,255,0.1); border-radius:10px">
        🌤️ ${weatherTip}
      </div>
    `;
    $('bmiResult').classList.remove("hidden");
    $('goalSection').classList.remove("hidden");
    $('tipsSection').classList.remove("hidden");
    $('aiSection').classList.remove("hidden");
    document.querySelector('.share-buttons')?.classList.remove("hidden");
    
    animateMeter(bmi);
    renderChart(bmi);
    saveToHistory(currentBMI, currentCategory);
    
    loader.classList.add("hidden");
  }, 700);
}

function getCategory(bmi) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

function getHealthRisk(category) {
  const risks = {
    'Underweight': '<p style="color:#3b82f6">⚠️ Risk: Nutrient deficiency, low immunity</p>',
    'Normal': '<p style="color:#22c55e">✅ Low health risk. Keep it up!</p>',
    'Overweight': '<p style="color:#f59e0b">⚠️ Risk: Heart disease, diabetes</p>',
    'Obese': '<p style="color:#ef4444">🔴 High risk: Heart disease, diabetes, joint issues</p>'
  };
  return risks[category] || '';
}

function getMessage(category) {
  const messages = {
    Underweight: "Focus on nutrient-rich foods and strength training 💪",
    Normal: "Perfect! Maintain with balanced diet and exercise 👌",
    Overweight: "Time to get active! Start with 30-min walks 🔥",
    Obese: "Consult a doctor. Small changes = big results ❤️"
  };
  return messages[category];
}

function animateMeter(bmi) {
  const meter = $('meterFill');
  meter.parentElement.parentElement.classList.remove("hidden");
  meter.style.width = "0%";
  setTimeout(() => { meter.style.width = Math.min((bmi/40)*100, 100) + "%"; }, 200);
}

function renderChart(bmi) {
  document.querySelector('.chart-box').classList.remove("hidden");
  const ctx = $('bmiChart').getContext('2d');
  if (chart) chart.destroy();
  
  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Underweight', 'Normal', 'Overweight', 'Obese'],
      datasets: [
        { data: [18.5, 24.9, 29.9, 40], backgroundColor: ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444'], borderRadius: 10, barPercentage: 0.5 },
        { data: [bmi, bmi, bmi, bmi], type: 'line', borderColor: 'white', borderWidth: 3, pointRadius: 8, pointBackgroundColor: 'white' }
      ]
    },
    options: { responsive: true, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => `Value: ${ctx.raw.toFixed(1)}` } } } }
  });
}

// ============================================
// GOAL & TIPS
// ============================================
function selectGoal(goal) {
  currentGoal = goal;
  gainBtn.classList.toggle('active', goal === 'gain');
  loseBtn.classList.toggle('active', goal === 'lose');
  showToast(`${goal === 'gain' ? '💪 Muscle Gain' : '🔥 Weight Loss'} goal selected!`);
  loadTipsForCategory('diet');
}

const tipsData = {
  gain: {
    diet: { title: "Muscle Gain Diet 🍗", description: "Calorie surplus + high protein", tips: ["Increase calories by 300-500", "Eat protein-rich foods", "Include healthy fats", "Eat 5-6 meals daily"] },
    workout: { title: "Strength Training 🏋️", description: "Build muscle mass", tips: ["Compound exercises", "Train 4-5x/week", "Progressive overload", "Rest 48 hours"] },
    lifestyle: { title: "Healthy Lifestyle 😴", description: "Recovery & consistency", tips: ["Sleep 7-8 hours", "Stay consistent", "Manage stress", "Drink 2-3L water"] }
  },
  lose: {
    diet: { title: "Fat Loss Diet 🥗", description: "Calorie deficit + nutrition", tips: ["Reduce sugar/processed food", "Eat more vegetables/fiber", "Increase protein", "Avoid late-night eating"] },
    workout: { title: "Fat Burn Workout 🔥", description: "Cardio + strength", tips: ["30-45 min cardio daily", "Add HIIT workouts", "Train 5-6 days/week", "Combine strength + cardio"] },
    lifestyle: { title: "Healthy Routine 🌿", description: "Discipline matters", tips: ["Walk 10,000 steps", "Sleep 7-8 hours", "Track calories", "Stay hydrated"] }
  }
};

function loadTipsForCategory(type) {
  if (!currentGoal) return;
  const data = tipsData[currentGoal]?.[type];
  if (!data) return;
  
  let html = `<h3>${data.title}</h3><p>${data.description}</p><ul class="premium-list">`;
  data.tips.forEach(tip => { html += `<li>✓ ${tip}</li>`; });
  html += "</ul>";
  $('tipsBox').innerHTML = html;
}

// ============================================
// DIET & WORKOUT PLANS
// ============================================
const dietWorkoutData = {
  gain: {
    diet: { Breakfast: { items: ["4 Eggs", "2 Bread + PB", "1 Glass milk"] }, Lunch: { items: ["2 Chapati", "Chicken/Paneer", "Vegetables"] }, Dinner: { items: ["2 Chapati", "Dal + Vegetables", "Eggs"] } },
    workout: { Monday: "Chest + Triceps", Wednesday: "Back + Biceps", Friday: "Legs + Shoulders" }
  },
  lose: {
    diet: { Breakfast: { items: ["Oats", "2 Boiled eggs", "Green tea"] }, Lunch: { items: ["Brown rice", "Grilled chicken", "Salad"] }, Dinner: { items: ["Vegetable salad", "Soup"] } },
    workout: { Monday: "Cardio (30 min)", Wednesday: "HIIT (20 min)", Friday: "Core + Abs (30 min)" }
  }
};

function showDietPlan() {
  if (!currentGoal) { showToast("Select goal first"); return; }
  const diet = dietWorkoutData[currentGoal]?.diet;
  let html = `<h2>🍽️ ${currentGoal === 'gain' ? 'Muscle Gain' : 'Fat Loss'} Diet</h2>`;
  for (let [meal, data] of Object.entries(diet)) {
    html += `<div class="plan-card"><h4>${meal}</h4><ul>${data.items.map(i => `<li>${i}</li>`).join('')}</ul></div>`;
  }
  openModal(html, '🍽️ Diet Plan');
}

function showWorkoutPlan() {
  if (!currentGoal) { showToast("Select goal first"); return; }
  const workout = dietWorkoutData[currentGoal]?.workout;
  let html = `<h2>🏋️ ${currentGoal === 'gain' ? 'Gain Muscle' : 'Fat Burn'} Workout</h2>`;
  for (let [day, plan] of Object.entries(workout)) {
    html += `<div class="plan-card"><h4>${day}</h4><p>${plan}</p></div>`;
  }
  openModal(html, '🏋️ Workout Plan');
}

function showCalorieCalculator() {
  const weight = parseFloat($('weight').value);
  const height = parseFloat($('height').value);
  const age = parseInt($('userAge').value) || 25;
  const gender = $('userGender')?.value || 'Male';
  
  if (!weight || !height) { showToast("Enter weight & height"); return; }
  
  let bmr = gender === 'Male' ? 88.362 + (13.397*weight) + (4.799*height) - (5.677*age) : 447.593 + (9.247*weight) + (3.098*height) - (4.330*age);
  const maintenance = Math.round(bmr * 1.375);
  
  openModal(`
    <div style="text-align:center">
      <h2>🔥 Daily Calories</h2>
      <div class="plan-card"><h3>Maintain: ${maintenance} kcal</h3></div>
      <div class="plan-card"><h3>🌱 Lose: ${maintenance-500} kcal</h3></div>
      <div class="plan-card"><h3>💪 Gain: ${maintenance+500} kcal</h3></div>
    </div>
  `, 'Calorie Calculator');
}

// ============================================
// PDF EXPORT
// ============================================
async function exportToPDF() {
  if (!currentBMI) { showToast("Calculate first"); return; }
  
  const element = document.createElement('div');
  element.innerHTML = `<div style="padding:20px"><h1>BMI Health Report</h1><p>Date: ${new Date().toLocaleString()}</p><p>Weight: ${$('weight').value} kg</p><p>Height: ${$('height').value} cm</p><p>BMI: ${currentBMI}</p><p>Category: ${currentCategory}</p><p>Status: ${getMessage(currentCategory)}</p><hr><p>Generated by BMI Analyzer Pro</p></div>`;
  
  html2pdf().set({ margin: 1, filename: `BMI_Report_${Date.now()}.pdf` }).from(element).save();
  showToast("PDF exported! 📄");
}

// ============================================
// CLEAR ALL
// ============================================
function clearAll() {
  $('weight').value = '';
  $('height').value = '';
  $('bmiResult').innerHTML = '';
  $('bmiResult').classList.add("hidden");
  $('meterFill').style.width = "0%";
  document.querySelector('.meter-container')?.classList.add("hidden");
  document.querySelector('.chart-box')?.classList.add("hidden");
  $('goalSection').classList.add("hidden");
  $('tipsSection').classList.add("hidden");
  $('aiSection').classList.add("hidden");
  document.querySelector('.share-buttons')?.classList.add("hidden");
  currentGoal = "";
  currentBMI = null;
  if (chart) chart.destroy();
  showToast("All cleared! 🧹");
}

// ============================================
// MODAL
// ============================================
function openModal(content, title = "Smart Plan") {
  modalTitle.innerText = title;
  modalBody.innerHTML = content;
  modal.classList.add("show");
}
closeModal.onclick = () => modal.classList.remove("show");
window.onclick = e => { if (e.target === modal) modal.classList.remove("show"); };

// ============================================
// DARK MODE
// ============================================
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

// ============================================
// EVENT LISTENERS
// ============================================
calculateBtn.onclick = calculateBMI;
clearBtn.onclick = clearAll;
downloadBtn.onclick = exportToPDF;
gainBtn.onclick = () => selectGoal('gain');
loseBtn.onclick = () => selectGoal('lose');
dietBtn.onclick = showDietPlan;
workoutBtn.onclick = showWorkoutPlan;
calorieBtn.onclick = showCalorieCalculator;
waterBtn?.addEventListener('click', calculateWaterIntake);
sleepBtn?.addEventListener('click', calculateSleep);
macroBtn?.addEventListener('click', calculateMacros);
nutritionBtn?.addEventListener('click', searchNutrition);
exerciseBtn?.addEventListener('click', getExerciseGuide);
newsBtn?.addEventListener('click', getHealthNews);
quoteBtn?.addEventListener('click', getMotivationalQuote);

document.querySelectorAll('.tab').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadTipsForCategory(btn.dataset.type);
  };
});

$('whatsappShare')?.addEventListener('click', shareToWhatsApp);
$('emailShare')?.addEventListener('click', shareToEmail);
$('copyResult')?.addEventListener('click', copyToClipboard);

const profileDropdown = $('profileDropdown');
profileBtn.onclick = () => profileDropdown.classList.toggle('show');
$('saveProfileBtn')?.addEventListener('click', saveProfile);
$('loadProfileBtn')?.addEventListener('click', loadProfile);
$('clearHistoryBtn')?.addEventListener('click', () => {
  localStorage.removeItem('bmiHistory');
  bmiHistory = [];
  updateHistoryDisplay();
  showToast("History cleared!");
});

historyBtn.onclick = () => {
  if (bmiHistory.length > 0) $('historySection').classList.toggle('hidden');
  else showToast("No history yet. Calculate first!");
};

// Initialize
loadHistory();
initVoiceInput();
document.addEventListener('keypress', (e) => { if (e.key === 'Enter') calculateBMI(); });
showToast("🚀 BMI Analyzer Pro Ready! Enter your details and press Calculate.");
