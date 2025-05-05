
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { enhanceSearchWithScroll } from './utils/textSearch.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Enhance search functionality after the page has loaded
document.addEventListener('DOMContentLoaded', () => {
  // Find all search inputs on the page
  const searchInputs = document.querySelectorAll('input[type="search"], input[placeholder*="search" i], input[placeholder*="find" i]');
  
  searchInputs.forEach(input => {
    if (input instanceof HTMLInputElement) {
      enhanceSearchWithScroll(input);
    }
  });
  
  // For dynamically added search inputs
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node instanceof HTMLElement) {
            const inputs = node.querySelectorAll('input[type="search"], input[placeholder*="search" i], input[placeholder*="find" i]');
            inputs.forEach(input => {
              if (input instanceof HTMLInputElement) {
                enhanceSearchWithScroll(input);
              }
            });
          }
        });
      }
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
});
