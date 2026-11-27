import { FINAL_GRADES } from '../data/options.js'

export function normalizePhone(value = '') {
  return String(value).replace(/\D/g, '')
}

export function isBlank(value) {
  return !String(value ?? '').trim()
}

export function validateName(value, label) {
  if (isBlank(value)) return `${label} is required.`
  if (String(value).trim().length < 2) return `${label} must be at least 2 characters.`
  return ''
}

export function validatePhone(value, label = 'Phone number') {
  if (isBlank(value)) return `${label} is required.`
  if (!/^\d{9,15}$/.test(normalizePhone(value))) {
    return `${label} must contain 9 to 15 digits.`
  }
  return ''
}

export function validateChoice(value, label) {
  return isBlank(value) ? `${label} is required.` : ''
}

export function validatePassword(value) {
  if (isBlank(value)) return 'Password is required.'
  if (String(value).length < 8) return 'Password must be at least 8 characters.'
  if (!/[A-Za-z]/.test(value)) return 'Password must include at least one letter.'
  if (!/\d/.test(value)) return 'Password must include at least one number.'
  return ''
}

export function validateConfirmPassword(password, confirmPassword) {
  if (isBlank(confirmPassword)) return 'Please confirm your password.'
  if (password !== confirmPassword) return 'Passwords do not match.'
  return ''
}

export function requiresStream(grade) {
  return FINAL_GRADES.includes(String(grade))
}

export function validateStudentStep(values, isPhoneTaken = () => false) {
  const errors = {}

  errors.firstName = validateName(values.firstName, 'First name')
  errors.fatherName = validateName(values.fatherName, "Father's name")
  errors.grandfatherName = validateName(values.grandfatherName, "Grandfather's name")
  errors.gender = validateChoice(values.gender, 'Gender')
  errors.phoneNumber = validatePhone(values.phoneNumber)
  errors.grade = validateChoice(values.grade, 'Grade')
  errors.schoolName = validateName(values.schoolName, 'School name')

  if (requiresStream(values.grade)) {
    errors.stream = validateChoice(values.stream, 'Stream')
  }

  if (!errors.phoneNumber && isPhoneTaken(values.phoneNumber)) {
    errors.phoneNumber = 'This phone number already has a Clone School account.'
  }

  return Object.fromEntries(Object.entries(errors).filter(([, message]) => message))
}

export function validateParentStep(values) {
  const errors = {
    parentFullName: validateName(values.parentFullName, 'Parent full name'),
    parentPhoneNumber: validatePhone(values.parentPhoneNumber, 'Parent phone number'),
  }

  return Object.fromEntries(Object.entries(errors).filter(([, message]) => message))
}

export function validateSecurityStep(values) {
  const errors = {
    password: validatePassword(values.password),
    confirmPassword: validateConfirmPassword(values.password, values.confirmPassword),
  }

  return Object.fromEntries(Object.entries(errors).filter(([, message]) => message))
}

export function validateLogin(values) {
  const errors = {
    phoneNumber: validatePhone(values.phoneNumber),
    password: isBlank(values.password) ? 'Password is required.' : '',
  }

  return Object.fromEntries(Object.entries(errors).filter(([, message]) => message))
}
