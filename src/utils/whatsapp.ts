
/**
 * Utility to launch a WhatsApp intent for sending messages.
 */
export function sendWhatsAppMessage(message: string) {
  // WhatsApp Web intent for a given phone number with a message
  const phone = "918824405590"; // Phone number in international format without +
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${phone}?text=${encodedMessage}`;
  
  try {
    // Open WhatsApp in a new tab
    const newWindow = window.open(url, "_blank");
    
    // Check if the window was successfully opened
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      console.warn("WhatsApp window could not be opened. The popup was likely blocked by the browser.");
      // Return the URL which could be used elsewhere
      return {
        success: false,
        url,
        message: "WhatsApp window was blocked. Please enable popups or use the link manually."
      };
    }
    
    return {
      success: true,
      url
    };
  } catch (error) {
    console.error("Error opening WhatsApp:", error);
    return {
      success: false,
      url,
      message: "Error opening WhatsApp. Please try manually."
    };
  }
}
