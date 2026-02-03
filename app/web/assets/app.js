// DOM Elements
const generateForm = document.getElementById('generateForm');
const generateBtn = document.getElementById('generateBtn');
const progressSection = document.getElementById('progressSection');
const progressText = document.getElementById('progressText');
const progressFill = document.getElementById('progressFill');
const videoSection = document.getElementById('videoSection');
const videoPlayer = document.getElementById('videoPlayer');
const downloadBtn = document.getElementById('downloadBtn');
const reportSection = document.getElementById('reportSection');
const reportContent = document.getElementById('reportContent');

let currentJobId = null;
let pollingInterval = null;

// Form submission
generateForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        topic: document.getElementById('topic').value,
        audience: document.getElementById('audience').value,
        duration: parseInt(document.getElementById('duration').value),
        style: document.getElementById('style').value
    };

    try {
        // Show progress section
        generateBtn.disabled = true;
        progressSection.style.display = 'block';
        videoSection.style.display = 'none';
        reportSection.style.display = 'none';
        progressText.textContent = 'Submitting request...';
        progressFill.style.width = '10%';

        // POST to /generate
        const response = await fetch('/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        currentJobId = data.job_id;

        progressText.textContent = 'Processing your video...';
        progressFill.style.width = '20%';

        // Start polling
        startPolling();
    } catch (error) {
        console.error('Error:', error);
        progressText.textContent = `Error: ${error.message}`;
        progressFill.style.width = '0%';
        generateBtn.disabled = false;
    }
});

// Poll job status
function startPolling() {
    pollingInterval = setInterval(async () => {
        try {
            const response = await fetch(`/jobs/${currentJobId}`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch job status: ${response.status}`);
            }

            const job = await response.json();
            
            // Update progress
            updateProgress(job);

            // Check if job is complete
            if (job.status === 'completed') {
                stopPolling();
                showVideo(job);
            } else if (job.status === 'failed') {
                stopPolling();
                showError(job);
            }
        } catch (error) {
            console.error('Polling error:', error);
            stopPolling();
            progressText.textContent = `Error: ${error.message}`;
            generateBtn.disabled = false;
        }
    }, 2000); // Poll every 2 seconds
}

function stopPolling() {
    if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
    }
}

function updateProgress(job) {
    // Update progress text based on job status
    if (job.progress_text) {
        progressText.textContent = job.progress_text;
    }

    // Update progress bar (estimate based on status)
    let progressPercent = 20;
    
    if (job.status === 'generating_script') {
        progressPercent = 30;
    } else if (job.status === 'generating_video') {
        progressPercent = 50;
    } else if (job.status === 'self_checking') {
        progressPercent = 75;
    } else if (job.status === 'adding_subtitles') {
        progressPercent = 90;
    } else if (job.status === 'completed') {
        progressPercent = 100;
    }

    progressFill.style.width = `${progressPercent}%`;
}

function showVideo(job) {
    // Hide progress section
    progressSection.style.display = 'none';
    
    // Show video section
    videoSection.style.display = 'block';
    videoPlayer.src = job.video_url;
    
    // Set up download button
    downloadBtn.onclick = () => {
        const a = document.createElement('a');
        a.href = job.video_url;
        a.download = `visplain_${currentJobId}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // Show report if available
    if (job.self_check_report) {
        reportSection.style.display = 'block';
        reportContent.textContent = job.self_check_report;
    }

    // Re-enable generate button
    generateBtn.disabled = false;
}

function showError(job) {
    progressSection.style.display = 'block';
    progressText.textContent = `Error: ${job.error || 'Video generation failed'}`;
    progressFill.style.width = '0%';
    generateBtn.disabled = false;
}

// Reset on new generation
function resetUI() {
    progressSection.style.display = 'none';
    videoSection.style.display = 'none';
    reportSection.style.display = 'none';
    progressFill.style.width = '0%';
    currentJobId = null;
    stopPolling();
}
