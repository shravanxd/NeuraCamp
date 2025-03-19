// Create a utility file to manage job applications across components

// Define types
export type JobApplication = {
  id: string
  jobId: string
  userId: string
  status: "pending" | "accepted" | "rejected" | "interview"
  submittedDate: string
  coverLetter?: string
  resume?: string
}

// Use localStorage to persist applications between page navigations
export const getApplications = (): JobApplication[] => {
  if (typeof window === "undefined") return []

  const storedApplications = localStorage.getItem("jobApplications")
  return storedApplications ? JSON.parse(storedApplications) : []
}

export const saveApplication = (application: JobApplication): void => {
  if (typeof window === "undefined") return

  const applications = getApplications()
  applications.push(application)
  localStorage.setItem("jobApplications", JSON.stringify(applications))
}

export const removeApplication = (jobId: string, userId: string): void => {
  if (typeof window === "undefined") return

  const applications = getApplications()
  const filteredApplications = applications.filter((app) => !(app.jobId === jobId && app.userId === userId))
  localStorage.setItem("jobApplications", JSON.stringify(filteredApplications))
}

export const hasApplied = (jobId: string, userId: string): boolean => {
  const applications = getApplications()
  return applications.some((app) => app.jobId === jobId && app.userId === userId)
}

export const getUserApplications = (userId: string): JobApplication[] => {
  const applications = getApplications()
  return applications.filter((app) => app.userId === userId)
}

