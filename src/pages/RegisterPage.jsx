import { Link } from 'react-router-dom'
import { UserRound } from 'lucide-react'
import AuthCard from '../components/auth/AuthCard'
import RegisterForm from '../components/auth/RegisterForm'
import AuthLayout from '../layouts/AuthLayout'
import './RegisterPage.css'

function RegisterPage() {
  return (
    <AuthLayout>
      <AuthCard
        badge="Student registration"
        badgeIcon={UserRound}
        title="Create your account"
        subtitle="Three quick steps to set up your Clone School student profile."
        titleId="register-title"
        className="auth-card--register"
        footer={
          <p>
            Already have an account?{' '}
            <Link className="auth-footer__link" to="/login">
              Sign in instead
            </Link>
          </p>
        }
      >
        <RegisterForm />
      </AuthCard>
    </AuthLayout>
  )
}

export default RegisterPage
