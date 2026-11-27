import { useEffect, useRef, useState } from 'react'
import {
  AlertCircle,
  BookOpen,
  Building2,
  CheckCircle2,
  GraduationCap,
  Phone,
  UserRound,
  Users,
} from 'lucide-react'
import { Navigate, useNavigate } from 'react-router-dom'
import PageHeader from '../components/courses/PageHeader'
import Button from '../components/common/Button'
import SelectField from '../components/common/SelectField'
import TextField from '../components/common/TextField'
import {
  DEFAULT_SCHOOL_NAME,
  GENDER_OPTIONS,
  GRADE_OPTIONS,
  STREAM_OPTIONS,
} from '../data/options.js'
import useAuth from '../hooks/useAuth'
import useNotifications from '../hooks/useNotifications'
import {
  normalizePhone,
  requiresStream,
  validateChoice,
  validateName,
  validatePhone,
} from '../utils/validation.js'
import './EditProfilePage.css'

const EMPTY_VALUES = {
  firstName: '',
  fatherName: '',
  grandfatherName: '',
  phoneNumber: '',
  gender: '',
  grade: '',
  stream: '',
  schoolName: DEFAULT_SCHOOL_NAME,
  parentFullName: '',
  parentPhoneNumber: '',
}

function createValues(student) {
  if (!student) return { ...EMPTY_VALUES }

  return {
    firstName: student.firstName ?? '',
    fatherName: student.fatherName ?? '',
    grandfatherName: student.grandfatherName ?? '',
    phoneNumber: student.phoneNumber ?? '',
    gender: student.gender ?? '',
    grade: student.grade ?? '',
    stream: student.stream ?? '',
    schoolName: student.schoolName || DEFAULT_SCHOOL_NAME,
    parentFullName: student.parentFullName ?? '',
    parentPhoneNumber: student.parentPhoneNumber ?? '',
  }
}

