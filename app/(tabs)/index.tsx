import { SafeAreaView } from "react-native-safe-area-context"; 
// SafeAreaView : permet d’éviter que le contenu ne chevauche la zone de l’écran réservée (notch, barre d’état)

import { FlatList, Image, Pressable, Text, TouchableOpacity, View } from "react-native"; 
// Import des composants natifs React Native pour l’affichage :
// FlatList → liste optimisée
// Image → affichage d’image
// Pressable → zone cliquable avec effet de pression
// Text → texte
// TouchableOpacity → zone cliquable avec effet d’opacité
// View → conteneur générique
import { Fragment } from "react"; 
// Fragment → wrapper pour retourner plusieurs éléments sans créer de View supplémentaire
import cn from 'clsx'; 
// clsx → bibliothèque pour gérer les classes conditionnelles (style Tailwind/React Native)
import CartButton from "@/components/CartButton"; 
// Bouton panier (composant réutilisable)
import { images, offers } from "@/constants"; 
// images → collection d’icônes et images
// offers → tableau des offres à afficher dans la liste
import useAuthStore from "@/store/auth.store"; 
// store de l’authentification (pour récupérer l’utilisateur connecté)


export default function Index() {
    // Récupération de l’utilisateur connecté depuis le store d’auth
  const { user } = useAuthStore();

  return (
    //SafeAreaView qui occupe tout l’espace disponible (flex-1) et fond blanc
      <SafeAreaView className="flex-1 bg-white">
          {/*FlatList : affichage des offres */}
          <FlatList
              data={offers}
              renderItem={({ item, index }) => {
                  const isEven = index % 2 === 0;
                //Carte d’offre
                  return (
                      <View>
                          <Pressable
                              className={cn("offer-card", isEven ? 'flex-row-reverse' : 'flex-row')}
                              style={{ backgroundColor: item.color }}
                              android_ripple={{ color: "#fffff22"}}
                          >
                              {({ pressed }) => (
                                  <Fragment>
                                      <View className={"h-full w-1/2"}>
                                        <Image source={item.image} className={"size-full"} resizeMode={"contain"} />
                                      </View>

                                      <View className={cn("offer-card__info", isEven ? 'pl-10': 'pr-10')}>
                                          <Text className="h1-bold text-white leading-tight">
                                              {item.title}
                                          </Text>
                                          <Image
                                            source={images.arrowRight}
                                            className="size-10"
                                            resizeMode="contain"
                                            tintColor="#ffffff"
                                          />
                                      </View>
                                  </Fragment>
                              )}
                          </Pressable>
                      </View>
                  )
              }}
              contentContainerClassName="pb-28 px-5"
              ListHeaderComponent={() => (
                  <View className="flex-between flex-row w-full my-5">
                      <View className="flex-start">
                          <Text className="small-bold text-primary">DELIVER TO</Text>
                          <TouchableOpacity className="flex-center flex-row gap-x-1 mt-0.5">
                              <Text className="paragraph-bold text-dark-100">Sousse</Text>
                              <Image source={images.arrowDown} className="size-3" resizeMode="contain" />
                          </TouchableOpacity>
                      </View>

                      <CartButton />
                  </View>
              )}
          />
      </SafeAreaView>
  );
}
