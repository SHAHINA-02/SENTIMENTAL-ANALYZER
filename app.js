import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';

// Configuration
env.allowLocalModels = false;
const MODEL_NAME = 'Xenova/distilbert-base-multilingual-cased-sentiments-student';

// DOM Elements
const loadingOverlay = document.getElementById('loading-overlay');
const loadingStatus = document.getElementById('loading-status');
const loadingProgress = document.getElementById('loading-progress');
const textInput = document.getElementById('text-input');
const langIndicator = document.getElementById('lang-indicator');
const currentChars = document.getElementById('current-chars');
const resultCard = document.getElementById('result-card');
const sentimentBadge = document.getElementById('sentiment-badge');
const confidenceValue = document.getElementById('confidence-value');
const confidenceBar = document.getElementById('confidence-bar');
const presetBtns = document.querySelectorAll('.preset-btn');

const breakdownItems = {
    pos: document.getElementById('breakdown-pos'),
    neu: document.getElementById('breakdown-neu'),
    neg: document.getElementById('breakdown-neg')
};

const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history');
const exportHistoryBtn = document.getElementById('export-history');

// Stat elements
const statTotal = document.getElementById('stat-total');
const statLang = document.getElementById('stat-lang');
const barPos = document.getElementById('bar-pos');
const barNeu = document.getElementById('bar-neu');
const barNeg = document.getElementById('bar-neg');

let classifier;
let history = JSON.parse(localStorage.getItem('sentiment_history') || '[]');
let stats = JSON.parse(localStorage.getItem('sentiment_stats') || JSON.stringify({
    total: 0,
    pos: 0,
    neu: 0,
    neg: 0,
    arabic: 0,
    english: 0
}));

// Initialize the model
async function init() {
    try {
        renderHistory();
        updateStatsDisplay();
        
        classifier = await pipeline('sentiment-analysis', MODEL_NAME, {
            progress_callback: (data) => {
                if (data.status === 'progress') {
                    loadingProgress.style.width = `${data.progress}%`;
                    loadingStatus.textContent = `Downloading ${data.file}: ${Math.round(data.progress)}%`;
                } else if (data.status === 'ready') {
                    loadingStatus.textContent = 'Model ready! Finishing up...';
                }
            }
        });

        // Hide loading screen
        loadingOverlay.classList.add('fade-out');
        setTimeout(() => loadingOverlay.style.display = 'none', 500);
    } catch (error) {
        console.error('Initialization error:', error);
        loadingStatus.textContent = 'Error loading model. Please refresh.';
        loadingStatus.style.color = '#ef4444';
    }
}

// Stats Management
function updateStats(lang, label) {
    stats.total++;
    
    if (label === 'positive') stats.pos++;
    else if (label === 'negative') stats.neg++;
    else stats.neu++;

    if (lang === 'Arabic') stats.arabic++;
    else stats.english++;

    localStorage.setItem('sentiment_stats', JSON.stringify(stats));
    updateStatsDisplay();
}

function updateStatsDisplay() {
    statTotal.textContent = stats.total;
    
    // Top Language
    if (stats.total === 0) {
        statLang.textContent = '-';
    } else {
        statLang.textContent = stats.arabic >= stats.english ? 'Arabic' : 'English';
    }

    // Sentiment Mix Bars
    const total = stats.total || 1; // Avoid div by zero
    const posPer = (stats.pos / total) * 100;
    const neuPer = (stats.neu / total) * 100;
    const negPer = (stats.neg / total) * 100;

    barPos.style.width = `${posPer}%`;
    barNeu.style.width = `${neuPer}%`;
    barNeg.style.width = `${negPer}%`;
}

