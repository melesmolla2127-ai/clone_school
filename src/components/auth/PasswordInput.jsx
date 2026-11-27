import { useState } from 'react'
import { Eye, EyeOff, LockKeyhole } from 'lucide-react'
import TextField from '../common/TextField'
import './PasswordInput.css'

function PasswordInput({ id = 'password', label = 'Password', icon: Icon = LockKeyhole, ...fieldProps }) {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setVisible((current) => !current)
  }

  return (
    <TextField
      id={id}
      label={label}
      icon={Icon}
      type={visible ? 'text' : 'password'}
      action={
        <button
          className="password-toggle"
          type="button"
          onClick={toggleVisibility}
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          aria-pressed={visible}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      }
      {...fieldProps}
    />
  )
}

export default PasswordInput
