
import { View, Text, Image, Alert, ScrollView } from 'react-native';
// Composants de base pour interface (View, Text, Image), Alert pour pop-ups, ScrollView pour scroll
import { router } from 'expo-router';
// router pour la navigation programmatique
import useAuthStore from '@/store/auth.store';
// store d'authentification (user, actions)
import CustomButton from '@/components/CustomButton';
// bouton personnalisé réutilisable
import CustomHeader from '@/components/CustomHeader';
// header personnalisé pour chaque écran
import { useState } from 'react';
// hook pour gérer les états locaux

const Profile = () => {
    const { user, signOutUser } = useAuthStore();
    // user → informations utilisateur
    // signOutUser → fonction pour déconnexion
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    // état pour indiquer si le logout est en cours

    const handleLogout = async () => {
        // fonction pour gérer la déconnexion
        Alert.alert(
            'Déconnexion',
            'Êtes-vous sûr de vouloir vous déconnecter ?',
            [
                {
                    text: 'Annuler',
                    style: 'cancel'
                },
                {
                    text: 'Déconnexion',
                    style: 'destructive',
                    onPress: async () => {
                        setIsLoggingOut(true);
                        try {
                            await signOutUser(); // appelle la fonction de déconnexion
                            router.replace('/sign-in'); // redirige vers la page de connexion
                        } catch (error: any) {
                            Alert.alert('Erreur', 'Impossible de se déconnecter');
                        } finally {
                            setIsLoggingOut(false); // reset de l'état
                        }
                    }
                }
            ]
        );
    };

    return (
        <ScrollView className="flex-1 bg-gray-50">
            {/* ScrollView pour permettre le scroll si contenu trop long */}
            <CustomHeader title="Profil" />
            
            <View className="px-5 py-8">
                {/* Carte d'informations du profil */}
                <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
                    <View className="items-center mb-6">
                        <Image 
                            source={{ uri: user?.avatar }} 
                            className="w-24 h-24 rounded-full mb-4"
                            defaultSource={require('@/assets/images/avatar.png')}
                        />
                        <Text className="text-2xl font-bold text-gray-800 mb-1">
                            {user?.name || 'Utilisateur'}
                        </Text>
                        <Text className="text-gray-500 text-base">
                            {user?.email || 'email@example.com'}
                        </Text>
                    </View>
                </View>

                {/* Bouton de déconnexion */}
                <View className="px-2">
                    <CustomButton
                        title="Se déconnecter"
                        onPress={handleLogout}
                        isLoading={isLoggingOut} // affichage d'un loader si déconnexion en cours
                    />
                </View>
            </View>
        </ScrollView>
    );
};

export default Profile;
