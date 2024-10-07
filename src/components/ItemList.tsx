/* eslint-disable prettier/prettier */
import React from 'react';
import {View, Text, Image, StyleSheet, FlatList} from 'react-native';

const ItemList = ({items, renderButtons}) => {
  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Image source={{uri: item.thumbnail}} style={styles.itemthumbnail} />
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemPrice}>{item.price}</Text>

      {/* Render buttons if the function is provided */}
      {renderButtons && typeof renderButtons === 'function' && (
        <View style={styles.actionButtons}>{renderButtons(item)}</View>
      )}
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
  itemthumbnail: {
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
  list: {
    paddingHorizontal: 10,
    marginTop: 10,
  },
});

export default ItemList;
