document.addEventListener("DOMContentLoaded", function() {
    fetchMoods(); // Load moods when page loads
    setupDarkMode(); // Set up dark mode toggle
    loadChart(); // Load mood statistics chart
});

let selectedMood = ""; // Store the selected mood

// Function to log a mood
function logMood(mood) {
    selectedMood = mood; // Update selected mood
    document.getElementById("selected-mood").textContent = "Selected Mood: " + mood;
}

// Function to save mood
function submitMood() {
    if (selectedMood === "") {
        alert("Please select a mood first!");
        return;
    }

    let note = document.getElementById("note").value;

    fetch("http://localhost:3000/moods")
        .then(response => response.json())
        .then(moods => {
            let newId = moods.length + 1; // Generate new ID
            let moodEntry = {
                id: newId,
                mood: selectedMood,
                note: note,
                date: new Date().toISOString().split("T")[0]
            };
            return fetch("http://localhost:3000/moods", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(moodEntry)
            });
        })
        .then(() => {
            fetchMoods(); // Refresh mood list
            document.getElementById("note").value = "";
            document.getElementById("selected-mood").textContent = "";
            selectedMood = "";
        })
        .catch(error => console.log("Error saving mood", error));
}

// Function to fetch moods
function fetchMoods() {
    fetch("http://localhost:3000/moods")
        .then(response => response.json())
        .then(moods => {
            let moodList = document.getElementById("mood-list");
            moodList.innerHTML = ""; // Clear list
            moods.forEach(entry => {
                let li = document.createElement("li");
                li.innerHTML = entry.date + " - " + entry.mood + ": " + entry.note + 
                    " <button onclick=\"deleteMood(" + entry.id + ")\">❌</button>";
                moodList.appendChild(li);
            });
        })
        .catch(error => console.log("Error fetching moods", error));
}

// Function to delete a mood
function deleteMood(id) {
    fetch("http://localhost:3000/moods/" + id, { method: "DELETE" })
    .then(() => fetchMoods())
    .catch(error => console.log("Error deleting mood", error));
}

// Function to toggle dark mode
function setupDarkMode() {
    let toggleButton = document.getElementById("dark-mode-toggle");
    toggleButton.addEventListener("click", function() {
        document.body.classList.toggle("dark-mode");
    });
}

// Function to filter moods
function searchMoods() {
    let query = document.getElementById("search-bar").value.toLowerCase();
    let items = document.querySelectorAll("#mood-list li");
    items.forEach(item => {
        if (item.textContent.toLowerCase().includes(query)) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    });
}

// Function to load chart
function loadChart() {
    fetch("http://localhost:3000/moods")
        .then(response => response.json())
        .then(moods => {
            let moodCounts = {};
            moods.forEach(m => {
                moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
            });
            let ctx = document.getElementById("moodChart").getContext("2d");
            new Chart(ctx, {
                type: "bar",
                data: {
                    labels: Object.keys(moodCounts),
                    datasets: [{
                        label: "Mood Frequency",
                        data: Object.values(moodCounts),
                        backgroundColor: "#4CAF50"
                    }]
                }
            });
        })
        .catch(error => console.log("Error loading chart", error));
}

// Function to generate a random mood quote
function generateQuote() {
    let quotes = [
        "Happiness is not something ready-made. It comes from your own actions.",
        "Sadness flies away on the wings of time.",
        "Relax, nothing is under control.",
        "Motivation gets you started. Habit keeps you going."
    ];
    let randomIndex = Math.floor(Math.random() * quotes.length);
    document.getElementById("mood-quote").textContent = quotes[randomIndex];
}

// Function to set a mood reminder
function setReminder() {
    let reminderTime = document.getElementById("reminder-time").value;
    if (reminderTime === "") {
        alert("Please set a reminder time.");
        return;
    }
    alert("Mood reminder set for " + reminderTime);
}
