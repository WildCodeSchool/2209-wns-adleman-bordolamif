export const speak = (text: string) => {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);

  utterance.lang = 'fr-FR';

  synth.speak(utterance);
};
