import { Account, Avatars, Client, Databases, ID, Query, Storage } from "react-native-appwrite";
import { CreateUserParams, GetMenuParams, SignInParams } from "@/type";
// Configuration Appwrite
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

// Initialisation Appwrite
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

    // Create a session for the new user
    await account.createEmailPasswordSession(email, password);

    const avatarUrl = avatars.getInitialsURL(name);

    return await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      { email, name, accountId: newAccount.$id, avatar: avatarUrl }
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
        // Delete the existing session first to allow fresh login
        await account.deleteSession("current");
        console.log("Existing session deleted, creating new session");
      }
    } catch {
      // No active session, continue with login
      console.log("No existing session found, proceeding with login");
    }

    // Create a new session
    const session = await account.createEmailPasswordSession(email, password);
    console.log("New session created successfully");
    return session;
  } catch (e: any) {
    throw new Error(e.message || String(e));
  }
};

/* ---------------------- SIGN OUT ---------------------- */
export const signOut = async () => {
  try {
    await account.deleteSession("current");
    console.log("User signed out successfully");
  } catch (e: any) {
    throw new Error(e.message || String(e));
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

    // If user document doesn't exist, create it
    if (!currentUser || !currentUser.documents.length) {
      console.log("User document not found, creating new user document");
      
      const avatarUrl = avatars.getInitialsURL(currentAccount.name);
      
      const newUserDoc = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        ID.unique(),
        { 
          email: currentAccount.email, 
          name: currentAccount.name, 
          accountId: currentAccount.$id, 
          avatar: avatarUrl 
        }
      );
      
      return newUserDoc;
    }

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