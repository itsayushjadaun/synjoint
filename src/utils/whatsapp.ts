
// If the file doesn't exist or needs updating
export const sendWhatsAppMessage = (message: string) => {
  try {
    const phone = "918824405590"; // Phone number in international format without +
    const encodedMessage = encodeURIComponent(message);
    
    // For client-side usage, create a WhatsApp URL
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
    
    // Open the URL in a new tab
    window.open(whatsappUrl, "_blank");
    
    return {
      whatsappUrl,
      success: true
    };
  } catch (error) {
    console.error("Error preparing WhatsApp message:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
};
