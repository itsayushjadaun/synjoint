
/**
 * Utility to launch a WhatsApp intent for sending messages.
 */
export function sendWhatsAppMessage(message: string) {
  // WhatsApp Web intent for a given phone number with a message
  const phone = "918824405590";
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}
