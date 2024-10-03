import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

const ItemList = ({ items, renderButtons }) => {
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.thumbnail }} style={styles.itemImage} />
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemPrice}>{item.price}</Text>

      {/* Render buttons if provided */}
      {renderButtons && (
        <View style={styles.actionButtons}>
          {renderButtons(item)}
        </View>
      )}
    </View>
  );

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
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
  itemImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  itemName: {
    marginTop: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  itemPrice: {
    marginTop: 5,
    fontSize: 14,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#6200EE',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  list: {
    paddingHorizontal: 10,
    marginTop: 10,
  },
});

export default ItemList;
