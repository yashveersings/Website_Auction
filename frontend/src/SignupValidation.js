function Validation(values) {
  let errors = {};
  const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;

  if (!values.name) {
    errors.name = "Name should not be empty";
  }

  if (!values.email) {
    errors.email = "Email should not be empty";
  } else if (!email_pattern.test(values.email)) {
    errors.email = "Invalid email format";
  }

  if (!values.password) {
    errors.password = "Password should not be empty";
  } else if (!password_pattern.test(values.password)) {
    errors.password = "Password must be at least 8 characters long, contain at least one number, one uppercase letter, and one lowercase letter";
  }

  if (!values.securityQuestion) {
    errors.securityQuestion = "Please select a security question";
  }

  if (!values.securityAnswer) {
    errors.securityAnswer = "Answer should not be empty";
  }

  return errors;
}

export default Validation;
