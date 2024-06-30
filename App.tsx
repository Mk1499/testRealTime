/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  useColorScheme,
  PanResponder,
  Image,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import Card from './components/Card/Card';
import data from './assets/data.json';
import refreshIcon from './assets/images/refresh-icon.png';
import animatedLogo from './assets/images/dribbble-logo.gif';

function App(): React.JSX.Element {
  const scrollPosition = useSharedValue(0);
  const pullDownPosition = useSharedValue(0);
  const isReadyToRefresh = useSharedValue(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const onPanRelease = () => {
    pullDownPosition.value = withTiming(isReadyToRefresh.value ? 75 : 0, {
      duration: 180,
    });

    if (isReadyToRefresh.value) {
      isReadyToRefresh.value = false;

      // A function that resets the animation
      const onRefreshComplete = () => {
        pullDownPosition.value = withTiming(0, {duration: 180});
      };

      // trigger the refresh action
      onRefresh(onRefreshComplete);
    }
  };

  const onRefresh = (done: () => void) => {
    console.log('Refreshing...');
    setRefreshing(true);

    setTimeout(() => {
      console.log('Refreshed!');
      setRefreshing(false);

      done();
    }, 7500);
  };

  const panResponderRef = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (event, gestureState) =>
        scrollPosition.value <= 0 && gestureState.dy >= 0,
      onPanResponderMove: (event, gestureState) => {
        const maxDistance = 150;
        pullDownPosition.value = Math.max(
          Math.min(maxDistance, gestureState.dy),
          0,
        );

        if (
          pullDownPosition.value >= maxDistance / 2 &&
          isReadyToRefresh.value === false
        ) {
          isReadyToRefresh.value = true;
          console.log('Ready to refresh');
        }

        if (
          pullDownPosition.value < maxDistance / 2 &&
          isReadyToRefresh.value === true
        ) {
          isReadyToRefresh.value = false;
          console.log('Will not refresh on release');
        }
      },
      onPanResponderRelease: onPanRelease,
      onPanResponderTerminate: onPanRelease,
    }),
  );

  const pullDownStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: pullDownPosition.value,
        },
      ],
    };
  });

  const backgroundStyle = {
    backgroundColor: Colors.darker,
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollPosition.value = event.contentOffset.y;
      console.log(event.contentOffset.y);
    },
  });

  const refreshContainerStyles = useAnimatedStyle(() => {
    return {
      height: pullDownPosition.value,
    };
  });

  const refreshIconStyles = useAnimatedStyle(() => {
    const scale = Math.min(1, Math.max(0, pullDownPosition.value / 75));

    return {
      opacity: refreshing
        ? withDelay(100, withTiming(0, {duration: 20}))
        : Math.max(0, pullDownPosition.value - 25) / 50,
      transform: [
        {
          scaleX: refreshing ? withTiming(0.15, {duration: 120}) : scale,
        },
        {
          scaleY: scale,
        },
        {
          rotate: `${pullDownPosition.value * 3}deg`,
        },
      ],
      backgroundColor: refreshing ? '#fff' : 'transparent',
    };
  }, [refreshing]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}>
      <View
        pointerEvents={refreshing ? 'none' : 'auto'}
        style={{
          flex: 1,
          backgroundColor: '#333',
        }}>
        <Animated.View
          style={[styles.refreshContainer, refreshContainerStyles]}>
          {refreshing && (
            <Image
              source={animatedLogo}
              style={{width: 280, height: '100%', objectFit: 'cover'}}
            />
          )}
          <Animated.Image
            source={refreshIcon}
            style={[styles.refreshIcon, refreshIconStyles]}
          />
        </Animated.View>
        <Animated.View
          style={[styles.root, pullDownStyles]}
          {...panResponderRef.current.panHandlers}>
          <Animated.FlatList
            data={data}
            keyExtractor={item => item.id?.toString()}
            overScrollMode="never"
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{height: 20}} />}
            contentContainerStyle={{
              paddingHorizontal: 50,
              paddingVertical: 30,
            }}
            renderItem={({item}) => (
              <Card image={item.image} title={item.title} likes={item.likes} />
            )}
            // Add new props after this line: 👇
            //-----------------------------------
            onScroll={scrollHandler}
            scrollEventThrottle={16}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ffabe7',
  },
  refreshContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 36,
    height: 36,
    marginTop: -18,
    marginLeft: -18,
    borderRadius: 18,
    objectFit: 'contain',
  },
});

export default App;
