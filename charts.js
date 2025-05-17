// Simple placeholder charts for the demo
function updateProgressCharts() {
    // Daily progress (random percentage for demo)
    const dailyPercentage = appState.habits.length > 0 
        ? (appState.habits.filter(h => h.completedToday).length / appState.habits.length) * 100 
        : 0;
    
    // Draw daily progress chart
    drawProgressRing('daily-progress', dailyPercentage, '#4CAF50');
    
    // Weekly progress (mock data for demo)
    const weeklyPercentage = 65;
    drawProgressRing('weekly-progress', weeklyPercentage, '#2196F3');
    
    // Streak progress
    const streakPercentage = Math.min((appState.longestStreak / 30) * 100, 100);
    drawProgressRing('streak-progress', streakPercentage, '#FF9800');
}

// Draw a simple progress ring on canvas
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
    ctx.strokeStyle = '#e0e0e0';
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
