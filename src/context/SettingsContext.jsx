import { useCallback, useEffect, useMemo, useState } from 'react'
import SettingsContext from './settingsContextDefinition.js'
import { translate } from '../data/i18n/translations.js'
import {
  applySettings,
  getSettings,
  subscribeToSystemTheme,
  updateSettings,
} from '../services/settingsService.js'

export default function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const initial = getSettings()
    applySettings(initial)
    return initial
  })

  useEffect(() => {
    applySettings(settings)
  }, [settings])

  useEffect(
    () =>
      subscribeToSystemTheme(() => {
        if (getSettings().theme === 'system') setSettings(getSettings())
      }),
    [],
  )

  const saveSettings = useCallback((patch) => {
    const next = updateSettings(patch)
    setSettings(next)
    return next
  }, [])

  const t = useCallback((key) => translate(settings.language, key), [settings.language])

  const value = useMemo(
    () => ({ settings, saveSettings, t }),
    [settings, saveSettings, t],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}
