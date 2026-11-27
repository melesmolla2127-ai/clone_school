import { useState } from 'react'
import { CheckCircle2, LockKeyhole } from 'lucide-react'
import Button from '../common/Button'
import TextField from '../common/TextField'
import { validateChoice, validateConfirmPassword, validatePassword } from '../../utils/validation.js'
import './PasswordChangeForm.css'

const EMPTY_VALUES = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}

function PasswordChangeForm({ onChangePassword }) {
  const [values, setValues] = useState(() => ({ ...EMPTY_VALUES }))
  const [errors, setErrors] = useState({})
  const [feedback, setFeedback] = useState('')
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  const updateField = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
    setFeedback('')
    setFormError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (saving) return

    const nextErrors = {
      currentPassword: validateChoice(values.currentPassword, 'Current password'),
      newPassword: validatePassword(values.newPassword),
      confirmPassword: validateConfirmPassword(values.newPassword, values.confirmPassword),
    }
    const filteredErrors = Object.fromEntries(Object.entries(nextErrors).filter(([, message]) => message))

    setErrors(filteredErrors)
    setFeedback('')
    setFormError('')

    if (Object.keys(filteredErrors).length) return

    setSaving(true)
    const result = onChangePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    })
    setSaving(false)

    if (!result.ok) {
      setFormError(result.error)
      return
    }

    setValues({ ...EMPTY_VALUES })
    setFeedback('Password changed successfully.')
  }

  return (
    <form className="password-change-form" onSubmit={handleSubmit} noValidate>
      <div className="password-change-form__fields">
        <TextField
          id="current-password"
          label="Current password"
          icon={LockKeyhole}
          type="password"
          autoComplete="current-password"
          placeholder="Enter current password"
          value={values.currentPassword}
          onChange={(event) => updateField('currentPassword', event.target.value)}
          error={errors.currentPassword}
        />
        <TextField
          id="new-password"
          label="New password"
          icon={LockKeyhole}
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={values.newPassword}
          onChange={(event) => updateField('newPassword', event.target.value)}
          error={errors.newPassword}
        />
        <TextField
          id="confirm-password"
          label="Confirm password"
          icon={LockKeyhole}
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter new password"
          value={values.confirmPassword}
          onChange={(event) => updateField('confirmPassword', event.target.value)}
          error={errors.confirmPassword}
        />
      </div>

      {formError && (
        <p className="password-change-form__error" role="alert">
          {formError}
        </p>
      )}
      {feedback && (
        <p className="password-change-form__feedback" role="status">
          <CheckCircle2 size={16} aria-hidden="true" />
          {feedback}
        </p>
      )}

      <Button className="password-change-form__submit" type="submit" disabled={saving} aria-busy={saving}>
        Change password
      </Button>
    </form>
  )
}

export default PasswordChangeForm