// History Management
function saveToHistory(text, lang, label, score) {
    const newItem = {
        id: Date.now(),
        text,
        lang,
        label,
        score,
        timestamp: new Date().toISOString()
    };

    // Update global stats
    updateStats(lang, label);

    // Add to start of array
    history.unshift(newItem);
    
    // Keep only last 5
    history = history.slice(0, 5);
    
    localStorage.setItem('sentiment_history', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    if (history.length === 0) {
        historyList.innerHTML = '<div class="empty-history">No analysis history yet. Try analyzing some text!</div>';
        return;
    }

    historyList.innerHTML = history.map(item => {
        const truncatedText = item.text.length > 60 ? item.text.substring(0, 60) + '...' : item.text;
        const confidencePercent = Math.round(item.score * 100);
        
        return `
            <div class="history-item">
                <div class="history-text" dir="${item.lang === 'Arabic' ? 'rtl' : 'ltr'}">${truncatedText}</div>
                <div class="history-meta">
                    <div class="meta-left">
                        <span class="lang-tag">${item.lang}</span>
                        <div class="badge ${item.label}">${item.label}</div>
                    </div>
                    <span class="confidence-val">${confidencePercent}% Confidence</span>
                </div>
            </div>
        `;
    }).join('');
}

// Language Detection
function detectLanguage(text) {
    const arabicPattern = /[\u0600-\u06FF]/;
    if (arabicPattern.test(text)) {
        return 'Arabic';
    }
    return 'English';
}

// Update Text Direction and Language Indicator
function updateTextDirection(text) {
    const lang = detectLanguage(text);
    if (text.trim() === '') {
        langIndicator.classList.add('hidden');
        textInput.setAttribute('dir', 'ltr');
        return;
    }

    langIndicator.textContent = lang;
    langIndicator.classList.remove('hidden');

    if (lang === 'Arabic') {
        textInput.setAttribute('dir', 'rtl');
    } else {
        textInput.setAttribute('dir', 'ltr');
    }
}

// Analyze Sentiment
async function analyzeSentiment(text, save = true) {
    if (!text.trim() || !classifier) {
        resultCard.classList.add('hidden');
        return;
    }

    // Show result card
    resultCard.classList.remove('hidden');

    // Run inference
    const results = await classifier(text, { top_k: null });
    
    const scores = {};
    results.forEach(r => {
        scores[r.label] = r.score;
    });

    const topResult = results[0];
    const label = topResult.label;
    const score = topResult.score;

    // Update UI
    updateUI(label, score, scores);

    // Save to history if requested
    if (save) {
        saveToHistory(text, detectLanguage(text), label, score);
    }
}

function updateUI(label, mainScore, allScores) {
    // Update Badge
    sentimentBadge.textContent = label.charAt(0).toUpperCase() + label.slice(1);
    sentimentBadge.className = `badge ${label}`;

    // Update Confidence Bar
    const percent = Math.round(mainScore * 100);
    confidenceValue.textContent = `${percent}%`;
    confidenceBar.style.width = `${percent}%`;
    
    // Set bar color based on sentiment
    if (label === 'positive') confidenceBar.style.background = 'var(--pos-color)';
    else if (label === 'negative') confidenceBar.style.background = 'var(--neg-color)';
    else confidenceBar.style.background = 'var(--neu-color)';

    // Update Breakdown
    updateBreakdownItem('pos', allScores.positive);
    updateBreakdownItem('neu', allScores.neutral);
    updateBreakdownItem('neg', allScores.negative);
}

function updateBreakdownItem(key, score) {
    const val = score || 0;
    const item = breakdownItems[key];
    item.querySelector('.value').textContent = `${Math.round(val * 100)}%`;
}

// Debounce helper
function debounce(func, timeout = 1000) { // Increased debounce for history stability
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

const debouncedAnalysis = debounce((text) => analyzeSentiment(text, true));

// Event Listeners
textInput.addEventListener('input', (e) => {
    const text = e.target.value;
    currentChars.textContent = text.length;
    updateTextDirection(text);
    if (text.trim()) {
        debouncedAnalysis(text);
    } else {
        resultCard.classList.add('hidden');
    }
});

presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-text');
        textInput.value = text;
        currentChars.textContent = text.length;
        updateTextDirection(text);
        analyzeSentiment(text, true);
    });
});

clearHistoryBtn.addEventListener('click', () => {
    history = [];
    localStorage.removeItem('sentiment_history');
    renderHistory();
});

exportHistoryBtn.addEventListener('click', () => {
    if (history.length === 0) {
        alert('No history to export.');
        return;
    }

    const headers = ['Text', 'Language', 'Sentiment', 'Confidence', 'Date & Time'];
    const rows = history.map(item => [
        `"${item.text.replace(/"/g, '""')}"`,
        item.lang,
        item.label,
        `${Math.round(item.score * 100)}%`,
        new Date(item.timestamp).toLocaleString()
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `uae_sentiment_export_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Start the app
init();
