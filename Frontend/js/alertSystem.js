let alertQueue = [];
let isShowingAlert = false;

function showAlert(message, type = 'info', duration = 5000) {
    const alert = { message, type, duration };
    alertQueue.push(alert);

    if (!isShowingAlert) {
        displayNextAlert();
    }
}

function displayNextAlert() {
    if (alertQueue.length === 0) {
        isShowingAlert = false;
        return;
    }

    isShowingAlert = true;
    const alert = alertQueue.shift();

    const alertContainer = getOrCreateAlertContainer();
    const alertElement = createAlertElement(alert.message, alert.type);

    alertContainer.appendChild(alertElement);

    setTimeout(() => {
        alertElement.classList.add('show');
    }, 10);

    if (alert.duration > 0) {
        setTimeout(() => {
            hideAlert(alertElement);
        }, alert.duration);
    }
}

function getOrCreateAlertContainer() {
    let container = document.getElementById('alert-container');

    if (!container) {
        container = document.createElement('div');
        container.id = 'alert-container';
        container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
    `;
        document.body.appendChild(container);
    }

    return container;
}

function createAlertElement(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;

    // Get icon based on type
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };

    const icon = icons[type] || icons.info;

    const colors = {
        success: {
            bg: 'linear-gradient(135deg, rgba(56, 239, 125, 0.9) 0%, rgba(17, 153, 142, 0.9) 100%)',
            border: '#38ef7d'
        },
        error: {
            bg: 'linear-gradient(135deg, rgba(241, 92, 100, 0.9) 0%, rgba(235, 57, 65, 0.9) 100%)',
            border: '#f15c64'
        },
        warning: {
            bg: 'linear-gradient(135deg, rgba(245, 87, 108, 0.9) 0%, rgba(240, 147, 251, 0.9) 100%)',
            border: '#f5576c'
        },
        info: {
            bg: 'linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%)',
            border: '#667eea'
        }
    };

    const color = colors[type] || colors.info;

    alert.style.cssText = `
    padding: 1rem 1.5rem;
    background: ${color.bg};
    backdrop-filter: blur(12px);
    border: 1px solid ${color.border};
    border-radius: 12px;
    color: white;
    font-size: 0.875rem;
    font-weight: 500;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    gap: 12px;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease-out;
    cursor: pointer;
    max-width: 100%;
    word-wrap: break-word;
  `;

    alert.innerHTML = `
    <span style="font-size: 1.25rem; flex-shrink: 0;">${icon}</span>
    <span style="flex: 1;">${message}</span>
    <button onclick="this.parentElement.style.display='none'" style="
      background: none;
      border: none;
      color: white;
      font-size: 1.25rem;
      cursor: pointer;
      padding: 0;
      margin-left: 8px;
      opacity: 0.7;
      transition: opacity 0.2s;
      flex-shrink: 0;
    " onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">×</button>
  `;

    alert.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') {
            hideAlert(alert);
        }
    });

    return alert;
}

function hideAlert(alertElement) {
    if (!alertElement) return;

    alertElement.classList.remove('show');
    alertElement.style.opacity = '0';
    alertElement.style.transform = 'translateX(100%)';

    setTimeout(() => {
        if (alertElement.parentElement) {
            alertElement.parentElement.removeChild(alertElement);
        }
        displayNextAlert();
    }, 300);
}

function addAlertStyles() {
    if (document.getElementById('alert-styles')) return;

    const style = document.createElement('style');
    style.id = 'alert-styles';
    style.textContent = `
    .alert.show {
      opacity: 1 !important;
      transform: translateX(0) !important;
    }
    
    @media (max-width: 768px) {
      #alert-container {
        left: 10px;
        right: 10px;
        max-width: none;
      }
    }
  `;
    document.head.appendChild(style);
}

function clearAllAlerts() {
    const container = document.getElementById('alert-container');
    if (container) {
        container.innerHTML = '';
    }
    alertQueue = [];
    isShowingAlert = false;
}

function showSuccess(message) {
    showAlert(message, 'success');
}

function showError(message) {
    showAlert(message, 'error');
}

function showWarning(message) {
    showAlert(message, 'warning');
}

function showInfo(message) {
    showAlert(message, 'info');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addAlertStyles);
} else {
    addAlertStyles();
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showAlert,
        hideAlert,
        clearAllAlerts,
        showSuccess,
        showError,
        showWarning,
        showInfo
    };
}

