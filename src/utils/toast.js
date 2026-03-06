// toast.js – Simple toast/alert utility for Antigravity UI
// Usage: showToast('Message', 'type')
// type: 'success' | 'error' | 'info' | 'warning'

function createToastContainer() {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.style.position = 'fixed';
        container.style.top = '1rem';
        container.style.right = '1rem';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '0.5rem';
        document.body.appendChild(container);
    }
    return container;
}

function showToast(message, type = 'info', duration = 3000) {
    const container = createToastContainer();
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.minWidth = '200px';
    toast.style.padding = '0.8rem 1rem';
    toast.style.borderRadius = '6px';
    toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
    toast.style.color = '#fff';
    toast.style.fontFamily = 'var(--font-family)';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';

    const colors = {
        success: 'hsl(140, 70%, 45%)',
        error: 'hsl(0, 70%, 55%)',
        warning: 'hsl(40, 80%, 55%)',
        info: 'hsl(210, 80%, 55%)',
    };
    toast.style.background = colors[type] || colors.info;

    container.appendChild(toast);
    requestAnimationFrame(() => (toast.style.opacity = '1'));

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.addEventListener('transitionend', () => toast.remove());
    }, duration);
}

// Export for use in other modules (if using ES modules)
export { showToast };
window.showToast = showToast;
