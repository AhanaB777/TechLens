// Shared career-role definitions. This is frontend demonstration data for
// the current product stage; a future backend can replace this data source.

export const careerRoles = [
  {
    id: 'backend-developer',
    name: 'Backend Developer',
    domain: 'Software Development',
    competencies: [
      { id: 'python', name: 'Python', category: 'Programming', required: 80, importance: 'Essential' },
      { id: 'sql', name: 'SQL', category: 'Databases', required: 75, importance: 'Essential' },
      { id: 'rest-apis', name: 'REST APIs', category: 'Backend Development', required: 78, importance: 'Important' },
      { id: 'problem-solving', name: 'Problem Solving', category: 'Professional Skills', required: 70, importance: 'Supporting' },
      { id: 'django', name: 'Django', category: 'Backend Development', required: 75, importance: 'Important' },
      { id: 'docker', name: 'Docker', category: 'Tools & Workflow', required: 75, importance: 'Important' },
      { id: 'testing', name: 'Testing', category: 'Tools & Workflow', required: 70, importance: 'Important' },
      { id: 'ci-cd', name: 'CI/CD', category: 'Tools & Workflow', required: 65, importance: 'Supporting' },
    ],
  },
  {
    id: 'frontend-developer',
    name: 'Frontend Developer',
    domain: 'Software Development',
    competencies: [
      { id: 'html-css', name: 'HTML & CSS', category: 'Frontend Development', required: 80, importance: 'Essential' },
      { id: 'javascript', name: 'JavaScript', category: 'Programming', required: 82, importance: 'Essential' },
      { id: 'react', name: 'React', category: 'Frontend Development', required: 78, importance: 'Essential' },
      { id: 'git', name: 'Git', category: 'Tools & Workflow', required: 70, importance: 'Important' },
      { id: 'accessibility', name: 'Accessibility', category: 'Frontend Development', required: 65, importance: 'Important' },
      { id: 'testing', name: 'Testing', category: 'Tools & Workflow', required: 70, importance: 'Important' },
      { id: 'performance', name: 'Performance', category: 'Frontend Development', required: 65, importance: 'Supporting' },
    ],
  },
  {
    id: 'full-stack-developer',
    name: 'Full Stack Developer',
    domain: 'Software Development',
    competencies: [
      { id: 'javascript', name: 'JavaScript', category: 'Programming', required: 82, importance: 'Essential' },
      { id: 'react', name: 'React', category: 'Frontend Development', required: 78, importance: 'Essential' },
      { id: 'python', name: 'Python', category: 'Programming', required: 78, importance: 'Important' },
      { id: 'sql', name: 'SQL', category: 'Databases', required: 75, importance: 'Important' },
      { id: 'rest-apis', name: 'REST APIs', category: 'Backend Development', required: 78, importance: 'Essential' },
      { id: 'git', name: 'Git', category: 'Tools & Workflow', required: 70, importance: 'Important' },
      { id: 'testing', name: 'Testing', category: 'Tools & Workflow', required: 70, importance: 'Important' },
      { id: 'docker', name: 'Docker', category: 'Tools & Workflow', required: 70, importance: 'Supporting' },
    ],
  },
  {
    id: 'software-engineer',
    name: 'Software Engineer',
    domain: 'Software Development',
    competencies: [
      { id: 'javascript', name: 'JavaScript', category: 'Programming', required: 75, importance: 'Important' },
      { id: 'python', name: 'Python', category: 'Programming', required: 75, importance: 'Important' },
      { id: 'problem-solving', name: 'Problem Solving', category: 'Professional Skills', required: 80, importance: 'Essential' },
      { id: 'sql', name: 'SQL', category: 'Databases', required: 70, importance: 'Important' },
      { id: 'git', name: 'Git', category: 'Tools & Workflow', required: 70, importance: 'Important' },
      { id: 'testing', name: 'Testing', category: 'Tools & Workflow', required: 70, importance: 'Important' },
      { id: 'system-design', name: 'System Design', category: 'Software Engineering', required: 65, importance: 'Supporting' },
    ],
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    domain: 'Data & Analytics',
    competencies: [
      { id: 'sql', name: 'SQL', category: 'Databases', required: 82, importance: 'Essential' },
      { id: 'python', name: 'Python', category: 'Programming', required: 72, importance: 'Important' },
      { id: 'statistics', name: 'Statistics', category: 'Data & Analytics', required: 75, importance: 'Essential' },
      { id: 'data-visualization', name: 'Data Visualization', category: 'Data & Analytics', required: 72, importance: 'Important' },
      { id: 'excel', name: 'Excel', category: 'Tools & Workflow', required: 75, importance: 'Important' },
      { id: 'problem-solving', name: 'Problem Solving', category: 'Professional Skills', required: 75, importance: 'Important' },
    ],
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    domain: 'Data & AI',
    competencies: [
      { id: 'python', name: 'Python', category: 'Programming', required: 85, importance: 'Essential' },
      { id: 'sql', name: 'SQL', category: 'Databases', required: 75, importance: 'Important' },
      { id: 'statistics', name: 'Statistics', category: 'Data & Analytics', required: 85, importance: 'Essential' },
      { id: 'machine-learning', name: 'Machine Learning', category: 'Data & AI', required: 80, importance: 'Essential' },
      { id: 'data-visualization', name: 'Data Visualization', category: 'Data & Analytics', required: 70, importance: 'Important' },
      { id: 'problem-solving', name: 'Problem Solving', category: 'Professional Skills', required: 80, importance: 'Essential' },
    ],
  },
  {
    id: 'machine-learning-engineer',
    name: 'Machine Learning Engineer',
    domain: 'Data & AI',
    competencies: [
      { id: 'python', name: 'Python', category: 'Programming', required: 85, importance: 'Essential' },
      { id: 'machine-learning', name: 'Machine Learning', category: 'Data & AI', required: 85, importance: 'Essential' },
      { id: 'sql', name: 'SQL', category: 'Databases', required: 70, importance: 'Important' },
      { id: 'docker', name: 'Docker', category: 'Tools & Workflow', required: 70, importance: 'Important' },
      { id: 'testing', name: 'Testing', category: 'Tools & Workflow', required: 70, importance: 'Important' },
      { id: 'ci-cd', name: 'CI/CD', category: 'Tools & Workflow', required: 65, importance: 'Supporting' },
    ],
  },
  {
    id: 'devops-engineer',
    name: 'DevOps Engineer',
    domain: 'Cloud & Infrastructure',
    competencies: [
      { id: 'linux', name: 'Linux', category: 'Infrastructure', required: 80, importance: 'Essential' },
      { id: 'docker', name: 'Docker', category: 'Tools & Workflow', required: 80, importance: 'Essential' },
      { id: 'ci-cd', name: 'CI/CD', category: 'Tools & Workflow', required: 85, importance: 'Essential' },
      { id: 'cloud', name: 'Cloud', category: 'Infrastructure', required: 78, importance: 'Important' },
      { id: 'git', name: 'Git', category: 'Tools & Workflow', required: 75, importance: 'Important' },
      { id: 'testing', name: 'Testing', category: 'Tools & Workflow', required: 65, importance: 'Supporting' },
    ],
  },
  {
    id: 'cloud-engineer',
    name: 'Cloud Engineer',
    domain: 'Cloud & Infrastructure',
    competencies: [
      { id: 'cloud', name: 'Cloud', category: 'Infrastructure', required: 85, importance: 'Essential' },
      { id: 'linux', name: 'Linux', category: 'Infrastructure', required: 80, importance: 'Essential' },
      { id: 'docker', name: 'Docker', category: 'Tools & Workflow', required: 75, importance: 'Important' },
      { id: 'ci-cd', name: 'CI/CD', category: 'Tools & Workflow', required: 80, importance: 'Important' },
      { id: 'networking', name: 'Networking', category: 'Infrastructure', required: 75, importance: 'Important' },
      { id: 'git', name: 'Git', category: 'Tools & Workflow', required: 70, importance: 'Supporting' },
    ],
  },
  {
    id: 'cybersecurity-analyst',
    name: 'Cybersecurity Analyst',
    domain: 'Cybersecurity',
    competencies: [
      { id: 'networking', name: 'Networking', category: 'Infrastructure', required: 80, importance: 'Essential' },
      { id: 'linux', name: 'Linux', category: 'Infrastructure', required: 75, importance: 'Important' },
      { id: 'security-fundamentals', name: 'Security Fundamentals', category: 'Cybersecurity', required: 85, importance: 'Essential' },
      { id: 'python', name: 'Python', category: 'Programming', required: 70, importance: 'Important' },
      { id: 'incident-response', name: 'Incident Response', category: 'Cybersecurity', required: 75, importance: 'Important' },
    ],
  },
  {
    id: 'mobile-developer',
    name: 'Mobile Developer',
    domain: 'Software Development',
    competencies: [
      { id: 'javascript', name: 'JavaScript', category: 'Programming', required: 78, importance: 'Important' },
      { id: 'mobile-development', name: 'Mobile Development', category: 'Mobile Development', required: 82, importance: 'Essential' },
      { id: 'git', name: 'Git', category: 'Tools & Workflow', required: 70, importance: 'Important' },
      { id: 'testing', name: 'Testing', category: 'Tools & Workflow', required: 70, importance: 'Important' },
      { id: 'accessibility', name: 'Accessibility', category: 'Mobile Development', required: 65, importance: 'Supporting' },
    ],
  },
]

export const experienceLevels = ['Entry Level', 'Early Career', 'Mid Level', 'Senior Level']
export const timelineOptions = ['3 months', '6 months', '9 months', '12 months']

export function getCareerRole(roleName) {
  return careerRoles.find((role) => role.name === roleName) ?? careerRoles[0]
}
