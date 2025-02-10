// models/approvalRequest.js
import { updateApprovalRequest, saveApprovalRequest, removeParticipantRequest, getAllApprovalRequestById } from '../../db.js';
let nextId = 1;

function create(participantName, roomName) {
  const request = {
    id: nextId++,
    participantName,
    roomName,
    status: 'pending',
  };
  saveApprovalRequest(request);
  return request;
}

async function update(id, status) {
  const request = await updateApprovalRequest(id, status)
  return request;
}

async function getById(id) {
  const request = await getAllApprovalRequestById(id);
  return request;
}

async function removeById(id) {
  await removeParticipantRequest(id)
}
export default  {
  create,
  update,
  getById,
  removeById,
};
