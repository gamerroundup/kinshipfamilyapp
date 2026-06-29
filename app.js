// Kinship Family Hub App State & Controller

// One-time migration to clear legacy local storage states for the new avatars
if (!localStorage.getItem("kinship_avatar_migration_v3")) {
  localStorage.removeItem("kinship_state");
  localStorage.setItem("kinship_avatar_migration_v3", "true");
}

// 1. CONSTANTS & INITIAL DATA SEEDS
const MEMBER_DATA = {
  mom: {
    name: "Mom",
    color: "mom",
    avatar: "mom_disgusted.png"
  },
  dad: {
    name: "Dad",
    color: "dad",
    avatar: "dad_angry.png"
  },
  campbell: {
    name: "Campbell",
    color: "alex",
    avatar: "campbell_sad.png"
  },
  daphne: {
    name: "Daphne",
    color: "maya",
    avatar: "daphne_joyous.png"
  },
  liberty: {
    name: "Liberty",
    color: "leo",
    avatar: "liberty_bored.png"
  }
};

const DEFAULT_STATE = {
  activeMember: "mom",
  calendarView: "month", // "month" (30-day) or "week" (7-day)
  customAvatars: {},
  members: {
    mom: { points: 650, streak: 7 },
    dad: { points: 450, streak: 5 },
    campbell: { points: 150, streak: 2 },
    daphne: { points: 280, target: "Extra Screen Time", targetPts: 300 },
    liberty: { points: 450, target: "Pizza Night", targetPts: 500 }
  },
  goals: [
    { id: 1, title: "Summer Europe Trip", desc: "Connecting with roots and making memories across Italy.", status: "65% BUDGETED", progress: 65, color: "tertiary" },
    { id: 2, title: "Backyard Garden", desc: "Self-sustaining vegetable patch by Spring.", status: "PLANNING PHASE", progress: 25, color: "primary" }
  ],
  wtasks: [
    { id: 1, lane: "on-deck", title: "Vet Appointment", desc: "Don't forget the vaccine records!", time: "Thursday, 4 PM", assignee: "dad" },
    { id: 2, lane: "on-deck", title: "Math Project Prep", desc: "Need poster board & markers.", time: "Friday morning", assignee: "daphne" },
    { id: 3, lane: "active", title: "Grocery Run", desc: "Grabbing organic milk, sourdough, and avocados for tonight.", time: "Currently active", assignee: "campbell" },
    { id: 4, lane: "complete", title: "Piano Practice", desc: "Completed 45 minute scales session.", time: "2h ago", assignee: "liberty" },
    { id: 5, lane: "complete", title: "Renew Insurance", desc: "Annual car insurance paperwork completed.", time: "Today", assignee: "mom" }
  ],
  calendarEvents: [
    { id: 1, date: "", title: "Weekly Team Sync", start: "09:00", end: "10:30", tag: "Work", member: "dad" },
    { id: 2, date: "", title: "Soccer Practice", start: "15:30", end: "17:00", tag: "School", member: "liberty" },
    { id: 3, date: "", title: "Dentist Appointment", start: "16:30", end: "17:30", tag: "Health", member: "daphne" },
    { id: 4, date: "", title: "Family Movie Night", start: "19:00", end: "20:30", tag: "Household", member: "mom" }
  ],
  groceries: [
    { id: 1, name: "Almond Milk (Unsweetened)", category: "Dairy", addedBy: "mom", checked: false },
    { id: 2, name: "Avocados (3 pack)", category: "Produce", addedBy: "dad", checked: true },
    { id: 3, name: "Whole Wheat Sourdough", category: "Bakery", addedBy: "liberty", checked: false }
  ],
  chores: [
    { id: 1, title: "Walk the Dog", due: "Due today", icon: "pets", assignee: "liberty", completed: false, points: 50 },
    { id: 2, title: "Empty Dishwasher", due: "Before 5 PM", icon: "restaurant", assignee: "daphne", completed: false, points: 50 },
    { id: 3, title: "Trash & Recycling", due: "Weekly", icon: "delete", assignee: "dad", completed: false, points: 100 }
  ],
  meals: {
    Mon: { Breakfast: "Blueberry Overnight Oats", Lunch: "Quinoa Salad with Lemon", Dinner: "Lemon Garlic Salmon", rating: 4, ingredients: "Oats, Blueberries, Quinoa, Salmon, Lemon, Garlic" },
    Tue: { Breakfast: "Greek Yogurt & Honey", Lunch: "Leftover Salmon Wrap", Dinner: "Homemade Taco Bar", rating: 5, ingredients: "Yogurt, Tortillas, Ground Beef, Avocados, Lime" },
    Wed: { Breakfast: "Green Spinach Smoothie", Lunch: "Turkey & Swiss Panini", Dinner: "Pasta Primavera", rating: 3, ingredients: "Spinach, Turkey, Swiss Cheese, Penne Pasta, Vegetables" },
    Thu: { Breakfast: "Eggs & Avocado Toast", Lunch: "Leftover Pasta", Dinner: "Chicken Stir Fry", rating: 0, ingredients: "Eggs, Bread, Chicken Breast, Soy Sauce, Broccoli" },
    Fri: { Breakfast: "Fruit Salad", Lunch: "Stir Fry Wrap", Dinner: "Pizza Party Night", rating: 0, ingredients: "Pizza Dough, Mozzarella, Tomato Sauce, Pepperoni" },
    Sat: { Breakfast: "Pancakes & Bacon", Lunch: "Tomato Soup & Grilled Cheese", Dinner: "Slow Cooker Beef Stew", rating: 0, ingredients: "Pancake Mix, Bacon, Beef Stew Meat, Potatoes, Carrots" },
    Sun: { Breakfast: "Cereal & Milk", Lunch: "Stew Bowls", Dinner: "BBQ Pulled Pork Sandwiches", rating: 0, ingredients: "Pork Shoulder, BBQ Sauce, Buns, Coleslaw" }
  },
  chatMessages: [
    { id: 1, sender: "dad", text: "Hey everyone! Don't forget we have the soccer match at 5 PM today. Who's bringing the orange slices?", time: "08:30 AM" },
    { id: 2, sender: "mom", text: "I've got the oranges! Already sliced and in the fridge. 🍊", time: "08:45 AM" },
    { id: 3, sender: "campbell", text: "I'll be there a bit late, finishing up a client call. Save me a seat!", time: "09:12 AM" },
    { id: 4, sender: "daphne", text: "Can we get pizza after? Pleaaaase? 🍕✨", time: "09:30 AM" },
    { id: 5, sender: "liberty", text: "I'm gonna score 3 goals today!! Watch me!! ⚽⚽⚽", time: "10:05 AM" }
  ],
  polls: [
    {
      id: 1,
      question: "What's for dinner tonight? 🍕🌮🥗",
      creator: "mom",
      endsIn: "02h 45m",
      options: [
        { text: "Pizza", votes: ["daphne", "liberty"] },
        { text: "Taco Night", votes: ["dad"] },
        { text: "Salad Bar", votes: [] }
      ]
    }
  ],
  rewardsStore: [
    { name: "Extra Screen Time", subtext: "30 Minutes on Tablet", pointsCost: 300, icon: "stay_current_portrait" },
    { name: "Pizza Night", subtext: "Pick the toppings for Friday", pointsCost: 500, icon: "local_pizza" },
    { name: "New Toy", subtext: "Choose a small toy at the store", pointsCost: 1500, icon: "toys" },
    { name: "Double Dessert", subtext: "Two scoops of icecream after dinner", pointsCost: 250, icon: "icecream" },
    { name: "Weekend Park Trip", subtext: "Family outing to the central park", pointsCost: 800, icon: "park" },
    { name: "Bedtime Pass", subtext: "Stay up 30 minutes past bedtime", pointsCost: 200, icon: "bedtime" }
  ]
};

// 2. STATE MANAGER
let state = JSON.parse(JSON.stringify(DEFAULT_STATE));
let selectedDate = new Date();
let currentTab = "whiteboard";
let currentListsSubTab = "groceries";
let activeModal = null;
let currentYear = selectedDate.getFullYear();
let currentMonth = selectedDate.getMonth(); // 0-indexed

