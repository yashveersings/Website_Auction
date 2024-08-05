function validateForgotPassword(values) {
  let errors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;

  if (!values.email) {
    errors.email = "Email should not be empty.";
  } else if (!emailPattern.test(values.email)) {
    errors.email = "Invalid email format.";
  }

  if (!values.securityQuestion) {
    errors.securityQuestion = "Please select a security question.";
  }

  if (!values.securityAnswer) {
    errors.securityAnswer = "Answer should not be empty.";
  }

  if (!values.newPassword) {
    errors.newPassword = "New password should not be empty.";
  } else if (!passwordPattern.test(values.newPassword)) {
    errors.newPassword = "Password must be at least 8 characters long, contain at least one number, one uppercase letter, and one lowercase letter.";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Please confirm your new password.";
  } else if (values.newPassword !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

export default validateForgotPassword;
