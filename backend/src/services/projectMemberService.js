import AppError from '../errors/AppError.js';
import * as projectMemberRepository from '../repositories/projectMemberRepository.js';
import * as userRepository from '../repositories/userRepository.js';

export async function getMembers({ projectId, userId }) {
    const membership = await projectMemberRepository.getMembership({ projectId, userId });
    if(!membership) {
       throw new AppError(404, "Project not found");  
    }

    const members = await projectMemberRepository.getProjectMembers({ projectId });
    return members;
}

export async function addProjectMember({ projectId, userId, targetUserId, role }) {
    const membership = await projectMemberRepository.getMembership({ projectId, userId });
    if(!membership) {
        throw new AppError(404, "Project not found");
    }

    if(membership.role !== "owner") {
        throw new AppError(403, "Only project owners can add members");
    }


    const targetUserExists = await userRepository.getUserById({ userId: targetUserId });
    if(!targetUserExists) {
        throw new AppError(404, "Target user not found")
    }

    const targetUserMembership = await projectMemberRepository.getMembership({ projectId, targetUserId });
    if(targetUserMembership) {
        throw new AppError(409, "Target user already a member");
    }

    const member = await projectMemberRepository.addProjectMember({projectId, userId: targetUserId, role });
    return member;
}

export async function removeProjectMember({ projectId, userId, targetUserId}) {
    const membership = await projectMemberRepository.getMembership({ projectId, userId });
    if(!membership) {
        throw new AppError(404, "Project not found");
    }

    if(membership.role !== "owner") {
        throw new AppError(403, "Only project owners can remove members");
    }

    const targetUserMembership = await projectMemberRepository.getMembership({ projectId, userId: targetUserId });
    if(!targetUserMembership) {
        throw new AppError(404, "Target user is not a member of this project");
    }

    if(targetUserId === userId) {
        throw new AppError(409, "Owner cannot remove themselves");
    }

    const member = await projectMemberRepository.removeProjectMember({ projectId, userId: targetUserId });
    return member;
}