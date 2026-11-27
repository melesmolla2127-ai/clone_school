import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  GraduationCap,
  Phone,
  UserRound,
  Users,
} from 'lucide-react'
import {
  DEFAULT_SCHOOL_NAME,
  GENDER_OPTIONS,
  GRADE_OPTIONS,
  STREAM_OPTIONS,
} from '../../data/options'
import useAuth from '../../hooks/useAuth'
import { phoneExists } from '../../services/authService'
import {
  requiresStream,
  validateParentStep,
  validateSecurityStep,
  validateStudentStep,
} from '../../utils/validation'
import Button from '../common/Button'
import LoadingIndicator from '../common/LoadingIndicator'
import SelectField from '../common/SelectField'
import TextField from '../common/TextField'
import PasswordInput from './PasswordInput'
import StepProgress from './StepProgress'
import './AuthForm.css'
import './RegisterForm.css'

const INITIAL_VALUES = {
  firstName: '',
  fatherName: '',
  grandfatherName: '',
  gender: '',
  phoneNumber: '',
  grade: '',
  stream: '',
  schoolName: DEFAULT_SCHOOL_NAME,
  parentFullName: '',
  parentPhoneNumber: '',
  password: '',
  confirmPassword: '',
}

function RegisterForm() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const timerRef = useRef(null)

  const [step, setStep] = useState(1)
  const [values, setValues] = useState(() => ({ ...INITIAL_VALUES }))
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  const updateField = (name, value) => {
    setValues((current) => {
      const next = { ...current, [name]: value }
      if (name === 'grade' && !requiresStream(value)) next.stream = ''
      return next
    })
    setErrors((current) => ({ ...current, [name]: '' }))
    setFormError('')
  }

  const validateCurrentStep = () => {
    if (step === 1) return validateStudentStep(values, phoneExists)
    if (step === 2) return validateParentStep(values)
    return validateSecurityStep(values)
  }

  const handleBack = () => {
    setErrors({})
    setFormError('')
    setStep((current) => Math.max(1, current - 1))
  }

  const submitLabel = step === 3 ? 'Create student account' : 'Continue'

  const handleSubmit = (event) => {
    event.preventDefault()
    if (submitting) return

    const nextErrors = validateCurrentStep()
    setErrors(nextErrors)
    setFormError('')

    if (Object.keys(nextErrors).length > 0) return

    if (step < 3) {
      setStep((current) => current + 1)
      return
    }

    setSubmitting(true)
    timerRef.current = window.setTimeout(() => {
      const result = signUp(values)
      setSubmitting(false)

      if (!result.ok) {
        setFormError(result.error)
        setStep(1)
        return
      }

      navigate('/register/success', {
        replace: true,
        state: { studentName: result.account.firstName },
      })
    }, 650)
  }

  return (
    <form className="auth-form register-form" onSubmit={handleSubmit} noValidate>
      <StepProgress current={step} />

      {formError && (
        <div className="auth-form__alert" role="alert">
          <AlertCircle size={17} aria-hidden="true" />
          <span>{formError}</span>
        </div>
      )}

      {step === 1 && (
        <div className="register-form__step" key="student">
          <div className="register-form__grid">
            <TextField
              id="firstName"
              label="First name"
              icon={UserRound}
              placeholder="e.g. Abel"
              autoComplete="given-name"
              value={values.firstName}
              onChange={(event) => updateField('firstName', event.target.value)}
              error={errors.firstName}
            />
            <TextField
              id="fatherName"
              label="Father's name"
              icon={Users}
              placeholder="e.g. Tesfaye"
              value={values.fatherName}
              onChange={(event) => updateField('fatherName', event.target.value)}
              error={errors.fatherName}
            />
            <TextField
              id="grandfatherName"
              label="Grandfather's name"
              icon={Users}
              placeholder="e.g. Gebre"
              value={values.grandfatherName}
              onChange={(event) => updateField('grandfatherName', event.target.value)}
              error={errors.grandfatherName}
            />
            <SelectField
              id="gender"
              label="Gender"
              icon={UserRound}
              options={GENDER_OPTIONS}
              placeholder="Select gender"
              value={values.gender}
              onChange={(event) => updateField('gender', event.target.value)}
              error={errors.gender}
            />
            <TextField
              id="register-phone"
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
            <SelectField
              id="grade"
              label="Grade"
              icon={GraduationCap}
              options={GRADE_OPTIONS}
              placeholder="Select grade"
              value={values.grade}
              onChange={(event) => updateField('grade', event.target.value)}
              error={errors.grade}
            />
            {requiresStream(values.grade) && (
              <SelectField
                id="stream"
                label="Stream"
                icon={BookOpen}
                options={STREAM_OPTIONS}
                placeholder="Select stream"
                className="register-form__field--full"
                value={values.stream}
                onChange={(event) => updateField('stream', event.target.value)}
                error={errors.stream}
              />
            )}
            <TextField
              id="schoolName"
              label="School name"
              icon={Building2}
              placeholder={DEFAULT_SCHOOL_NAME}
              autoComplete="organization"
              className="register-form__field--full"
              value={values.schoolName}
              onChange={(event) => updateField('schoolName', event.target.value)}
              error={errors.schoolName}
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="register-form__step" key="parent">
          <div className="register-form__info">
            <Users size={18} aria-hidden="true" />
            <span>We only use parent details for demo record-keeping in this browser.</span>
          </div>
          <div className="register-form__grid">
            <TextField
              id="parentFullName"
              label="Parent full name"
              icon={UserRound}
              placeholder="e.g. Tesfaye Gebre"
              className="register-form__field--full"
              value={values.parentFullName}
              onChange={(event) => updateField('parentFullName', event.target.value)}
              error={errors.parentFullName}
            />
            <TextField
              id="parentPhoneNumber"
              label="Parent phone number"
              icon={Phone}
              type="tel"
              inputMode="tel"
              placeholder="0912345678"
              className="register-form__field--full"
              value={values.parentPhoneNumber}
              onChange={(event) => updateField('parentPhoneNumber', event.target.value)}
              error={errors.parentPhoneNumber}
            />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="register-form__step" key="security">
          <PasswordInput
            id="register-password"
            label="Password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            value={values.password}
            onChange={(event) => updateField('password', event.target.value)}
            error={errors.password}
          />
          <p className="auth-form__hint">Use at least 8 characters with a letter and a number.</p>
          <PasswordInput
            id="confirmPassword"
            label="Confirm password"
            placeholder="Re-enter your password"
            autoComplete="new-password"
            value={values.confirmPassword}
            onChange={(event) => updateField('confirmPassword', event.target.value)}
            error={errors.confirmPassword}
          />
          <div className="register-form__info">
            <AlertCircle size={18} aria-hidden="true" />
            <span>This is a frontend demo. Do not use a real password.</span>
          </div>
        </div>
      )}

      <div className="register-form__actions">
        {step > 1 && (
          <Button
            type="button"
            variant="secondary"
            icon={ArrowLeft}
            onClick={handleBack}
            disabled={submitting}
          >
            Back
          </Button>
        )}
        <Button
          className="auth-form__submit"
          type="submit"
          disabled={submitting}
          icon={submitting ? undefined : ArrowRight}
          aria-busy={submitting}
        >
          {submitting ? <LoadingIndicator label="Creating account" /> : submitLabel}
        </Button>
      </div>
    </form>
  )
}

export default RegisterForm