// GitHub Sync config
let githubConfig = {
  repo: "",
  branch: "main",
  path: "kinship-data.json",
  token: ""
};
let githubSha = null;

// Initialize events with correct current month dates to ensure they display
function alignDefaultEventDates() {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, "0");
  const todayStr = `${year}-${month}-${String(new Date().getDate()).padStart(2, "0")}`;
  
  state.calendarEvents.forEach(evt => {
    if (!evt.date) {
      evt.date = todayStr;
    }
  });
}

// 3. STORAGE & SYNC ENGINE
function loadStateFromStorage() {
  const localConfig = localStorage.getItem("kinship_github_config");
  if (localConfig) {
    githubConfig = JSON.parse(localConfig);
    document.getElementById("github-repo").value = githubConfig.repo || "";
    document.getElementById("github-branch").value = githubConfig.branch || "main";
    document.getElementById("github-path").value = githubConfig.path || "kinship-data.json";
    document.getElementById("github-token").value = githubConfig.token || "";
  }

  const localState = localStorage.getItem("kinship_state");
  if (localState) {
    state = JSON.parse(localState);
  } else {
    alignDefaultEventDates();
  }

  // Restore custom avatar URLs
  if (state.customAvatars) {
    Object.keys(state.customAvatars).forEach(key => {
      if (MEMBER_DATA[key] && state.customAvatars[key] && !state.customAvatars[key].includes("aida-public")) {
        MEMBER_DATA[key].avatar = state.customAvatars[key];
      }
    });
  }
}

function saveStateToStorage() {
  localStorage.setItem("kinship_state", JSON.stringify(state));
  updateUI();
  
  if (githubConfig.repo && githubConfig.token) {
    pushToGitHub();
  }
}

// GitHub API communications
async function fetchFromGitHub() {
  if (!githubConfig.repo || !githubConfig.token) return;
  
  const badge = document.getElementById("sync-badge");
  const statusDetails = document.getElementById("sync-status-details");
  badge.textContent = "Syncing...";
  badge.className = "bg-amber-100 text-amber-800 font-label-caps text-[10px] px-sm py-[2px] rounded-full border border-amber-200 select-none";

  try {
    const url = `https://api.github.com/repos/${githubConfig.repo}/contents/${githubConfig.path}?ref=${githubConfig.branch}`;
    const response = await fetch(url, {
      headers: {
        "Authorization": `token ${githubConfig.token}`,
        "Accept": "application/vnd.github.v3+json"
      }
    });

    if (response.ok) {
      const data = await response.json();
      githubSha = data.sha;
      const content = atob(data.content);
      const remoteState = JSON.parse(content);
      state = remoteState;
      
      // Update custom avatars immediately from remote state
      if (state.customAvatars) {
        Object.keys(state.customAvatars).forEach(key => {
          if (MEMBER_DATA[key]) MEMBER_DATA[key].avatar = state.customAvatars[key];
        });
      }

      localStorage.setItem("kinship_state", JSON.stringify(state));
      
      badge.textContent = "GitHub Synced";
      badge.className = "bg-green-100 text-green-800 font-label-caps text-[10px] px-sm py-[2px] rounded-full border border-green-200 select-none";
      statusDetails.innerHTML = `Status: <span class="text-green-600 font-bold">Connected</span> (SHA: ${githubSha.substring(0, 7)})`;
      updateUI();
    } else if (response.status === 404) {
      // File doesn't exist, create it with current state
      badge.textContent = "Initializing Repo...";
      await pushToGitHub();
    } else {
      throw new Error(`Response status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching from GitHub", error);
    badge.textContent = "Sync Error";
    badge.className = "bg-red-100 text-red-800 font-label-caps text-[10px] px-sm py-[2px] rounded-full border border-red-200 select-none";
    statusDetails.innerHTML = `Status: <span class="text-red-600 font-bold">Sync Error</span> (${error.message})`;
  }
}

async function pushToGitHub() {
  if (!githubConfig.repo || !githubConfig.token) return;

  const url = `https://api.github.com/repos/${githubConfig.repo}/contents/${githubConfig.path}`;
  const body = {
    message: "chore: update Kinship Family Hub database",
    content: btoa(unescape(encodeURIComponent(JSON.stringify(state, null, 2)))),
    branch: githubConfig.branch
  };

  if (githubSha) {
    body.sha = githubSha;
  }

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Authorization": `token ${githubConfig.token}`,
        "Content-Type": "application/json",
        "Accept": "application/vnd.github.v3+json"
      },
      body: JSON.stringify(body)
    });

    if (response.ok) {
      const data = await response.json();
      githubSha = data.content.sha;
      
      const badge = document.getElementById("sync-badge");
      const statusDetails = document.getElementById("sync-status-details");
      badge.textContent = "GitHub Synced";
      badge.className = "bg-green-100 text-green-800 font-label-caps text-[10px] px-sm py-[2px] rounded-full border border-green-200 select-none";
      statusDetails.innerHTML = `Status: <span class="text-green-600 font-bold">Connected</span> (SHA: ${githubSha.substring(0, 7)})`;
    } else {
      const errorText = await response.text();
      throw new Error(errorText);
    }
  } catch (error) {
    console.error("Error writing to GitHub", error);
    const badge = document.getElementById("sync-badge");
    badge.textContent = "Sync Error";
    badge.className = "bg-red-100 text-red-800 font-label-caps text-[10px] px-sm py-[2px] rounded-full border border-red-200 select-none";
  }
}

function saveGitHubConfig() {
  githubConfig.repo = document.getElementById("github-repo").value.trim();
  githubConfig.branch = document.getElementById("github-branch").value.trim() || "main";
  githubConfig.path = document.getElementById("github-path").value.trim() || "kinship-data.json";
  githubConfig.token = document.getElementById("github-token").value.trim();

  localStorage.setItem("kinship_github_config", JSON.stringify(githubConfig));
  fetchFromGitHub();
}

function clearGitHubConfig() {
  githubConfig = { repo: "", branch: "main", path: "kinship-data.json", token: "" };
  githubSha = null;
  localStorage.removeItem("kinship_github_config");
  
  document.getElementById("github-repo").value = "";
  document.getElementById("github-branch").value = "main";
  document.getElementById("github-path").value = "kinship-data.json";
  document.getElementById("github-token").value = "";

  const badge = document.getElementById("sync-badge");
  badge.textContent = "LocalStorage Mode";
  badge.className = "bg-surface-container text-on-surface-variant font-label-caps text-[10px] px-sm py-[2px] rounded-full border border-outline-variant select-none";
  document.getElementById("sync-status-details").innerHTML = `Status: <span class="font-bold">Not Connected</span>`;
}

// 4. UI RENDER ENGINE
function updateUI() {
  const currentMember = state.activeMember;
  
  // Header Avatar
  const avatarImg = document.getElementById("current-member-avatar");
  avatarImg.src = MEMBER_DATA[currentMember].avatar;
  avatarImg.alt = MEMBER_DATA[currentMember].name;
  
  // Update header color ring based on profile
  const avatarBtn = document.getElementById("current-member-avatar-btn");
  avatarBtn.className = `w-10 h-10 rounded-full overflow-hidden border-2 cursor-pointer active:scale-95 transition-transform border-${MEMBER_DATA[currentMember].color}`;

  // Render active tab
  renderActiveTab();
}

function renderActiveTab() {
  // Hide all sections
  document.querySelectorAll(".view-section").forEach(sec => sec.classList.add("hidden"));
  
  // Un-highlight nav items
  document.querySelectorAll("#app-bottom-navbar button").forEach(btn => {
    btn.classList.remove("text-primary");
    btn.classList.add("text-on-surface-variant");
    const icon = btn.querySelector(".material-symbols-outlined");
    if (icon) icon.classList.remove("filled");
  });

  // Activate chosen tab
  const activeSec = document.getElementById(`view-${currentTab}`);
  if (activeSec) activeSec.classList.remove("hidden");

  const activeNavBtn = document.getElementById(`nav-btn-${currentTab}`);
  if (activeNavBtn) {
    activeNavBtn.classList.remove("text-on-surface-variant");
    activeNavBtn.classList.add("text-primary");
    const icon = activeNavBtn.querySelector(".material-symbols-outlined");
    if (icon) icon.classList.add("filled");
  }

  // View-specific renders
  if (currentTab === "whiteboard") renderWhiteboard();
  else if (currentTab === "calendar") renderCalendar();
  else if (currentTab === "chat") renderChat();
  else if (currentTab === "lists") renderLists();
  else if (currentTab === "meals") renderMeals();
  else if (currentTab === "settings") renderSettings();
}

