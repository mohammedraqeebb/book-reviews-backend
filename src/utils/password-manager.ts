import bcrypt from 'bcrypt';

export class PasswordManager {
  static async hashPassword(plainPassword: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(plainPassword, salt);
  }
  static async comparePassword(inputPassword: string, hashedPassword: string) {
    return await bcrypt.compare(inputPassword, hashedPassword);
  }
  static validatePassword(inputPassword: string) {
    let totalCharacters = inputPassword.length,
      specialCharacters = 0,
      lowerCase = 0,
      upperCase = 0,
      numbers = 0;

    for (let i = 0; i < inputPassword.length; i++) {
      const asciiCode = inputPassword.charCodeAt(i);

      if (
        (asciiCode >= 32 && asciiCode <= 47) ||
        (asciiCode >= 58 && asciiCode <= 64) ||
        (asciiCode >= 91 && asciiCode <= 96) ||
        (asciiCode >= 123 && asciiCode <= 126)
      ) {
        specialCharacters++;
      } else if (asciiCode > 48 && asciiCode <= 57) {
        numbers++;
      } else if (asciiCode >= 65 && asciiCode <= 90) {
        upperCase++;
      } else if (asciiCode >= 65 && asciiCode <= 90) {
        upperCase++;
      } else if (asciiCode >= 97 && asciiCode <= 122) {
        lowerCase++;
      }
    }

    return (
      totalCharacters >= 8 &&
      totalCharacters <= 100 &&
      upperCase >= 1 &&
      lowerCase >= 1 &&
      specialCharacters >= 1 &&
      numbers >= 1
    );
  }
}
