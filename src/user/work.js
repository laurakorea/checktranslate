// src/user/work.js – Main Controller
import * as api from "./work-api.js";
import * as ui from "./work-ui.js";

// Application State
const state = {
  allTourImages: [],
  currentImageIndex: 0,
  currentLines: [],
  currentLineIndex: 0,
  isPending: false,
  isReadOnly: localStorage.getItem('TEST_READ_ONLY') === 'true',
  totalTourLines: 0,
  evaluatedLinesCount: 0,
  userCode: localStorage.getItem('USER_CODE'),
  assignedLang: localStorage.getItem('ASSIGNED_LANG'),
  testId: localStorage.getItem('CURRENT_TEST_ID'),
  tourId: localStorage.getItem('CURRENT_TOUR_ID'),
  currentImageId: null
};

window.onerror = function (message, source, lineno, colno, error) {
  console.error("Global Guard caught an error:", message, error);
  if (window.showToast) window.showToast("System Error", "error");
  return true;
};

// ----------------------------------------------------
// Core Logical Flow
// ----------------------------------------------------
async function initializeTour() {
  try {
    const result = await api.fetchTourProgress(state.tourId, state.userCode);
    state.allTourImages = result.tourImages;
    state.totalTourLines = result.totalTourLines;
    state.evaluatedLinesCount = result.evaluatedLinesCount;

    ui.updateHeaderProgress(state.evaluatedLinesCount, state.totalTourLines);

    const imageIds = state.allTourImages.map(img => img.id);
    const resumeImgId = await api.fetchRecentEvaluatedImageId(state.userCode, imageIds);

    let startImgIdx = 0;
    if (resumeImgId) {
      const idx = state.allTourImages.findIndex(img => img.id === resumeImgId);
      if (idx !== -1) startImgIdx = idx;
    }

    loadNextImage(startImgIdx);
  } catch (e) {
    console.error("Error initializing tour:", e);
  }
}

async function loadNextImage(imgIndex) {
  if (imgIndex >= state.allTourImages.length) {
    handleTourCompletion();
    return;
  }

  state.currentImageIndex = imgIndex;
  const imageObj = state.allTourImages[imgIndex];
  state.currentImageId = imageObj.id;

  ui.updateImageInfo(imageObj);

  try {
    state.currentLines = await api.fetchImageLines(state.currentImageId, state.assignedLang);
    const evals = await api.fetchUserEvaluationsForImage(state.userCode, state.currentImageId);

    if (evals && evals.length > 0) {
      const lastNum = evals[0].line_id;
      const nextIdx = state.currentLines.findIndex(l => l.line_id > lastNum);
      if (nextIdx === -1 && evals.length >= state.currentLines.length) {
        // Image finished, instantly proceed to the next
        await loadNextImage(imgIndex + 1);
        return;
      }
      state.currentLineIndex = nextIdx !== -1 ? nextIdx : 0;
    } else {
      state.currentLineIndex = 0;
    }

    ui.renderLine(state.currentLines[state.currentLineIndex], state.currentLineIndex, state.currentLines.length, state.assignedLang, true);
  } catch (e) {
    console.error("Error loading image data:", e);
  }
}

async function handleTourCompletion() {
  ui.renderEndOfWork();

  if (!state.isReadOnly && state.testId) {
    await api.markTestCompleted(state.testId);
    state.isReadOnly = true;
    localStorage.setItem('TEST_READ_ONLY', 'true');
  }
}

async function handleReviewAction(status, issueCategory = null, issueDetail = null) {
  if (state.isPending || state.isReadOnly || !state.currentLines[state.currentLineIndex]) return;

  state.isPending = true;
  ui.setUILoading(true, state.isReadOnly);

  const item = state.currentLines[state.currentLineIndex];

  try {
    await api.saveLineEvaluation({
      userCode: state.userCode,
      imageId: state.currentImageId,
      lineId: item.line_id,
      testId: state.testId,
      result: status === 'natural' ? 'NATURAL' : issueCategory || 'AWKWARD',
      detail: issueDetail
    });

    if (status === 'issue') ui.toggleActionSheet(false, state.isReadOnly);

    state.evaluatedLinesCount++;
    ui.updateHeaderProgress(state.evaluatedLinesCount, state.totalTourLines);

    ui.animateCardOut(async () => {
      if (state.currentLineIndex + 1 < state.currentLines.length) {
        state.currentLineIndex++;
        ui.resetCardAnimation();
        ui.renderLine(state.currentLines[state.currentLineIndex], state.currentLineIndex, state.currentLines.length, state.assignedLang, true);

        state.isPending = false;
        ui.setUILoading(false, state.isReadOnly);
      } else {
        ui.resetCardAnimation();
        await loadNextImage(state.currentImageIndex + 1);

        state.isPending = false;
        ui.setUILoading(false, state.isReadOnly);
      }
    });
  } catch (err) {
    console.error("Review save error:", err);
    if (window.showToast) window.showToast("Save Error", "error");
    else alert("Save error: " + err.message);

    state.isPending = false;
    ui.setUILoading(false, state.isReadOnly);
  }
}

// ----------------------------------------------------
// DOM Binding
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // Guards
  if (!state.userCode || !state.tourId) {
    window.location.href = './select_test.html';
    return;
  }

  // Set Header
  const headerUserId = document.getElementById('headerUserId');
  if (headerUserId) headerUserId.textContent = state.userCode;

  // Back Button
  const btnBack = document.getElementById('btnBack');
  if (btnBack) {
    btnBack.addEventListener('click', () => {
      window.location.href = './select_test.html';
    });
  }

  // Read Only State Application
  if (state.isReadOnly) {
    const btnIssue = document.getElementById('btnIssue');
    const btnNatural = document.getElementById('btnNatural');
    if (btnIssue) {
      btnIssue.style.opacity = '0.5';
      btnIssue.disabled = true;
      btnIssue.textContent += " (Read Only)";
    }
    if (btnNatural) {
      btnNatural.style.opacity = '0.5';
      btnNatural.disabled = true;
      btnNatural.textContent += " (Read Only)";
    }
  }

  // Main Actions
  document.getElementById('btnIssue')?.addEventListener('click', () => {
    if (!state.isPending && !state.isReadOnly) ui.toggleActionSheet(true, state.isReadOnly);
  });

  document.getElementById('btnNatural')?.addEventListener('click', () => handleReviewAction('natural'));

  document.getElementById('overlay')?.addEventListener('click', () => ui.toggleActionSheet(false, state.isReadOnly));

  // Action Sheet buttons
  document.querySelectorAll('.action-btn[data-category]').forEach(btn => {
    btn.addEventListener('click', () => handleReviewAction('issue', btn.dataset.category));
  });

  document.getElementById('btnOthers')?.addEventListener('click', (e) => {
    if (state.isPending || state.isReadOnly || e.target.closest('#issueInput') || e.target.closest('#btnSubmitOthers')) return;
    document.getElementById('issueInput').classList.toggle('active');
    document.getElementById('btnSubmitOthers').classList.toggle('active');
  });

  document.getElementById('btnSubmitOthers')?.addEventListener('click', () => {
    const detail = document.getElementById('issueInput').value;
    handleReviewAction('issue', 'others', detail);
  });

  // Boot
  initializeTour();
});
