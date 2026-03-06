export function updateHeaderProgress(evaluatedLinesCount, totalTourLines) {
    const textEl = document.getElementById('headerProgressText');
    const barEl = document.getElementById('headerProgressBar');

    if (textEl) textEl.textContent = `${evaluatedLinesCount} / ${totalTourLines}`;

    if (barEl) {
        const p = totalTourLines > 0 ? (evaluatedLinesCount / totalTourLines) * 100 : 0;
        barEl.style.width = `${Math.min(100, Math.max(0, p))}%`;
    }
}

export function renderLine(lineItem, currentLineIndex, totalLines, assignedLang, isInitial = false) {
    if (!lineItem) return;

    const transText = document.getElementById('translationText');
    const card = document.getElementById('translationCard');

    const langCol = assignedLang || 'espanol';
    const textToShow = (langCol === 'korean') ? lineItem.korean : (lineItem[langCol] || '');

    // Line progress
    const lineText = document.getElementById('subProgressText');
    const lineBar = document.getElementById('subProgressBar');
    if (lineText) lineText.textContent = `Line: ${currentLineIndex + 1} / ${totalLines}`;
    if (lineBar) {
        lineBar.style.width = `${((currentLineIndex + 1) / totalLines) * 100}%`;
    }

    if (isInitial) {
        card.classList.add('card-in');
        transText.textContent = textToShow;
        setTimeout(() => card.classList.remove('card-in'), 50);
    } else {
        transText.textContent = textToShow;
    }
}

export function setUILoading(loading, isReadOnly) {
    document.querySelectorAll('.btn, .action-btn').forEach(b => {
        b.disabled = loading || isReadOnly;
        b.style.opacity = (loading || isReadOnly) ? "0.6" : "1";
    });
}

export function toggleActionSheet(show, isReadOnly) {
    if (isReadOnly) return;

    const overlay = document.getElementById('overlay');
    const sheet = document.getElementById('actionSheet');
    if (show) {
        overlay.classList.add('active');
        sheet.classList.add('active');
    } else {
        overlay.classList.remove('active');
        sheet.classList.remove('active');
        document.getElementById('issueInput').classList.remove('active');
        document.getElementById('btnSubmitOthers').classList.remove('active');
    }
}

export function renderEndOfWork() {
    const transText = document.getElementById('translationText');
    const korRef = document.getElementById('korReference');
    if (korRef) korRef.textContent = 'Tour Completed';
    if (transText) transText.textContent = 'You have reviewed all lines for this tour! 🎉';

    const btnIssue = document.getElementById('btnIssue');
    const btnNatural = document.getElementById('btnNatural');
    if (btnIssue) btnIssue.style.display = 'none';
    if (btnNatural) btnNatural.style.display = 'none';
}

export function updateImageInfo(imageObj) {
    const headerImageTitle = document.getElementById('headerImageTitle');
    if (headerImageTitle) {
        headerImageTitle.textContent = imageObj.image_title || `Image ${imageObj.id}`;
    }

    const mainImg = document.getElementById('mainImage');
    if (mainImg) {
        mainImg.classList.add('fade-out');
        setTimeout(() => {
            mainImg.src = imageObj.image_url;
            mainImg.onload = () => mainImg.classList.remove('fade-out');
        }, 300);
    }
}

export function animateCardOut(callback) {
    const card = document.getElementById('translationCard');
    card.classList.add('card-out');
    setTimeout(() => {
        callback();
    }, 300);
}

export function resetCardAnimation() {
    const card = document.getElementById('translationCard');
    card.classList.remove('card-out');
}
