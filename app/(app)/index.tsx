import { View, Text, StyleSheet, SectionList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../provider/AuthProvider';
import { supabase } from '../../config/initSupabase';
import BottomGrocerySheet from '../../components/BottomGrocerySheet';

const Page = () => {
  const [listItems, setListItems] = useState<any[]>([]);
  const { user } = useAuth();
  const [groceryOptions, setGroceryOptions] = useState<any[]>([
    'Banana',
    'Apple',
    'Oats',
    'Milk',
    'Eggs',
    'Bread',
    'Butter',
  ]);

  useEffect(() => {
    const fetchData = async () => {
      // Load categories from Supabase
      let { data: categories } = await supabase.from('categories').select('id, category');
      // Load products from Supabase
      const { data: products } = await supabase.from('products').select().eq('historic', false);
      const { data: historic } = await supabase.from('products').select().eq('historic', true);

      // Load previously used products from Supabase and set recommendations
      if (historic) {
        // remove duplicate names
        const combinedHistoric = [...historic.map((item: any) => item.name), ...groceryOptions];
        const uniqueHistoric = [...new Set(combinedHistoric)];
        console.log("🚀 ~ file: index.tsx:28 ~ fetchData ~ uniqueHistoric:", uniqueHistoric);
        setGroceryOptions(uniqueHistoric);
      }

      // Group products by category
      if (products) {
        const grouped: any = categories?.map((category: any) => {
          const items = products.filter((product: any) => product.category === category.id);
          return { ...category, data: items };
        });
        console.log("🚀 ~ file: index.tsx:42 ~ constgrouped:any=categories?.map ~ grouped:", grouped)

        setListItems(grouped);
      }
    }
    fetchData();
  }, [])

  // Add item to shopping list
  const onAddItem = async (name: string, categoryId: number) => {
    console.log('ITEM ADDED: ', name);
  };

  return (
    <View style={styles.container}>
      {listItems.length > 0 && (
        <SectionList
          renderSectionHeader={({ section: { category } }) => <Text style={styles.sectionHeader}>{category}</Text>}
          contentContainerStyle={{ paddingBottom: 150 }}
          sections={listItems}
        />
      )}

      <BottomGrocerySheet
        listItems={listItems}
        groceryOptions={groceryOptions}
        onItemSelected={(item, category) => onAddItem(item, category)}
      />
    </View>
  )
}

export default Page

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2a2a2a',
  },
  groceryRow: {
    flexDirection: 'row',
    backgroundColor: '#2b825b',
    padding: 10,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 4,
  },
  groceryName: {
    color: '#fff',
    fontSize: 20,
    flex: 1,
  },
  sectionHeader: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 20,
  },
});