import { useCallback, useMemo, useState } from 'react'
import AuthContext from './authContextDefinition.js'
import {
  changeStudentPassword,
  deleteStudentAccount,
  getCurrentStudent,
  loginStudent,
  logoutStudent,
  registerStudent,
  restoreSession,
  updateStudentAccount,
} from '../services/authService'

function AuthProvider({ children }) {
  const [session, setSession] = useState(() => restoreSession())
  const [_revision, setRevision] = useState(0)

  const student = session ? getCurrentStudent() : null

  const signUp = useCallback((details) => registerStudent(details), [])

  const signIn = useCallback((credentials, remember = false) => {
    const result = loginStudent(credentials, remember)
    if (result.ok) setSession(result.session)
    return result
  }, [])

  const signOut = useCallback(() => {
    logoutStudent()
    setSession(null)
  }, [])

  const updateProfile = useCallback(
    (details) => {
      const result = updateStudentAccount(session?.accountId, details)
      if (result.ok) setRevision((value) => value + 1)
      return result
    },
    [session],
  )

  const changePassword = useCallback(
    (passwords) => changeStudentPassword(session?.accountId, passwords),
    [session],
  )

  const deleteAccount = useCallback(() => {
    const result = deleteStudentAccount(session?.accountId)
    if (result.ok) setSession(null)
    return result
  }, [session])

  const value = useMemo(
    () => ({
      session,
      student,
      isAuthenticated: Boolean(session && student),
      signUp,
      signIn,
      signOut,
      updateProfile,
      changePassword,
      deleteAccount,
    }),
    [session, student, signUp, signIn, signOut, updateProfile, changePassword, deleteAccount],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
