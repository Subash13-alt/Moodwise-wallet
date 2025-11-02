# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListAdvice*](#listadvice)
  - [*ListMyMoodLogs*](#listmymoodlogs)
- [**Mutations**](#mutations)
  - [*CreateUser*](#createuser)
  - [*SaveAdvice*](#saveadvice)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListAdvice
You can execute the `ListAdvice` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listAdvice(): QueryPromise<ListAdviceData, undefined>;

interface ListAdviceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAdviceData, undefined>;
}
export const listAdviceRef: ListAdviceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAdvice(dc: DataConnect): QueryPromise<ListAdviceData, undefined>;

interface ListAdviceRef {
  ...
  (dc: DataConnect): QueryRef<ListAdviceData, undefined>;
}
export const listAdviceRef: ListAdviceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAdviceRef:
```typescript
const name = listAdviceRef.operationName;
console.log(name);
```

### Variables
The `ListAdvice` query has no variables.
### Return Type
Recall that executing the `ListAdvice` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAdviceData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAdviceData {
  advices: ({
    id: UUIDString;
    author?: string | null;
    category?: string | null;
    content: string;
  } & Advice_Key)[];
}
```
### Using `ListAdvice`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAdvice } from '@dataconnect/generated';


// Call the `listAdvice()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAdvice();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAdvice(dataConnect);

console.log(data.advices);

// Or, you can use the `Promise` API.
listAdvice().then((response) => {
  const data = response.data;
  console.log(data.advices);
});
```

### Using `ListAdvice`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAdviceRef } from '@dataconnect/generated';


// Call the `listAdviceRef()` function to get a reference to the query.
const ref = listAdviceRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAdviceRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.advices);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.advices);
});
```

## ListMyMoodLogs
You can execute the `ListMyMoodLogs` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listMyMoodLogs(): QueryPromise<ListMyMoodLogsData, undefined>;

interface ListMyMoodLogsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyMoodLogsData, undefined>;
}
export const listMyMoodLogsRef: ListMyMoodLogsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMyMoodLogs(dc: DataConnect): QueryPromise<ListMyMoodLogsData, undefined>;

interface ListMyMoodLogsRef {
  ...
  (dc: DataConnect): QueryRef<ListMyMoodLogsData, undefined>;
}
export const listMyMoodLogsRef: ListMyMoodLogsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMyMoodLogsRef:
```typescript
const name = listMyMoodLogsRef.operationName;
console.log(name);
```

### Variables
The `ListMyMoodLogs` query has no variables.
### Return Type
Recall that executing the `ListMyMoodLogs` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMyMoodLogsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListMyMoodLogs`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMyMoodLogs } from '@dataconnect/generated';


// Call the `listMyMoodLogs()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMyMoodLogs();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMyMoodLogs(dataConnect);

console.log(data.userMoodLogs);

// Or, you can use the `Promise` API.
listMyMoodLogs().then((response) => {
  const data = response.data;
  console.log(data.userMoodLogs);
});
```

### Using `ListMyMoodLogs`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMyMoodLogsRef } from '@dataconnect/generated';


// Call the `listMyMoodLogsRef()` function to get a reference to the query.
const ref = listMyMoodLogsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMyMoodLogsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.userMoodLogs);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.userMoodLogs);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateUser
You can execute the `CreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createUser(): MutationPromise<CreateUserData, undefined>;

interface CreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateUserData, undefined>;
}
export const createUserRef: CreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUser(dc: DataConnect): MutationPromise<CreateUserData, undefined>;

interface CreateUserRef {
  ...
  (dc: DataConnect): MutationRef<CreateUserData, undefined>;
}
export const createUserRef: CreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRef:
```typescript
const name = createUserRef.operationName;
console.log(name);
```

### Variables
The `CreateUser` mutation has no variables.
### Return Type
Recall that executing the `CreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserData {
  user_insert: User_Key;
}
```
### Using `CreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUser } from '@dataconnect/generated';


// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUser(dataConnect);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createUser().then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRef } from '@dataconnect/generated';


// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## SaveAdvice
You can execute the `SaveAdvice` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
saveAdvice(vars: SaveAdviceVariables): MutationPromise<SaveAdviceData, SaveAdviceVariables>;

interface SaveAdviceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: SaveAdviceVariables): MutationRef<SaveAdviceData, SaveAdviceVariables>;
}
export const saveAdviceRef: SaveAdviceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
saveAdvice(dc: DataConnect, vars: SaveAdviceVariables): MutationPromise<SaveAdviceData, SaveAdviceVariables>;

interface SaveAdviceRef {
  ...
  (dc: DataConnect, vars: SaveAdviceVariables): MutationRef<SaveAdviceData, SaveAdviceVariables>;
}
export const saveAdviceRef: SaveAdviceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the saveAdviceRef:
```typescript
const name = saveAdviceRef.operationName;
console.log(name);
```

### Variables
The `SaveAdvice` mutation requires an argument of type `SaveAdviceVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface SaveAdviceVariables {
  adviceId: UUIDString;
}
```
### Return Type
Recall that executing the `SaveAdvice` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SaveAdviceData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SaveAdviceData {
  savedAdvice_insert: SavedAdvice_Key;
}
```
### Using `SaveAdvice`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, saveAdvice, SaveAdviceVariables } from '@dataconnect/generated';

// The `SaveAdvice` mutation requires an argument of type `SaveAdviceVariables`:
const saveAdviceVars: SaveAdviceVariables = {
  adviceId: ..., 
};

// Call the `saveAdvice()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await saveAdvice(saveAdviceVars);
// Variables can be defined inline as well.
const { data } = await saveAdvice({ adviceId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await saveAdvice(dataConnect, saveAdviceVars);

console.log(data.savedAdvice_insert);

// Or, you can use the `Promise` API.
saveAdvice(saveAdviceVars).then((response) => {
  const data = response.data;
  console.log(data.savedAdvice_insert);
});
```

### Using `SaveAdvice`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, saveAdviceRef, SaveAdviceVariables } from '@dataconnect/generated';

// The `SaveAdvice` mutation requires an argument of type `SaveAdviceVariables`:
const saveAdviceVars: SaveAdviceVariables = {
  adviceId: ..., 
};

// Call the `saveAdviceRef()` function to get a reference to the mutation.
const ref = saveAdviceRef(saveAdviceVars);
// Variables can be defined inline as well.
const ref = saveAdviceRef({ adviceId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = saveAdviceRef(dataConnect, saveAdviceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.savedAdvice_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.savedAdvice_insert);
});
```

