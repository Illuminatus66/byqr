import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {
  ViroARScene,
  ViroARSceneNavigator,
  Viro3DObject,
  ViroAmbientLight,
  ViroSpotLight,
  ViroNode,
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
  Orders: undefined;
};

const ARBicycleScene = () => {
  const [position, setPosition] = useState<[number, number, number]>([
    0, 0, -2,
  ]);

  return (
    <ViroARScene>
      <ViroAmbientLight color={'#ffffff'} intensity={0.5} />
      <ViroSpotLight
        position={[0, 2, 1]}
        color="#ffffff"
        intensity={0.8}
        direction={[0, -1, -1]}
        castsShadow={true}
        innerAngle={45}
        outerAngle={60}
        attenuationStartDistance={2}
        attenuationEndDistance={10}
      />
      <ViroNode
        position={position}
        dragType="FixedToWorld"
        onDrag={(dragToPos: [number, number, number]) => {
          setPosition(dragToPos);
        }}>
        <Viro3DObject
          source={require('../assets/models/bicycle.glb')}
          scale={[1.0, 1.0, 1.0]}
          type="GLB"
        />
      </ViroNode>
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
  backButtonText: {color: '#000000', fontSize: 10},
});

export default ARScreen;
