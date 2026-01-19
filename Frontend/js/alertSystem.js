
const ALERT_DURATION_DEFAULT = 5000;     
const ALERT_DURATION_LONG = 8000;        

const ALERT_TYPES = {
  success: {
    className: 'alert-success',
    icon: '✓',
    title: 'Success'
  },
  error: {
    className: 'alert-error',
    icon: '✕',
    title: 'Error'
  },
  warning: {
    className: 'alert-warning',
    icon: '⚠',
    title: 'Warning'
  },
  info: {
    className: 'alert-info',
    icon: 'ℹ',
    title: 'Info'
  }
};


let alertContainer = null;
let currentTimeout = null;

function getAlertContainer() {
  if (!alertContainer) {
    alertContainer = document.querySelector('.alert-container') || 
                    document.querySelector('[data-alert-container]');

    if (!alertContainer) {
      alertContainer = document.createElement('div');
      alertContainer.className = 'alert-container';
      document.body.prepend(alertContainer);
    }
  }
  return alertContainer;
}

function createAlert(message, type = 'info', duration = ALERT_DURATION_DEFAULT) {

  hideAlert();

  const alert = document.createElement('div');
  alert.className = `alert-banner ${ALERT_TYPES[type]?.className || 'alert-info'}`;
  
  const icon = ALERT_TYPES[type]?.icon || 'ℹ';
  const title = ALERT_TYPES[type]?.title || 'Notification';

  alert.innerHTML = `
    <div class="alert-icon">${icon}</div>
    <div class="alert-content">
      <strong>${title}</strong>
      <p>${message}</p>
    </div>
    <button class="alert-close" aria-label="Close">×</button>
  `;

  getAlertContainer().appendChild(alert);

  if (duration > 0) {
    currentTimeout = setTimeout(() => {
      hideAlert();
    }, duration);
  }

  alert.querySelector('.alert-close').addEventListener('click', () => {
    hideAlert();
  });

  alert.addEventListener('click', (e) => {
    if (e.target !== alert.querySelector('.alert-close')) {
      hideAlert();
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

