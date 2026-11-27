import { BookOpen } from 'lucide-react'
import { Navigate, useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import ComingSoonPage from '../components/common/ComingSoonPage'
import { getLastStudied } from '../services/learningProgress'
import './ContinueLearningPage.css'

function buildPath(subjectId, unitId, grade, stream) {
  const params = new URLSearchParams()
  if (grade) params.set('grade', grade)
  if (stream) params.set('stream', stream)
  const suffix = params.toString()
  return `/courses/${subjectId}${unitId ? `/${unitId}` : ''}${suffix ? `?${suffix}` : ''}`
}

function ContinueLearningPage() {
  const navigate = useNavigate()
  const lastStudied = getLastStudied()

  if (lastStudied?.subjectId) {
    return <Navigate to={buildPath(lastStudied.subjectId, lastStudied.unitId, lastStudied.grade, lastStudied.stream)} replace />
  }

  return (
    <ComingSoonPage
      icon={BookOpen}
      title="Continue Learning"
      description="Open a course to start tracking your progress. Your last subject and unit will appear here."
    >
      <div className="continue-redirect__action">
        <Button type="button" onClick={() => navigate('/courses')}>
          Browse courses
        </Button>
      </div>
    </ComingSoonPage>
  )
}

export default ContinueLearningPage
