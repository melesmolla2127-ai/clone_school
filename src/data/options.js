export const DEFAULT_SCHOOL_NAME = 'Clone School'

export const GENDER_OPTIONS = [
  { value: 'Female', label: 'Female' },
  { value: 'Male', label: 'Male' },
  { value: 'Other', label: 'Other' },
  { value: 'Prefer not to say', label: 'Prefer not to say' },
]

export const GRADE_OPTIONS = [
  { value: 'KG', label: 'Kindergarten (KG)' },
  { value: '1', label: 'Grade 1' },
  { value: '2', label: 'Grade 2' },
  { value: '3', label: 'Grade 3' },
  { value: '4', label: 'Grade 4' },
  { value: '5', label: 'Grade 5' },
  { value: '6', label: 'Grade 6' },
  { value: '7', label: 'Grade 7' },
  { value: '8', label: 'Grade 8' },
  { value: '9', label: 'Grade 9' },
  { value: '10', label: 'Grade 10' },
  { value: '11', label: 'Grade 11' },
  { value: '12', label: 'Grade 12' },
]

export const STREAM_OPTIONS = [
  { value: 'Natural Science', label: 'Natural Science' },
  { value: 'Social Science', label: 'Social Science' },
]

export const FINAL_GRADES = ['11', '12']

export function getGradeLabel(value) {
  return GRADE_OPTIONS.find((grade) => grade.value === value)?.label ?? value
}