// --- TAB RENDERS ---

// 4a. WHITEBOARD VIEW
function renderWhiteboard() {
  // Render Goals
  const goalsList = document.getElementById("whiteboard-goals-list");
  goalsList.innerHTML = state.goals.map(goal => `
    <div class="sticky-note bg-white p-md rounded-xl shadow-md border-l-8 border-${goal.color}">
      <div class="flex justify-between items-start mb-sm">
        <h4 class="font-title-sm text-on-surface font-semibold">${goal.title}</h4>
        <button onclick="deleteGoal(${goal.id})" class="text-outline hover:text-error">
          <span class="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>
      <p class="font-body-sm text-body-sm text-on-surface-variant mb-md italic font-light">"${goal.desc}"</p>
      <div class="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
        <div class="bg-${goal.color} h-full" style="width: ${goal.progress}%"></div>
      </div>
      <div class="mt-base flex justify-between items-center text-[10px]">
        <span class="font-label-caps text-on-surface-variant">${goal.status} (${goal.progress}%)</span>
      </div>
    </div>
  `).join("");

  // Render Tasks
  ["on-deck", "active", "complete"].forEach(lane => {
    const laneList = document.getElementById(`whiteboard-${lane.replace("-", "")}-list`);
    const laneTasks = state.wtasks.filter(t => t.lane === lane);
    
    laneList.innerHTML = laneTasks.map(t => {
      const member = MEMBER_DATA[t.assignee] || MEMBER_DATA.mom;
      return `
        <div class="sticky-note bg-white p-md rounded-xl shadow-sm border-l-8 border-${member.color} flex justify-between items-center">
          <div class="flex-1 min-w-0 pr-sm">
            <div class="flex items-center gap-xs">
              <h4 class="font-title-sm text-on-surface font-semibold truncate">${t.title}</h4>
              ${lane === "active" ? `<span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>` : ""}
            </div>
            <p class="font-body-sm text-body-sm text-on-surface-variant truncate">${t.desc}</p>
            ${t.time ? `
              <div class="mt-xs flex items-center gap-xs text-[11px] text-on-surface-variant">
                <span class="material-symbols-outlined text-[12px]">schedule</span>
                <span>${t.time}</span>
              </div>
            ` : ""}
          </div>
          <div class="flex flex-col items-end gap-xs flex-shrink-0">
            <div class="w-8 h-8 rounded-full overflow-hidden border border-outline-variant">
              <img class="w-full h-full object-cover" src="${member.avatar}" alt="${member.name}">
            </div>
            <div class="flex gap-1 mt-1">
              ${lane !== "complete" ? `
                <button onclick="advanceTask(${t.id})" title="Move Forward" class="text-primary hover:bg-surface-container p-0.5 rounded">
                  <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              ` : ""}
              <button onclick="deleteTask(${t.id})" title="Delete" class="text-outline hover:text-error p-0.5 rounded">
                <span class="material-symbols-outlined text-[16px]">delete</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  });
}

function advanceTask(id) {
  const task = state.wtasks.find(t => t.id === id);
  if (task) {
    if (task.lane === "on-deck") task.lane = "active";
    else if (task.lane === "active") task.lane = "complete";
    saveStateToStorage();
  }
}

function deleteTask(id) {
  state.wtasks = state.wtasks.filter(t => t.id !== id);
  saveStateToStorage();
}

function deleteGoal(id) {
  state.goals = state.goals.filter(g => g.id !== id);
  saveStateToStorage();
}

document.getElementById("clear-completed-whiteboard").addEventListener("click", () => {
  state.wtasks = state.wtasks.filter(t => t.lane !== "complete");
  saveStateToStorage();
});

// 4b. CALENDAR VIEW
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function toggleCalendarView(view) {
  state.calendarView = view;
  saveStateToStorage();
}

function renderCalendar() {
  const viewMode = state.calendarView || "month";
  
  // Set red date badge in top-right header to today's date number
  const todayDateObj = new Date();
  document.getElementById("calendar-today-badge").textContent = todayDateObj.getDate();

  // Set month name in header
  if (viewMode === "month") {
    document.getElementById("calendar-header-month-name").textContent = `${MONTH_NAMES[currentMonth]} ${currentYear}`;
  } else {
    // Show selected date month name in week view
    document.getElementById("calendar-header-month-name").textContent = `${MONTH_NAMES[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
  }

  // Highlight correct toggle button
  const monthBtn = document.getElementById("btn-cal-month");
  const weekBtn = document.getElementById("btn-cal-week");
  if (viewMode === "month") {
    monthBtn.className = "px-sm py-1 rounded-lg font-label-caps text-label-caps font-bold transition-all text-primary bg-white shadow-sm";
    weekBtn.className = "px-sm py-1 rounded-lg font-label-caps text-label-caps font-bold transition-all text-on-surface-variant hover:text-on-surface";
  } else {
    weekBtn.className = "px-sm py-1 rounded-lg font-label-caps text-label-caps font-bold transition-all text-primary bg-white shadow-sm";
    monthBtn.className = "px-sm py-1 rounded-lg font-label-caps text-label-caps font-bold transition-all text-on-surface-variant hover:text-on-surface";
  }

  const daysContainer = document.getElementById("calendar-days-container");
  daysContainer.innerHTML = "";

  if (viewMode === "month") {
    // 30-Day Month View Grid
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthTotalDays = new Date(currentYear, currentMonth, 0).getDate();

    // Previous month padded days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthTotalDays - i;
      daysContainer.appendChild(createDayCell(dayNum, true));
    }

    // Active month days
    for (let day = 1; day <= totalDays; day++) {
      const isToday = todayDateObj.getDate() === day && todayDateObj.getMonth() === currentMonth && todayDateObj.getFullYear() === currentYear;
      daysContainer.appendChild(createDayCell(day, false, isToday));
    }

    // Next month padded days
    const gridCellsFilled = firstDayIndex + totalDays;
    const remainingCells = 42 - gridCellsFilled;
    for (let i = 1; i <= remainingCells; i++) {
      daysContainer.appendChild(createDayCell(i, true));
    }
  } else {
    // 7-Day Week View Grid
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);

      const isToday = (currentDay.getDate() === todayDateObj.getDate() && 
                       currentDay.getMonth() === todayDateObj.getMonth() && 
                       currentDay.getFullYear() === todayDateObj.getFullYear());
                       
      const isSelected = (currentDay.getDate() === selectedDate.getDate() && 
                          currentDay.getMonth() === selectedDate.getMonth() && 
                          currentDay.getFullYear() === selectedDate.getFullYear());

      const cell = document.createElement("div");
      cell.className = `calendar-day-cell relative py-1 flex flex-col items-center justify-center cursor-pointer select-none transition-all`;
      
      if (isToday) {
        cell.classList.add("cal-badge-red");
      } else if (isSelected) {
        cell.classList.add("cal-badge-gray");
      } else {
        cell.className += " hover:bg-surface-container-low";
      }
      
      const textSpan = document.createElement("span");
      textSpan.className = `font-body-sm text-sm z-10 font-bold ${isToday ? "text-white" : "text-on-surface"}`;
      textSpan.textContent = currentDay.getDate();
      cell.appendChild(textSpan);

      const cellDateStr = `${currentDay.getFullYear()}-${String(currentDay.getMonth() + 1).padStart(2, "0")}-${String(currentDay.getDate()).padStart(2, "0")}`;
      const dayEvents = state.calendarEvents.filter(e => e.date === cellDateStr);

      if (dayEvents.length > 0) {
        const dotsDiv = document.createElement("div");
        dotsDiv.className = "flex gap-0.5 mt-0.5 z-10";
        dayEvents.slice(0, 3).forEach(evt => {
          const member = MEMBER_DATA[evt.member] || MEMBER_DATA.mom;
          const dot = document.createElement("div");
          dot.className = `w-1.5 h-1.5 rounded-full member-bg-${member.color}`;
          dotsDiv.appendChild(dot);
        });
        cell.appendChild(dotsDiv);
      }

      const dNum = currentDay.getDate();
      const dMonth = currentDay.getMonth();
      const dYear = currentDay.getFullYear();
      cell.addEventListener("click", () => {
        selectedDate = new Date(dYear, dMonth, dNum);
        renderCalendar();
      });

      daysContainer.appendChild(cell);
    }
  }

  // Update selected date labels in timezone bar
  const daysOfWeekFull = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const formattedDayStr = `${daysOfWeekFull[selectedDate.getDay()].substring(0, 3)} ${selectedDate.getDate()}`;
  document.getElementById("selected-day-label").textContent = formattedDayStr;

  // Conflict Check
  checkCalendarConflicts();

  // Render Daily Timeline
  renderDailyTimeline();
}

function createDayCell(day, isPadded = false, isToday = false) {
  const cell = document.createElement("div");
  cell.className = `calendar-day-cell relative py-1 flex flex-col items-center justify-center cursor-pointer select-none transition-all`;
  
  if (isPadded) {
    cell.classList.add("other-month");
  } else {
    const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear;
    
    if (isToday) {
      cell.classList.add("cal-badge-red");
    } else if (isSelected) {
      cell.classList.add("cal-badge-gray");
    }
  }

  const textSpan = document.createElement("span");
  textSpan.className = `font-body-sm text-sm z-10 font-bold ${isToday ? "text-white" : "text-on-surface"}`;
  textSpan.textContent = day;
  cell.appendChild(textSpan);

  // Check events on this day
  if (!isPadded) {
    const cellDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayEvents = state.calendarEvents.filter(e => e.date === cellDateStr);

    if (dayEvents.length > 0) {
      const dotsDiv = document.createElement("div");
      dotsDiv.className = "flex gap-0.5 mt-0.5 z-10";
      
      // Render up to 3 colored dots
      dayEvents.slice(0, 3).forEach(evt => {
        const member = MEMBER_DATA[evt.member] || MEMBER_DATA.mom;
        const dot = document.createElement("div");
        dot.className = `w-1.5 h-1.5 rounded-full member-bg-${member.color}`;
        dotsDiv.appendChild(dot);
      });
      cell.appendChild(dotsDiv);
    }

    cell.addEventListener("click", () => {
      selectedDate = new Date(currentYear, currentMonth, day);
      renderCalendar();
    });
  }

  return cell;
}

function prevMonth() {
  if (state.calendarView === "week") {
    selectedDate.setDate(selectedDate.getDate() - 7);
    currentMonth = selectedDate.getMonth();
    currentYear = selectedDate.getFullYear();
  } else {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    // Update selectedDate to 1st of month to avoid overflow issues
    selectedDate = new Date(currentYear, currentMonth, 1);
  }
  renderCalendar();
}

function nextMonth() {
  if (state.calendarView === "week") {
    selectedDate.setDate(selectedDate.getDate() + 7);
    currentMonth = selectedDate.getMonth();
    currentYear = selectedDate.getFullYear();
  } else {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    selectedDate = new Date(currentYear, currentMonth, 1);
  }
  renderCalendar();
}

function checkCalendarConflicts() {
  const banner = document.getElementById("calendar-conflict-alert");
  const bannerText = document.getElementById("calendar-conflict-text");
  
  const datesMap = {};
  let conflictStr = "";

  state.calendarEvents.forEach(evt => {
    if (!datesMap[evt.date]) datesMap[evt.date] = [];
    datesMap[evt.date].push(evt);
  });

  for (const date in datesMap) {
    const evts = datesMap[date];
    if (evts.length > 1) {
      for (let i = 0; i < evts.length; i++) {
        for (let j = i + 1; j < evts.length; j++) {
          const e1 = evts[i];
          const e2 = evts[j];
          if ((e1.start >= e2.start && e1.start < e2.end) || (e2.start >= e1.start && e2.start < e1.end)) {
            conflictStr = `Overlap Conflict on ${date}: "${e1.title}" and "${e2.title}" overlap times.`;
            break;
          }
        }
      }
    }
  }

  if (conflictStr) {
    banner.classList.remove("hidden");
    bannerText.textContent = conflictStr;
  } else {
    banner.classList.add("hidden");
  }
}

function renderDailyTimeline() {
  // Render hours grid (7 AM to 10 PM)
  const hoursGrid = document.getElementById("timeline-hours-grid");
  hoursGrid.innerHTML = "";
  for (let h = 7; h <= 22; h++) {
    const ampm = h >= 12 ? (h === 12 ? "12 PM" : `${h - 12} PM`) : `${h} AM`;
    hoursGrid.innerHTML += `
      <div class="timeline-hour-row">
        <div class="timeline-hour-label">${ampm}</div>
        <div class="timeline-hour-grid-line"></div>
      </div>
    `;
  }

  // Render events overlay
  const overlay = document.getElementById("timeline-events-overlay");
  overlay.innerHTML = "";

  const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;
  const dayEvents = state.calendarEvents.filter(e => e.date === dateStr);

  const colorsMap = {
    mom: { bg: "#eff6ff", border: "#3b82f6", text: "#1e3a8a" },
    dad: { bg: "#faf5ff", border: "#a855f7", text: "#581c87" },
    campbell: { bg: "#fef3c7", border: "#f59e0b", text: "#78350f" },
    daphne: { bg: "#ecfdf5", border: "#10b981", text: "#064e3b" },
    liberty: { bg: "#fef2f2", border: "#ef4444", text: "#7f1d1d" }
  };

  const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  dayEvents.forEach(evt => {
    const startMin = parseTimeToMinutes(evt.start);
    const endMin = parseTimeToMinutes(evt.end);
    
    // Timeline starts at 7 AM (420 minutes)
    const timelineStartMin = 7 * 60;
    const offsetMin = startMin - timelineStartMin;
    const durationMin = endMin - startMin;

    // Calculate position: 60px per hour means 1px per minute
    const topPx = offsetMin;
    const heightPx = Math.max(35, durationMin);

    const member = MEMBER_DATA[evt.member] || MEMBER_DATA.mom;
    const theme = colorsMap[member.color] || colorsMap.mom;

    const card = document.createElement("div");
    card.className = "timeline-event-card border-l-[6px]";
    card.style.top = `${topPx}px`;
    card.style.height = `${heightPx}px`;
    card.style.borderColor = theme.border;
    card.style.backgroundColor = theme.bg;

    card.innerHTML = `
      <div class="flex justify-between items-start">
        <div class="font-bold text-[12px] truncate" style="color: ${theme.text}">${evt.title}</div>
        <button onclick="deleteEvent(${evt.id}); event.stopPropagation();" class="opacity-45 hover:opacity-100 transition-opacity" style="color: ${theme.text}">
          <span class="material-symbols-outlined text-[14px]">close</span>
        </button>
      </div>
      <div class="text-[10px] opacity-80 mt-[2px] truncate" style="color: ${theme.text}">
        ${evt.start} - ${evt.end} • ${evt.tag} (${member.name})
      </div>
    `;
    overlay.appendChild(card);
  });

  // Calculate upcoming status info (upcoming events today relative to now)
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  
  let upcomingText = "No more events today";
  if (dateStr === todayStr) {
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const futureEvents = dayEvents.filter(e => parseTimeToMinutes(e.start) > currentMinutes);
    
    if (futureEvents.length > 0) {
      futureEvents.sort((a, b) => a.start.localeCompare(b.start));
      const nextEvt = futureEvents[0];
      const nextStartMin = parseTimeToMinutes(nextEvt.start);
      const diffMin = nextStartMin - currentMinutes;
      const diffHours = Math.floor(diffMin / 60);
      const diffRemainingMin = diffMin % 60;
      
      if (diffHours > 0) {
        upcomingText = `Upcoming in ${diffHours}h ${diffRemainingMin}min`;
      } else {
        upcomingText = `Upcoming in ${diffRemainingMin}min`;
      }
    }
  } else {
    // Show total events count if viewing another day
    upcomingText = `${dayEvents.length} event${dayEvents.length === 1 ? "" : "s"} scheduled`;
  }
  
  document.getElementById("timeline-upcoming-status").textContent = upcomingText;
}

function showAllEvents() {
  const overlay = document.getElementById("timeline-events-overlay");
  overlay.innerHTML = "";
  
  const scrollContainer = document.querySelector(".timeline-scroll-container");
  scrollContainer.scrollTop = 0;

  const sorted = [...state.calendarEvents].sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start));

  const listContainer = document.createElement("div");
  listContainer.className = "p-md flex flex-col gap-sm bg-white pointer-events-auto h-full overflow-y-auto";
  
  listContainer.innerHTML = sorted.map(evt => {
    const member = MEMBER_DATA[evt.member] || MEMBER_DATA.mom;
    return `
      <div class="bg-surface-container-low p-sm px-md rounded-lg flex justify-between items-center border border-outline-variant/30">
        <div>
          <div class="text-[10px] font-bold text-primary font-label-caps uppercase">${evt.tag} • ${evt.date}</div>
          <h4 class="font-title-sm text-on-surface font-bold text-[14px]">${evt.title}</h4>
          <p class="text-[11px] text-outline">${evt.start} - ${evt.end}</p>
        </div>
        <button onclick="deleteEvent(${evt.id}); renderCalendar();" class="text-outline hover:text-error">
          <span class="material-symbols-outlined text-[18px]">delete</span>
        </button>
      </div>
    `;
  }).join("");

  overlay.appendChild(listContainer);
}

