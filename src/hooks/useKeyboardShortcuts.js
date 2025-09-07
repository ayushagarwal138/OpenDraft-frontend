import { useEffect, useCallback } from 'react';

const useKeyboardShortcuts = ({
  onSave,
  onBold,
  onItalic,
  onUndo,
  onRedo,
  onPreview,
  onPublish,
  onNewPost,
  onSearch,
  onHelp,
  enabled = true,
}) => {
  const handleKeyDown = useCallback((event) => {
    if (!enabled) return;

    // Check if user is typing in an input field
    const target = event.target;
    const isInputField = target.tagName === 'INPUT' || 
                        target.tagName === 'TEXTAREA' || 
                        target.contentEditable === 'true';

    // Allow shortcuts even in input fields for some actions
    const allowInInput = ['ctrl+s', 'ctrl+shift+s', 'f1', 'ctrl+/'];
    const shortcut = getShortcutKey(event);
    
    if (isInputField && !allowInInput.includes(shortcut)) {
      return;
    }

    // Prevent default behavior for shortcuts
    if (shortcut) {
      event.preventDefault();
    }

    switch (shortcut) {
      case 'ctrl+s':
        if (onSave) {
          onSave();
          showNotification('💾 Saved!', 'success');
        }
        break;

      case 'ctrl+shift+s':
        if (onSave) {
          onSave(true); // Force save
          showNotification('💾 Force saved!', 'success');
        }
        break;

      case 'ctrl+b':
        if (onBold) {
          onBold();
          showNotification('**Bold**', 'info');
        }
        break;

      case 'ctrl+i':
        if (onItalic) {
          onItalic();
          showNotification('*Italic*', 'info');
        }
        break;

      case 'ctrl+z':
        if (onUndo) {
          onUndo();
          showNotification('↶ Undone', 'info');
        }
        break;

      case 'ctrl+y':
      case 'ctrl+shift+z':
        if (onRedo) {
          onRedo();
          showNotification('↷ Redone', 'info');
        }
        break;

      case 'ctrl+shift+p':
        if (onPreview) {
          onPreview();
          showNotification('👁️ Preview mode', 'info');
        }
        break;

      case 'ctrl+enter':
        if (onPublish) {
          onPublish();
          showNotification('🚀 Publishing...', 'info');
        }
        break;

      case 'ctrl+n':
        if (onNewPost) {
          onNewPost();
          showNotification('📝 New post', 'info');
        }
        break;

      case 'ctrl+f':
        if (onSearch) {
          onSearch();
          showNotification('🔍 Search', 'info');
        }
        break;

      case 'f1':
      case 'ctrl+/':
        if (onHelp) {
          onHelp();
        } else {
          showShortcutsHelp();
        }
        break;

      case 'escape':
        // Close modals, dropdowns, etc.
        const activeElement = document.activeElement;
        if (activeElement && activeElement.blur) {
          activeElement.blur();
        }
        break;

      default:
        break;
    }
  }, [enabled, onSave, onBold, onItalic, onUndo, onRedo, onPreview, onPublish, onNewPost, onSearch, onHelp]);

  // Get shortcut key combination
  const getShortcutKey = (event) => {
    const keys = [];
    
    if (event.ctrlKey || event.metaKey) keys.push('ctrl');
    if (event.shiftKey) keys.push('shift');
    if (event.altKey) keys.push('alt');
    
    const key = event.key.toLowerCase();
    if (key !== 'control' && key !== 'shift' && key !== 'alt' && key !== 'meta') {
      keys.push(key);
    }
    
    return keys.join('+');
  };

  // Show notification
  const showNotification = (message, type = 'info') => {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      font-weight: 500;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };

  // Show shortcuts help
  const showShortcutsHelp = () => {
    const shortcuts = [
      { key: 'Ctrl + S', description: 'Save draft' },
      { key: 'Ctrl + Shift + S', description: 'Force save' },
      { key: 'Ctrl + B', description: 'Bold text' },
      { key: 'Ctrl + I', description: 'Italic text' },
      { key: 'Ctrl + Z', description: 'Undo' },
      { key: 'Ctrl + Y', description: 'Redo' },
      { key: 'Ctrl + Shift + P', description: 'Preview post' },
      { key: 'Ctrl + Enter', description: 'Publish post' },
      { key: 'Ctrl + N', description: 'New post' },
      { key: 'Ctrl + F', description: 'Search' },
      { key: 'F1', description: 'Show this help' },
      { key: 'Escape', description: 'Close dialogs' },
    ];

    const helpModal = document.createElement('div');
    helpModal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    const helpContent = document.createElement('div');
    helpContent.style.cssText = `
      background: white;
      border-radius: 12px;
      padding: 24px;
      max-width: 500px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    `;

    helpContent.innerHTML = `
      <h2 style="margin: 0 0 20px 0; color: #333; font-size: 24px;">Keyboard Shortcuts</h2>
      <div style="display: grid; gap: 12px;">
        ${shortcuts.map(shortcut => `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">
            <kbd style="background: #f5f5f5; padding: 4px 8px; border-radius: 4px; font-family: monospace; font-size: 12px; border: 1px solid #ddd;">
              ${shortcut.key}
            </kbd>
            <span style="color: #666;">${shortcut.description}</span>
          </div>
        `).join('')}
      </div>
      <div style="margin-top: 20px; text-align: center;">
        <button onclick="this.closest('.help-modal').remove()" style="
          background: #2196f3;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        ">Close</button>
      </div>
    `;

    helpModal.className = 'help-modal';
    helpModal.appendChild(helpContent);
    document.body.appendChild(helpModal);

    // Close on escape or click outside
    const closeModal = () => {
      if (helpModal.parentNode) {
        helpModal.parentNode.removeChild(helpModal);
      }
    };

    helpModal.addEventListener('click', (e) => {
      if (e.target === helpModal) closeModal();
    });

    const handleEscape = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', handleEscape);

    // Cleanup
    helpModal.addEventListener('remove', () => {
      document.removeEventListener('keydown', handleEscape);
    });
  };

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [enabled, handleKeyDown]);

  return {
    showShortcutsHelp,
    showNotification,
  };
};

export default useKeyboardShortcuts; 