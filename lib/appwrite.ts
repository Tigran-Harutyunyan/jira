import {
  Client,
  Account,
  Users,
  Storage,
  Databases,
} from "node-appwrite";

import { AUTH_COOKIE } from "@/features/auth/constants";
import { getClientCookie } from './utils';
export { ID } from "appwrite";

const runtimeConfig = useRuntimeConfig();
export const APPWRITE_ENDPOINT = runtimeConfig.public.appwrite.APPWRITE_ENDPOINT;
export const APPWRITE_PROJECT_ID = runtimeConfig.public.appwrite.APPWRITE_PROJECT_ID;
export const APPWRITE_IMAGES_BUCKET_ID = runtimeConfig.public.appwrite.APPWRITE_IMAGES_BUCKET_ID;
export function createSessionClient(event?) {

  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

  let session;

  if (event) {
    session = getCookie(event, AUTH_COOKIE);
  } else {
    session = getClientCookie(AUTH_COOKIE);
  }

  client.setSession(session);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    }
  };
};

export async function createAdminClient() {
  if (process.client) {
    throw new Error("Unauthorized");
  }
  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(process.env.NUXT_APPWRITE_KEY!);

  return {
    get account() {
      return new Account(client);
    },
    get users() {
      return new Users(client);
    }
  };
};