function deleteEvent(id) {
  state.calendarEvents = state.calendarEvents.filter(e => e.id !== id);
  saveStateToStorage();
}

// 4c. CHAT VIEW WITH POLL VOTING & TYPING SIMULATION
function renderChat() {
  const container = document.getElementById("chat-messages-container");
  container.innerHTML = "";

  const divider = document.createElement("div");
  divider.className = "flex justify-center my-xs";
  divider.innerHTML = `<span class="bg-surface-container text-on-surface-variant font-label-caps text-[10px] px-sm py-[2px] rounded-full">CONVERSATION RECORD</span>`;
  container.appendChild(divider);

  state.chatMessages.forEach(msg => {
    const isMe = msg.sender === state.activeMember;
    const member = MEMBER_DATA[msg.sender] || MEMBER_DATA.mom;
    
    const bubble = document.createElement("div");
    bubble.className = `flex items-end gap-sm group ${isMe ? "flex-row-reverse" : ""}`;
    
    bubble.innerHTML = `
      <div class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-outline-variant">
        <img class="w-full h-full object-cover" src="${member.avatar}" alt="${member.name}">
      </div>
      <div class="max-w-[75%] flex flex-col ${isMe ? "items-end" : ""}">
        <span class="font-label-caps text-[10px] text-on-surface-variant mb-xs ml-sm mr-sm">${member.name}${isMe ? " (You)" : ""}</span>
        <div class="${isMe ? "bg-primary text-on-primary border-l-[6px] border-primary-container" : "bg-white text-on-surface border-l-[6px] border-" + member.color} p-sm px-md rounded-2xl rounded-bl-none chat-bubble-shadow">
          <p class="font-body-lg text-[15px] leading-relaxed">${msg.text}</p>
          <span class="block text-right font-label-caps text-[8px] mt-xs opacity-70">${msg.time}</span>
        </div>
      </div>
    `;
    container.appendChild(bubble);
  });

  state.polls.forEach(poll => {
    const bubble = document.createElement("div");
    bubble.className = "flex items-end gap-sm group";
    
    let totalVotes = 0;
    poll.options.forEach(opt => totalVotes += opt.votes.length);

    const optionsHTML = poll.options.map((opt, optIndex) => {
      const hasVoted = opt.votes.includes(state.activeMember);
      const avatarsHTML = opt.votes.map(v => {
        const m = MEMBER_DATA[v] || MEMBER_DATA.mom;
        return `<img class="w-5 h-5 rounded-full border border-white object-cover" src="${m.avatar}" title="${m.name}"/>`;
      }).join("");

      return `
        <button onclick="votePoll(${poll.id}, ${optIndex})" class="flex justify-between items-center w-full p-2 px-sm rounded-lg border ${hasVoted ? "border-primary bg-primary/5 font-bold" : "border-outline-variant"} hover:bg-surface-container-low transition-colors">
          <span class="text-body-sm">${opt.text}</span>
          <div class="flex items-center gap-xs">
            <div class="flex -space-x-1.5 mr-1">${avatarsHTML}</div>
            <span class="text-label-caps text-[10px] ${hasVoted ? "text-primary" : "text-outline"}">${opt.votes.length} vote${opt.votes.length === 1 ? "" : "s"}</span>
          </div>
        </button>
      `;
    }).join("");

    bubble.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center flex-shrink-0 border border-outline-variant">
        <span class="material-symbols-outlined text-primary text-[20px]">how_to_vote</span>
      </div>
      <div class="max-w-[80%] w-full flex flex-col">
        <div class="flex items-center gap-xs mb-xs">
          <span class="ml-sm font-label-caps text-[10px] text-on-surface-variant">Family Poll</span>
          <span class="bg-primary-container text-white text-[9px] px-xs rounded-full font-label-caps">ACTIVE</span>
        </div>
        <div class="bg-white p-md rounded-2xl rounded-bl-none chat-bubble-shadow border-l-[6px] border-primary">
          <p class="text-on-surface font-semibold text-title-sm mb-sm">${poll.question}</p>
          <div class="flex flex-col gap-xs">
            ${optionsHTML}
          </div>
          <div class="mt-base flex justify-between items-center text-[10px] text-outline pt-xs">
            <div class="flex items-center gap-xs text-error font-label-caps pulse-timer">
              <span class="material-symbols-outlined text-[12px]">schedule</span>
              <span>Ends: ${poll.endsIn}</span>
            </div>
            <button onclick="deletePoll(${poll.id})" class="text-outline hover:text-error font-label-caps">Delete</button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(bubble);
  });

  setTimeout(() => {
    container.scrollTop = container.scrollHeight;
  }, 50);
}

