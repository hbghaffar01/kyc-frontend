export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return regex.test(password);
};

export const validateName = (name) => {
  return name && name.length >= 2 && name.length <= 50;
};

export const validateKycDocument = (file) => {
  if (!file) return false;
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) return false;

  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
  return allowedTypes.includes(file.type);
};
