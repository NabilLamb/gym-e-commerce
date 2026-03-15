// lib/validations.ts

// Centralized validation rules used by both frontend and backend

export const VALIDATION = {
  name: {
    min: 2,
    max: 50,
    regex: /^[a-zA-ZÀ-ÿ\s'-]+$/,
    message: "Name must be 2-50 characters and contain only letters, spaces, hyphens, or apostrophes.",
  },
  email: {
    regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: "Please enter a valid email address.",
  },
  password: {
    min: 8,
    max: 100,
    // At least: 1 uppercase, 1 lowercase, 1 number
    regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
    message:
      "Password must be at least 8 characters and include one uppercase letter, one lowercase letter, and one number.",
  },
  phone: {
    regex: /^\+?[1-9]\d{6,14}$/,
    message: "Please enter a valid phone number (7-15 digits, optional + prefix).",
  },
  zip: {
    regex: /^[a-zA-Z0-9\s-]{3,10}$/,
    message: "Please enter a valid ZIP or postal code.",
  },
} as const;

// Reusable validator functions
export function validateName(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return "Name is required.";
  if (trimmed.length < VALIDATION.name.min) return `Name must be at least ${VALIDATION.name.min} characters.`;
  if (trimmed.length > VALIDATION.name.max) return `Name must be at most ${VALIDATION.name.max} characters.`;
  if (!VALIDATION.name.regex.test(trimmed)) return VALIDATION.name.message;
  return null;
}

export function validateEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) return "Email is required.";
  if (!VALIDATION.email.regex.test(trimmed)) return VALIDATION.email.message;
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "Password is required.";
  if (password.length < VALIDATION.password.min) return `Password must be at least ${VALIDATION.password.min} characters.`;
  if (password.length > VALIDATION.password.max) return "Password is too long.";
  if (!VALIDATION.password.regex.test(password)) return VALIDATION.password.message;
  return null;
}

export function validatePhone(phone: string): string | null {
  const trimmed = phone.trim();
  if (!trimmed) return "Phone number is required.";
  if (!VALIDATION.phone.regex.test(trimmed)) return VALIDATION.phone.message;
  return null;
}