// src/hooks/useApi.js
import { useCallback } from "react";

const useApi = () => {
  const apiKey = process.env.REACT_APP_API_SECRET_KEY; // Clave del frontend (debe estar en .env)

  const fetchWithAuth = useCallback(async (url, options = {}) => {
     
    
    const headers = {
      "X-API-Key": apiKey, // Envía la clave en headers
      "Content-Type": "application/json",
      ...options.headers,
    };
    
    return fetch(url, { ...options, headers });
  }, [apiKey]);

  return { fetchWithAuth };
};

export default useApi;