function sendChatMessage() {
  const input = document.getElementById("chat-input");
  const text = input.value.trim();
  if (!text) return;

  const now = new Date();
  const timeStr = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  
  state.chatMessages.push({
    id: Date.now(),
    sender: state.activeMember,
    text: text,
    time: timeStr
  });

  input.value = "";
  saveStateToStorage();
}

function votePoll(pollId, optionIndex) {
  const poll = state.polls.find(p => p.id === pollId);
  if (!poll) return;

  const member = state.activeMember;

  poll.options.forEach((opt, idx) => {
    const index = opt.votes.indexOf(member);
    if (index > -1) {
      opt.votes.splice(index, 1);
    }
  });

  poll.options[optionIndex].votes.push(member);
  saveStateToStorage();
}

function deletePoll(id) {
  state.polls = state.polls.filter(p => p.id !== id);
  saveStateToStorage();
}

function triggerSimulatedChatReply() {
  const indicator = document.getElementById("chat-typing-indicator");
  const textElem = document.getElementById("chat-typing-text");
  
  const possibleSenders = Object.keys(MEMBER_DATA).filter(k => k !== state.activeMember);
  const randomSender = possibleSenders[Math.floor(Math.random() * possibleSenders.length)];
  const senderName = MEMBER_DATA[randomSender].name;

  textElem.textContent = `${senderName} is typing...`;
  indicator.classList.replace("opacity-0", "opacity-100");

  setTimeout(() => {
    indicator.classList.replace("opacity-100", "opacity-0");
    
    const responses = [
      "Sounds like a plan! 👍",
      "Wait, could we do that tomorrow instead?",
      "Perfect, count me in!",
      "I will update my calendar checklist.",
      "Awesome! Let me check the whiteboard.",
      "🍕 PIZZA! Yes please!"
    ];
    const randomText = responses[Math.floor(Math.random() * responses.length)];
    const now = new Date();
    const timeStr = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

    state.chatMessages.push({
      id: Date.now(),
      sender: randomSender,
      text: randomText,
      time: timeStr
    });
    saveStateToStorage();
  }, 3500);
}

