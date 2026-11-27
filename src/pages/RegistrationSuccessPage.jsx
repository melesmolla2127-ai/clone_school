import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Check, ShieldCheck } from 'lucide-react'
import AuthCard from '../components/auth/AuthCard'
import Button from '../components/common/Button'
import AuthLayout from '../layouts/AuthLayout'
import './RegistrationSuccessPage.css'

function RegistrationSuccessPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const studentName = location.state?.studentName
  const title = studentName ? `Welcome, ${studentName}!` : 'Welcome to Clone School!'

  return (
    <AuthLayout>
      <AuthCard
        badge="Account created"
        badgeIcon={ShieldCheck}
        title={title}
        subtitle="Your student account was created successfully."
        titleId="registration-success-title"
        footer={
          <p>
            Demo only — your account is saved in this browser.
          </p>
        }
      >
        <div className="registration-success">
          <div className="registration-success__icon" aria-hidden="true">
            <span />
            <Check size={38} strokeWidth={2.6} />
          </div>
          <p className="registration-success__message">
            You can now sign in with your phone number and password.
          </p>
          <Button
            className="registration-success__button"
            type="button"
            icon={ArrowRight}
            onClick={() => navigate('/login', { replace: true })}
          >
            Go to login
          </Button>
        </div>
      </AuthCard>
    </AuthLayout>
  )
}

export default RegistrationSuccessPage
