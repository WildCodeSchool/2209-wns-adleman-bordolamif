function getRandomChar(characters: string) {
  const randomIndex = Math.floor(Math.random() * characters.length);
  return characters.charAt(randomIndex);
}

function shuffleString(string: string) {
  const array = string.split('');
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join('');
}

export function generateRandomPassword(length: number) {
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numericChars = '0123456789';
  const specialChars = '!@#$%^&*';

  let password = '';

  // Ajouter au moins un caractère de chaque type
  password += getRandomChar(lowercaseChars);
  password += getRandomChar(uppercaseChars);
  password += getRandomChar(numericChars);
  password += getRandomChar(specialChars);

  // Générer le reste du mot de passe
  for (let i = 4; i < length; i += 1) {
    const allChars = lowercaseChars + uppercaseChars + numericChars + specialChars;
    password += getRandomChar(allChars);
  }

  // Mélanger le mot de passe pour assurer un ordre aléatoire des caractères
  password = shuffleString(password);

  return password;
}
