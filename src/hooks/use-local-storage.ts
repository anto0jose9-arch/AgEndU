"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

// Custom hook to check if it's the initial mount
const useIsMounted = () => {
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = false;
  }, []);
  return isMountedRef.current;
};

export function useLocalStorage<T>(
  key: string, 
  fallbackValue: T,
  reviver?: (key: string, value: any) => any
): [T, React.Dispatch<React.SetStateAction<T>>, boolean] {
  const [value, setValue] = useState<T>(fallbackValue);
  const [isMounted, setIsMounted] = useState(false);
  const isInitialMount = useIsMounted();

  useEffect(() => {
    // Only run this effect on the client
    if (typeof window !== 'undefined') {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          setValue(JSON.parse(item, reviver));
        }
      } catch (error) {
        console.warn(`Error reading localStorage key “${key}”:`, error);
      } finally {
        setIsMounted(true);
      }
    }
  }, [key, reviver]);

  const setValueInLocalStorage = useCallback((newValue: T | ((val: T) => T)) => {
    // Prevent setting value on the server
    if (typeof window === 'undefined') {
      return;
    }
    
    setValue(currentValue => {
        const result = newValue instanceof Function ? newValue(currentValue) : newValue;
        try {
            window.localStorage.setItem(key, JSON.stringify(result));
        } catch (error) {
            console.warn(`Error setting localStorage key “${key}”:`, error);
        }
        return result;
    });
  }, [key]);

  // Don't sync from local storage on initial server render
  const safeValue = isInitialMount ? fallbackValue : value;

  return [safeValue, setValueInLocalStorage, isMounted];
}
