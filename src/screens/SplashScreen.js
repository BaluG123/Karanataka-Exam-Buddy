// import {View, Text} from 'react-native';
// import React from 'react';

// const SplashScreen = ({navigation}) => {
//   setTimeout(() => {
//     navigation.navigate('Home');
//   }, 2000);
//   return (
//     <View>
//       <Text>SplashScreen</Text>
//     </View>
//   );
// };

// export default SplashScreen;

import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const SplashScreen = ({navigation}) => {
  // Animation values
  const logoScale = new Animated.Value(0);
  const titleOpacity = new Animated.Value(0);
  const subtitleOpacity = new Animated.Value(0);

  useEffect(() => {
    // Animate logo
    Animated.spring(logoScale, {
      toValue: 1,
      tension: 10,
      friction: 2,
      useNativeDriver: true,
    }).start();

    // Animate title
    Animated.timing(titleOpacity, {
      toValue: 1,
      duration: 800,
      delay: 300,
      useNativeDriver: true,
    }).start();

    // Animate subtitle
    Animated.timing(subtitleOpacity, {
      toValue: 1,
      duration: 800,
      delay: 600,
      useNativeDriver: true,
    }).start();

    // Navigate to Home screen after delay
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1a237e" barStyle="light-content" />

      {/* Background Pattern */}
      <View style={styles.backgroundPattern} />

      {/* Main Content */}
      <View style={styles.content}>
        {/* Animated Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{scale: logoScale}],
            },
          ]}>
          <Icon name="graduation-cap" size={wp('20%')} color="#fff" />
        </Animated.View>

        {/* Animated Title */}
        <Animated.Text
          style={[
            styles.title,
            {
              opacity: titleOpacity,
            },
          ]}>
          Karnataka Exam Hub
        </Animated.Text>

        {/* Animated Subtitle */}
        <Animated.Text
          style={[
            styles.subtitle,
            {
              opacity: subtitleOpacity,
            },
          ]}>
          Your Gateway to Success
        </Animated.Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Icon
          name="book"
          size={wp('4%')}
          color="#fff"
          style={styles.footerIcon}
        />
        <Text style={styles.footerText}>Prepare • Practice • Succeed</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a237e', // Deep blue color
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#283593',
    opacity: 0.1,
    transform: [{rotate: '45deg'}],
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: wp('10%'),
  },
  logoContainer: {
    width: wp('30%'),
    height: wp('30%'),
    borderRadius: wp('15%'),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('3%'),
  },
  title: {
    fontSize: wp('8%'),
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: hp('1%'),
    ...Platform.select({
      android: {
        fontFamily: 'Roboto',
      },
      ios: {
        fontFamily: 'System',
      },
    }),
  },
  subtitle: {
    fontSize: wp('4%'),
    color: '#E8EAF6',
    textAlign: 'center',
    letterSpacing: wp('0.2%'),
  },
  footer: {
    position: 'absolute',
    bottom: hp('5%'),
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerIcon: {
    marginRight: wp('2%'),
  },
  footerText: {
    color: '#E8EAF6',
    fontSize: wp('3.5%'),
    letterSpacing: wp('0.1%'),
  },
});

export default SplashScreen;
