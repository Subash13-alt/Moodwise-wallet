const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'studio',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const createUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUser');
}
createUserRef.operationName = 'CreateUser';
exports.createUserRef = createUserRef;

exports.createUser = function createUser(dc) {
  return executeMutation(createUserRef(dc));
};

const listAdviceRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAdvice');
}
listAdviceRef.operationName = 'ListAdvice';
exports.listAdviceRef = listAdviceRef;

exports.listAdvice = function listAdvice(dc) {
  return executeQuery(listAdviceRef(dc));
};

const saveAdviceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'SaveAdvice', inputVars);
}
saveAdviceRef.operationName = 'SaveAdvice';
exports.saveAdviceRef = saveAdviceRef;

exports.saveAdvice = function saveAdvice(dcOrVars, vars) {
  return executeMutation(saveAdviceRef(dcOrVars, vars));
};

const listMyMoodLogsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMyMoodLogs');
}
listMyMoodLogsRef.operationName = 'ListMyMoodLogs';
exports.listMyMoodLogsRef = listMyMoodLogsRef;

exports.listMyMoodLogs = function listMyMoodLogs(dc) {
  return executeQuery(listMyMoodLogsRef(dc));
};
