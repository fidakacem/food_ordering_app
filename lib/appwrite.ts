import { Account, Avatars, Client, Databases, ID, Query, Storage } from "react-native-appwrite";
import { CreateUserParams, GetMenuParams, SignInParams } from "@/type";

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  platform: "com.food.ordering",
  databaseId: "69125077001df193924a",
  bucketId: "69139e58003a2328daaa",
  userCollectionId: "user",
  categoriesCollectionId: "categories",
  menuCollectionId: "menu",
  customizationsCollectionId: "customizations",
  menuCustomizationsCollectionId: "menu_customizations",
};

export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
const avatars = new Avatars(client);

/* ---------------------- CREATE USER ---------------------- */
export const createUser = async ({ email, password, name }: CreateUserParams) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);
    if (!newAccount) throw Error("Account creation failed");

    // No signIn needed — Appwrite auto-logs in the new user

    const avatarUrl = avatars.getInitialsURL(name);

    return await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      { email, name, accountId: newAccount.$id, avatar: avatarUrl }
      // No permissions needed because collection allows all users full CRUD
    );
  } catch (e: any) {
    throw new Error(e.message || String(e));
  }
};

/* ---------------------- SIGN IN ---------------------- */
export const signIn = async ({ email, password }: SignInParams) => {
  try {
    // Check if a session is already active
    try {
      const currentSession = await account.getSession("current");
      if (currentSession) {
        console.log("A session is already active:", currentSession);
        return currentSession; // Prevents duplicate session error
      }
    } catch {
      // No active session, continue
    }

    // Create a new session only if none exists
    const session = await account.createEmailPasswordSession(email, password);
    console.log("New session created:", session);
    return session;
  } catch (e) {
    throw new Error(e as string);
  }
};

/* ---------------------- GET CURRENT USER ---------------------- */
export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error("No active account found");

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser || !currentUser.documents.length) throw Error("User not found in database");

    return currentUser.documents[0];
  } catch (e: any) {
    console.log(e);
    throw new Error(e.message || String(e));
  }
};

/* ---------------------- GET MENU ---------------------- */
export const getMenu = async ({ category, query }: GetMenuParams) => {
  try {
    const queries: string[] = [];

    if (category) queries.push(Query.equal("categories", category));
    if (query) queries.push(Query.search("name", query));

    const menus = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.menuCollectionId,
      queries
    );

    return menus.documents;
  } catch (e: any) {
    throw new Error(e.message || String(e));
  }
};

/* ---------------------- GET CATEGORIES ---------------------- */
export const getCategories = async () => {
  try {
    const categories = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.categoriesCollectionId
    );

    return categories.documents;
  } catch (e: any) {
    throw new Error(e.message || String(e));
  }
};