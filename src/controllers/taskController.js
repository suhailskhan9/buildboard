import * as taskService from '../services/taskService.js'

export async function createTaskController(req, res) {
    const { projectId } = req.params;
    const userId = req.user.id;
    const taskData = req.body;
    
    const task = await taskService.createTask({ projectId, userId, taskData });

    return res.status(201).json(task);
};

export async function getTasksController(req, res) {
    const { projectId } = req.params;
    const userId = req.user.id;
    const { page, limit, status, assigned_to_id, search } = req.validatedQuery;

    const tasks = await taskService.getTasks({ projectId, userId, page, limit, status, assignedToId: assigned_to_id, search });

    return res.status(200).json(tasks)
}

export async function getTaskByIdController(req, res) {
    const { projectId, taskId } = req.params;
    const userId = req.user.id;

    const task = await taskService.getTaskById({ projectId, taskId, userId});

    return res.status(200).json(task);
}