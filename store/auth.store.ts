
import { create } from 'zustand';
import { User } from "@/type";
import { getCurrentUser, signOut } from "@/lib/appwrite";

// Zustand store pour auth
type AuthState = {
    isAuthenticated: boolean; // si connecté
    user: User | null; // info utilisateur
    isLoading: boolean; // loader global

    setIsAuthenticated: (value: boolean) => void;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;

    fetchAuthenticatedUser: () => Promise<void>; // fetch user courant
    signOutUser: () => Promise<void>; // logout
}

const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    user: null,
    isLoading: true,

    setIsAuthenticated: (value) => set({ isAuthenticated: value }),
    setUser: (user) => set({ user }),
    setLoading: (value) => set({isLoading: value}),

    fetchAuthenticatedUser: async () => {
        set({isLoading: true});

        try {
            const user = await getCurrentUser();
            if(user) set({ isAuthenticated: true, user: user as User })
            else set({ isAuthenticated: false, user: null });
        } catch (e) {
            console.log('fetchAuthenticatedUser error', e);
            set({ isAuthenticated: false, user: null });
        } finally {
            set({ isLoading: false });
        }
    },

    signOutUser: async () => {
        set({isLoading: true});

        try {
            await signOut(); // Appwrite logout
            set({ isAuthenticated: false, user: null });
        } catch (e) {
            console.log('signOutUser error', e);
        } finally {
            set({ isLoading: false });
        }
    }
}))

export default useAuthStore;
