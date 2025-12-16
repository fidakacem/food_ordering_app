// CartItem.tsx
import { useCartStore } from "@/store/cart.store"; // hook Zustand pour accéder au panier
import { CartItemType } from "@/type"; // type des items du panier
import { Image, Text, TouchableOpacity, View } from "react-native";
import { images } from "@/constants"; // constantes d'images (plus, minus, trash)

const CartItem = ({ item }: { item: CartItemType }) => {
    const { increaseQty, decreaseQty, removeItem } = useCartStore(); // fonctions pour gérer la quantité et suppression

    return (
        <View className="cart-item">
            {/* Ligne principale: image + infos */}
            <View className="flex flex-row items-center gap-x-3">
                <View className="cart-item__image">
                    <Image
                        source={{ uri: item.image_url }}
                        className="size-4/5 rounded-lg"
                        resizeMode="cover"
                    />
                </View>

                <View>
                    <Text className="base-bold text-dark-100">{item.name}</Text>
                    <Text className="paragraph-bold text-primary mt-1"> 
                        {item.price} TND
                    </Text>

                    {/* Actions quantité */}
                    <View className="flex flex-row items-center gap-x-4 mt-2">
                        {/* Diminuer quantité */}
                        <TouchableOpacity
                            onPress={() => decreaseQty(item.id)}
                            className="cart-item__actions"
                        >
                            <Image
                                source={images.minus}
                                className="size-1/2"
                                resizeMode="contain"
                                tintColor={"#FF9C01"}
                            />
                        </TouchableOpacity>

                        <Text className="base-bold text-dark-100">{item.quantity}</Text>

                        {/* Augmenter quantité */}
                        <TouchableOpacity
                            onPress={() => increaseQty(item.id)}
                            className="cart-item__actions"
                        >
                            <Image
                                source={images.plus}
                                className="size-1/2"
                                resizeMode="contain"
                                tintColor={"#FF9C01"}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Bouton supprimer */}
            <TouchableOpacity
                onPress={() => removeItem(item.id)}
                className="flex-center"
            >
                <Image source={images.trash} className="size-5" resizeMode="contain" />
            </TouchableOpacity>
        </View>
    );
};

export default CartItem;
