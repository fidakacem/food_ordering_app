//importer les modules , alert= fenetre popup d'erreur
import {View, Text, Button, Alert} from 'react-native'
/*Link = navigation via texte cliquable
router = navigation programmée (replace, push, etc).*/
import {Link, router} from "expo-router";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
//ook React utilisé pour gérer les valeurs du formulaire + le loading.
import {useState} from "react";
//Fonction Appwrite utilisée pour inscrire un nouvel utilisateur.
import {createUser} from "@/lib/appwrite";
import useAuthStore from "@/store/auth.store";
import {User} from "@/type";

const SignUp = () => {
    //Indique si le bouton est en chargement
    const [isSubmitting, setIsSubmitting] = useState(false);
    //Valeurs du formulaire d’inscription
    const [form, setForm] = useState({ name: '', email: '', password: '' });

    //Fonction submit :Déclenchée quand l’utilisateur clique sur Sign Up.
    const submit = async () => {
        const { name, email, password } = form;
        //Étape 1 — Vérification des champs : Empêche de soumettre si un champ est vide.
        if(!name || !email || !password) return Alert.alert('Error', 'Please enter valid email address & password.');
        //Étape 2 — Active le loading
        setIsSubmitting(true)

        try {
            //Étape 3 — Création du compte dans Appwrite
            const newUser = await createUser({ email,  password,  name });
            
            // Étape 4 — Mise à jour du store Zustand (librairie de gestion d'etats pour react): Stocker l’utilisateur dans l’app, Le marquer comme connecté
            useAuthStore.getState().setUser(newUser as User);
            useAuthStore.getState().setIsAuthenticated(true);
            //Étape 5 — Redirection vers home
            router.replace('/');
            //tape 6 — Gestion erreur + désactivation du loading
        } catch(error: any) {
            // Affiche une popup d'erreur
            Alert.alert('Error', error.message);
        } finally {
            // Désactive le bouton loading
            setIsSubmitting(false);
        }
    }

    return (
        <View className="gap-10 bg-white rounded-lg p-5 mt-5">
            <CustomInput
                placeholder="Enter your full name"
                value={form.name}
                onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
                label="Full name"
            />
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
                title="Sign Up"
                isLoading={isSubmitting}
                onPress={submit}
            />

            <View className="flex justify-center mt-5 flex-row gap-2">
                <Text className="base-regular text-gray-100">
                    Already have an account?
                </Text>
                <Link href="/sign-in" className="base-bold text-primary">
                    Sign In
                </Link>
            </View>
        </View>
    )
}

export default SignUp