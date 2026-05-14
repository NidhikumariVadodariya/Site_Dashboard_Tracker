// JAVASCRIPT

// getting variables
// get input, select, button, list, and empty message from HTML

const activityInput = document.getElementById("activityInput");
const statusInput = document.getElementById("statusInput");
const addActivityBtn = document.getElementById("addActivityBtn");
const activityList = document.getElementById("activityList");
const emptyState = document.getElementById("emptyState");

// get dashboard number elements from HTML
const totalActivities = document.getElementById("totalActivities");
const completedActivities = document.getElementById("completedActivities");
const inProgressActivities = document.getElementById("inProgressActivities");
const pendingActivities = document.getElementById("pendingActivities");
const progressPercent = document.getElementById("progressPercent");
const progressFill = document.getElementById("progressFill");

const filterCards = document.querySelectorAll(".card");

// load saved activities from localstorage
// if nothing is saved, start with an empty array
let activities = JSON.parse(localStorage.getItem("siteActivities")) || [];

let currentFilter = "All";

// save activities to localstorage
function saveActivities () {
    localStorage.setItem("siteActivities", JSON.stringify(activities));
}

// show activities on the screen
function renderActivities () {
    activityList.innerHTML = "";

    const filteredActivities = activities.filter(function (activity) {
        if (currentFilter === "All") {
            return true;
        }

        return activity.status === currentFilter;
    });

    // activities.forEach(function (activity) {
    filteredActivities.forEach(function (activity) {
        const activityItem = document.createElement("div");
        activityItem.classList.add("activity-item");
        
        // convert status text into CSS class name
        // example: "In-Progress" becomes "in-progress"
        const statusClass = activity.status.toLowerCase().replace(" ","-");

        activityItem.innerHTML = `
            <h3>${activity.text}</h3>

            <span class="status ${statusClass}">
                ${activity.status}
            </span>
            
            <button class="delete-btn">🗑 Delete</button>
        `;

        const deleteBtn = activityItem.querySelector(".delete-btn")

        // delete selected activity
        deleteBtn.addEventListener("click", function() {
            activities = activities.filter(function (item) {
                return item.id !== activity.id;
            });

            saveActivities();
            renderActivities();

        });

        activityList.appendChild(activityItem);

    });

    updateDashboard();
    updateEmptyState();

}

// add new activity

function addActivity() {
    const activityText = activityInput.value.trim();
    const activityStatus = statusInput.value;

    if (activityText === "") {
        alert("Please enter a site activity.");
        return;
    }

    const newActivity = {
        id: Date.now(),
        text: activityText,
        status: activityStatus
    };

    activities.push(newActivity);

    activityInput.value = "";
    statusInput.value = "Pending";
    activityInput.focus();

    saveActivities();
    renderActivities();
}

// update cards and progress bar

function updateDashboard() {
    const total = activities.length;

    const completed = activities.filter(function (activity) {
        return activity.status === "Completed";
    }).length;

    const inProgress = activities.filter(function (activity) {
        return activity.status === "In Progress";
    }).length;

    const pending = activities.filter(function (activity) {
        return activity.status === "Pending";
    }).length;

    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    totalActivities.textContent = total;
    completedActivities.textContent = completed;
    inProgressActivities.textContent = inProgress;
    pendingActivities.textContent = pending;

    progressPercent.textContent = percent + "%";
    progressFill.style.width = percent + "%";
}

// show empty message only when no activities exist
function updateEmptyState() {
    if (activities.length === 0) {
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";
    }
}

// add activity by clicking button
addActivityBtn.addEventListener("click", addActivity);

// add activity by pressing Enter
activityInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addActivity();
    }
});

// filter activites by clicking dashboard cards
filterCards.forEach(function (card) { 
    card.addEventListener("click",function () {
        currentFilter = card.dataset.filter;
        renderActivities();
        filterCards.forEach(function (card) {
            card.classList.remove("active-filter");
        });

        card.classList.add("active-filter");
    });
});

document.querySelector(".total-card").classList.add("active-filter");

// load existing saved activities when page opens

renderActivities();