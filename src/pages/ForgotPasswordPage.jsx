import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Info, KeyRound, Phone } from 'lucide-react'
import AuthCard from '../components/auth/AuthCard'
import Button from '../components/common/Button'
import TextField from '../components/common/TextField'
import AuthLayout from '../layouts/AuthLayout'
import { findAccountByPhone } from '../services/authService'
import { validatePhone } from '../utils/validation'
import './ForgotPasswordPage.css'

function ForgotPasswordPage() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const phoneError = validatePhone(phoneNumber)
    setError(phoneError)
    setMessage('')

    if (phoneError) return

    const account = findAccountByPhone(phoneNumber)
    setMessage(
      account
        ? 'This phone number belongs to a demo account. Real password recovery requires a secure backend, so no SMS or OTP has been sent.'
        : 'No demo account found for this phone number. Check the number or create a student account first.',
    )
  }

  return (
    <AuthLayout>
      <AuthCard
        badge="Password help"
        badgeIcon={KeyRound}
        title="Forgot password?"
        subtitle="Check whether a demo account exists for your phone number."
        titleId="forgot-password-title"
        footer={
          <Link className="auth-footer__link" to="/login">
            Back to sign in
          </Link>
        }
      >
        <form className="auth-form forgot-form" onSubmit={handleSubmit} noValidate>
          <TextField
            id="forgot-phone"
            label="Phone number"
            icon={Phone}
            type="tel"
            inputMode="tel"
            placeholder="0912345678"
            autoComplete="tel"
            value={phoneNumber}
            onChange={(event) => {
              setPhoneNumber(event.target.value)
              setError('')
              setMessage('')
            }}
            error={error}
          />

          <Button className="auth-form__submit" type="submit" icon={Info}>
            Check demo account
          </Button>

          {message && (
            <div className="forgot-form__message" role="status">
              <Info size={17} aria-hidden="true" />
              <span>{message}</span>
            </div>
          )}

          <Link className="auth-form__link forgot-form__back" to="/login">
            <ArrowLeft size={14} aria-hidden="true" />
            Return to login
          </Link>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}

export default ForgotPasswordPage
