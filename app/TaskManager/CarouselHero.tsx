import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Image, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.75;
const CARD_HEIGHT = CARD_WIDTH * 0.7;
const AUTOPLAY_INTERVAL = 3000;

const images = [
  require('../TaskManager/images/1.jpg'),
  require('../TaskManager/images/2.jpg'),
  require('../TaskManager/images/3.jpg'),
  require('../TaskManager/images/4.jpg'),
  require('../TaskManager/images/5.jpg'),
  require('../TaskManager/images/6.jpg'),
];

const AnimatedCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(0);


  const changeSlide = useCallback((direction: number) => {
    scale.value = withSequence(
      withTiming(0.9, { duration: 150 }),
      withTiming(1, { duration: 150 })
    );
    opacity.value = withTiming(0, { duration: 150 });
    translateX.value = withSpring(direction * CARD_WIDTH);

    setTimeout(() => {
      translateX.value = 0;
      opacity.value = withTiming(1, { duration: 150 });
      setActiveIndex((prev) =>
        direction > 0
          ? (prev + 1) % images.length
          : (prev - 1 + images.length) % images.length
      );
    }, 150);
  }, []);


  const nextSlide = useCallback(() => {
    changeSlide(1);
  }, []);

  const prevSlide = useCallback(() => {
    changeSlide(-1);
  }, []);

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;
    if (isAutoplay) {
      interval = setInterval(nextSlide, AUTOPLAY_INTERVAL);
    }
    return () => clearInterval(interval);
  }, [isAutoplay, nextSlide]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: scale.value }
    ],
    opacity: opacity.value,
  }));

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {images.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            { backgroundColor: index === activeIndex ? '#000' : '#ccc' },
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.carouselContainer}>
          <Pressable onPress={prevSlide} style={[styles.navButton, styles.leftNavButton]}>
            <AntDesign name="leftcircle" size={30} color="#000" />
          </Pressable>

          <Animated.View style={[styles.cardContainer, animatedStyle]}>
            <Image
              source={images[activeIndex]}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.overlay}>
              <View style={styles.playPauseButton}>
                <Pressable onPress={() => setIsAutoplay(!isAutoplay)}>
                  <AntDesign
                    name={isAutoplay ? "pausecircleo" : "playcircleo"}
                    size={24}
                    color="white"
                  />
                </Pressable>
              </View>
            </View>
          </Animated.View>

          <Pressable onPress={nextSlide} style={[styles.navButton, styles.rightNavButton]}>
            <AntDesign name="rightcircle" size={30} color="#000" />
          </Pressable>
        </View>
        {renderDots()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 20,
  },
  carouselContainer: {
    width: SCREEN_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: 'white',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 10,
  },
  playPauseButton: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 5,
  },
  navButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 30,
    position: 'absolute',
    zIndex: 1,
  },
  leftNavButton: {
    left: (SCREEN_WIDTH - CARD_WIDTH) / 2 - 25,
  },
  rightNavButton: {
    right: (SCREEN_WIDTH - CARD_WIDTH) / 2 - 25,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
  },
});

export default AnimatedCarousel;