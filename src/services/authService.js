import { DEFAULT_SCHOOL_NAME, FINAL_GRADES } from '../data/options.js'
import { normalizePhone, validatePassword } from '../utils/validation.js'

const ACCOUNTS_KEY = 'clone-school.accounts.v1'
const SESSION_KEY = 'clone-school.session.v1'
const REMEMBERED_PHONE_KEY = 'clone-school.remembered-phone.v1'

function getStorage() {
  return globalThis.localStorage
}

function readJSON(key, fallback) {
  try {
    const rawValue = getStorage()?.getItem(key)
    return rawValue ? JSON.parse(rawValue) : fallback
  } catch {
    return fallback
  }
}

function writeJSON(key, value) {
  try {
    getStorage()?.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

function removeItem(key) {
  try {
    getStorage()?.removeItem(key)
    return true
  } catch {
    return false
  }
}

function createId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

function clean(value) {
  return String(value ?? '').trim()
}

export function getAccounts() {
  const accounts = readJSON(ACCOUNTS_KEY, [])
  return Array.isArray(accounts) ? accounts : []
}

export function phoneExists(phoneNumber, excludeId = null) {
  const phone = normalizePhone(phoneNumber)
  if (!phone) return false
  return getAccounts().some(
    (account) => account.phoneNumber === phone && account.id !== excludeId,
  )
}

export function findAccountByPhone(phoneNumber) {
  const phone = normalizePhone(phoneNumber)
  return getAccounts().find((account) => account.phoneNumber === phone) ?? null
}

export function getAccountById(accountId) {
  return getAccounts().find((account) => account.id === accountId) ?? null
}

export function registerStudent(details) {
  const phoneNumber = normalizePhone(details.phoneNumber)

  if (phoneExists(phoneNumber)) {
    return {
      ok: false,
      error: 'This phone number already has a Clone School account.',
    }
  }

  const account = {
    id: createId(),
    firstName: clean(details.firstName),
    fatherName: clean(details.fatherName),
    grandfatherName: clean(details.grandfatherName),
    gender: clean(details.gender),
    phoneNumber,
    grade: clean(details.grade),
    stream: FINAL_GRADES.includes(clean(details.grade)) ? clean(details.stream) : '',
    schoolName: clean(details.schoolName) || DEFAULT_SCHOOL_NAME,
    parentFullName: clean(details.parentFullName),
    parentPhoneNumber: normalizePhone(details.parentPhoneNumber),
    password: String(details.password ?? ''),
    createdAt: new Date().toISOString(),
  }

  const accounts = getAccounts()
  const saved = writeJSON(ACCOUNTS_KEY, [...accounts, account])

  if (!saved) {
    return { ok: false, error: 'Browser storage is unavailable. Please try again.' }
  }

  return { ok: true, account }
}

export function updateStudentAccount(accountId, updates = {}) {
  const existing = getAccountById(accountId)
  if (!existing) return { ok: false, error: 'Account not found.' }

  const phoneNumber = normalizePhone(updates.phoneNumber ?? existing.phoneNumber)
  if (!phoneNumber) return { ok: false, error: 'Enter a valid phone number.' }
  if (phoneExists(phoneNumber, accountId)) {
    return { ok: false, error: 'This phone number already has a Clone School account.' }
  }

  const grade = clean(updates.grade ?? existing.grade)
  const updated = {
    ...existing,
    firstName: clean(updates.firstName ?? existing.firstName),
    fatherName: clean(updates.fatherName ?? existing.fatherName),
    grandfatherName: clean(updates.grandfatherName ?? existing.grandfatherName),
    gender: clean(updates.gender ?? existing.gender),
    phoneNumber,
    grade,
    stream: FINAL_GRADES.includes(grade) ? clean(updates.stream ?? existing.stream) : '',
    schoolName: clean(updates.schoolName ?? existing.schoolName) || DEFAULT_SCHOOL_NAME,
    parentFullName: clean(updates.parentFullName ?? existing.parentFullName),
    parentPhoneNumber: normalizePhone(updates.parentPhoneNumber ?? existing.parentPhoneNumber),
  }

  const accounts = getAccounts().map((account) => (account.id === accountId ? updated : account))
  if (!writeJSON(ACCOUNTS_KEY, accounts)) {
    return { ok: false, error: 'Browser storage is unavailable. Please try again.' }
  }

  if (getRememberedPhone() === existing.phoneNumber && phoneNumber !== existing.phoneNumber) {
    writeJSON(REMEMBERED_PHONE_KEY, phoneNumber)
  }

  return { ok: true, account: updated }
}

export function changeStudentPassword(accountId, { currentPassword, newPassword } = {}) {
  const existing = getAccountById(accountId)
  if (!existing) return { ok: false, error: 'Account not found.' }
  if (existing.password !== String(currentPassword ?? '')) {
    return { ok: false, error: 'Current password is incorrect.' }
  }
  const error = validatePassword(newPassword)
  if (error) return { ok: false, error }

  const accounts = getAccounts().map((account) =>
    account.id === accountId ? { ...account, password: String(newPassword) } : account,
  )
  if (!writeJSON(ACCOUNTS_KEY, accounts)) {
    return { ok: false, error: 'Browser storage is unavailable. Please try again.' }
  }
  return { ok: true }
}

export function deleteStudentAccount(accountId) {
  const existing = getAccountById(accountId)
  if (!existing) return { ok: false, error: 'Account not found.' }

  const accounts = getAccounts().filter((account) => account.id !== accountId)
  if (!writeJSON(ACCOUNTS_KEY, accounts)) {
    return { ok: false, error: 'Browser storage is unavailable. Please try again.' }
  }

  let removedProgress = false
  if (!accounts.length) {
    const progressKeys = [
      'clone-school.learning-progress.v1',
      'clone-school.game-progress.v1',
      'clone-school.euee-progress.v1',
      'clone-school.euee-archive.v1',
      'clone-school.notifications.v1',
      'clone-school.achievements.v1',
      'clone-school.daily-progress.v1',
      'clone-school.settings.v1',
    ]
    progressKeys.forEach((key) => {
      removeItem(key)
    })
    removedProgress = true
  }

  logoutStudent()
  if (getRememberedPhone() === existing.phoneNumber) removeItem(REMEMBERED_PHONE_KEY)
  return { ok: true, removedProgress }
}

export function loginStudent(credentials, remember = false) {
  const account = findAccountByPhone(credentials.phoneNumber)

  if (!account) {
    return { ok: false, error: 'No account found for this phone number.' }
  }

  if (account.password !== String(credentials.password ?? '')) {
    return { ok: false, error: 'Incorrect password. Please try again.' }
  }

  const session = {
    accountId: account.id,
    issuedAt: new Date().toISOString(),
    remember: Boolean(remember),
  }

  writeJSON(SESSION_KEY, session)

  if (remember) {
    writeJSON(REMEMBERED_PHONE_KEY, account.phoneNumber)
  } else {
    removeItem(REMEMBERED_PHONE_KEY)
  }

  return { ok: true, account, session }
}

export function restoreSession() {
  const session = readJSON(SESSION_KEY, null)
  if (!session?.accountId) return null
  if (!getAccountById(session.accountId)) {
    logoutStudent()
    return null
  }
  return session
}

export function getCurrentStudent() {
  const session = restoreSession()
  if (!session) return null
  return getAccountById(session.accountId)
}

export function getRememberedPhone() {
  try {
    const rawValue = getStorage()?.getItem(REMEMBERED_PHONE_KEY)
    if (!rawValue) return ''
    return JSON.parse(rawValue)
  } catch {
    return ''
  }
}

export function logoutStudent() {
  return removeItem(SESSION_KEY)
}
