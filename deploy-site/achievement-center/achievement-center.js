// Achievement Center - Live Command & Vision System
// Military-tech UI with AI vision integration

let visionActive = false;
let videoStream = null;
let visionInterval = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Achievement Center initialized');
    initializeVision();
    loadSavedTasks();
    startLiveUpdates();
});

// Tab Switching
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
}

// Vision Integration
function initializeVision() {
    const visionToggle = document.getElementById('visionToggle');
    const visionPanel = document.getElementById('visionPanel');
    const videoElement = document.getElementById('videoElement');
    const canvasElement = document.getElementById('canvasElement');
    const visionStatus = document.getElementById('visionStatus');

    visionToggle.addEventListener('click', async () => {
        if (!visionActive) {
            try {
                // Request camera access
                videoStream = await navigator.mediaDevices.getUserMedia({
                    video: { 
                        width: { ideal: 640 },
                        height: { ideal: 480 },
                        facingMode: 'user'
                    }
                });

                videoElement.srcObject = videoStream;
                visionActive = true;
                visionToggle.classList.add('active');
                visionToggle.textContent = '🔍 VISION ACTIVE';
                visionPanel.style.display = 'block';
                visionStatus.textContent = 'Vision mode: ACTIVE - Analyzing...';

                // Start vision processing
                startVisionProcessing();
            } catch (error) {
                console.error('Error accessing camera:', error);
                visionStatus.textContent = 'Error: Camera access denied or unavailable';
                alert('Unable to access camera. Please check permissions.');
            }
        } else {
            // Stop vision
            stopVision();
        }
    });
}

function startVisionProcessing() {
    const videoElement = document.getElementById('videoElement');
    const canvasElement = document.getElementById('canvasElement');
    const visionStatus = document.getElementById('visionStatus');
    const ctx = canvasElement.getContext('2d');

    canvasElement.width = videoElement.videoWidth || 640;
    canvasElement.height = videoElement.videoHeight || 480;

    visionInterval = setInterval(() => {
        if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
            // Draw video frame to canvas
            ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

            // Get image data for analysis
            const imageData = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);
            
            // Simulate vision analysis (in production, this would call an AI vision API)
            analyzeVision(imageData);
        }
    }, 100); // Process every 100ms
}

function analyzeVision(imageData) {
    // Simulated vision analysis
    // In production, this would:
    // 1. Send image data to vision API (OpenAI Vision, Google Vision, etc.)
    // 2. Analyze for objects, text, faces, gestures
    // 3. Update UI based on analysis

    const visionStatus = document.getElementById('visionStatus');
    
    // Simulate detection
    const detections = [
        'Face detected',
        'Focus level: High',
        'Environment: Office',
        'Activity: Working'
    ];

    visionStatus.textContent = `Vision: ${detections[Math.floor(Math.random() * detections.length)]}`;
}

function stopVision() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
    }

    if (visionInterval) {
        clearInterval(visionInterval);
        visionInterval = null;
    }

    visionActive = false;
    const visionToggle = document.getElementById('visionToggle');
    const visionPanel = document.getElementById('visionPanel');
    const visionStatus = document.getElementById('visionStatus');

    visionToggle.classList.remove('active');
    visionToggle.textContent = '🔍 VISION MODE';
    visionPanel.style.display = 'none';
    visionStatus.textContent = 'Vision mode inactive';
}

// Task Management
function toggleTask(checkbox) {
    checkbox.classList.toggle('checked');
    const taskItem = checkbox.closest('.task-item');
    
    if (checkbox.classList.contains('checked')) {
        taskItem.style.opacity = '0.6';
        updateFocusScore(5); // Increase focus score
    } else {
        taskItem.style.opacity = '1';
        updateFocusScore(-5);
    }

    saveTasks();
}

function updateFocusScore(points) {
    const focusScoreElement = document.querySelector('.stat-value');
    if (focusScoreElement && focusScoreElement.textContent.includes('%')) {
        let currentScore = parseInt(focusScoreElement.textContent);
        currentScore = Math.max(0, Math.min(100, currentScore + points));
        focusScoreElement.textContent = currentScore + '%';
    }
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.task-item').forEach(item => {
        const checkbox = item.querySelector('.task-checkbox');
        const title = item.querySelector('.task-title').textContent;
        const description = item.querySelector('.task-description').textContent;
        const priority = item.querySelector('.task-priority').textContent;

        tasks.push({
            title,
            description,
            priority,
            completed: checkbox.classList.contains('checked')
        });
    });

    localStorage.setItem('achievementCenterTasks', JSON.stringify(tasks));
}

function loadSavedTasks() {
    const saved = localStorage.getItem('achievementCenterTasks');
    if (saved) {
        const tasks = JSON.parse(saved);
        const taskList = document.getElementById('taskList');
        
        taskList.innerHTML = tasks.map(task => `
            <li class="task-item" style="opacity: ${task.completed ? '0.6' : '1'}">
                <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTask(this)"></div>
                <div class="task-content">
                    <div class="task-title">${task.title}</div>
                    <div class="task-description">${task.description}</div>
                </div>
                <span class="task-priority priority-${task.priority.toLowerCase()}">${task.priority}</span>
            </li>
        `).join('');
    }
}

