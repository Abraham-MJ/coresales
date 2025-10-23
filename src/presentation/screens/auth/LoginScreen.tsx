import { Button, Input, ScreenContainer, Text } from '@presentation/components/ui';
import { GradientBackground } from '@presentation/components/ui/GradientBackground';
import React, { useState } from 'react';
import { Dimensions, Image, PanResponder, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { login_styles } from './styles/login-styles';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function LoginScreen() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const translateY = useSharedValue(SCREEN_HEIGHT * 0.8);
  const cardHeight = SCREEN_HEIGHT * 0.8;

  const showCard = () => {
    setIsOpen(true);
    translateY.value = withSpring(0, {
      damping: 25,
      stiffness: 200,
      mass: 1,
    });
  };

  const hideCard = () => {
    setIsOpen(false);
    translateY.value = withSpring(cardHeight, {
      damping: 15,
      stiffness: 400,
      mass: 0.6,
    });
  };

  const startY = useSharedValue(0);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dy) > 5 && gestureState.dy > 0;
    },
    onPanResponderGrant: () => {
      startY.value = translateY.value;
    },
    onPanResponderMove: (evt, gestureState) => {
      const newY = startY.value + gestureState.dy;
      if (newY >= 0) {
        translateY.value = newY;
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      const dragDistance = gestureState.dy;
      const dragPercentage = (dragDistance / cardHeight) * 100;
      const velocity = gestureState.vy;

      if (dragPercentage > 10 || velocity > 0.5) {
        setIsOpen(false);
        translateY.value = withSpring(cardHeight, {
          damping: 15,
          stiffness: 400,
          mass: 0.6,
        });
      } else {
        translateY.value = withSpring(0, {
          damping: 15,
          stiffness: 400,
          mass: 0.6,
        });
      }
    },
  });

  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <GradientBackground>
      <ScreenContainer>
        <View style={login_styles.container}>
          <View style={[isOpen ? login_styles.headerContent : login_styles.mainContent]}>
            {!isOpen && (
              <>
                <View style={login_styles.logoContainer}>
                  <Image
                    source={require('@/assets/images/icon-nextcore.png')}
                    style={login_styles.logo}
                    resizeMode="contain"
                  />
                </View>

                <Text variant='hero' style={login_styles.title}>
                  NextCore
                </Text>
                <Text variant='subtitle1' style={login_styles.subtitle}>
                  Gestiona tus ventas con eficiencia
                </Text>
              </>
            )}
          </View>

          {!isOpen && (
            <View style={login_styles.bottomSection}>
              <Button
                title="Iniciar sesión"
                style={login_styles.button}
                onPress={showCard}
                size='large'
                textStyle={{ fontWeight: 'medium' }}
              />
            </View>
          )}

          {isOpen && (
            <Animated.View style={[login_styles.loginCard, cardAnimatedStyle]}>
              <View style={login_styles.handle} {...panResponder.panHandlers}>
                <TouchableOpacity
                  style={login_styles.handleButton}
                  onPress={hideCard}
                  activeOpacity={0.7}
                />
              </View>

              <View style={login_styles.cardContent}>
                <View style={login_styles.form}>
                  <Input placeholder='Correo electrónico' error='Correo malo' label='Correo electronico:' />
                  <Input placeholder='Contraseña' secureTextEntry={true} error='Correo malo' label='Contraseña:' />
                </View>
              </View>
            </Animated.View>
          )}
        </View>
      </ScreenContainer>
    </GradientBackground>
  );
}
