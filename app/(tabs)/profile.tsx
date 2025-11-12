import {View, Text, Image, Alert, ScrollView} from 'react-native'
import { router } from 'expo-router'
import useAuthStore from '@/store/auth.store'
import CustomButton from '@/components/CustomButton'
import CustomHeader from '@/components/CustomHeader'
import { useState } from 'react'

const Profile = () => {
    const { user, signOutUser } = useAuthStore()
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleLogout = async () => {
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
                        setIsLoggingOut(true)
                        try {
                            await signOutUser()
                            router.replace('/sign-in')
                        } catch (error: any) {
                            Alert.alert('Erreur', 'Impossible de se déconnecter')
                        } finally {
                            setIsLoggingOut(false)
                        }
                    }
                }
            ]
        )
    }

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <CustomHeader title="Profil" />
            
            <View className="px-5 py-8">
                {/* Profile Info Card */}
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

                {/* Logout Button */}
                <View className="px-2">
                    <CustomButton
                        title="Se déconnecter"
                        onPress={handleLogout}
                        isLoading={isLoggingOut}
                    />
                </View>
            </View>
        </ScrollView>
    )
}

export default Profile;