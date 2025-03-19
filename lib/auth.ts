import usersData from "@/data/users.json"

export type EnrolledCourse = {
  courseId: string
  enrolledDate: string
  progress: number
  lastAccessedDate: string
}

export type CompletedCourse = {
  courseId: string
  completedDate: string
  certificateId: string
}

export type EnrolledTrack = {
  trackId: string
  enrolledDate: string
  progress: number
  lastAccessedDate: string
}

export type User = {
  id: string
  name: string
  email: string
  password: string
  avatar: string
  role: string
  joinedDate: string
  enrolledCourses: EnrolledCourse[]
  completedCourses: CompletedCourse[]
  enrolledTracks?: EnrolledTrack[]
}

// In a real app, this would be handled by a backend
// For this demo, we'll use localStorage to simulate persistence
export const auth = {
  // Get all users
  getUsers: (): User[] => {
    // Try to get users from localStorage first
    if (typeof window !== "undefined") {
      const localUsers = localStorage.getItem("users")
      if (localUsers) {
        return JSON.parse(localUsers)
      }

      // If not found, initialize with the dummy data
      localStorage.setItem("users", JSON.stringify(usersData))
    }
    return usersData
  },

  // Get current user
  getCurrentUser: (): User | null => {
    if (typeof window !== "undefined") {
      const userJson = localStorage.getItem("currentUser")
      return userJson ? JSON.parse(userJson) : null
    }
    return null
  },

  // Sign in
  signIn: (email: string, password: string): User | null => {
    const users = auth.getUsers()
    const user = users.find((u) => u.email === email && u.password === password)

    if (user && typeof window !== "undefined") {
      // Initialize enrolledTracks if it doesn't exist
      if (!user.enrolledTracks) {
        user.enrolledTracks = []
      }

      // Store the current user in localStorage (without password in a real app)
      localStorage.setItem("currentUser", JSON.stringify(user))
      return user
    }

    return null
  },

  // Sign up
  signUp: (
    userData: Omit<User, "id" | "role" | "joinedDate" | "enrolledCourses" | "completedCourses" | "enrolledTracks">,
  ): User => {
    const users = auth.getUsers()

    // Check if email already exists
    if (users.some((u) => u.email === userData.email)) {
      throw new Error("Email already exists")
    }

    // Create new user
    const newUser: User = {
      id: (users.length + 1).toString(),
      ...userData,
      role: "student",
      joinedDate: new Date().toISOString().split("T")[0],
      enrolledCourses: [],
      completedCourses: [],
      enrolledTracks: [],
    }

    // Add to users array
    const updatedUsers = [...users, newUser]

    // Update localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("users", JSON.stringify(updatedUsers))
    }

    return newUser
  },

  // Sign out
  signOut: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentUser")
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!auth.getCurrentUser()
  },

  // Enroll in a course
  enrollInCourse: (courseId: string): User | null => {
    const currentUser = auth.getCurrentUser()
    if (!currentUser) return null

    // Check if already enrolled
    if (currentUser.enrolledCourses.some((course) => course.courseId === courseId)) {
      return currentUser // Already enrolled
    }

    // Add course to enrolled courses
    const updatedUser = {
      ...currentUser,
      enrolledCourses: [
        ...currentUser.enrolledCourses,
        {
          courseId,
          enrolledDate: new Date().toISOString().split("T")[0],
          progress: 0,
          lastAccessedDate: new Date().toISOString().split("T")[0],
        },
      ],
    }

    // Update user in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))

      // Update user in users array
      const users = auth.getUsers()
      const updatedUsers = users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      localStorage.setItem("users", JSON.stringify(updatedUsers))
    }

    return updatedUser
  },

  // Enroll in a track
  enrollInTrack: (trackId: string): User | null => {
    const currentUser = auth.getCurrentUser()
    if (!currentUser) return null

    // Initialize enrolledTracks if it doesn't exist
    if (!currentUser.enrolledTracks) {
      currentUser.enrolledTracks = []
    }

    // Check if already enrolled
    if (currentUser.enrolledTracks.some((track) => track.trackId === trackId)) {
      return currentUser // Already enrolled
    }

    // Add track to enrolled tracks
    const updatedUser = {
      ...currentUser,
      enrolledTracks: [
        ...currentUser.enrolledTracks,
        {
          trackId,
          enrolledDate: new Date().toISOString().split("T")[0],
          progress: 0,
          lastAccessedDate: new Date().toISOString().split("T")[0],
        },
      ],
    }

    // Update user in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))

      // Update user in users array
      const users = auth.getUsers()
      const updatedUsers = users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      localStorage.setItem("users", JSON.stringify(updatedUsers))
    }

    return updatedUser
  },

  // Update course progress
  updateCourseProgress: (courseId: string, progress: number): User | null => {
    const currentUser = auth.getCurrentUser()
    if (!currentUser) return null

    // Find the course
    const courseIndex = currentUser.enrolledCourses.findIndex((course) => course.courseId === courseId)

    if (courseIndex === -1) return currentUser // Not enrolled

    // Update the course progress
    const updatedEnrolledCourses = [...currentUser.enrolledCourses]
    updatedEnrolledCourses[courseIndex] = {
      ...updatedEnrolledCourses[courseIndex],
      progress,
      lastAccessedDate: new Date().toISOString().split("T")[0],
    }

    // Update user
    const updatedUser = {
      ...currentUser,
      enrolledCourses: updatedEnrolledCourses,
    }

    // Update user in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))

      // Update user in users array
      const users = auth.getUsers()
      const updatedUsers = users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      localStorage.setItem("users", JSON.stringify(updatedUsers))
    }

    return updatedUser
  },

  // Update track progress
  updateTrackProgress: (trackId: string, progress: number): User | null => {
    const currentUser = auth.getCurrentUser()
    if (!currentUser || !currentUser.enrolledTracks) return null

    // Find the track
    const trackIndex = currentUser.enrolledTracks.findIndex((track) => track.trackId === trackId)

    if (trackIndex === -1) return currentUser // Not enrolled

    // Update the track progress
    const updatedEnrolledTracks = [...currentUser.enrolledTracks]
    updatedEnrolledTracks[trackIndex] = {
      ...updatedEnrolledTracks[trackIndex],
      progress,
      lastAccessedDate: new Date().toISOString().split("T")[0],
    }

    // Update user
    const updatedUser = {
      ...currentUser,
      enrolledTracks: updatedEnrolledTracks,
    }

    // Update user in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))

      // Update user in users array
      const users = auth.getUsers()
      const updatedUsers = users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      localStorage.setItem("users", JSON.stringify(updatedUsers))
    }

    return updatedUser
  },

  // Check if user is enrolled in a course
  isEnrolledInCourse: (courseId: string): boolean => {
    const currentUser = auth.getCurrentUser()
    if (!currentUser) return false

    return currentUser.enrolledCourses.some((course) => course.courseId === courseId)
  },

  // Check if user is enrolled in a track
  isEnrolledInTrack: (trackId: string): boolean => {
    const currentUser = auth.getCurrentUser()
    if (!currentUser || !currentUser.enrolledTracks) return false

    return currentUser.enrolledTracks.some((track) => track.trackId === trackId)
  },

  // Get user's enrolled courses
  getEnrolledCourses: (): EnrolledCourse[] => {
    const currentUser = auth.getCurrentUser()
    if (!currentUser) return []

    return currentUser.enrolledCourses
  },

  // Get user's enrolled tracks
  getEnrolledTracks: (): EnrolledTrack[] => {
    const currentUser = auth.getCurrentUser()
    if (!currentUser || !currentUser.enrolledTracks) return []

    return currentUser.enrolledTracks
  },

  // Get user's completed courses
  getCompletedCourses: (): CompletedCourse[] => {
    const currentUser = auth.getCurrentUser()
    if (!currentUser) return []

    return currentUser.completedCourses
  },
}

export const getCurrentUser = auth.getCurrentUser

