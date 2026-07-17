import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"
import {
  registerUser,
  loginUser,
  logoutUser,
  getSessionUser,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
} from "../services/authService"
import { requireAuth } from "../middleware/auth"
import { toErrorResponse } from "../utils/apiError"

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("A valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  company: z.string().optional(),
})

const loginSchema = z.object({
  email: z.string().email("A valid email is required"),
  password: z.string().min(1, "Password is required"),
})

export const registerFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => registerSchema.parse(d))
  .handler(async ({ data }) => {
    try {
      return { data: await registerUser(data) }
    } catch (e) {
      return toErrorResponse(e)
    }
  })

export const loginFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => loginSchema.parse(d))
  .handler(async ({ data }) => {
    try {
      return { data: await loginUser(data) }
    } catch (e) {
      return toErrorResponse(e)
    }
  })

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
  return { data: logoutUser() }
})

export const sessionFn = createServerFn({ method: "GET" }).handler(async () => {
  return { data: await getSessionUser() }
})

export const updateProfileFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({
        name: z.string().optional(),
        company: z.string().optional(),
        avatar: z.string().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    try {
      const payload = requireAuth()
      return { data: await updateProfile(payload.sub, data) }
    } catch (e) {
      return toErrorResponse(e)
    }
  })

export const changePasswordFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({
        currentPassword: z.string().min(1),
        newPassword: z.string().min(6, "New password must be at least 6 characters"),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    try {
      const payload = requireAuth()
      return { data: await changePassword(payload.sub, data) }
    } catch (e) {
      return toErrorResponse(e)
    }
  })

export const forgotPasswordFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ email: z.string().email() }).parse(d))
  .handler(async ({ data }) => {
    try {
      return { data: await forgotPassword(data.email) }
    } catch (e) {
      return toErrorResponse(e)
    }
  })

export const resetPasswordFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({ token: z.string().min(1), newPassword: z.string().min(6) }).parse(d),
  )
  .handler(async ({ data }) => {
    try {
      return { data: await resetPassword(data) }
    } catch (e) {
      return toErrorResponse(e)
    }
  })
