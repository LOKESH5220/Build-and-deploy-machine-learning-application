document.getElementById('predictionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const resultDiv = document.getElementById('result');
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<div class="loading"></div>Analyzing...';
    resultDiv.className = 'result-default';
    resultDiv.innerHTML = '<div class="loading"></div>Processing your data...';
    
    // Collect form data
    const data = {};
    Array.from(form.elements).forEach(input => {
        if(input.name && input.type !== 'submit') {
            data[input.name] = parseFloat(input.value);
        }
    });

    try {
        // Pick the correct backend URL depending on how the page is being served.
        // - If the page is served from the backend (same origin, e.g. http://127.0.0.1:5000),
        //   use the relative `/predict` path so requests remain same-origin.
        // - If the page is opened directly or served from a static server (e.g. http://127.0.0.1:8000),
        //   use the backend host explicitly so cross-origin requests go to the API server.
        let predictUrl = '/predict';
        try {
            const origin = window.location.origin || '';
            // If opened from file: or a different port than 5000, point to the backend explicitly
            if (origin === 'null' || origin.startsWith('file:')) {
                predictUrl = 'http://127.0.0.1:5000/predict';
            } else if (!origin.includes(':5000')) {
                // If served from another port (e.g. 8000) use the backend address
                // Keep this simple for local development — adjust if your backend runs elsewhere.
                predictUrl = 'http://127.0.0.1:5000/predict';
            }
        } catch (err) {
            // default to relative path if anything goes wrong
            predictUrl = '/predict';
        }

        const response = await fetch(predictUrl, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();

        if (response.ok) {
            // Determine result styling based on prediction
            let resultClass = 'result-default';
            let icon = 'fas fa-info-circle';
            
            if (result.prediction === 1) {
                if (result.probability > 0.7) {
                    resultClass = 'result-danger';
                    icon = 'fas fa-exclamation-triangle';
                } else {
                    resultClass = 'result-warning';
                    icon = 'fas fa-exclamation-circle';
                }
            } else {
                resultClass = 'result-success';
                icon = 'fas fa-check-circle';
            }
            
            resultDiv.className = resultClass;
            resultDiv.innerHTML = `
                <i class="${icon}"></i> 
                <strong>${result.message}</strong><br>
                <small>Risk Probability: ${(result.probability * 100).toFixed(1)}%</small>
            `;
            
            // Add additional health advice
            if (result.prediction === 1) {
                resultDiv.innerHTML += '<br><small><i class="fas fa-heart"></i> Please consult with a healthcare professional for further evaluation.</small>';
            } else {
                resultDiv.innerHTML += '<br><small><i class="fas fa-heart"></i> Continue maintaining a healthy lifestyle!</small>';
            }
            
        } else {
            resultDiv.className = 'result-danger';
            resultDiv.innerHTML = `<i class="fas fa-times-circle"></i> Error: ${result.error}`;
        }
    } catch (err) {
        resultDiv.className = 'result-danger';
        resultDiv.innerHTML = `
            <i class="fas fa-wifi"></i> 
            <strong>Connection Error</strong><br>
            <small>Cannot connect to the prediction server. Please make sure the backend is running.</small>
        `;
        console.error('Fetch error:', err);
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-stethoscope"></i> Analyze Heart Health';
    }
});

// Add input validation and real-time feedback
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', function() {
        // Remove any previous error styling
        this.style.borderColor = '';
        
        // Validate based on input type
        const value = parseFloat(this.value);
        const name = this.name;
        
        // Basic validation
        if (isNaN(value)) {
            this.style.borderColor = '#ff6b6b';
            return;
        }
        
        // Field-specific validation
        switch(name) {
            case 'age':
                if (value < 1 || value > 120) this.style.borderColor = '#ff6b6b';
                break;
            case 'sex':
                if (value !== 0 && value !== 1) this.style.borderColor = '#ff6b6b';
                break;
            case 'cp':
                if (value < 0 || value > 3) this.style.borderColor = '#ff6b6b';
                break;
            case 'trestbps':
                if (value < 80 || value > 250) this.style.borderColor = '#ff6b6b';
                break;
            case 'chol':
                if (value < 100 || value > 600) this.style.borderColor = '#ff6b6b';
                break;
            case 'fbs':
            case 'exang':
                if (value !== 0 && value !== 1) this.style.borderColor = '#ff6b6b';
                break;
            case 'restecg':
                if (value < 0 || value > 2) this.style.borderColor = '#ff6b6b';
                break;
            case 'thalach':
                if (value < 60 || value > 220) this.style.borderColor = '#ff6b6b';
                break;
            case 'oldpeak':
                if (value < 0 || value > 10) this.style.borderColor = '#ff6b6b';
                break;
            case 'slope':
                if (value < 0 || value > 2) this.style.borderColor = '#ff6b6b';
                break;
            case 'ca':
                if (value < 0 || value > 3) this.style.borderColor = '#ff6b6b';
                break;
            case 'thal':
                if (value < 1 || value > 3) this.style.borderColor = '#ff6b6b';
                break;
        }
        
        // Reset border color if valid
        if (this.style.borderColor === '#ff6b6b') {
            setTimeout(() => {
                if (this.style.borderColor === '#ff6b6b') {
                    this.style.borderColor = '';
                }
            }, 2000);
        }
    });
});
