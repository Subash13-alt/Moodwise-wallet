import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AdviceFeedback_Key {
  userId: UUIDString;
  adviceId: UUIDString;
  __typename?: 'AdviceFeedback_Key';
}

export interface Advice_Key {
  id: UUIDString;
  __typename?: 'Advice_Key';
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface ListAdviceData {
  advices: ({
    id: UUIDString;
    author?: string | null;
    category?: string | null;
    content: string;
  } & Advice_Key)[];
}

export interface ListMyMoodLogsData {
  userMoodLogs: ({
    id: UUIDString;
    mood: {
      name: string;
      description: string;
      iconUrl?: string | null;
      colorCode?: string | null;
    };
      loggedAt: TimestampString;
      userNotes?: string | null;
  } & UserMoodLog_Key)[];
}

export interface MoodAdvice_Key {
  moodId: UUIDString;
  adviceId: UUIDString;
  __typename?: 'MoodAdvice_Key';
}

export interface Mood_Key {
  id: UUIDString;
  __typename?: 'Mood_Key';
}

export interface SaveAdviceData {
  savedAdvice_insert: SavedAdvice_Key;
}

export interface SaveAdviceVariables {
  adviceId: UUIDString;
}

export interface SavedAdvice_Key {
  userId: UUIDString;
  adviceId: UUIDString;
  __typename?: 'SavedAdvice_Key';
}

export interface UserMoodLog_Key {
  id: UUIDString;
  __typename?: 'UserMoodLog_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateUserData, undefined>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(): MutationPromise<CreateUserData, undefined>;
export function createUser(dc: DataConnect): MutationPromise<CreateUserData, undefined>;

interface ListAdviceRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAdviceData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAdviceData, undefined>;
  operationName: string;
}
export const listAdviceRef: ListAdviceRef;

export function listAdvice(): QueryPromise<ListAdviceData, undefined>;
export function listAdvice(dc: DataConnect): QueryPromise<ListAdviceData, undefined>;

interface SaveAdviceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: SaveAdviceVariables): MutationRef<SaveAdviceData, SaveAdviceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: SaveAdviceVariables): MutationRef<SaveAdviceData, SaveAdviceVariables>;
  operationName: string;
}
export const saveAdviceRef: SaveAdviceRef;

export function saveAdvice(vars: SaveAdviceVariables): MutationPromise<SaveAdviceData, SaveAdviceVariables>;
export function saveAdvice(dc: DataConnect, vars: SaveAdviceVariables): MutationPromise<SaveAdviceData, SaveAdviceVariables>;

interface ListMyMoodLogsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyMoodLogsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMyMoodLogsData, undefined>;
  operationName: string;
}
export const listMyMoodLogsRef: ListMyMoodLogsRef;

export function listMyMoodLogs(): QueryPromise<ListMyMoodLogsData, undefined>;
export function listMyMoodLogs(dc: DataConnect): QueryPromise<ListMyMoodLogsData, undefined>;

