import {Appwrite} from 'appwrite';

const appwrite = new Appwrite();

const endpoint = import.meta.env.APP_ENDPOINT as string;
const project = import.meta.env.APP_PROJECT as string;

appwrite.setEndpoint(endpoint).setProject(project);

export {
  appwrite,
}
