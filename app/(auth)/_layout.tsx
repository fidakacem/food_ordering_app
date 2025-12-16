/* On importe des composants de base de React Native pour construire l’interface :
KeyboardAvoidingView: évite que le clavier recouvre les inputs,
ScrollView :permet de scroller,
Dimensions :récupère la taille de l’écran,
ImageBackground :affiche une image en fond.*/
import {View, Text, KeyboardAvoidingView, Platform, ScrollView, Dimensions, ImageBackground, Image} from 'react-native'
/* Redirect permet de renvoyer l’utilisateur vers une autre page.
 Slot permet d’afficher la page enfant (sign-in ou sign-up).*/
import {Redirect, Slot} from "expo-router";
//// Import des images de l'application
import {images} from "@/constants";
//On importe le "store" qui contient l’état de connexion.
import useAuthStore from "@/store/auth.store";

// Déclaration du composant principal de layout pour les pages d’authentification.
export default function AuthLayout() {
   //On récupère si l’utilisateur est déjà connecté , si connécté on le redirige vers la page home
    const { isAuthenticated } = useAuthStore();
    
    if(isAuthenticated) return <Redirect href="/" />

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            {/* keyboardShouldPersistTaps="handled" évite que le clavier se ferme trop tôt.*/ }
            <ScrollView className="bg-white h-full" keyboardShouldPersistTaps="handled">
                {/* Un bloc contenant :
                    une image en background,
                    le logo par dessus..*/ }
                <View className="w-full relative" style={{ height: Dimensions.get('screen').height / 2.25}}>
                    <ImageBackground source={images.loginGraphic} className="size-full rounded-b-lg" resizeMode="stretch" />
                    <Image source={images.logo} className="self-center size-48 absolute -bottom-16 z-10" />
                </View>
                {/*Slot affiche le contenu de sign-in ou sign-up.*/}
                <Slot />
            </ScrollView>
        </KeyboardAvoidingView>
    )
}
