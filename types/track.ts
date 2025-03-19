export interface TrackCourse {
  id: string
  position: number
  required: boolean
}

export interface TrackReview {
  id: number
  name: string
  avatar: string
  rating: number
  comment: string
  date: string
}

export interface Track {
  id: string
  title: string
  description: string
  level: string
  duration: string
  enrolledStudents: number
  rating: number
  ratingCount: number
  thumbnail: string
  courses: TrackCourse[]
  skills: string[]
  careers: string[]
  reviews: TrackReview[]
}

