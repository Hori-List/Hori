import { Appwrite } from 'appwrite';

const appwrite = new Appwrite();

const endpoint = import.meta.env.VITE_APP_ENDPOINT as string;
const project = import.meta.env.VITE_APP_PROJECT as string;

const listsCollection = import.meta.env.VITE_APP_LISTS_COLLECTION as string;

appwrite.setEndpoint(endpoint).setProject(project);

async function createAccount(email: string, password: string, name: string) {
  return await appwrite.account.create(email, password, name).then((user) => {
    return [user, null];
  }, (err) => {
    return [null, err];
  });
}

async function login(email: string, password: string) {
  return await appwrite.account.createSession(email, password).then((user) => {
    return [user, null];
  }, (err) => {
    return [null, err];
  });
}

async function logout() {
  return await appwrite.account.deleteSession('current');
}

async function createList(name: string) {
  const data = {
    name,
  };
  return await appwrite.database.createDocument(listsCollection, data).then((res) => {
    return [res, null];
  }, (err) => {
    return [null, err];
  });
}


export {
  appwrite, createList, login, logout, createAccount,
};
