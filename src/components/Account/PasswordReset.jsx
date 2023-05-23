import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth'; // Import sendPasswordResetEmail function
import { auth } from '../../firebase';

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email); // Use sendPasswordResetEmail function
      setSuccessMessage('Password reset email sent. Please check your inbox.');
      setErrorMessage('');
      setEmail('');
    } catch (error) {
      setErrorMessage('Error resetting password. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handleResetPassword}>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button type="submit">Reset Password</button>
      </form>
      {successMessage && <p>{successMessage}</p>}
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default PasswordReset;