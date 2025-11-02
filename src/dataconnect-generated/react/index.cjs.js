const { createUserRef, listAdviceRef, saveAdviceRef, listMyMoodLogsRef, connectorConfig } = require('../index.cjs.js');
const { validateArgs, CallerSdkTypeEnum } = require('firebase/data-connect');
const { useDataConnectQuery, useDataConnectMutation, validateReactArgs } = require('@tanstack-query-firebase/react/data-connect');

exports.useCreateUser = function useCreateUser(dcOrOptions, options) {
  const { dc: dcInstance, vars: inputOpts } = validateArgs(connectorConfig, dcOrOptions, options);
  function refFactory() {
    return createUserRef(dcInstance);
  }
  return useDataConnectMutation(refFactory, inputOpts, CallerSdkTypeEnum.GeneratedReact);
}


exports.useListAdvice = function useListAdvice(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts } = validateReactArgs(connectorConfig, dcOrOptions, options);
  const ref = listAdviceRef(dcInstance);
  return useDataConnectQuery(ref, inputOpts, CallerSdkTypeEnum.GeneratedReact);
}
exports.useSaveAdvice = function useSaveAdvice(dcOrOptions, options) {
  const { dc: dcInstance, vars: inputOpts } = validateArgs(connectorConfig, dcOrOptions, options);
  function refFactory(vars) {
    return saveAdviceRef(dcInstance, vars);
  }
  return useDataConnectMutation(refFactory, inputOpts, CallerSdkTypeEnum.GeneratedReact);
}


exports.useListMyMoodLogs = function useListMyMoodLogs(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts } = validateReactArgs(connectorConfig, dcOrOptions, options);
  const ref = listMyMoodLogsRef(dcInstance);
  return useDataConnectQuery(ref, inputOpts, CallerSdkTypeEnum.GeneratedReact);
}