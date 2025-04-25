import { AvailableUserRoles, UserRolesEnum } from "@/utils/constants"
import * as z from "zod"

export const projectSchema = z.object({
    name: z.string({ required_error: "Name is required" }).min(1, "Name can't be empty"),
    description: z.string({ required_error: "Description is required" }).min(1, "Description can't be empty")
})

export const updateProjectSchema = z.object({
    name: z.string({ required_error: "Name is required" }).min(1, "Name can't be empty").optional(),
    description: z.string({ required_error: "Description is required" }).min(1, "Description can't be empty").optional()
}).refine(data => data.name || data.description, {
    message: "Atleast one of the name or description must be provided",
})

const UserRolesEnumkeys = Object.values(UserRolesEnum) as [keyof typeof UserRolesEnum]

export const memberRoleSchema = z.object({
    role: z.enum(UserRolesEnumkeys, {
        required_error: 'You must select valid member Roles!',
    }),
})