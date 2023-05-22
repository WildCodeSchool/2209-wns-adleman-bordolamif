export const speak = (text: string) => {
  const synth = window.speechSynthesis;

  // Vérifie si la synthèse vocale est en cours et l'arrête
  if (synth.speaking) {
    synth.cancel();
  }

  // Crée un nouvel objet SpeechSynthesisUtterance
  const utterance = new SpeechSynthesisUtterance(text);

  // Langue de la synthèse vocale (facultatif)
  utterance.lang = 'fr-FR';

  // Lance la synthèse vocale
  synth.speak(utterance);
};
