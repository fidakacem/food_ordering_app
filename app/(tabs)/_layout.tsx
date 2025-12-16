/*  Tabs → composant pour créer les onglets (home / search / cart / profile).
    Redirect → redirige l’utilisateur si non connecté.
    Slot → pas utilisé ici mais sert à afficher une page enfant (dans d’autres layouts).*/
import {Redirect, Slot, Tabs} from "expo-router";
//Import du store Zustand qui stocke l’état de connexion.
import useAuthStore from "@/store/auth.store";
//Type TS pour sécuriser les props de ton icône d’onglet.
import {TabBarIconProps} from "@/type";
import {Image, Text, View} from "react-native";
//sert à combiner des classes conditionnelles (comme className dynamique).
import {images} from "@/constants";
import cn from "clsx";

/*Définition de l’icône customisée pour les onglets
    focused = si l’onglet est actif
    icon = l’image à afficher
    title = texte sous l’icône */
const TabBarIcon = ({ focused, icon, title }: TabBarIconProps) => (
    <View className="tab-icon">
        {/*Change la couleur de l’icône quand l’onglet devient actif*/ }
        <Image source={icon} className="size-7" resizeMode="contain" tintColor={focused ? '#FE8C00' : '#5D5F6D'} />
        <Text className={cn('text-sm font-bold', focused ? 'text-primary':'text-gray-200')}>
            {title}
        </Text>
    </View>
)
//Layout principal des tabs
export default function TabLayout() {
    //Vérification si l'utilisateur est connecté
    const { isAuthenticated } = useAuthStore();
    //Si pas connecté redirection automatique vers la page sign-in
    if(!isAuthenticated) return <Redirect href="/sign-in" />
    //Création des Tabs (barre d’onglets)
    return (
        <Tabs screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    borderTopLeftRadius: 50,
                    borderTopRightRadius: 50,
                    borderBottomLeftRadius: 50,
                    borderBottomRightRadius: 50,
                    marginHorizontal: 20,
                    height: 80,
                    position: 'absolute',
                    bottom: 40,
                    backgroundColor: 'white',
                    shadowColor: '#1a1a1a',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 5
                }
            }}>
            <Tabs.Screen
                name='index'
                options={{
                    title: 'Home',
                    tabBarIcon: ({ focused }) => <TabBarIcon title="Home" icon={images.home} focused={focused} />
                }}
            />
            <Tabs.Screen
                name='search'
                options={{
                    title: 'Search',
                    tabBarIcon: ({ focused }) => <TabBarIcon title="Search" icon={images.search} focused={focused} />
                }}
            />
            <Tabs.Screen
                name='cart'
                options={{
                    title: 'Cart',
                    tabBarIcon: ({ focused }) => <TabBarIcon title="Cart" icon={images.bag} focused={focused} />
                }}
            />
            <Tabs.Screen
                name='profile'
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ focused }) => <TabBarIcon title="Profile" icon={images.person} focused={focused} />
                }}
            />
        </Tabs>
    );
}
