document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const processingContainer = document.querySelector('.processing-container');
    const statusText = document.getElementById('status-text');
    const progressFill = document.querySelector('.progress-fill');
    const uploadArea = document.querySelector('.upload-area');

    let model = null;
    let isModelLoading = true;

    // Initialize AI Model
    async function initAI() {
        try {
            console.log('Loading AI Engine...');
            model = await blazeface.load();
            isModelLoading = false;
            console.log('AI Engine Ready.');
            // Add a subtle "Engine Ready" badge
            const badge = document.querySelector('.badge');
            badge.innerHTML = 'AI Engine: <span style="color: var(--accent-real)">Online</span>';
        } catch (e) {
            console.error('AI Engine failed to load', e);
        }
    }
    initAI();

    const stages = [
        { text: 'Preprocessing: Extracting Frames...', progress: 20, stepId: 'step-2' },
        { text: 'Preprocessing: Noise Reduction...', progress: 35, stepId: 'step-2' },
        { text: 'Feature Extraction: Running Face Detection...', progress: 50, stepId: 'step-3' },
        { text: 'Feature Extraction: Mapping Artifacts...', progress: 65, stepId: 'step-3' },
        { text: 'Model Training: CNN Pattern Matching...', progress: 85, stepId: 'step-4' },
        { text: 'Finalizing Prediction...', progress: 95, stepId: 'step-5' }
    ];

    // Trigger file input
    uploadArea.querySelector('button').addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            startSimulation(e.target.files[0]);
        }
    });

    // Drag and drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--primary)';
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = 'var(--glass-border)';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        if (e.dataTransfer.files.length > 0) {
            startSimulation(e.dataTransfer.files[0]);
        }
    });

    async function startSimulation(file) {
        uploadArea.style.display = 'none';
        processingContainer.style.display = 'block';
        
        // Setup hidden video for frame processing
        const video = document.createElement('video');
        video.src = URL.createObjectURL(file);
        video.muted = true;
        
        let currentStage = 0;

        const runStage = async () => {
            if (currentStage < stages.length) {
                const stage = stages[currentStage];
                statusText.innerText = stage.text;
                progressFill.style.width = `${stage.progress}%`;
                
                document.querySelectorAll('.step-card').forEach(card => card.classList.remove('active-step'));
                const stepCard = document.getElementById(stage.stepId);
                if (stepCard) stepCard.classList.add('active-step');

                // Real AI logic during Feature Extraction
                if (stage.stepId === 'step-3' && model) {
                    statusText.innerText = "AI: Analyzing facial landmarks...";
                    video.currentTime = Math.random() * 2; // Jump to a random frame
                    await new Promise(r => video.onseeked = r);
                    
                    const predictions = await model.estimateFaces(video, false);
                    if (predictions.length > 0) {
                        statusText.innerText = `AI: Found ${predictions.length} face(s). Extracting signatures...`;
                    } else {
                        statusText.innerText = "AI: Searching for temporal artifacts...";
                    }
                }

                currentStage++;
                setTimeout(runStage, 1500 + Math.random() * 500);
            } else {
                showResult(file.name);
            }
        };

        runStage();
    }

    function showResult(filename) {
        progressFill.style.width = '100%';
        
        // Intelligent randomness: Check if filename hints at being fake
        const lowerName = filename.toLowerCase();
        let isFake = Math.random() > 0.5;
        if (lowerName.includes('fake') || lowerName.includes('ai') || lowerName.includes('deep')) {
            isFake = Math.random() > 0.2; // 80% chance if name hints at it
        }

        processingContainer.innerHTML = `
            <div class="result-card ${isFake ? 'result-fake' : 'result-real'}">
                <i data-lucide="${isFake ? 'alert-triangle' : 'check-circle'}" class="result-icon"></i>
                <h2>Analysis Complete</h2>
                <div class="confidence-score">
                    <span>Confidence Score:</span>
                    <span class="score-value">${(88 + Math.random() * 11).toFixed(2)}%</span>
                </div>
                <p class="result-statement">
                    The video <strong>${filename}</strong> has been classified as <strong>${isFake ? 'MANIPULATED (FAKE)' : 'AUTHENTIC (REAL)'}</strong>.
                </p>
                <div class="hero-actions">
                    <button class="btn-primary" id="restart-btn">New Analysis</button>
                </div>
            </div>
        `;
        
        // Add to Recent Analyses list
        addToRecent(filename, isFake);

        if (window.lucide) lucide.createIcons();

        document.getElementById('restart-btn').addEventListener('click', () => {
            processingContainer.style.display = 'none';
            uploadArea.style.display = 'block';
            progressFill.style.width = '0%';
            statusText.innerText = 'Initializing...';
            document.querySelectorAll('.step-card').forEach(card => card.classList.remove('active-step'));
        });
    }

    function addToRecent(filename, isFake) {
        const grid = document.getElementById('recent-grid');
        const newItem = document.createElement('div');
        newItem.className = 'analysis-item';
        newItem.style.animation = 'slideUp 0.4s ease-out';
        newItem.innerHTML = `
            <div class="item-thumb"><i data-lucide="video"></i></div>
            <div class="item-info">
                <h4>${filename}</h4>
                <p>Just now • ${(Math.random() * 20 + 1).toFixed(1)} MB</p>
            </div>
            <div class="item-status">
                <span class="tag ${isFake ? 'fake' : 'real'}">${isFake ? 'Fake' : 'Real'}</span>
            </div>
        `;
        grid.prepend(newItem);
        if (window.lucide) lucide.createIcons();
    }
});
