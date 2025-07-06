const bcrypt = require('bcryptjs');

async function createPassword() {
  const password = 'admin123';
  const saltRounds = 10;
  
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Original password:', password);
    console.log('Hashed password:', hashedPassword);
    
    // Test verification
    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log('Password verification:', isMatch);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

createPassword();
