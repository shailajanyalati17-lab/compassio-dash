import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService"
import { requireAuth } from "../middleware/auth"
import { toErrorResponse } from "../utils/apiError"

const listSchema = z
  .object({
    search: z.string().optional(),
    category: z.string().optional(),
    status: z.string().optional(),
    page: z.number().optional(),
    limit: z.number().optional(),
    sort: z.string().optional(),
  })
  .optional()

const productInput = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  price: z.number().nonnegative("Price must be positive"),
  cost: z.number().nonnegative().optional(),
  stock: z.number().int().nonnegative("Stock must be positive"),
  description: z.string().optional(),
  status: z.enum(["active", "inactive", "out_of_stock"]).optional(),
  image: z.string().optional(),
})

export const listProductsFn = createServerFn({ method: "GET" })
  .validator((d: unknown) => listSchema.parse(d))
  .handler(async ({ data }) => {
    try {
      requireAuth()
      return { data: await listProducts(data ?? {}) }
    } catch (e) {
      return toErrorResponse(e)
    }
  })

export const getProductFn = createServerFn({ method: "GET" })
  .validator((d: unknown) => z.object({ id: z.string() }).parse(d))
  .handler(async ({ data }) => {
    try {
      requireAuth()
      return { data: await getProduct(data.id) }
    } catch (e) {
      return toErrorResponse(e)
    }
  })

export const createProductFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => productInput.parse(d))
  .handler(async ({ data }) => {
    try {
      requireAuth()
      return { data: await createProduct(data) }
    } catch (e) {
      return toErrorResponse(e)
    }
  })

export const updateProductFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => productInput.partial().extend({ id: z.string() }).parse(d))
  .handler(async ({ data }) => {
    try {
      requireAuth()
      const { id, ...patch } = data
      return { data: await updateProduct(id, patch) }
    } catch (e) {
      return toErrorResponse(e)
    }
  })

export const deleteProductFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ id: z.string() }).parse(d))
  .handler(async ({ data }) => {
    try {
      requireAuth()
      return { data: await deleteProduct(data.id) }
    } catch (e) {
      return toErrorResponse(e)
    }
  })
