import AppError from '../errors/AppError.js';
import * as projectMemberRepository from '../repositories/projectMemberRepository.js';

export async function getMembers({ projectId, userId }) {
    const membership = await projectMemberRepository.getMembership({ projectId, userId });
    if(!membership) {
       throw new AppError(404, "Project not found");  
    }

    const members = await projectMemberRepository.getProjectMembers({ projectId });
    return members;
}