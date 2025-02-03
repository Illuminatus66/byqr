import React from 'react';
import {View, StyleSheet} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

interface StoreLocatorProps {
  latitude: number;
  longitude: number;
}

const StoreLocator: React.FC<StoreLocatorProps> = ({latitude, longitude}) => {
  return (
    <View style={styles.container}>
      <MapView
        provider="google"
        googleMapId="933cc19be330b127"
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}>
        <Marker coordinate={{latitude, longitude}} />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 250,
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
});

export default StoreLocator;
