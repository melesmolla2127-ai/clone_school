import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, ArrowRight, Phone, ShieldCheck } from 'lucide-react'
import { getRememberedPhone } from '../../services/authService'
import useAuth from '../../hooks/useAuth'
import { validateLogin } from '../../utils/validation'
import Button from '../common/Button'
import LoadingIndicator from '../common/LoadingIndicator'
import TextField from '../common/TextField'
import CheckboxField from './CheckboxField'
import PasswordInput from './PasswordInput'
import './AuthForm.css'
import './LoginForm.css'

function LoginForm() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const timerRef = useRef(null)

  const [values, setValues] = useState(() => ({
    phoneNumber: getRememberedPhone(),
    password: '',
  }))
  const [remember, setRemember] = useState(() => Boolean(getRememberedPhone()))
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  const updateField = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
    setFormError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (submitting) return

    const nextErrors = validateLogin(values)
    setErrors(nextErrors)
    setFormError('')

    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    timerRef.current = window.setTimeout(() => {
      const result = signIn(values, remember)
      setSubmitting(false)

      if (!result.ok) {
        setFormError(result.error)
        return
      }

      navigate('/home', { replace: true })
    }, 650)
  }

  return (
    <form className="auth-form login-form" onSubmit={handleSubmit} noValidate>
      {formError && (
        <div className="auth-form__alert" role="alert">
          <AlertCircle size={17} aria-hidden="true" />
          <span>{formError}</span>
        </div>
      )}

      <TextField
        id="login-phone"
        label="Phone number"
        icon={Phone}
        type="tel"
        inputMode="tel"
        placeholder="0912345678"
        autoComplete="tel"
        value={values.phoneNumber}
        onChange={(event) => updateField('phoneNumber', event.target.value)}
        error={errors.phoneNumber}
      />

      <PasswordInput
        id="login-password"
        label="Password"
        placeholder="Enter your password"
        autoComplete="current-password"
        value={values.password}
        onChange={(event) => updateField('password', event.target.value)}
        error={errors.password}
      />

      <div className="auth-form__row">
        <CheckboxField
          id="remember-me"
          label="Remember me"
          checked={remember}
          onChange={(event) => setRemember(event.target.checked)}
        />
        <Link className="auth-form__link" to="/forgot-password">
          Forgot password?
        </Link>
      </div>

      <Button
        className="auth-form__submit"
        type="submit"
        disabled={submitting}
        icon={submitting ? undefined : ArrowRight}
        aria-busy={submitting}
      >
        {submitting ? <LoadingIndicator label="Signing in" /> : 'Sign in'}
      </Button>

      <div className="login-form__demo-note">
        <ShieldCheck size={15} aria-hidden="true" />
        Demo only — accounts are stored in this browser.
      </div>
    </form>
  )
}

export default LoginForm
