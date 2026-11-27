import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function useDelayedNavigate(to, delay = 3000) {
  const navigate = useNavigate()

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      navigate(to, { replace: true })
    }, delay)

    return () => window.clearTimeout(timeoutId)
  }, [delay, navigate, to])
}

export default useDelayedNavigate
