/**
 * Input Validation Utilities
 * 
 * Centralized validation for all user inputs.
 * Used in both client-side forms and server-side API routes.
 */

export interface ValidationResult {
    valid: boolean;
    error?: string;
}

/** RFC 5322 compliant email validation */
export function validateEmail(email: string): ValidationResult {
    if (!email || !email.trim()) {
        return { valid: false, error: 'Email is required' };
    }

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email.trim())) {
        return { valid: false, error: 'Invalid email format' };
    }

    if (email.length > 254) {
        return { valid: false, error: 'Email too long' };
    }

    return { valid: true };
}

/** Password strength validation: min 8 chars, one uppercase, one number */
export function validatePassword(password: string): ValidationResult {
    if (!password) {
        return { valid: false, error: 'Password is required' };
    }

    if (password.length < 8) {
        return { valid: false, error: 'Password must be at least 8 characters' };
    }

    if (password.length > 128) {
        return { valid: false, error: 'Password too long' };
    }

    if (!/[A-Z]/.test(password)) {
        return { valid: false, error: 'Password needs at least one uppercase letter' };
    }

    if (!/[0-9]/.test(password)) {
        return { valid: false, error: 'Password needs at least one number' };
    }

    return { valid: true };
}

/** Ghost name validation: alphanumeric + spaces, 2-30 chars */
export function validateGhostName(name: string): ValidationResult {
    if (!name || !name.trim()) {
        return { valid: false, error: 'Identity is required' };
    }

    const trimmed = name.trim();

    if (trimmed.length < 2) {
        return { valid: false, error: 'Name must be at least 2 characters' };
    }

    if (trimmed.length > 30) {
        return { valid: false, error: 'Name must be 30 characters or less' };
    }

    // Allow alphanumeric, spaces, underscores, hyphens, and some unicode
    if (!/^[\w\s\-\u00C0-\u024F]+$/u.test(trimmed)) {
        return { valid: false, error: 'Name contains invalid characters' };
    }

    return { valid: true };
}

/** Sanitize text input — strip HTML tags and normalize whitespace */
export function sanitizeInput(text: string): string {
    return text
        .replace(/<[^>]*>/g, '')              // Strip HTML tags
        .replace(/&[a-z]+;/gi, '')            // Strip HTML entities
        .replace(/javascript:/gi, '')          // Strip JS protocol
        .replace(/on\w+\s*=/gi, '')           // Strip inline event handlers
        .replace(/\s+/g, ' ')                 // Normalize whitespace
        .trim();
}

/** Validate generic text field with length constraints */
export function validateTextField(
    value: string,
    fieldName: string,
    minLength = 1,
    maxLength = 500
): ValidationResult {
    if (!value || !value.trim()) {
        return { valid: false, error: `${fieldName} is required` };
    }

    if (value.trim().length < minLength) {
        return { valid: false, error: `${fieldName} must be at least ${minLength} characters` };
    }

    if (value.trim().length > maxLength) {
        return { valid: false, error: `${fieldName} must be ${maxLength} characters or less` };
    }

    return { valid: true };
}
