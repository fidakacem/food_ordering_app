import { ID } from "react-native-appwrite";
import { appwriteConfig, databases, storage } from "./appwrite";
import dummyData from "./data";

interface Category {
  name: string;
  description: string;
}

interface Customization {
  name: string;
  price: number;
  type: "topping" | "side" | "size" | "crust" | string;
}

interface MenuItem {
  name: string;
  description: string;
  image_url: string;
  price: number;
  rating: number;
  calories: number;
  protein: number;
  category_name: string;
  customizations: string[];
}

interface DummyData {
  categories: Category[];
  customizations: Customization[];
  menu: MenuItem[];
}

const data = dummyData as DummyData;

// Supprime tous les documents d'une collection
async function clearAll(collectionId: string): Promise<void> {
  const list = await databases.listDocuments(appwriteConfig.databaseId, collectionId);
  await Promise.all(
    list.documents.map(doc => databases.deleteDocument(appwriteConfig.databaseId, collectionId, doc.$id))
  );
}

// Supprime tous les fichiers du storage
async function clearStorage(): Promise<void> {
  const list = await storage.listFiles(appwriteConfig.bucketId);
  await Promise.all(
    list.files.map(file => storage.deleteFile(appwriteConfig.bucketId, file.$id))
  );
}

// Upload d'une image vers Appwrite et renvoie l'URL
async function uploadImageToStorage(imageUrl: string): Promise<string> {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    const fileObj = {
      name: imageUrl.split("/").pop() || `file-${Date.now()}.jpg`,
      type: blob.type,
      size: blob.size,
      uri: imageUrl,
    };

    const file = await storage.createFile(appwriteConfig.bucketId, ID.unique(), fileObj);
    return storage.getFileViewURL(appwriteConfig.bucketId, file.$id);
  } catch (err) {
    console.error("Failed to upload image:", imageUrl, err);
    return ""; // fallback string
  }
}

async function seed(): Promise<void> {
  console.log("🧹 Clearing previous data...");
  await clearAll(appwriteConfig.categoriesCollectionId);
  await clearAll(appwriteConfig.customizationsCollectionId);
  await clearAll(appwriteConfig.menuCollectionId);
  await clearAll(appwriteConfig.menuCustomizationsCollectionId);
  await clearStorage();

  // 1️⃣ Categories
  console.log("📂 Creating categories...");
  const categoryMap: Record<string, string> = {};
  for (const cat of data.categories) {
    try {
      const doc = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.categoriesCollectionId,
        ID.unique(),
        { name: cat.name, description: cat.description }
      );
      categoryMap[cat.name] = doc.$id;
    } catch (err) {
      console.error("Failed to create category:", cat, err);
    }
  }

  // 2️⃣ Customizations
  console.log("⚙️ Creating customizations...");
  const customizationMap: Record<string, string> = {};
  for (const cus of data.customizations) {
    try {
      const doc = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.customizationsCollectionId,
        ID.unique(),
        { name: cus.name, price: cus.price, type: cus.type }
      );
      customizationMap[cus.name] = doc.$id;
    } catch (err) {
      console.error("Failed to create customization:", cus, err);
    }
  }

  // 3️⃣ Menu Items
  console.log("🍔 Creating menu items...");
  for (const item of data.menu) {
    const categoryId = categoryMap[item.category_name];
    if (!categoryId) {
      console.warn(`Category not found for menu item: ${item.name}. Skipping...`);
      continue;
    }

    let uploadedImage: string = "";
    if (item.image_url) {
      uploadedImage = await uploadImageToStorage(item.image_url);
    }

    try {
      const doc = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.menuCollectionId,
        ID.unique(),
        {
          name: item.name,
          description: item.description,
          image_url: uploadedImage,
          price: item.price,
          rating: item.rating,
          calories: item.calories,
          protein: item.protein,
          categories: categoryId,
        }
      );

      // 4️⃣ Menu Customizations
      for (const cusName of item.customizations) {
        const cusId = customizationMap[cusName];
        if (!cusId) {
          console.warn(`Customization not found for menu item: ${item.name}, customization: ${cusName}`);
          continue;
        }
        await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.menuCustomizationsCollectionId,
          ID.unique(),
          {
            menu: doc.$id,
            customizations: cusId,
          }
        );
      }
    } catch (err) {
      console.error("Failed to create menu item:", item.name, err);
    }
  }

  console.log("✅ Seeding complete!");
}

export default seed;
