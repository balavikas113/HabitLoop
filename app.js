// App state
const appState = {
    habits: [],
    longestStreak: 0,
    todayDate: new Date().toISOString().split('T')[0]
};

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the app
    initApp();
    
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('darkMode', 'true');
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('darkMode', 'false');
        }
        
        // Redraw progress rings when theme changes
        drawProgressRings();
    });
    
    // Modal functionality
    const modal = document.getElementById('habit-modal');
    const addHabitBtn = document.getElementById('add-habit-btn');
    const closeModalBtn = document.querySelector('.close-modal');
    
    // Open modal when Add Habit button is clicked
    addHabitBtn.addEventListener('click', function() {
        modal.style.display = 'flex';
    });
    
    // Close modal when X is clicked
    closeModalBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Form submission
    const habitForm = document.getElementById('new-habit-form');
    habitForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const habitName = document.getElementById('habit-name').value.trim();
        const habitIcon = document.getElementById('habit-icon').value;
        const habitColor = document.getElementById('habit-color').value;
        
        if (habitName) {
            // Create new habit object
            const newHabit = {
                id: Date.now().toString(),
                name: habitName,
                icon: habitIcon,
                color: habitColor,
                streak: 0,
                completedToday: false,
                lastCompletedDate: null
            };
            
            // Add to habits array
            appState.habits.push(newHabit);
            
            // Save to localStorage
            saveHabitsToStorage();
            
            // Render habits
            renderHabits();
            
            // Reset form and close modal
            habitForm.reset();
            modal.style.display = 'none';
        }
    });
    
    // Event delegation for habit completion
    const habitsContainer = document.getElementById('habits-container');
    habitsContainer.addEventListener('click', function(event) {
        const habitCheck = event.target.closest('.habit-check');
        if (habitCheck) {
            const habitIndex = parseInt(habitCheck.dataset.index);
            toggleHabitCompletion(habitIndex);
        }
    });
});

// Initialize the app
function initApp() {
    // Load habits from localStorage
    loadHabitsFromStorage();
    
    // Render habits
    renderHabits();
    
    // Check for dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        document.getElementById('theme-toggle').innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Set a random motivational quote
    setRandomQuote();
    
    // Draw initial progress rings
    drawProgressRings();
    
    // Update badges
    updateBadges();
}

// Load habits from localStorage
function loadHabitsFromStorage() {
    const savedHabits = localStorage.getItem('habitLoopHabits');
    if (savedHabits) {
        appState.habits = JSON.parse(savedHabits);
    }
}

// Save habits to localStorage
function saveHabitsToStorage() {
    localStorage.setItem('habitLoopHabits', JSON.stringify(appState.habits));
}

// Render habits in the UI
function renderHabits() {
    const habitsContainer = document.getElementById('habits-container');
    habitsContainer.innerHTML = '';
    
    if (appState.habits.length === 0) {
        habitsContainer.innerHTML = `
            <div class="empty-state">
                <p>You haven't added any habits yet. Click the "Add Habit" button to get started!</p>
            </div>
        `;
        return;
    }
    
    appState.habits.forEach((habit, index) => {
        const habitCard = document.createElement('div');
        habitCard.className = `habit-card ${habit.completedToday ? 'completed' : ''}`;
        habitCard.innerHTML = `
            <div class="habit-info">
                <div class="habit-icon" style="background-color: ${habit.color}">
                    <i class="fas ${habit.icon}"></i>
                </div>
                <div class="habit-details">
                    <h3>${habit.name}</h3>
                    <div class="habit-streak">Current streak: ${habit.streak} days</div>
                </div>
            </div>
            <div class="habit-actions">
                <div class="habit-check ${habit.completedToday ? 'completed' : ''}" data-index="${index}">
                    ${habit.completedToday ? '<i class="fas fa-check"></i>' : ''}
                </div>
            </div>
        `;
        habitsContainer.appendChild(habitCard);
    });
    
    // Update progress rings after rendering habits
    drawProgressRings();
}

// Toggle habit completion
function toggleHabitCompletion(habitIndex) {
    const habit = appState.habits[habitIndex];
    habit.completedToday = !habit.completedToday;
    
    if (habit.completedToday) {
        habit.lastCompletedDate = appState.todayDate;
        
        // Trigger confetti if available
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }
    
    saveHabitsToStorage();
    renderHabits();
    updateBadges();
}

// Update badges based on streaks
function updateBadges() {
    // Find the longest streak
    appState.longestStreak = 0;
    appState.habits.forEach(habit => {
        if (habit.streak > appState.longestStreak) {
            appState.longestStreak = habit.streak;
        }
    });
    
    // Update badge UI
    const badges = document.querySelectorAll('.badge');
    badges.forEach(badge => {
        const requiredStreak = parseInt(badge.dataset.streak);
        if (appState.longestStreak >= requiredStreak) {
            badge.classList.add('unlocked');
        } else {
            badge.classList.remove('unlocked');
        }
    });
}

// Set a random motivational quote
function setRandomQuote() {
    const quotes = [
        { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
        { text: "Small daily improvements are the key to staggering long-term results.", author: "Anonymous" },
        { text: "Habits are the compound interest of self-improvement.", author: "James Clear" },
        { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
        { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" }
    ];
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('motivation-quote').textContent = `"${randomQuote.text}"`;
    document.getElementById('quote-author').textContent = `- ${randomQuote.author}`;
}

// Draw progress rings
function drawProgressRings() {
    // Calculate completion percentages
    const totalHabits = appState.habits.length;
    const completedToday = appState.habits.filter(h => h.completedToday).length;
    const dailyPercentage = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;
    
    // Draw rings
    drawProgressRing('daily-progress', dailyPercentage, '#4CAF50');
    
    // Mock data for weekly progress (for demo purposes)
    const weeklyPercentage = 65;
    drawProgressRing('weekly-progress', weeklyPercentage, '#2196F3');
    
    // Streak progress (max 30 days)
    const streakPercentage = Math.min((appState.longestStreak / 30) * 100, 100);
    drawProgressRing('streak-progress', streakPercentage, '#FF9800');
}

// Draw a progress ring on canvas with percentage text
function drawProgressRing(canvasId, percentage, color) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = document.body.classList.contains('dark-mode') ? '#333' : '#e0e0e0';
    ctx.lineWidth = 15;
    ctx.stroke();
    
    // Draw progress arc
    const startAngle = -0.5 * Math.PI; // Start at top
    const endAngle = startAngle + (percentage / 100) * 2 * Math.PI;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.strokeStyle = color;
    ctx.lineWidth = 15;
    ctx.stroke();
    
    // Draw percentage text
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#f0f0f0' : '#333';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(percentage)}%`, centerX, centerY);
}
