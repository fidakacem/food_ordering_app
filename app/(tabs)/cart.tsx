//Importe les composants de base de React Native pour construire l’UI
import {View, Text, FlatList} from 'react-native'
//Assurer que le contenu ne dépasse pas les zones “sensibles” (notch iPhone, barres système).
import {SafeAreaView} from "react-native-safe-area-context";
//Importe le store Zustand personnalisé pour récupérer les items du panier et calculer totaux.
import {useCartStore} from "@/store/cart.store";
//Mon header personnalisé réutilisable.
import CustomHeader from "@/components/CustomHeader";
//clsx permet de combiner des classes conditionnellement, pratique avec NativeWind.
import cn from "clsx";
//Bouton réutilisable.
import CustomButton from "@/components/CustomButton";
//Composant pour afficher un item dans le panier.
import CartItem from "@/components/CartItem";


//Sous-composant réutilisable pour une ligne du résumé de paiement: PaymentInfoStripe 
const PaymentInfoStripe = ({ label,  value,  labelStyle,  valueStyle, }: PaymentInfoStripeProps) => (
    <View className="flex-between flex-row my-1">
        <Text className={cn("paragraph-medium text-gray-200", labelStyle)}>
            {label}
        </Text>
        <Text className={cn("paragraph-bold text-dark-100", valueStyle)}>
            {value}
        </Text>
    </View>
);
//Déclaration du composant principal de l’écran panier.
const Cart = () => {
    /* Récupère :
    items: tous les éléments du panier
    getTotalItems(): nombre total d’articles
    getTotalPrice(): prix total des articles*/
    const { items, getTotalItems, getTotalPrice } = useCartStore();

    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();

    return (
        <SafeAreaView className="bg-white h-full">
            <FlatList
              /* data={items} : la liste vient du store.
                renderItem : comment afficher chaque produit.
                CartItem : composant UI pour chaque article.
                keyExtractor : clé unique.*/
                data={items}
                renderItem={({ item }) => <CartItem item={item} />}
                keyExtractor={(item) => item.id}
                
                contentContainerClassName="pb-28 px-5 pt-5"
                //Afficher un header en haut.
                ListHeaderComponent={() => <CustomHeader title="Your Cart" />}
                ListEmptyComponent={() => <Text>Cart Empty</Text>}
                //Le summary s’affiche seulement si le panier n’est pas vide.
                ListFooterComponent={() => totalItems > 0 && (
                    <View className="gap-5">
                        <View className="mt-6 border border-gray-200 p-5 rounded-2xl">
                            <Text className="h3-bold text-dark-100 mb-5">
                                Payment Summary
                            </Text>

                            {/*Total en se basant sur les données du store. */}
                            <PaymentInfoStripe
                                label={`Total Items (${totalItems})`}
                                value={`${totalPrice.toFixed(2)} TND`}
                            />
                            <PaymentInfoStripe
                                label={`Delivery Fee`}
                                value={` 5.00 TND`}
                            />
                            <PaymentInfoStripe
                                label={`Discount`}
                                value={`- 0.50 TND`}
                                valueStyle="!text-success"
                            />
                            <View className="border-t border-gray-300 my-2" />
                            <PaymentInfoStripe
                                label={`Total`}
                                value={`${(totalPrice + 5 - 0.5).toFixed(2)} TND`}
                                labelStyle="base-bold !text-dark-100"
                                valueStyle="base-bold !text-dark-100 !text-right"
                            />
                        </View>

                        <CustomButton title="Order Now" />
                    </View>
                )}
            />
        </SafeAreaView>
    )
}

export default Cart
