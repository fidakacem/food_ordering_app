import { FlatList, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { Category } from "@/type";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";

const Filter = ({ categories }: { categories: Category[] }) => {
    const searchParams = useLocalSearchParams();
    const [active, setActive] = useState(searchParams.category || ''); // catégorie active

    const handlePress = (id: string) => {
        setActive(id);
        if (id === 'all') router.setParams({ category: undefined });
        else router.setParams({ category: id }); // filtrer par catégorie
    };

    const filterData = [
        { $id: 'all', name: 'All' },
        ...categories.map(cat => ({ $id: cat.$id, name: cat.name }))
    ];

    return (
        <FlatList
            data={filterData}
            keyExtractor={item => item.$id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={[
                        styles.filter,
                        active === item.$id ? styles.activeFilter : styles.inactiveFilter,
                        Platform.OS === 'android' ? { elevation: 5, shadowColor: '#878787' } : {}
                    ]}
                    onPress={() => handlePress(item.$id)}
                >
                    <Text style={active === item.$id ? styles.activeText : styles.inactiveText}>
                        {item.name}
                    </Text>
                </TouchableOpacity>
            )}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        paddingBottom: 12,
        flexDirection: 'row',
        gap: 8,
    },
    filter: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    activeFilter: {
        backgroundColor: '#f59e0b',
    },
    inactiveFilter: {
        backgroundColor: '#ffffff',
    },
    activeText: {
        color: '#ffffff',
    },
    inactiveText: {
        color: '#a3a3a3',
    },
});

export default Filter;
