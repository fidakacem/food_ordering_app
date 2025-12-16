import { CartStore } from "@/type"; // TypeScript : type du store
import { create } from "zustand"; // Zustand : création du store

// Création du store du panier
export const useCartStore = create<CartStore>((set, get) => ({
    items: [], // Tableau initial des items dans le panier

    // Ajouter un item au panier
    addItem: (item) => {
        // Vérifie si l'item existe déjà dans le panier
        const existing = get().items.find((i) => i.id === item.id);

        if (existing) {
            // Si l'item existe déjà, on augmente seulement la quantité
            set({
                items: get().items.map((i) =>
                    i.id === item.id
                        ? { ...i, quantity: i.quantity + 1 } // Augmente la quantité
                        : i
                ),
            });
        } else {
            // Sinon, on ajoute le nouvel item avec quantity = 1
            set({
                items: [...get().items, { ...item, quantity: 1 }],
            });
        }
    },

    // Supprimer un item complètement du panier
    removeItem: (id) => {
        set({
            items: get().items.filter((i) => i.id !== id), // Filtre tous les items sauf celui avec l'id correspondant
        });
    },

    // Augmenter la quantité d'un item
    increaseQty: (id) => {
        set({
            items: get().items.map((i) =>
                i.id === id ? { ...i, quantity: i.quantity + 1 } : i
            ),
        });
    },

    // Diminuer la quantité d'un item
    decreaseQty: (id) => {
        set({
            items: get()
                .items.map((i) =>
                    i.id === id ? { ...i, quantity: i.quantity - 1 } : i
                )
                .filter((i) => i.quantity > 0), // Supprime l'item si la quantité tombe à 0
        });
    },

    // Vider complètement le panier
    clearCart: () => set({ items: [] }),

    // Calculer le nombre total d'items dans le panier
    getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

    // Calculer le prix total du panier
    getTotalPrice: () =>
        get().items.reduce((total, item) => total + item.quantity * item.price, 0),
}));
