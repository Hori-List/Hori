import {Appwrite} from 'appwrite';
import {invitation, list, user} from './interfaces';
import {useStore} from './store';
import {AppwriteException, RealtimeResponse} from './types';

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
    return await appwrite.account.create(email, password, name);
}

/**
 * sends a verification email to the user
 */
async function sendVerificationEmail() {
    const url = import.meta.env.VITE_VERIFY_URL as string;
    return await appwrite.account.createVerification(url);
}

/**
 * creates a session for the user
 * @param email the email of the user
 * @param password the password of the user
 */
async function login(email: string, password: string): Promise<user> {
    const user: any = await appwrite.account.createSession(email, password);
    return {
        id: user.$id,
        email: user.email,
        name: user.name,
    };
}

function handleRealtime() {
    const store = useStore();
    appwrite.subscribe(`collections.${listsCollection}.documents`, (response: RealtimeResponse) => {
        switch (response.event) {
            case 'database.documents.create':
                // user created a new list
                break;
            default:
                break;
        }
        console.log(response);
    });
    appwrite.subscribe(`collections.${invitationsCollection}.documents`, (response: RealtimeResponse) => {
        console.log(response);
        if (response.event === 'database.documents.create') {
            // user has either been invited to a list or created a new list
            store.updateLists();
        }
    });
}

/**
 * retrieves the user object
 */
async function getUser() {
    const user: any = await appwrite.account.get().then((user: any) => {
        return user;
    }).catch((err: AppwriteException) => {
    });
    return {
        id: user?.$id,
        email: user?.email,
        name: user?.name,
        verified: user?.emailVerification,
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
        items: [],
    };
    return await appwrite.database.createDocument(listsCollection, data);
}

/**
 * gets the users id from the store
 */
function userId() {
    const store = useStore();
    return store.user.id;
}

/**
 * gets all lists.
 * WARNING: this contains lists that the user might not want to see.
 */
async function getAllLists() {
    const {documents} = await appwrite.database.listDocuments(listsCollection).catch((err: AppwriteException) => {
        throw err;
    }) as any;
    return documents;
}

/**
 * returns all the the accepted invitations
 */
async function getAcceptedInvites() {
    const {documents} = await appwrite.database.listDocuments(invitationsCollection, [
        `status=accepted`, `inviteeId=${userId()}`,
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
        ids.push(doc.listId);
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
    const {documents} = await appwrite.database.listDocuments(invitationsCollection, [
        `status=invited`, `inviteeId=${userId()}`,
    ]);
    return documents;
}

/**
 * retrieves all public user data for a given user
 * @param id the id of the user
 */
async function getUserDataFromId(id: string) {
    const {documents} = await appwrite.database.listDocuments(usersCollection, [`user=${id}`]).catch((err: AppwriteException) => {
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
    for (const inv of openInvitations) {
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

/**
 * adds a given item to a given list
 * @param listId the id of the list
 * @param item the item you want to add to the list
 * @returns the appwrite response
 */
async function addItem(listId: string, item: string) {
    let {items} = (await appwrite.database.getDocument(listsCollection, listId) as any);

    if (items && items.length > 0) {
        items.push(item);
    } else {
        items = [item];
    }
    return await appwrite.database.updateDocument(listsCollection, listId, {items});
}

/**
 * Removes a given item from a given list
 * @param listId the id of the list
 * @param item the item you want to remove
 * @returns a promise containing the updated list
 */
async function removeItem(listId: string, item: string): Promise<list> {
    let {items} = await appwrite.database.getDocument(listsCollection, listId) as any;
    items = items.filter((value: string) => value !== item);
    const list = await appwrite.database.updateDocument(listsCollection, listId, {items}) as any;
    return {
        id: list.$id,
        name: list.name,
        items: list.items,
    };
}

/**
 * updates the users email in the database
 * @param email the new email
 * @param password the users password
 */
async function updateEmail(email: string, password: string) {
    return await appwrite.account.updateEmail(email, password);
}

/**
 * updates the users name in the database
 * @param name the new name
 */
async function updateName(name: string) {
    return await appwrite.account.updateName(name);
}

/**
 * confirms the users email address
 * @param userId the id of the user
 * @param secret the users secret
 */
async function confirmEmail(userId: string, secret: string) {
    return await appwrite.account.updateVerification(userId, secret);
}

export {
    appwrite,
    createList,
    login,
    logout,
    createAccount,
    sendVerificationEmail,
    invite,
    getUser,
    getLists,
    getInvitations,
    addItem,
    removeItem,
    updateName,
    updateEmail,
    confirmEmail,
    handleRealtime,
};
