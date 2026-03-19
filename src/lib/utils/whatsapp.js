/**
 * Utility to generate a pre-filled WhatsApp click-to-chat deep link.
 * Used to transition users from the web onboarding to the mobile capture experience.
 */
export function generateWhatsAppConciergeLink(projectDna, phone = '15550198333') { // Mock Innerspace Business Number
  const message = `Hello Innerspace Concierge. \n\nI have just completed my Style Calibration. My Design DNA is: *${projectDna}*.\n\nI am ready to perform my Virtual Room Tour. Please send me the secure upload link.`;
  
  // Encode the message for the URL
  const encodedMessage = encodeURIComponent(message);
  
  // Return the universal WhatsApp link format
  return `https://wa.me/${phone}?text=${encodedMessage}`;
}
