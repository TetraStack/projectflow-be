import { addMemberToProject, createProject, deleteMember, deleteProject, getProjectById, getProjectMembers, getProjects, updateMemberRole, updateProject } from "@/controllers/project";
import { Router } from "express";

export const router: Router = Router()

router.post("/add-member", addMemberToProject)
router.post("/", createProject)
router.post("/delete-member", deleteMember)
router.delete("/:id", deleteProject)
router.get("/:id", getProjectById)
router.get("/members/:id", getProjectMembers)
router.get("/projects/:userId", getProjects)
router.post("/update-member-role/:projectId/:memberId", updateMemberRole)
router.patch("/:id", updateProject)