// Command Processing
function handleCommand(event) {
    if (event.key === 'Enter') {
        const commandInput = document.getElementById('commandInput');
        const command = commandInput.value.trim().toLowerCase();

        if (command) {
            processCommand(command);
            commandInput.value = '';
        }
    }
}

function processCommand(command) {
    console.log('Processing command:', command);

    // Command patterns
    if (command.includes('vision') || command.includes('camera')) {
        document.getElementById('visionToggle').click();
        showCommandFeedback('Vision mode toggled');
    }
    else if (command.includes('task') || command.includes('add')) {
        addTaskFromCommand(command);
    }
    else if (command.includes('focus') || command.includes('score')) {
        showCommandFeedback('Current focus score: 87%');
    }
    else if (command.includes('stats') || command.includes('statistics')) {
        switchTab('stats');
        showCommandFeedback('Switched to Stats tab');
    }
    else if (command.includes('achievement') || command.includes('badge')) {
        switchTab('achievements');
        showCommandFeedback('Switched to Achievements tab');
    }
    else if (command.includes('mission')) {
        switchTab('missions');
        showCommandFeedback('Switched to Missions tab');
    }
    else if (command.includes('help')) {
        showCommandFeedback('Available commands: vision, task, focus, stats, achievements, missions');
    }
    else {
        // Try to process as natural language
        processNaturalLanguageCommand(command);
    }
}

function addTaskFromCommand(command) {
    // Extract task details from command
    const taskTitle = command.replace(/^(add|create|new)\s+task\s*:?\s*/i, '').trim();
    
    if (taskTitle) {
        const taskList = document.getElementById('taskList');
        const newTask = document.createElement('li');
        newTask.className = 'task-item';
        newTask.innerHTML = `
            <div class="task-checkbox" onclick="toggleTask(this)"></div>
            <div class="task-content">
                <div class="task-title">${taskTitle}</div>
                <div class="task-description">Added via command</div>
            </div>
            <span class="task-priority priority-medium">MEDIUM</span>
        `;
        taskList.appendChild(newTask);
        saveTasks();
        showCommandFeedback(`Task "${taskTitle}" added`);
    }
}

function processNaturalLanguageCommand(command) {
    // Simple natural language processing
    // In production, this would use an AI API (OpenAI, etc.)
    
    if (command.includes('what') || command.includes('show') || command.includes('tell')) {
        if (command.includes('revenue') || command.includes('sales')) {
            switchTab('stats');
            showCommandFeedback('Showing revenue statistics');
        } else if (command.includes('progress') || command.includes('achievement')) {
            switchTab('achievements');
            showCommandFeedback('Showing achievements');
        }
    } else {
        showCommandFeedback('Command processed. Use "help" for available commands.');
    }
}

function showCommandFeedback(message) {
    // Create temporary feedback element
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: var(--bg-secondary);
        border: 1px solid var(--accent-primary);
        color: var(--accent-primary);
        padding: 15px 20px;
        border-radius: 8px;
        font-family: 'Orbitron', monospace;
        font-size: 0.9rem;
        z-index: 1000;
        box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
        animation: slideIn 0.3s;
    `;
    feedback.textContent = message;
    document.body.appendChild(feedback);

    setTimeout(() => {
        feedback.style.animation = 'slideOut 0.3s';
        setTimeout(() => feedback.remove(), 300);
    }, 2000);
}

// Live Updates
function startLiveUpdates() {
    // Update stats every 30 seconds
    setInterval(() => {
        updateLiveStats();
    }, 30000);

    // Update achievements progress
    setInterval(() => {
        updateAchievements();
    }, 60000);

    // Initial update
    updateLiveStats();
}

function updateLiveStats() {
    // Simulate live data updates
    // In production, this would fetch from your API
    
    const stats = [
        { selector: '.stat-value', index: 0, value: '$' + (47832 + Math.floor(Math.random() * 1000)).toLocaleString() },
        { selector: '.stat-value', index: 1, value: (1247 + Math.floor(Math.random() * 10)).toLocaleString() },
    ];

    // Update focus score with small random variations
    const focusScore = document.querySelector('#daily-focus .stat-value');
    if (focusScore) {
        let current = parseInt(focusScore.textContent) || 87;
        current = Math.max(70, Math.min(100, current + Math.floor(Math.random() * 3 - 1)));
        focusScore.textContent = current + '%';
    }
}

function updateAchievements() {
    // Update achievement progress bars
    document.querySelectorAll('.achievement-progress-bar').forEach(bar => {
        const currentWidth = parseInt(bar.style.width) || 0;
        if (currentWidth < 100) {
            const newWidth = Math.min(100, currentWidth + Math.floor(Math.random() * 5));
            bar.style.width = newWidth + '%';
        }
    });
}

// Export functions for inline handlers
window.switchTab = switchTab;
window.toggleTask = toggleTask;
window.handleCommand = handleCommand;

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    stopVision();
});
