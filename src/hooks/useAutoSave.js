import { useState, useEffect, useCallback, useRef } from 'react';

const useAutoSave = (data, saveKey, delay = 3000) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const timeoutRef = useRef(null);
  const lastDataRef = useRef(null);

  // Load saved data on mount
  const loadSavedData = useCallback(() => {
    try {
      const saved = localStorage.getItem(`autosave_${saveKey}`);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error loading saved data:', error);
      return null;
    }
  }, [saveKey]);

  // Save data to localStorage
  const saveData = useCallback((dataToSave) => {
    try {
      localStorage.setItem(`autosave_${saveKey}`, JSON.stringify(dataToSave));
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      return true;
    } catch (error) {
      console.error('Error saving data:', error);
      return false;
    }
  }, [saveKey]);

  // Clear saved data
  const clearSavedData = useCallback(() => {
    try {
      localStorage.removeItem(`autosave_${saveKey}`);
      setLastSaved(null);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error clearing saved data:', error);
    }
  }, [saveKey]);

  // Auto-save effect
  useEffect(() => {
    if (!data || JSON.stringify(data) === JSON.stringify(lastDataRef.current)) {
      return;
    }

    lastDataRef.current = data;
    setHasUnsavedChanges(true);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(() => {
      setIsSaving(true);
      const success = saveData(data);
      setIsSaving(false);
      
      if (success) {
        // Auto-saved successfully
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, saveData]);

  // Save immediately
  const saveNow = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsSaving(true);
    const success = saveData(data);
    setIsSaving(false);
    return success;
  }, [data, saveData]);

  // Check if there are unsaved changes
  const hasChanges = useCallback(() => {
    const saved = loadSavedData();
    return saved && JSON.stringify(saved) !== JSON.stringify(data);
  }, [data, loadSavedData]);

  // Get saved data
  const getSavedData = useCallback(() => {
    return loadSavedData();
  }, [loadSavedData]);

  // Format last saved time
  const getLastSavedText = useCallback(() => {
    if (!lastSaved) return 'Never saved';
    
    const now = new Date();
    const diff = now - lastSaved;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }, [lastSaved]);

  return {
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    saveNow,
    clearSavedData,
    loadSavedData,
    getSavedData,
    hasChanges,
    getLastSavedText,
  };
};

export default useAutoSave; 