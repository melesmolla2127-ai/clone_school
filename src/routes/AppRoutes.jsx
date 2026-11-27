import { Navigate, Route, Routes } from 'react-router-dom'
import { BrainCircuit, CalendarDays } from 'lucide-react'
import AppLayout from '../layouts/AppLayout'
import ComingSoonPage from '../components/common/ComingSoonPage'
import ContinueLearningPage from '../pages/ContinueLearningPage'
import CoursesPage from '../pages/CoursesPage'
import EditProfilePage from '../pages/EditProfilePage'
import EUEEArchiveExamPage from '../pages/euee/EUEEArchiveExamPage'
import EUEEArchivePage from '../pages/euee/EUEEArchivePage'
import EUEEArchiveResultsPage from '../pages/euee/EUEEArchiveResultsPage'
import EUEEExamPage from '../pages/EUEEExamPage'
import EUEEPage from '../pages/EUEEPage'
import EUEEPracticePage from '../pages/EUEEPracticePage'
import EUEEResultsPage from '../pages/EUEEResultsPage'
import ForgotPasswordPage from '../pages/ForgotPasswordPage'
import GamePage from '../pages/GamePage'
import GamesPage from '../pages/GamesPage'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import NotificationsPage from '../pages/NotificationsPage'
import PracticeRedirect from '../pages/PracticeRedirect'
import ProfilePage from '../pages/ProfilePage'
import SettingsPage from '../pages/SettingsPage'
import QuestionPracticePage from '../pages/QuestionPracticePage'
import RegisterPage from '../pages/RegisterPage'
import RegistrationSuccessPage from '../pages/RegistrationSuccessPage'
import ScholarCoursePage from '../pages/ScholarCoursePage'
import SplashPage from '../pages/SplashPage'
import SubjectPage from '../pages/SubjectPage'
import UnitPage from '../pages/UnitPage'
import ProtectedRoute from './ProtectedRoute'

const featurePlaceholders = [
  {
    path: '/ai-assistant',
    title: 'AI Study Assistant',
    description: 'The study assistant conversation will arrive in a future stage.',
    icon: BrainCircuit,
  },
  {
    path: '/schedule',
    title: 'Study Schedule',
    description: 'Planning tools and reminders will arrive in a future stage.',
    icon: CalendarDays,
  },
]

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/splash" replace />} />
      <Route path="/splash" element={<SplashPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register/success" element={<RegistrationSuccessPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:subjectId" element={<SubjectPage />} />
          <Route path="/courses/scholar" element={<ScholarCoursePage />} />
          <Route path="/courses/:subjectId/:unitId" element={<UnitPage />} />
          <Route path="/courses/:subjectId/:unitId/practice" element={<QuestionPracticePage />} />
          <Route path="/continue-learning" element={<ContinueLearningPage />} />
          <Route path="/practice" element={<PracticeRedirect />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/:gameId" element={<GamePage />} />
          <Route path="/euee" element={<EUEEPage />} />
          <Route path="/euee/practice" element={<EUEEPracticePage />} />
          <Route path="/euee/exam" element={<EUEEExamPage />} />
          <Route path="/euee/results/:id" element={<EUEEResultsPage />} />
          <Route path="/euee/archive" element={<EUEEArchivePage />} />
          <Route path="/euee/archive/:year/:streamId/:subjectId" element={<EUEEArchiveExamPage />} />
          <Route path="/euee/archive/results/:attemptId" element={<EUEEArchiveResultsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/edit" element={<EditProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/app-demo" element={<Navigate to="/home" replace />} />

          {featurePlaceholders.map((item) => (
            <Route
              key={item.path}
              path={item.path}
              element={
                <ComingSoonPage
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                />
              }
            />
          ))}
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/splash" replace />} />
    </Routes>
  )
}

export default AppRoutes

