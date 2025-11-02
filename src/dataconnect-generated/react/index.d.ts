import { CreateUserData, ListAdviceData, SaveAdviceData, SaveAdviceVariables, ListMyMoodLogsData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserData, undefined>;
export function useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserData, undefined>;

export function useListAdvice(options?: useDataConnectQueryOptions<ListAdviceData>): UseDataConnectQueryResult<ListAdviceData, undefined>;
export function useListAdvice(dc: DataConnect, options?: useDataConnectQueryOptions<ListAdviceData>): UseDataConnectQueryResult<ListAdviceData, undefined>;

export function useSaveAdvice(options?: useDataConnectMutationOptions<SaveAdviceData, FirebaseError, SaveAdviceVariables>): UseDataConnectMutationResult<SaveAdviceData, SaveAdviceVariables>;
export function useSaveAdvice(dc: DataConnect, options?: useDataConnectMutationOptions<SaveAdviceData, FirebaseError, SaveAdviceVariables>): UseDataConnectMutationResult<SaveAdviceData, SaveAdviceVariables>;

export function useListMyMoodLogs(options?: useDataConnectQueryOptions<ListMyMoodLogsData>): UseDataConnectQueryResult<ListMyMoodLogsData, undefined>;
export function useListMyMoodLogs(dc: DataConnect, options?: useDataConnectQueryOptions<ListMyMoodLogsData>): UseDataConnectQueryResult<ListMyMoodLogsData, undefined>;
