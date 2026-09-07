import * as taskRepository from '../repositories/taskRepository.js'
import * as projectMemberRepository from '../repositories/projectMemberRepository.js';
import AppError from '../errors/AppError.js';

export async function createTask({projectId, userId, taskData}) {
    const membership = await projectMemberRepository.getMembership({ projectId, userId });
    if(!membership) {
       throw new AppError(404, "Project not found");  
    }

    if(membership.role !== 'owner' && membership.role !== 'editor') {
        throw new AppError(403, "Not allowed to create task");
    }

    if(taskData.assigned_to_id !== undefined) {
        const assigneeMembership = await projectMemberRepository.getMembership({ projectId, userId: taskData.assigned_to_id });
    
        if(!assigneeMembership) {
            throw new AppError(400, "Assigned user must be a member of the project");
        }
    }

    const task = await taskRepository.createTask({ projectId, taskData });

    return task;
}   

export async function getTasks({ projectId, userId, page, limit, status, assignedToId, search}){
    const membership = await projectMemberRepository.getMembership({ projectId, userId})

    if(!membership) {
        throw new AppError(404, "Project not found");
    }

    const offset = (page - 1) * limit;

    const result = await taskRepository.getTasks({ projectId, limit, offset, status, assignedToId, search });

    const totalPages = Math.ceil(result.total / limit);

    return {
        data: result.tasks,
        pagination: {
            page, limit, total: result.total, totalPages
        }
    }
}


export async function getTaskById({ projectId, taskId, userId }) {
    const membership = await projectMemberRepository.getMembership({ projectId, userId });
    
    if(!membership) {
        throw new AppError(404, "Project not found")
    }

    const task = await taskRepository.getTaskById({ projectId, taskId });

    if(!task) {
        throw new AppError(404, "Task not found");
    }

    return task;
}

export async function updateTask({ projectId, taskId, userId, taskData }){
    const membership = await projectMemberRepository.getMembership({ projectId, userId });

    if(!membership) {
        throw new AppError(404, "Project not found");
    }

    if(!["owner", "editor"].includes(membership.role)){
        throw new AppError(403, "Not allowed to update task");
    }
    
    const task = await taskRepository.getTaskById({ projectId ,taskId })

    if(!task) {
        throw new AppError(404, "Task not found")
    }

    if(taskData.assigned_to_id !== undefined && taskData.assigned_to_id !== null){
        const assigneeMembership = await projectMemberRepository.getMembership({ projectId, userId: taskData.assigned_to_id})

        if(!assigneeMembership) {
            throw new AppError(400, "Assigned user must be a member of this project")
        }
    }

    const updatedTask = await taskRepository.updateTask({ projectId, taskId, taskData });

    return updatedTask;
}