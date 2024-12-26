import React, {useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import examsData from '../../papers.json';

const HomeScreen = () => {
  const navigation = useNavigation();
  const scrollY = new Animated.Value(0);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Available Exams</Text>
      <Text style={styles.headerSubtitle}>Select an exam to view papers</Text>
    </View>
  );

  const renderItem = ({item, index}) => {
    // Adjusted animation ranges for more subtle effect
    console.log(item);
    const inputRange = [
      -1,
      0,
      (hp(12) + hp(2)) * index,
      (hp(12) + hp(2)) * (index + 2),
    ];

    // Reduced scale range for subtler transform
    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [1, 1, 1, 0.97],
      extrapolate: 'clamp', // Prevents excessive scaling
    });

    // Reduced opacity range to keep items more visible
    const opacity = scrollY.interpolate({
      inputRange,
      outputRange: [1, 1, 1, 0.8],
      extrapolate: 'clamp', // Prevents excessive fading
    });

    return (
      <Animated.View
        style={[
          styles.itemContainer,
          {
            transform: [{scale}],
            opacity,
          },
        ]}>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => navigation.navigate('Papers', {exam: item})}
          activeOpacity={0.7}>
          <View style={styles.iconContainer}>
            <Icon name="file-text" size={wp('6%')} color="#007BFF" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.examName}>{item.examName}</Text>
            <Text style={styles.date}>{item.date}</Text>
          </View>
          <View style={styles.arrowContainer}>
            <Icon name="chevron-right" size={wp('4%')} color="#007BFF" />
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
      <Animated.FlatList
        data={examsData.exams}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: true},
        )}
        scrollEventThrottle={16} // Ensures smooth animation
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  headerContainer: {
    padding: wp('4%'),
    marginBottom: hp('2%'),
  },
  headerTitle: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: hp('0.5%'),
  },
  headerSubtitle: {
    fontSize: wp('3.5%'),
    color: '#666',
  },
  listContainer: {
    padding: wp('4%'),
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: wp('3%'),
    marginBottom: hp('2%'),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('4%'),
  },
  iconContainer: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: wp('3%'),
  },
  examName: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: hp('0.5%'),
  },
  date: {
    fontSize: wp('3.5%'),
    color: '#666',
  },
  arrowContainer: {
    padding: wp('2%'),
  },
});

export default HomeScreen;
