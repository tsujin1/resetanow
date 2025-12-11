/**
 * Application constants
 */

export const GENDER_OPTIONS = ["Male", "Female"] as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
  PATIENT_NOT_FOUND: "Patient not found",
  PRESCRIPTION_NOT_FOUND: "Prescription not found",
  MEDCERT_NOT_FOUND: "Medical certificate not found",
  USER_NOT_FOUND: "User not found",
  UNAUTHORIZED: "Not authorized",
  SERVER_ERROR: "Server error",
} as const;

