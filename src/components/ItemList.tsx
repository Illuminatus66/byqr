import React from 'react';
import { FlatList, View, Text, Image, StyleSheet } from 'react-native';

const ItemList = ({ items }) => {
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <Text style={styles.itemName}>{item.name}</Text>
    </View>
  );

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      numColumns={2}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 5,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  itemImage: { width: 150, height: 150, borderRadius: 10 },
  itemName: { marginTop: 10, fontWeight: 'bold' },
  list: { paddingHorizontal: 10, marginTop: 10 },
});

export default ItemList;
