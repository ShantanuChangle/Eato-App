// src/api/apiClient.js
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCallback } from 'react';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export function useApi() {
  const { token } = useAuth();

  const request = useCallback(
    async (options) => {
      const headers = { ...(options.headers || {}) };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await api({
        ...options,
        headers,
      });

      return res.data;
    },
    [token]
  );

  return { request };
}





// import axios from 'axios';
// import { useAuth } from '../context/AuthContext';

// // Base axios instance
// const api = axios.create({
//   baseURL: 'http://localhost:3000',
// });

// // helper hook: returns functions that auto-attach token if available
// export function useApi() {
//   const { token } = useAuth();

//   // request with optional auth
//   const request = async (options) => {
//     const headers = options.headers || {};

//     if (token) {
//       headers['Authorization'] = `Bearer ${token}`;
//     }

//     const res = await api({
//       ...options,
//       headers,
//     });

//     return res.data;
//   };

//   return { request };
// }