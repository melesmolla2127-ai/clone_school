import { BellRing, Clock3 } from 'lucide-react'
import Button from '../common/Button'
import ToggleRow from './ToggleRow'
import './BrowserReminderCard.css'

function BrowserReminderCard({ enabled, permission, onToggle, onRequestPermission }) {
  return (
    <div className="browser-reminder">
      <div className="browser-reminder__header">
        <span className="browser-reminder__icon" aria-hidden="true">
          <BellRing size={18} />
        </span>
        <div>
          <strong>Browser reminders</strong>
          <p>Frontend-only reminders do not work when the browser is closed.</p>
        </div>
      </div>

      <ToggleRow
        id="browser-reminders-enabled"
        label="Enable browser reminders"
        description="Show reminders while this app is open."
        checked={enabled}
        onChange={onToggle}
      />

      <div className="browser-reminder__footer">
        <span className="browser-reminder__permission">
          <Clock3 size={14} aria-hidden="true" />
          Permission: {permission}
        </span>
        <Button type="button" variant="secondary" onClick={onRequestPermission} disabled={permission === 'unsupported'}>
          Enable browser notifications
        </Button>
      </div>
    </div>
  )
}

export default BrowserReminderCard
