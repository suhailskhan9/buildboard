import * as projectMemberService from '../services/projectMemberService.js'

export async function getMembersController(req, res) {
    const { projectId } = req.params;
    const userId = req.user.id;

    const members = await projectMemberService.getMembers({ projectId, userId });
    return res.status(200).json(members);
}

export async function addProjectMemberController(req, res) {
    const { projectId } = req.params;
    const targetUserId = req.body.user_id;
    const role = req.body.role;
    const userId = req.user.id;

    const member = await projectMemberService.addProjectMember({ projectId, userId, targetUserId, role });
    return res.status(201).json(member);
}

export async function removeProjectMemberController(req, res) {
    const { projectId, userId: targetUserId } = req.params;
    const userId = req.user.id;

    const member = await projectMemberService.removeProjectMember({ projectId, userId, targetUserId });
    return res.status(204).send();
}