// 4d. LISTS & CHORES VIEW
function renderLists() {
  ["groceries", "chores", "rewards"].forEach(subTab => {
    const btn = document.getElementById(`btn-sub-${subTab}`);
    const pane = document.getElementById(`pane-${subTab}`);
    
    if (subTab === currentListsSubTab) {
      btn.className = "px-sm py-1.5 rounded-lg font-label-caps text-label-caps font-bold transition-all text-primary bg-white shadow-sm";
      pane.classList.remove("hidden");
    } else {
      btn.className = "px-sm py-1.5 rounded-lg font-label-caps text-label-caps font-bold transition-all text-on-surface-variant hover:text-on-surface";
      pane.classList.add("hidden");
    }
  });

  if (currentListsSubTab === "groceries") renderGroceries();
  else if (currentListsSubTab === "chores") renderChores();
  else if (currentListsSubTab === "rewards") renderRewards();
}

function renderGroceries() {
  const container = document.getElementById("grocery-list-items");
  container.innerHTML = "";
  
  let count = 0;
  state.groceries.forEach(item => {
    if (!item.checked) count++;

    const row = document.createElement("div");
    row.className = "flex items-center justify-between p-sm rounded-lg hover:bg-surface-container-low transition-all group";
    
    row.innerHTML = `
      <div class="flex items-center gap-md">
        <input onchange="toggleGroceryChecked(${item.id})" class="w-5 h-5 border-2 border-outline rounded text-primary focus:ring-primary checkbox-bounce" type="checkbox" ${item.checked ? "checked" : ""}/>
        <div class="flex flex-col">
          <span class="font-body-lg text-[15px] ${item.checked ? "line-through text-outline" : "text-on-surface"}">${item.name}</span>
          <span class="font-label-caps text-[9px] text-outline uppercase tracking-wider">Added by ${MEMBER_DATA[item.addedBy]?.name || item.addedBy}</span>
        </div>
      </div>
      <div class="flex items-center gap-sm">
        <span class="px-sm py-0.5 bg-primary-fixed/40 text-primary rounded-full font-label-caps text-[10px]">${item.category}</span>
        <button onclick="deleteGroceryItemRow(${item.id})" class="text-outline hover:text-error opacity-0 group-hover:opacity-100 transition-opacity">
          <span class="material-symbols-outlined text-[18px]">delete</span>
        </button>
      </div>
    `;
    container.appendChild(row);
  });

  document.getElementById("grocery-count-badge").textContent = `${count} ITEM${count === 1 ? "" : "S"}`;
}

function addGroceryItem() {
  const input = document.getElementById("grocery-input");
  const name = input.value.trim();
  if (!name) return;

  const categories = ["Produce", "Dairy", "Bakery", "Pantry", "Frozen", "Meat"];
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];

  state.groceries.push({
    id: Date.now(),
    name: name,
    category: randomCategory,
    addedBy: state.activeMember,
    checked: false
  });

  input.value = "";
  saveStateToStorage();
}

function toggleGroceryChecked(id) {
  const item = state.groceries.find(g => g.id === id);
  if (item) {
    item.checked = !item.checked;
    saveStateToStorage();
  }
}

function deleteGroceryItemRow(id) {
  state.groceries = state.groceries.filter(g => g.id !== id);
  saveStateToStorage();
}

// CHORES SUBTAB
let choresFilter = "all";

function renderChores() {
  const container = document.getElementById("chores-list-items");
  container.innerHTML = "";

  ["all", "kids", "parents"].forEach(f => {
    const chip = document.getElementById(`chore-filter-${f}`);
    if (f === choresFilter) {
      chip.className = "bg-secondary-container text-on-secondary-container px-sm py-1 rounded-full font-label-caps text-label-caps shrink-0 select-none";
    } else {
      chip.className = "bg-surface-container text-on-surface-variant px-sm py-1 rounded-full font-label-caps text-label-caps shrink-0 hover:bg-surface-container-high select-none";
    }
  });

  let filtered = state.chores;
  if (choresFilter === "kids") {
    filtered = state.chores.filter(c => c.assignee === "liberty" || c.assignee === "daphne");
  } else if (choresFilter === "parents") {
    filtered = state.chores.filter(c => c.assignee === "mom" || c.assignee === "dad" || c.assignee === "campbell");
  }

  if (filtered.length === 0) {
    container.innerHTML = `<p class="text-on-surface-variant text-center py-md italic font-body-sm">No chores currently assigned in this category.</p>`;
  } else {
    filtered.forEach(chore => {
      const member = MEMBER_DATA[chore.assignee] || MEMBER_DATA.mom;
      const card = document.createElement("div");
      card.className = `member-border-${member.color} bg-surface-container-low rounded-lg p-sm px-md flex items-center justify-between group transition-transform active:scale-[0.99]`;
      
      card.innerHTML = `
        <div class="flex items-center gap-md">
          <input onchange="toggleChoreComplete(${chore.id})" class="w-5 h-5 border-2 border-secondary rounded text-secondary focus:ring-secondary checkbox-bounce" type="checkbox" ${chore.completed ? "checked" : ""}/>
          <div class="flex flex-col">
            <span class="font-title-sm text-[15px] ${chore.completed ? "line-through text-outline font-normal" : "text-on-surface font-semibold"}">${chore.title}</span>
            <span class="font-body-sm text-[12px] text-on-surface-variant">${chore.due} • Assigned to ${member.name} (${chore.points} PTS)</span>
          </div>
        </div>
        <div class="flex items-center gap-sm">
          <span class="material-symbols-outlined text-outline group-hover:text-secondary transition-colors">${chore.icon}</span>
          <button onclick="deleteChoreRow(${chore.id})" class="text-outline hover:text-error opacity-0 group-hover:opacity-100 transition-opacity">
            <span class="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      `;
      container.appendChild(card);
    });
  }
}

function filterChores(category) {
  choresFilter = category;
  renderChores();
}

function toggleChoreComplete(id) {
  const chore = state.chores.find(c => c.id === id);
  if (chore) {
    chore.completed = !chore.completed;
    
    if (chore.completed) {
      if (state.members[chore.assignee]) {
        state.members[chore.assignee].points += chore.points;
      }
    } else {
      if (state.members[chore.assignee]) {
        state.members[chore.assignee].points = Math.max(0, state.members[chore.assignee].points - chore.points);
      }
    }
    
    saveStateToStorage();
  }
}

function deleteChoreRow(id) {
  state.chores = state.chores.filter(c => c.id !== id);
  saveStateToStorage();
}

// REWARDS STORE
function renderRewards() {
  const pointsContainer = document.getElementById("kids-points-container");
  pointsContainer.innerHTML = "";

  const kids = ["liberty", "daphne"];
  kids.forEach(kidId => {
    const profile = MEMBER_DATA[kidId];
    const stat = state.members[kidId];
    const pct = Math.min(100, Math.floor((stat.points / stat.targetPts) * 100));

    const card = document.createElement("div");
    card.className = `chalkboard-tile bg-white rounded-xl p-md border-l-[6px] border-${profile.color}`;
    card.innerHTML = `
      <div class="flex justify-between items-start mb-base">
        <div class="flex items-center gap-sm">
          <div class="w-10 h-10 rounded-full overflow-hidden border border-outline-variant">
            <img class="w-full h-full object-cover" src="${profile.avatar}" alt="${profile.name}">
          </div>
          <div>
            <h3 class="font-title-sm text-on-surface font-semibold">${profile.name}</h3>
            <p class="font-label-caps text-on-surface-variant text-[10px]">Streak: ${stat.streak} Days</p>
          </div>
        </div>
        <div class="text-right">
          <span class="font-headline-md text-headline-md-mobile text-${profile.color} font-bold">${stat.points}</span>
          <p class="font-label-caps text-on-surface-variant text-[9px]">Points</p>
        </div>
      </div>
      <div class="mt-sm">
        <div class="flex justify-between font-label-caps text-[10px] text-on-surface-variant mb-xs">
          <span>Goal: ${stat.target}</span>
          <span>${stat.points} / ${stat.targetPts}</span>
        </div>
        <div class="h-2.5 w-full bg-surface-container rounded-full overflow-hidden">
          <div class="h-full bg-${profile.color} rounded-full" style="width: ${pct}%"></div>
        </div>
      </div>
    `;
    pointsContainer.appendChild(card);
  });

  const store = document.getElementById("rewards-store-grid");
  store.innerHTML = "";

  state.rewardsStore.forEach(reward => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-xl p-md flex flex-col justify-between chalkboard-tile border border-outline-variant/30 h-44";
    
    card.innerHTML = `
      <div>
        <div class="flex justify-between items-start">
          <h4 class="font-title-sm text-on-surface font-semibold leading-tight pr-xs">${reward.name}</h4>
          <span class="bg-primary-fixed text-primary px-sm py-0.5 rounded-full font-label-caps text-[10px] font-bold select-none shrink-0">${reward.pointsCost} PTS</span>
        </div>
        <p class="font-body-sm text-[12px] text-on-surface-variant mt-xs">${reward.subtext || "Family reward"}</p>
      </div>
      <div class="flex justify-between items-end mt-base">
        <span class="material-symbols-outlined text-outline text-3xl">${reward.icon || "stars"}</span>
        <button onclick="redeemReward('${reward.name}', ${reward.pointsCost})" class="text-primary font-label-caps text-[11px] border border-primary px-md py-1 rounded-lg hover:bg-primary hover:text-white transition-colors active:scale-95">REDEEM</button>
      </div>
    `;
    store.appendChild(card);
  });
}

