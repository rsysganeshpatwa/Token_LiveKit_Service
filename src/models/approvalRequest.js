// models/approvalRequest.js
let approvalRequests = [];
let nextId = 1;

function getAll() {
  return approvalRequests;
}

function create(participantName, roomName) {
  const request = {
    id: nextId++,
    participantName,
    roomName,
    status: 'pending',
  };
  approvalRequests.push(request);
  return request;
}

function update(id, status) {
  const index = approvalRequests.findIndex(req => req.id === id);
  if (index === -1) return null;
  approvalRequests[index].status = status;
  return approvalRequests[index];
}

function getById(id) {
  return approvalRequests.find(req => req.id === id);
}

export default  {
  getAll,
  create,
  update,
  getById,
};
