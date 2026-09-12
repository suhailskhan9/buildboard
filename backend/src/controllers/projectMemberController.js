import * as projectMemberService from '../services/projectMemberService.js'

export async function getMembersController(req, res) {
    const { projectId } = req.params;
    const userId = req.user.id;

    const members = await projectMemberService.getMembers({ projectId, userId });
    return res.status(200).json(members);
}