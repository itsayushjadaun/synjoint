
/**
 * Scrolls to the first occurrence of a search term on the page
 * 
 * @param searchTerm The term to search for
 * @returns boolean indicating if a match was found
 */
export const scrollToSearchTerm = (searchTerm: string): boolean => {
  if (!searchTerm) return false;

  // Convert to lowercase for case-insensitive search
  const searchTermLower = searchTerm.toLowerCase();
  const bodyText = document.body.innerText.toLowerCase();
  
  // If the term doesn't exist in the body text at all, return false
  if (!bodyText.includes(searchTermLower)) return false;
  
  // Get all text nodes in the document
  const textNodes = getTextNodes(document.body);
  
  for (const node of textNodes) {
    const content = node.textContent?.toLowerCase() || '';
    
    if (content.includes(searchTermLower)) {
      // Find the position of the term within the text node
      const textPosition = content.indexOf(searchTermLower);
      
      // If the term was found
      if (textPosition !== -1) {
        // Create a range to select the text
        const range = document.createRange();
        range.setStart(node, textPosition);
        range.setEnd(node, textPosition + searchTermLower.length);
        
        // Create a selection and select the range
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
        
        // Get the client rect of the selection
        const rect = range.getBoundingClientRect();
        
        // Scroll to the element, positioning it in the middle of the viewport
        window.scrollTo({
          top: window.scrollY + rect.top - window.innerHeight / 2,
          behavior: 'smooth'
        });
        
        // Highlight effect (temporary)
        const highlight = document.createElement('mark');
        highlight.style.backgroundColor = 'yellow';
        highlight.style.color = 'black';
        highlight.style.padding = '2px';
        highlight.style.borderRadius = '2px';
        highlight.textContent = node.textContent?.substring(textPosition, textPosition + searchTermLower.length) || '';
        
        try {
          // Replace the text with the highlighted version
          range.deleteContents();
          range.insertNode(highlight);
          
          // Remove highlight after 3 seconds
          setTimeout(() => {
            if (highlight.parentNode) {
              const parent = highlight.parentNode;
              const text = document.createTextNode(highlight.textContent || '');
              parent.replaceChild(text, highlight);
            }
          }, 3000);
        } catch (e) {
          console.error('Error highlighting text:', e);
        }
        
        return true;
      }
    }
  }
  
  return false;
};

/**
 * Gets all text nodes in an element
 * 
 * @param element The element to search in
 * @returns Array of text nodes
 */
const getTextNodes = (element: Node): Text[] => {
  const textNodes: Text[] = [];
  
  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
      textNodes.push(node as Text);
    } else {
      for (let i = 0; i < node.childNodes.length; i++) {
        walk(node.childNodes[i]);
      }
    }
  };
  
  walk(element);
  return textNodes;
};

/**
 * Enhance an existing search input with scroll-to functionality
 * 
 * @param inputElement The search input element to enhance
 */
export const enhanceSearchWithScroll = (inputElement: HTMLInputElement) => {
  // Store the original event handler if it exists
  const originalHandler = inputElement.onkeyup;
  
  inputElement.onkeyup = (event) => {
    // Call the original handler if it exists
    if (originalHandler) {
      if (typeof originalHandler === 'function') {
        originalHandler.call(inputElement, event);
      } else if (typeof originalHandler === 'object' && originalHandler !== null) {
        // Check if it's an EventListener object with handleEvent
        const eventListener = originalHandler as EventListenerObject;
        if ('handleEvent' in eventListener) {
          eventListener.handleEvent(event);
        }
      }
    }
    
    // Add our scroll behavior
    if (event.key === 'Enter') {
      const searchTerm = inputElement.value.trim();
      if (searchTerm) {
        const found = scrollToSearchTerm(searchTerm);
        if (!found) {
          console.log(`"${searchTerm}" not found in page content`);
        }
      }
    }
  };
  
  // Add an explicit search button if not present
  const parent = inputElement.parentElement;
  if (parent) {
    // Check if there's already a search button
    const existingButton = Array.from(parent.children).find(
      child => child instanceof HTMLButtonElement && 
      (child.textContent?.toLowerCase().includes('search') || 
       child.querySelector('svg[data-search-icon]'))
    );
    
    if (!existingButton) {
      const searchButton = document.createElement('button');
      searchButton.textContent = 'Find';
      searchButton.className = 'px-3 py-1 ml-2 rounded bg-blue-500 text-white text-sm';
      searchButton.onclick = () => {
        const searchTerm = inputElement.value.trim();
        if (searchTerm) {
          const found = scrollToSearchTerm(searchTerm);
          if (!found) {
            console.log(`"${searchTerm}" not found in page content`);
          }
        }
      };
      
      // Insert after the input
      inputElement.insertAdjacentElement('afterend', searchButton);
    }
  }
};
