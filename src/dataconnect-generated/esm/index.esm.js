import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'studio',
  location: 'us-east4'
};

export const createUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUser');
}
createUserRef.operationName = 'CreateUser';

export function createUser(dc) {
  return executeMutation(createUserRef(dc));
}

export const listAdviceRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAdvice');
}
listAdviceRef.operationName = 'ListAdvice';

export function listAdvice(dc) {
  return executeQuery(listAdviceRef(dc));
}

export const saveAdviceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'SaveAdvice', inputVars);
}
saveAdviceRef.operationName = 'SaveAdvice';

export function saveAdvice(dcOrVars, vars) {
  return executeMutation(saveAdviceRef(dcOrVars, vars));
}

export const listMyMoodLogsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMyMoodLogs');
}
listMyMoodLogsRef.operationName = 'ListMyMoodLogs';

export function listMyMoodLogs(dc) {
  return executeQuery(listMyMoodLogsRef(dc));
}

