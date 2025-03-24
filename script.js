document.addEventListener("DOMContentLoaded", () => {
    fetchMoods();
});

let selectedMood = null;

// Function to select mood and display it
function logMood(mood) {
    selectedMood = mood;
    document.getElementById("selected-mood").textContent = `Selected Mood: ${mood}`;
}

// Function to save mood entry
function submitMood() {
    if (!selectedMood) {
        alert("Please select a mood before saving!");
        return;
    }

    const note = document.getElementById("note").value;

    // First, fetch existing moods to determine the next numeric ID
    fetch("http://localhost:3000/moods")
        .then(response => response.json())
        .then(moods => {
            // Ensure next numeric ID
            const newId = moods.length > 0 ? Math.max(...moods.map(m => Number(m.id) || 0)) + 1 : 1;

            const moodEntry = {
                id: newId,  // ✅ Explicitly set a numeric ID
                mood: selectedMood,
                note: note,
                date: new Date().toISOString().split("T")[0]
            };

            // Now send the new entry to the server
            return fetch("http://localhost:3000/moods", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(moodEntry)
            });
        })
        .then(response => response.json())
        .then(() => {
            fetchMoods(); // Refresh list
            document.getElementById("note").value = ""; // Clear note
            document.getElementById("selected-mood").textContent = ""; // Clear selected mood
            selectedMood = null;
        })
        .catch(error => console.error("Error saving mood:", error));
}

// Function to fetch moods from db.json
function fetchMoods() {
    fetch("http://localhost:3000/moods")
        .then(response => response.json())
        .then(moods => {
            const moodList = document.getElementById("mood-list");
            moodList.innerHTML = ""; // Clear the list

            moods.forEach(entry => {
                const li = document.createElement("li");
                li.innerHTML = `${entry.date} - ${entry.mood}: ${entry.note} 
                    <button onclick="deleteMood(${entry.id})" class="delete-btn">❌</button>`;
                moodList.appendChild(li);
            });
        })
        .catch(error => console.error("Error fetching moods:", error));
}

// Function to delete a mood entry
// Function to delete a mood entry
function deleteMood(id) {
    fetch(`http://localhost:3000/moods/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
    })
    .then(response => {
        if (!response.ok) throw new Error("Failed to delete mood");
        return response.json();
    })
    .then(() => fetchMoods()) // Refresh list
    .catch(error => console.error("Error:", error));
}
