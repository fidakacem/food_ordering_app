import { SplashScreen, Stack } from "expo-router";
// SplashScreen → écran de chargement initial
// Stack → navigation stack (pages avec header)

import { useFonts } from 'expo-font';
// useFonts → hook pour charger des polices personnalisées

import { useEffect } from "react";
// useEffect → hook pour gérer les effets de bord (fetch, chargement, etc.)

import './globals.css';
// CSS global pour l'application

import useAuthStore from "@/store/auth.store";
// store d'authentification : gérer l'utilisateur connecté et les actions liées

// RootLayout : layout principal de l'application
export default function RootLayout() {
  const { isLoading, fetchAuthenticatedUser } = useAuthStore();
  // Récupère l'état de chargement et la fonction pour fetcher l'utilisateur connecté

  // Chargement des polices personnalisées
  const [fontsLoaded, error] = useFonts({
    "QuickSand-Bold": require('../assets/fonts/Quicksand-Bold.ttf'),
    "QuickSand-Medium": require('../assets/fonts/Quicksand-Medium.ttf'),
    "QuickSand-Regular": require('../assets/fonts/Quicksand-Regular.ttf'),
    "QuickSand-SemiBold": require('../assets/fonts/Quicksand-SemiBold.ttf'),
    "QuickSand-Light": require('../assets/fonts/Quicksand-Light.ttf'),
  });

  // Effet pour cacher le splash screen quand les polices sont chargées
  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  // Effet pour récupérer l'utilisateur connecté au montage
  useEffect(() => {
    fetchAuthenticatedUser();
  }, []);

  // Si les polices ne sont pas chargées ou si l'authentification est en cours → ne rien afficher
  if (!fontsLoaded || isLoading) return null;

  // Retourne le Stack principal pour la navigation, sans header
  return <Stack screenOptions={{ headerShown: false }} />;
}
