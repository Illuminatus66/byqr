import React, {useState, useMemo} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useAppSelector} from '../hooks';
import {selectOrders} from '../reducers/orderSlice';
import OrdersByYear from '../components/OrdersByYear';
import Toolbar from '../components/Toolbar';
import Footer from '../components/Footer';

const OrdersScreen = () => {
  const orders = useAppSelector(selectOrders);
  const [sortOrder, setSortOrder] = useState<'newToOld' | 'oldToNew'>(
    'newToOld',
  );
  const [selectedYear, setSelectedYear] = useState<'All Orders' | string>(
    'All Orders',
  );

  const years = useMemo(() => {
    const uniqueYears = new Set(
      orders.map(order => new Date(order.created_at).getFullYear().toString()),
    );
    return ['All Orders', ...Array.from(uniqueYears).sort().reverse()];
  }, [orders]);

  const filteredOrders = useMemo(() => {
    let filtered = orders;
    if (selectedYear !== 'All Orders') {
      filtered = orders.filter(
        order =>
          new Date(order.created_at).getFullYear().toString() === selectedYear,
      );
    }
    return filtered.sort((a, b) =>
      sortOrder === 'newToOld'
        ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        : new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );
  }, [orders, selectedYear, sortOrder]);

  return (
    <View style={styles.container}>
      <Toolbar title="BYQR" />
      <View style={styles.title}>
        <Text style={styles.titleText}>Orders</Text>
        <TouchableOpacity
          onPress={() =>
            setSortOrder(sortOrder === 'newToOld' ? 'oldToNew' : 'newToOld')
          }
          disabled={orders.length === 0}
          style={styles.sortButton}>
          <Text style={styles.sortButtonText}>
            {sortOrder === 'newToOld' ? 'New to Old' : 'Old to New'}
          </Text>
        </TouchableOpacity>
      </View>
      <Picker
        selectedValue={selectedYear}
        onValueChange={itemValue => setSelectedYear(itemValue)}
        enabled={orders.length > 0}>
        {years.map(year => (
          <Picker.Item key={year} label={year} value={year} />
        ))}
      </Picker>
      {filteredOrders.length === 0 ? (
        <View style={styles.container}>
          <Text style={styles.emptyText}>
            You have not ordered anything yet. Add products to your cart and
            start shopping!
          </Text>
        </View>
      ) : (
        <FlatList
          data={years.filter(y => y !== 'All Orders')}
          keyExtractor={year => year}
          renderItem={({item}) => (
            <OrdersByYear
              year={item}
              orders={filteredOrders.filter(
                order =>
                  new Date(order.created_at).getFullYear().toString() === item,
              )}
            />
          )}
        />
      )}
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  emptyText: {
    fontSize: 25, 
    textAlign: 'center', 
    marginTop: '50%'
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  titleText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  sortButton: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 7,
    padding: 3,
    backgroundColor: '#6200EE',
  },
  sortButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default OrdersScreen;