function redeemReward(name, cost) {
  const active = state.activeMember;
  if (active !== "liberty" && active !== "daphne") {
    alert("Only kids (Liberty or Daphne) can redeem points for rewards store items!");
    return;
  }

  const stat = state.members[active];
  if (stat.points < cost) {
    alert(`Insufficient points! You need ${cost} points, but you currently have ${stat.points}.`);
    return;
  }

  stat.points -= cost;
  alert(`Successfully redeemed: ${name}! ${cost} points deducted.`);
  saveStateToStorage();
}

// MEALS VIEW
function renderMeals() {
  const container = document.getElementById("meal-days-grid");
  container.innerHTML = "";

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const fullNames = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday" };

  days.forEach(day => {
    const meal = state.meals[day];
    const card = document.createElement("div");
    card.className = "chalkboard-tile p-md flex flex-col gap-sm";
    
    let starsHTML = "";
    for (let s = 1; s <= 5; s++) {
      const active = s <= meal.rating;
      starsHTML += `<span onclick="rateMeal('${day}', ${s})" class="material-symbols-outlined text-[18px] cursor-pointer hover:scale-110 transition-transform ${active ? "text-amber-500 filled" : "text-outline"}">star</span>`;
    }

    card.innerHTML = `
      <div class="flex justify-between items-center border-b border-surface-variant/40 pb-base">
        <h4 class="font-title-sm text-on-surface font-bold text-primary">${fullNames[day]}</h4>
      </div>
      <div class="space-y-sm">
        <div class="p-sm bg-surface-container-low rounded-lg">
          <p class="text-[9px] font-bold text-outline uppercase tracking-wider mb-xs">Breakfast</p>
          <p class="font-body-sm text-[13px] text-on-surface font-semibold">${meal.Breakfast || "Not planned"}</p>
        </div>
        <div class="p-sm bg-surface-container-low rounded-lg">
          <p class="text-[9px] font-bold text-outline uppercase tracking-wider mb-xs">Lunch</p>
          <p class="font-body-sm text-[13px] text-on-surface font-semibold">${meal.Lunch || "Not planned"}</p>
        </div>
        <div class="p-sm bg-primary-fixed text-on-primary-fixed rounded-lg flex justify-between items-center">
          <div>
            <p class="text-[9px] font-bold text-on-primary-fixed-variant uppercase tracking-wider mb-xs">Dinner</p>
            <p class="font-body-sm text-[13px] font-bold">${meal.Dinner || "Not planned"}</p>
          </div>
          <span class="material-symbols-outlined text-primary">restaurant</span>
        </div>
        
        <div class="pt-base border-t border-surface-variant/30 flex items-center justify-between">
          <div class="flex gap-[2px] star-rating">
            ${starsHTML}
          </div>
          <span class="text-[9px] text-outline italic">Rating</span>
        </div>
      </div>
      <div class="flex gap-sm mt-xs">
        <button onclick="openAddMealModal('${day}')" class="flex-1 py-1.5 border border-dashed border-outline-variant rounded-lg text-outline font-label-caps text-[10px] hover:bg-surface-container transition-colors">
          EDIT MEALS
        </button>
        <button onclick="addMealIngredientsToList('${day}')" class="px-sm py-1.5 bg-surface-container text-on-surface-variant font-label-caps text-[10px] rounded-lg hover:bg-surface-container-high transition-colors">
          + INGREDIENTS
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function rateMeal(day, rating) {
  if (state.meals[day]) {
    state.meals[day].rating = rating;
    saveStateToStorage();
  }
}

function addMealIngredientsToList(day) {
  const meal = state.meals[day];
  if (!meal || !meal.ingredients) return;

  const items = meal.ingredients.split(",").map(i => i.trim());
  items.forEach(name => {
    if (name) {
      state.groceries.push({
        id: Date.now() + Math.random(),
        name: name,
        category: "Produce",
        addedBy: state.activeMember,
        checked: false
      });
    }
  });

  alert(`Added ingredients (${items.join(", ")}) to grocery list!`);
  saveStateToStorage();
}

function generateAIMealSuggestions() {
  const suggestions = {
    Breakfast: ["Banana Walnut Waffles", "Avocado Toast with Poached Egg", "Acai Smoothie Bowl", "Buttermilk Pancakes", "Chia Seed Pudding"],
    Lunch: ["Mediterranean Chickpea Salad", "Turkey Club Wrap", "Thai Peanut Noodles", "Caprese Panini", "Harvest Cob Cobb Salad"],
    Dinner: ["Beef Stir-Fry with Broccoli", "Creamy Tomato Tuscan Chicken", "Sheet Pan Shrimp Fajitas", "Baked Ziti with Ricotta", "BBQ Glazed Pork Chops"]
  };

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  days.forEach(d => {
    state.meals[d].Breakfast = suggestions.Breakfast[Math.floor(Math.random() * suggestions.Breakfast.length)];
    state.meals[d].Lunch = suggestions.Lunch[Math.floor(Math.random() * suggestions.Lunch.length)];
    state.meals[d].Dinner = suggestions.Dinner[Math.floor(Math.random() * suggestions.Dinner.length)];
    state.meals[d].rating = 0;
  });

  alert("AI Generated new meal blueprints for the week! Ratings reset.");
  saveStateToStorage();
}

// SETTINGS VIEW & AVATAR EDITOR
function renderSettings() {
  const list = document.getElementById("settings-profile-list");
  list.innerHTML = "";

  Object.keys(MEMBER_DATA).forEach(memberKey => {
    const m = MEMBER_DATA[memberKey];
    const isSelected = state.activeMember === memberKey;
    const card = document.createElement("div");
    card.className = "flex flex-col items-center gap-xs cursor-pointer select-none group";
    card.onclick = () => selectProfile(memberKey);

    card.innerHTML = `
      <div class="w-14 h-14 rounded-full overflow-hidden border-4 transition-transform active:scale-90 ${isSelected ? "border-" + m.color + " scale-105" : "border-transparent opacity-60 hover:opacity-100"}">
        <img class="w-full h-full object-cover" src="${m.avatar}" alt="${m.name}">
      </div>
      <span class="font-label-caps text-label-caps ${isSelected ? "text-primary font-bold" : "text-on-surface-variant"}">${m.name}</span>
    `;
    list.appendChild(card);
  });

  // Render Custom Profile Photos Editor
  const editContainer = document.getElementById("settings-avatar-edit-list");
  editContainer.innerHTML = Object.keys(MEMBER_DATA).map(key => `
    <div class="flex items-center gap-md p-xs rounded-lg hover:bg-surface-container-low">
      <div class="w-10 h-10 rounded-full overflow-hidden border border-outline-variant shrink-0">
        <img class="w-full h-full object-cover" src="${MEMBER_DATA[key].avatar}" alt="${MEMBER_DATA[key].name}">
      </div>
      <div class="flex-grow">
        <label class="block text-[11px] font-bold font-label-caps text-on-surface-variant">${MEMBER_DATA[key].name} URL</label>
        <input type="text" class="w-full bg-surface-container-low border-none rounded-lg h-9 px-3 text-xs focus:ring-1 focus:ring-primary" value="${MEMBER_DATA[key].avatar}" onchange="updateMemberAvatar('${key}', this.value)" placeholder="Paste image URL here..." />
      </div>
    </div>
  `).join("");
}

function updateMemberAvatar(key, url) {
  if (!url) return;
  if (!state.customAvatars) state.customAvatars = {};
  
  state.customAvatars[key] = url;
  MEMBER_DATA[key].avatar = url;
  saveStateToStorage();
}

function selectProfile(key) {
  state.activeMember = key;
  saveStateToStorage();
}

// 5. APPLICATION TABS & DIALOG ACTIONS
function switchTab(tabId) {
  currentTab = tabId;
  renderActiveTab();
}

// Modal Handlers
function openAddGoalModal() {
  openModal("modal-add-goal");
}

function submitGoal() {
  const title = document.getElementById("input-goal-title").value.trim();
  const desc = document.getElementById("input-goal-desc").value.trim();
  const status = document.getElementById("input-goal-status").value.trim() || "PLANNING";
  const progress = parseInt(document.getElementById("input-goal-progress").value) || 0;
  const color = document.getElementById("input-goal-color").value;

  if (!title) return alert("Title is required!");

  state.goals.push({
    id: Date.now(),
    title,
    desc,
    status,
    progress,
    color
  });

  closeActiveModal();
  saveStateToStorage();
}

function openAddTaskModal(lane) {
  document.getElementById("input-wtask-lane").value = lane;
  openModal("modal-add-wtask");
}

function submitWhiteboardTask() {
  const lane = document.getElementById("input-wtask-lane").value;
  const title = document.getElementById("input-wtask-title").value.trim();
  const desc = document.getElementById("input-wtask-desc").value.trim();
  const time = document.getElementById("input-wtask-time").value.trim();
  const assignee = document.getElementById("input-wtask-assignee").value;

  if (!title) return alert("Task Name is required!");

  state.wtasks.push({
    id: Date.now(),
    lane,
    title,
    desc,
    time,
    assignee
  });

  closeActiveModal();
  saveStateToStorage();
}

function openAddEventModal() {
  const dateInput = document.getElementById("input-event-date");
  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
  const day = String(selectedDate.getDate()).padStart(2, "0");
  dateInput.value = `${year}-${month}-${day}`;
  
  openModal("modal-add-event");
}

function submitEvent() {
  const title = document.getElementById("input-event-title").value.trim();
  const date = document.getElementById("input-event-date").value;
  const start = document.getElementById("input-event-start").value;
  const end = document.getElementById("input-event-end").value;
  const tag = document.getElementById("input-event-tag").value.trim() || "Event";
  const member = document.getElementById("input-event-member").value;

  if (!title || !date || !start || !end) return alert("All fields are required!");

  state.calendarEvents.push({
    id: Date.now(),
    title,
    date,
    start,
    end,
    tag,
    member
  });

  closeActiveModal();
  saveStateToStorage();
}

function openCreatePollModal() {
  openModal("modal-create-poll");
}

function submitPoll() {
  const question = document.getElementById("input-poll-question").value.trim();
  const opt1 = document.getElementById("input-poll-opt1").value.trim();
  const opt2 = document.getElementById("input-poll-opt2").value.trim();
  const opt3 = document.getElementById("input-poll-opt3").value.trim();
  const hours = document.getElementById("input-poll-duration").value || 2;

  if (!question || !opt1 || !opt2) return alert("Question and at least 2 options are required!");

  const options = [
    { text: opt1, votes: [] },
    { text: opt2, votes: [] }
  ];
  if (opt3) {
    options.push({ text: opt3, votes: [] });
  }

  state.polls.push({
    id: Date.now(),
    question,
    creator: state.activeMember,
    endsIn: `${String(hours).padStart(2, "0")}h 00m`,
    options
  });

  closeActiveModal();
  saveStateToStorage();
}

function openAddChoreModal() {
  openModal("modal-add-chore");
}

function submitChore() {
  const title = document.getElementById("input-chore-title").value.trim();
  const due = document.getElementById("input-chore-due").value.trim() || "Due today";
  const icon = document.getElementById("input-chore-icon").value;
  const assignee = document.getElementById("input-chore-assignee").value;
  const points = parseInt(document.getElementById("input-chore-points").value) || 50;

  if (!title) return alert("Chore Name is required!");

  state.chores.push({
    id: Date.now(),
    title,
    due,
    icon,
    assignee,
    completed: false,
    points
  });

  closeActiveModal();
  saveStateToStorage();
}

function openAddMealModal(day) {
  document.getElementById("input-meal-day").value = day;
  
  const meal = state.meals[day];
  document.getElementById("input-meal-title").value = meal ? meal.Dinner : "";
  document.getElementById("input-meal-ingredients").value = meal ? (meal.ingredients || "") : "";

  openModal("modal-add-meal");
}

function submitMeal() {
  const day = document.getElementById("input-meal-day").value;
  const time = document.getElementById("input-meal-time").value;
  const title = document.getElementById("input-meal-title").value.trim();
  const ingredients = document.getElementById("input-meal-ingredients").value.trim();

  if (!title) return alert("Meal Name is required!");

  if (!state.meals[day]) state.meals[day] = {};
  state.meals[day][time] = title;
  
  if (ingredients) {
    state.meals[day].ingredients = ingredients;
  }

  closeActiveModal();
  saveStateToStorage();
}

function openModal(id) {
  document.querySelectorAll("#modals-container > div").forEach(m => m.classList.add("hidden"));
  const container = document.getElementById("modals-container");
  const modal = document.getElementById(id);
  if (modal) {
    container.classList.remove("hidden");
    modal.classList.remove("hidden");
    activeModal = id;
  }
}

function closeActiveModal() {
  document.getElementById("modals-container").classList.add("hidden");
  if (activeModal) {
    const modal = document.getElementById(activeModal);
    if (modal) modal.classList.add("hidden");
  }
  activeModal = null;
  
  document.querySelectorAll("#modals-container input, #modals-container textarea").forEach(input => {
    if (input.type !== "hidden" && input.type !== "number" && input.type !== "select-one" && input.type !== "date" && input.type !== "time") {
      input.value = "";
    }
  });
}

// 6. INITIALIZATION & LAYOUT CONFIG
document.addEventListener("DOMContentLoaded", () => {
  loadStateFromStorage();
  
  const desktopBtn = document.getElementById("layout-desktop");
  const mobileBtn = document.getElementById("layout-mobile");
  
  const viewsHTML = document.getElementById("app-views");
  const mobileTarget = document.getElementById("mobile-view-content-target");
  const desktopTarget = document.getElementById("desktop-view-content-target");

  desktopTarget.appendChild(viewsHTML);

  desktopBtn.addEventListener("click", () => {
    document.body.classList.remove("mobile-mode");
    desktopBtn.classList.add("active");
    mobileBtn.classList.remove("active");
    desktopTarget.appendChild(viewsHTML);
    updateUI();
  });

  mobileBtn.addEventListener("click", () => {
    document.body.classList.add("mobile-mode");
    mobileBtn.classList.add("active");
    desktopBtn.classList.remove("active");
    mobileTarget.appendChild(viewsHTML);
    updateUI();
  });

  function updateMobileClock() {
    const clock = document.getElementById("mobile-time");
    if (clock) {
      const now = new Date();
      clock.textContent = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
    }
  }
  setInterval(updateMobileClock, 60000);
  updateMobileClock();

  document.getElementById("modals-container").addEventListener("click", (e) => {
    if (e.target.id === "modals-container") {
      closeActiveModal();
    }
  });

  if (githubConfig.repo && githubConfig.token) {
    fetchFromGitHub();
  }

  updateUI();
});
