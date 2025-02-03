import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroARPlaneSelector,
  Viro3DObject,
} from '@reactvision/react-viro';
import {NavigationProp, useNavigation} from '@react-navigation/native';

interface Store {
  name: string;
  lat: number;
  long: number;
}
interface Product {
  _id: string;
  name: string;
  price: number;
  thumbnail: string;
  imgs: string[];
  description: string;
  category: string;
  stock: number;
  date_added: string;
  frameMaterial: string;
  weight: number;
  wheelSize: number;
  gearSystem: string;
  brakeType: string;
  suspension: string;
  tyreType: string;
  brand: string;
  warranty: string;
  stores: Store[];
}

type RootStackParamList = {
  Home: {filter: string};
  Cart: undefined;
  Login: undefined;
  Wishlist: undefined;
  ProductDescription: {pr_id: string};
  Profile: undefined;
  Compare: {ComparisonProducts: Product[]};
  ARScreen: undefined;
};

const ARBicycleScene = () => {
  const [placed, setPlaced] = useState(false);

  return (
    <ViroARScene>
      {!placed && (
        <ViroARPlaneSelector
          onPlaneSelected={() => setPlaced(true)} // Locked placement
        >
          <Viro3DObject
            source={require('../assets/models/mini_bicycle.glb')}
            position={[0, 0, -2]}
            scale={[1.0, 1.0, 1.0]}
            type="GLB"
            dragType="FixedToWorld"
            onDrag={() => {}} // Allows dragging but keeps it locked on the real-world plane
          />
        </ViroARPlaneSelector>
      )}

      {placed && (
        <Viro3DObject
          source={require('../assets/models/mini_bicycle.glb')}
          position={[0, 0, -2]}
          scale={[1.0, 1.0, 1.0]}
          type="GLB"
          dragType="FixedToWorld"
          onDrag={() => {}}
        />
      )}
    </ViroARScene>
  );
};

const ARScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{scene: ARBicycleScene}}
      />
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <Text style={styles.backButtonText}>Back to Product</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  backButton: {position: 'absolute', top: 20, left: 20, color: '#fff'},
  backButtonText: {color: '#000000', fontSize: 6},
});

export default ARScreen;
