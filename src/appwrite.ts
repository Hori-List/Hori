import { Appwrite } from 'appwrite';
import { list, user, invitation } from './interfaces';
import { useStore } from './store';

const appwrite = new Appwrite();

// the endpoint of the appwrite instance
const endpoint = import.meta.env.VITE_APP_ENDPOINT as string;
//the appwrite project id
const project = import.meta.env.VITE_APP_PROJECT as string;

const listsCollection = import.meta.env.VITE_APP_LISTS_COLLECTION as string;
const invitationsCollection = import.meta.env.VITE_APP_INVITATIONS_COLLECTION as string;
const usersCollection = import.meta.env.VITE_APP_USERS_COLLECTION as string;

//initialize appwrite
appwrite.setEndpoint(endpoint).setProject(project);

/**
 * creates a new account
 * @param email the email of the user
 * @param password the users password
 * @param name the name of the user
 */
async function createAccount(email: string, password: string, name: string) {
  return await appwrite.account.create(email, password, name).then((user) => {
    return [user, null];
  }, (err) => {
    return [null, err];
  });
}

async function login(email: string, password: string): Promise<user> {
  const user: any = await appwrite.account.createSession(email, password);
  return {
    id: user.$id,
    email: user.email,
    name: user.name,
  };
}

/**
 * retrieves the user object
 */
async function getUser() {
  const user: any = await appwrite.account.get().then((user) => {
    return user;
  }).catch((err) => {
    console.log(err);
  });
  return {
    id: user.$id,
    email: user.email,
    name: user.name,
  };
}

/**
 * logs the user out
 */
async function logout() {
  return await appwrite.account.deleteSession('current');
}

/**
 * creates a new list with the given name
 * @param name the name of the list
 */
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

/**
 * gets the users id from the store
 */
function userId() {
  const store = useStore();
  console.log(store.user.id);
  return store.user.id;
}

/**
 * gets all lists.
 * WARNING: this contains lists that the user might not want to see.
 */
async function getAllLists() {
  const { documents } = await appwrite.database.listDocuments(listsCollection).catch((err) => {
    throw err;
  }) as any;
  return documents;
}

/**
 * returns all the the accepted invitations
 */
async function getAcceptedInvites() {
  const { documents } = await appwrite.database.listDocuments(invitationsCollection, [
    `status=accepted`, `inviteeId=${ userId() }`,
  ]);
  return documents;
}

/**
 * get the id of all accepted lists
 */
async function getAcceptedIds() {
  const accepted = await getAcceptedInvites();
  const ids: string[] = [];
  accepted.forEach((doc: any) => {
    ids.push(doc.$id);
  });
  return ids;
}

/**
 * returns all user relevant lists.
 * lists that have not been accepted will be filtered out.
 */
async function getLists() {
  const accepted = await getAcceptedIds();
  const all = await getAllLists();
  const lists: list[] = [];
  all.forEach((doc: any) => {
    if (accepted.includes(doc.$id)) {
      lists.push({
        id: doc.$id,
        name: doc.name,
        items: doc.items,
      });
    }
  });
  return lists;
}

/**
 * returns all the invitations that are yet to be accepted
 */
async function getOpenInvitations() {
  const { documents } = await appwrite.database.listDocuments(invitationsCollection, [
    `status=invited`, `inviteeId=${ userId() }`,
  ]);
  return documents;
}

/**
 * retrieves all public user data for a given user
 * @param id the id of the user
 */
async function getUserDataFromId(id: string) {
  const { documents } = await appwrite.database.listDocuments(usersCollection, [`user=${ id }`]).catch((err) => {
    throw err;
  }) as any;
  return documents[1];
}

/**
 * returns the specified list
 * @param id the id of the list
 */
async function getListFromId(id: string): Promise<any> {
  return await appwrite.database.getDocument(listsCollection, id);
}

/**
 * returns all open invitations
 */
async function getInvitations() {
  const openInvitations = await getOpenInvitations();
  const invitations: invitation[] = [];
  for(const inv of openInvitations) {
    const inviterData = await getUserDataFromId(inv.inviterId);
    const listData = await getListFromId(inv.listId);
    invitations.push({
      id: inv.$id,
      inviterEmail: inviterData.email,
      inviterName: inviterData.name,
      listName: listData.name,
    });
  }
  return invitations;
}

/**
 * invites another user using their email to a list
 * @param email the email of the user
 * @param listId the id of the list the user will be invited to
 */
async function invite(email: string, listId: string) {
  const data = {
    email,
    listId,
  };
  const functionId = import.meta.env.VITE_APP_INVITATION_FUNCTION as string;
  return await appwrite.functions.createExecution(functionId, JSON.stringify(data));
}

export {
  appwrite, createList, login, logout, createAccount, invite, getUser, getLists, getInvitations
};
