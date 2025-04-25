import { addMemberToProject, createProject, deleteMember, deleteProject, getProjectById, getProjectMembers, getProjects, updateMemberRole, updateProject } from "@/controllers/project";
import { isAuth } from "@/middlewares/isAuth";
import { validate } from "@/middlewares/validator";
import { memberRoleSchema, projectSchema, updateProjectSchema } from "@/validators/projectSchema";
import { Router } from "express";

export const router: Router = Router()

router.use(isAuth)

router.post("/", validate(projectSchema), createProject)
router.get("/", getProjects)
router.get("/:projectId", getProjectById)
router.patch("/:projectId", validate(updateProjectSchema), updateProject)
router.delete("/:projectId", deleteProject)

router.post("/add-member/:projectId/:memberId", validate(memberRoleSchema), addMemberToProject)
router.get("/members/:projectId", getProjectMembers)
router.post("/update-member-role/:projectId/:userId", validate(memberRoleSchema), updateMemberRole)
router.delete("/delete-member/:projectId/:userId", deleteMember)