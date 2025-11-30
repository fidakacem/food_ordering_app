import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import useAppwrite from "@/lib/useAppwrite";
import { getCategories, getMenu } from "@/lib/appwrite";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import CartButton from "@/components/CartButton";
import MenuCard from "@/components/MenuCard";
import { MenuItem, Category } from "@/type";

import Filter from "@/components/Filter";
import SearchBar from "@/components/SearchBar";

const Search = () => {
    const { category, query } = useLocalSearchParams<{ query: string; category: string }>();

    const { data: menuData, refetch, loading } = useAppwrite({
        fn: getMenu,
        params: { category, query, limit: 6 },
    });

    const { data: categoriesData } = useAppwrite({ fn: getCategories });

    useEffect(() => {
        refetch({ category, query, limit: 6 });
    }, [category, query]);

    const categories: Category[] = categoriesData?.map(cat => ({
        $id: cat.$id,
        name: cat.name,
        description: cat.description,
    })) || [];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <FlatList
                data={menuData || []}
                renderItem={({ item, index }) => {
                    const isFirstRightColItem = index % 2 === 0;
                    return (
                        <View style={{
                            flex: 1,
                            maxWidth: '48%',
                            marginTop: !isFirstRightColItem ? 10 : 0
                        }}>
                            <MenuCard item={item as MenuItem} />
                        </View>
                    );
                }}
                keyExtractor={item => item.$id}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 20 }}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
                ListHeaderComponent={() => (
                    <View style={{ marginVertical: 20 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View>
                                <Text style={{ fontWeight: 'bold', textTransform: 'uppercase', color: '#f59e0b' }}>Search</Text>
                                <Text style={{ fontWeight: '600', color: '#333' }}>Find your favorite food</Text>
                            </View>
                            <CartButton />
                        </View>

                        <SearchBar />

                        {categories.length > 0 && <Filter categories={categories} />}
                    </View>
                )}
                ListEmptyComponent={() => !loading && <Text style={{ textAlign: 'center', marginTop: 20 }}>No results</Text>}
            />
        </SafeAreaView>
    );
};

export default Search;
