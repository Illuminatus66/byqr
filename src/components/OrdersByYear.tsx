import React from 'react';
import {View, Text, FlatList, Image, StyleSheet} from 'react-native';

interface ProductForOrderScreen {
  pr_id: string;
  name: string;
  qty: number;
  price: number;
  thumbnail: string;
}
interface Orders {
  receipt: string;
  products: ProductForOrderScreen[];
  total_amount: number;
  created_at: string;
}

interface OrdersByYearRouteProp {
  year: string;
  orders: Orders[];
}

const OrdersByYear: React.FC<OrdersByYearRouteProp> = ({year, orders}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.yearTitle}>{year}</Text>
      <FlatList
        data={orders}
        keyExtractor={item => item.receipt}
        renderItem={({item}) => (
          <View style={styles.orderBox}>
            <View style={styles.orderHeader}>
              <Text style={styles.receipt}>{item.receipt}</Text>
              <Text style={styles.date}>
                {new Date(item.created_at).toDateString()} at {''}
                {new Date(item.created_at).toLocaleTimeString()}
              </Text>
            </View>
            <Text style={styles.totalAmount}>
              Total: Rs. {item.total_amount}
            </Text>
            <View style={styles.separator} />
            <FlatList
              data={item.products}
              keyExtractor={product => product.pr_id}
              renderItem={({item: product}) => (
                <View style={styles.productContainer}>
                  <Image
                    source={{uri: product.thumbnail}}
                    style={styles.thumbnail}
                  />
                  <View style={styles.productDetails}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productPrice}>
                      Rs. {product.price} x {product.qty} units = Rs.{' '}
                      {product.price * product.qty}
                    </Text>
                  </View>
                </View>
              )}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  yearTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 10,
  },
  orderBox: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  receipt: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: 'gray',
  },
  totalAmount: {
    fontSize: 16,
    marginVertical: 5,
  },
  separator: {
    height: 4,
    backgroundColor: '#000',
    marginVertical: 5,
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingVertical: 5,
  },
  thumbnail: {
    width: '20%',
    height: 60,
    resizeMode: 'cover',
  },
  productDetails: {
    width: '80%',
    paddingLeft: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: 'gray',
  },
});

export default OrdersByYear;
