// Initialize the user list
let userList = [];

// Load data from localStorage when the page loads
const loadFromLocalStorage = () => {
    const storedUserList = localStorage.getItem('userList');
    if (storedUserList) {
        userList = JSON.parse(storedUserList);
    }
};

loadFromLocalStorage(); // Load any existing data

// Function to save user list to localStorage
const saveToLocalStorage = () => {
    localStorage.setItem('userList', JSON.stringify(userList));
};

// Function to update the schedule display
const updateDisplay = () => {
    const currentUserElement = document.getElementById("current-user");
    const timeRemainingElement = document.getElementById("time-remaining");
    const nextUsersListElement = document.getElementById("next-users-list");

    nextUsersListElement.innerHTML = "";

    if (userList.length > 0) {
        currentUserElement.textContent = userList[0].name;

        const currentTime = new Date();
        const endTime = new Date(userList[0].endTime);
        const timeRemaining = Math.floor((endTime - currentTime) / 1000);

        if (timeRemaining <= 0) {
            completeReservation();
        } else {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            timeRemainingElement.textContent = `${minutes} minutes, ${seconds} seconds`;
        }

        for (let i = 1; i < userList.length; i++) {
            const listItem = document.createElement("li");
            listItem.textContent = userList[i].name;
            nextUsersListElement.appendChild(listItem);
        }
    } else {
        currentUserElement.textContent = "None";
        timeRemainingElement.textContent = "N/A";
    }
};

// Function to complete the current reservation
const completeReservation = () => {
    userList.shift();
    saveToLocalStorage();
    updateDisplay();
};

// Function to extend the current reservation time
const extendTime = (minutes) => {
    if (userList.length > 0) {
        const currentTime = new Date(userList[0].endTime);
        currentTime.setMinutes(currentTime.getMinutes() + minutes);
        userList[0].endTime = currentTime;
        saveToLocalStorage();
        updateDisplay();
    }
};

// Function to end the current reservation early
const endEarly = () => {
    if (userList.length > 0) {
        // Remove the current user and update the list
        userList.shift();
        
        // Update localStorage and the display
        saveToLocalStorage();
        updateDisplay();
    }
};

document.getElementById("form").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const endTime = document.getElementById("end-time").value;

    const currentDate = new Date();
    const [hours, minutes] = endTime.split(":");
    const endTimeObject = new Date(currentDate);
    endTimeObject.setHours(hours, minutes, 0, 0);

    userList.push({ name, endTime: endTimeObject });
    saveToLocalStorage();
    updateDisplay();
});

// Attach event listeners to the extension and end-early buttons
document.getElementById("extend-5").addEventListener("click", () => extendTime(5));
document.getElementById("extend-10").addEventListener("click", () => extendTime(10));
document.getElementById("extend-15").addEventListener("click", () => extendTime(15));
document.getElementById("end-early").addEventListener("click", endEarly);

// Update the display every second
setInterval(updateDisplay, 1000);
