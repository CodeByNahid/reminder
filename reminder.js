const body = document.body;
body.style.fontFamily = "Arial, sans-serif";
body.style.textAlign = "center";
body.style.marginTop = "50px";
body.style.backgroundColor = "#e0f2e9";

const container = document.createElement("div");
container.style.backgroundColor = "#2e7d32";
container.style.color = "white";
container.style.padding = "20px";
container.style.borderRadius = "10px";
container.style.display = "inline-block";
container.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
body.appendChild(container);

const title = document.createElement("h2");
title.textContent = "Event Reminder";
container.appendChild(title);

const nameInput = document.createElement("input");
nameInput.type = "text";
nameInput.placeholder = "Event Name";
nameInput.id = "eventName";
nameInput.style.marginBottom = "10px";
container.appendChild(nameInput);

const input = document.createElement("input");
input.type = "datetime-local";
input.id = "eventTime";
container.appendChild(input);

const button = document.createElement("button");
button.textContent = "Set Reminder";
button.style.marginLeft = "10px";
button.style.padding = "5px 10px";
button.style.backgroundColor = "#81c784";
button.style.border = "none";
button.style.color = "white";
button.style.borderRadius = "5px";
button.style.cursor = "pointer";
button.onclick = startCountdown;
container.appendChild(button);

const countdownContainer = document.createElement("div");
countdownContainer.style.marginTop = "20px";
body.appendChild(countdownContainer);

function startCountdown() {
    const eventTime = new Date(input.value).getTime();
    const eventName = nameInput.value.trim();
    if (isNaN(eventTime) || eventName === "") {
        alert("Please enter an event name and a valid date/time.");
        return;
    }
    
    let events = JSON.parse(localStorage.getItem("events")) || [];
    events.push({ name: eventName, time: eventTime });
    localStorage.setItem("events", JSON.stringify(events));
    renderCountdowns();
}

function renderCountdowns() {
    countdownContainer.innerHTML = "";
    let events = JSON.parse(localStorage.getItem("events")) || [];
    events = events.filter(event => event.time > new Date().getTime()); // Remove expired events
    
    // Sort events by time (soonest event first)
    events.sort((a, b) => a.time - b.time);
    
    localStorage.setItem("events", JSON.stringify(events));
    
    events.forEach(event => {
        const countdown = document.createElement("h3");
        countdown.style.marginTop = "10px";
        countdownContainer.appendChild(countdown);
        updateCountdown(event, countdown);
    });
}

function updateCountdown(event, countdownElement) {
    function update() {
        const now = new Date().getTime();
        const timeLeft = event.time - now;

        if (timeLeft <= 0) {
            countdownElement.textContent = `${event.name} time has arrived!`;
            alert(`Time for your event: ${event.name}!`);
            renderCountdowns();
            return;
        }
        
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
        const seconds = Math.floor((timeLeft / 1000) % 60);

        countdownElement.textContent = `${event.name} - Time remaining: ${days}d ${hours}h ${minutes}m ${seconds}s`;
        requestAnimationFrame(update);
    }
    update();
}

// Load events on page load
window.onload = renderCountdowns;
