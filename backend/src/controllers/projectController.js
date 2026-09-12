import * as projectService from "../services/projectService.js";

export async function getAllProjectsController(req, res) {
    const userId = req.user.id;
    const projects = await projectService.getAllProjects(userId);
    return res.status(200).json(projects);

}


export async function getProjectByIdController(req, res) {
    const { projectId } = req.params;
    const userId = req.user.id;

    const project = await projectService.getProjectById({ projectId, userId });
    return res.status(200).json(project)
}

export async function createProjectController(req, res) {
    const { name, description } = req.body;
        
    const userId = req.user.id;

    const project = await projectService.createProject({ name, description, userId })

    return res.status(201).json(project);
}


export async function updateProjectController(req, res) {
    const { projectId } = req.params;
    const { name } = req.body;
    const userId = req.user.id;

    const project = await projectService.updateProject({ projectId, name, userId });

    return res.status(200).json(project);
}

export async function deleteProjectController(req, res) {
    const { projectId } = req.params
    const userId = req.user.id;
        
    const project = await projectService.deleteProject({ projectId, userId })

    return res.status(200).json({message: "Project deleted successfully", project: project});

}