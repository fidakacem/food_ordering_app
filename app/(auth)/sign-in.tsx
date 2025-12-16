//Composants de base UI
import {View, Text, Button, Alert} from 'react-native'
/*Link : navigation par lien,
 router : navigation programmée (redirect).*/
import {Link, router} from "expo-router";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
//Hook pour gérer l’état du formulaire.
import {useState} from "react";
//Fonction qui envoie la requête login à Appwrite.
import {signIn} from "@/lib/appwrite";
//Zustand pour stocker l’utilisateur connecté.
import useAuthStore from "@/store/auth.store";
//Utilisé pour tracker les erreurs


const SignIn = () => {
    //Pour afficher un loading pendant que la requête s’exécute.
    const [isSubmitting, setIsSubmitting] = useState(false);
    //Contenu du formulaire.
    const [form, setForm] = useState({ email: '', password: '' });
    //Fonction pour récupérer l’utilisateur connecté .
    const { fetchAuthenticatedUser } = useAuthStore();

    const submit = async () => {
        const { email, password } = form;
        // Validation simple
        if(!email || !password) return Alert.alert('Error', 'Please enter valid email address & password.');
        // Active le loading
        setIsSubmitting(true)

        try {
            // Appwrite : connexion
            await signIn({ email, password });
            
            // Update auth store state after successful login: // Récupère le user 
            await fetchAuthenticatedUser();
            // // Redirige vers la page d'accueil
            router.replace('/');
        } catch(error: any) {
            // Affiche l'erreur
            Alert.alert('Error', error.message);
            
        } finally {
            // Désactive loading
            setIsSubmitting(false);
        }
    }

    return (
        <View className="gap-10 bg-white rounded-lg p-5 mt-5">
            <CustomInput
                placeholder="Enter your email"
                value={form.email}
                onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
                label="Email"
                keyboardType="email-address"
            />
            <CustomInput
                placeholder="Enter your password"
                value={form.password}
                onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
                label="Password"
                secureTextEntry={true}
            />

            <CustomButton
                title="Sign In"
                isLoading={isSubmitting}
                onPress={submit}
            />

            <View className="flex justify-center mt-5 flex-row gap-2">
                <Text className="base-regular text-gray-100">
                    Don't have an account?
                </Text>
                <Link href="/sign-up" className="base-bold text-primary">
                    Sign Up
                </Link>
            </View>
        </View>
    )
}

export default SignIn;