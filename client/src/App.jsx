import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Onboarding from './pages/Onboarding.jsx'
import ResumeUpload from './pages/ResumeUpload.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import CareerGoal from './pages/CareerGoal.jsx'
import CompetencyProfile from './pages/CompetencyProfile.jsx'
import SkillGaps from './pages/SkillGaps.jsx'
import Roadmap from './pages/Roadmap.jsx'
import Progress from './pages/Progress.jsx'
import AssessmentPlaceholder from './pages/AssessmentPlaceholder.jsx'

export default function App() {
  return (
    <Routes>
      {/* Public / onboarding flow from teammate frontend */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/resume-upload" element={<ResumeUpload />} />

      {/* Main TechLens application */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/career-goal" element={<CareerGoal />} />
        <Route path="/competency-profile" element={<CompetencyProfile />} />
        <Route path="/skill-gaps" element={<SkillGaps />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/assessment" element={<AssessmentPlaceholder />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