function EditProfilePage() {
  const { student, updateProfile } = useAuth()
  const { notify } = useNotifications()
  const navigate = useNavigate()
  const timerRef = useRef(null)

  const [values, setValues] = useState(() => createValues(student))
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  if (!student) return <Navigate to="/login" replace />

  const updateField = (name, value) => {
    setValues((current) => {
      const next = { ...current, [name]: value }
      if (name === 'grade' && !requiresStream(value)) next.stream = ''
      return next
    })
    setErrors((current) => ({ ...current, [name]: '' }))
    setFormError('')
    setFeedback('')
  }

  const validate = () => {
    const nextErrors = {
      firstName: validateName(values.firstName, 'First name'),
      fatherName: validateName(values.fatherName, "Father's name"),
      grandfatherName: validateName(values.grandfatherName, "Grandfather's name"),
      gender: validateChoice(values.gender, 'Gender'),
      phoneNumber: validatePhone(values.phoneNumber),
      grade: validateChoice(values.grade, 'Grade'),
      schoolName: validateName(values.schoolName, 'School name'),
      parentFullName: validateName(values.parentFullName, 'Parent full name'),
      parentPhoneNumber: validatePhone(values.parentPhoneNumber, 'Parent phone number'),
    }

    if (requiresStream(values.grade)) {
      nextErrors.stream = validateChoice(values.stream, 'Stream')
    }

    return Object.fromEntries(Object.entries(nextErrors).filter(([, message]) => message))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (submitting) return

    const nextErrors = validate()
    setErrors(nextErrors)
    setFormError('')
    setFeedback('')

    if (Object.keys(nextErrors).length) return

    setSubmitting(true)
    const result = updateProfile({
      firstName: values.firstName.trim(),
      fatherName: values.fatherName.trim(),
      grandfatherName: values.grandfatherName.trim(),
      phoneNumber: normalizePhone(values.phoneNumber),
      gender: values.gender,
      grade: values.grade,
      stream: requiresStream(values.grade) ? values.stream : '',
      schoolName: values.schoolName.trim(),
      parentFullName: values.parentFullName.trim(),
      parentPhoneNumber: normalizePhone(values.parentPhoneNumber),
    })

    if (!result.ok) {
      setSubmitting(false)
      setFormError(result.error)
      return
    }

    setFeedback('Profile updated successfully.')
    notify({
      category: 'system',
      title: 'Profile updated',
      message: 'Your profile details were saved.',
      actionPath: '/profile',
      iconName: 'UserRound',
      eventKey: 'profile-updated',
    })
    timerRef.current = window.setTimeout(() => navigate('/profile', { replace: true }), 900)
  }

  return (
    <div className="edit-profile-page">
      <PageHeader
        kicker="Account"
        title="Edit profile"
        description="Update your personal, school, and parent details. Password and account records stay unchanged."
        backTo="/profile"
      />

      <form className="edit-profile-page__form" onSubmit={handleSubmit} noValidate>
        {formError && (
          <div className="edit-profile-page__alert" role="alert">
            <AlertCircle size={17} aria-hidden="true" />
            <span>{formError}</span>
          </div>
        )}
        {feedback && (
          <div className="edit-profile-page__feedback" role="status">
            <CheckCircle2 size={17} aria-hidden="true" />
            <span>{feedback}</span>
          </div>
        )}

        <div className="edit-profile-page__group">
          <h2>Student details</h2>
          <div className="edit-profile-page__grid">
            <TextField
              id="edit-first-name"
              label="First name"
              icon={UserRound}
              autoComplete="given-name"
              value={values.firstName}
              onChange={(event) => updateField('firstName', event.target.value)}
              error={errors.firstName}
            />
            <TextField
              id="edit-father-name"
              label="Father's name"
              icon={Users}
              value={values.fatherName}
              onChange={(event) => updateField('fatherName', event.target.value)}
              error={errors.fatherName}
            />
            <TextField
              id="edit-grandfather-name"
              label="Grandfather's name"
              icon={Users}
              value={values.grandfatherName}
              onChange={(event) => updateField('grandfatherName', event.target.value)}
              error={errors.grandfatherName}
            />
            <SelectField
              id="edit-gender"
              label="Gender"
              icon={UserRound}
              options={GENDER_OPTIONS}
              placeholder="Select gender"
              value={values.gender}
              onChange={(event) => updateField('gender', event.target.value)}
              error={errors.gender}
            />
            <TextField
              id="edit-phone"
              label="Phone number"
              icon={Phone}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={values.phoneNumber}
              onChange={(event) => updateField('phoneNumber', event.target.value)}
              error={errors.phoneNumber}
            />
          </div>
        </div>

        <div className="edit-profile-page__group">
          <h2>School details</h2>
          <div className="edit-profile-page__grid">
            <SelectField
              id="edit-grade"
              label="Grade"
              icon={GraduationCap}
              options={GRADE_OPTIONS}
              placeholder="Select grade"
              value={values.grade}
              onChange={(event) => updateField('grade', event.target.value)}
              error={errors.grade}
            />
            <SelectField
              id="edit-stream"
              label="Stream"
              icon={BookOpen}
              options={STREAM_OPTIONS}
              placeholder="Select stream"
              value={values.stream}
              onChange={(event) => updateField('stream', event.target.value)}
              error={errors.stream}
            />
            <TextField
              id="edit-school"
              label="School name"
              icon={Building2}
              className="edit-profile-page__field--full"
              autoComplete="organization"
              value={values.schoolName}
              onChange={(event) => updateField('schoolName', event.target.value)}
              error={errors.schoolName}
            />
          </div>
          <p className="edit-profile-page__hint">Stream is required for grades 11 and 12.</p>
        </div>

        <div className="edit-profile-page__group">
          <h2>Parent or guardian</h2>
          <div className="edit-profile-page__grid">
            <TextField
              id="edit-parent-name"
              label="Parent full name"
              icon={UserRound}
              className="edit-profile-page__field--full"
              value={values.parentFullName}
              onChange={(event) => updateField('parentFullName', event.target.value)}
              error={errors.parentFullName}
            />
            <TextField
              id="edit-parent-phone"
              label="Parent phone number"
              icon={Phone}
              type="tel"
              inputMode="tel"
              className="edit-profile-page__field--full"
              value={values.parentPhoneNumber}
              onChange={(event) => updateField('parentPhoneNumber', event.target.value)}
              error={errors.parentPhoneNumber}
            />
          </div>
        </div>

        <div className="edit-profile-page__actions">
          <Button type="button" variant="secondary" onClick={() => navigate('/profile')} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" icon={CheckCircle2} disabled={submitting} aria-busy={submitting}>
            Save changes
          </Button>
        </div>
      </form>
    </div>
  )
}

export default EditProfilePage
