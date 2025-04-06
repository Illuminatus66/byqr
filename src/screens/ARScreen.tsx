import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Vibration,
  Alert,
  ToastAndroid,
} from 'react-native';
import {
  ViroARScene,
  ViroARSceneNavigator,
  Viro3DObject,
  ViroAmbientLight,
  ViroSpotLight,
  ViroNode,
  ViroTrackingStateConstants,
  ViroARTrackingReasonConstants,
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
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);
  const [isTrackingNormal, setIsTrackingNormal] = useState(false);
  const nodeRef = useRef<any>(null);
  const hasVibratedRef = useRef(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const BOUNDS = {
    xMin: -2,
    xMax: 2,
    yMin: 0,
    yMax: 0.1,
    zMin: -3,
    zMax: 3,
  };
  const hasHitBoundary = (x: number, y: number, z: number) => {
    return (
      x < BOUNDS.xMin ||
      x > BOUNDS.xMax ||
      y < BOUNDS.yMin ||
      y > BOUNDS.yMax ||
      z < BOUNDS.zMin ||
      z > BOUNDS.zMax
    );
  };

  const onInitialized = (state: any, reason: ViroARTrackingReasonConstants) => {
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      setIsTrackingNormal(true);
    } else if (state === ViroTrackingStateConstants.TRACKING_LIMITED) {
      if (
        reason == ViroARTrackingReasonConstants.TRACKING_REASON_EXCESSIVE_MOTION
      ) {
        ToastAndroid.show(
          'Stop shaking the camera so hard!',
          ToastAndroid.SHORT,
        );
      }
    } else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
      Alert.alert(
        'AR tracking was lost.',
        'Try reopening the AR view more steadily from the product page',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    }
  };

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
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
        ref={nodeRef}
        rotation={rotation}
        position={position}
        dragType="FixedToWorld"
        onDrag={(dragToPos: [number, number, number]) => {
          const [x, y, z] = dragToPos;

          const clampedX = Math.max(BOUNDS.xMin, Math.min(BOUNDS.xMax, x));
          const clampedY = Math.max(BOUNDS.yMin, Math.min(BOUNDS.yMax, y));
          const clampedZ = Math.max(BOUNDS.zMin, Math.min(BOUNDS.zMax, z));

          const hit = hasHitBoundary(x, y, z);
          if (hit && !hasVibratedRef.current) {
            Vibration.vibrate(50);
            hasVibratedRef.current = true;
          } else if (!hit) {
            hasVibratedRef.current = false;
          }

          setPosition([clampedX, clampedY, clampedZ]);
        }}
        onRotate={(rotateState, rotationFactor, source) => {
          if (rotateState === 3) {
            // Releasing both fingers saves the final rotation
            setRotation(prev => [0, prev[1] + rotationFactor, 0]);
          } else {
            // Live update
            nodeRef.current?.setNativeProps({
              rotation: [0, rotation[1] + rotationFactor, 0],
            });
          }
        }}>
        {isTrackingNormal && (
          <Viro3DObject
            source={require('../assets/models/bicycle.glb')}
            scale={[1.0, 1.0, 1.0]}
            type="GLB"
          />
        )}
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
        <Text style={styles.backButtonText}>❌</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  backButton: {position: 'absolute', top: 10, left: 10, color: '#fff'},
  backButtonText: {fontSize: 10},
});

export default ARScreen;
