// import React from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   TouchableOpacity,
//   Linking,
//   Animated,
//   Platform,
//   StatusBar,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';

// const PapersScreen = ({route}) => {
//   const {exam} = route.params;
//   const scrollY = new Animated.Value(0);

//   const renderHeader = () => (
//     <View style={styles.headerContainer}>
//       <View style={styles.examInfoContainer}>
//         <Icon name="graduation-cap" size={wp('8%')} color="#007BFF" />
//         <View style={styles.examTextContainer}>
//           <Text style={styles.examName}>{exam.examName}</Text>
//           <Text style={styles.examDate}>{exam.date}</Text>
//         </View>
//       </View>
//       <Text style={styles.subtitle}>Available Papers</Text>
//     </View>
//   );

//   const handleLinkPress = async url => {
//     try {
//       const supported = await Linking.canOpenURL(url);
//       if (supported) {
//         await Linking.openURL(url);
//       } else {
//         alert("Can't open this URL");
//       }
//     } catch (error) {
//       alert('Something went wrong');
//     }
//   };

//   const renderItem = ({item, index}) => {
//     const inputRange = [-1, 0, hp(18) * index, hp(18) * (index + 1)];

//     const scale = scrollY.interpolate({
//       inputRange,
//       outputRange: [1, 1, 1, 0.97],
//       extrapolate: 'clamp',
//     });

//     return (
//       <Animated.View
//         style={[
//           styles.paperContainer,
//           {
//             transform: [{scale}],
//           },
//         ]}>
//         <View style={styles.subjectHeader}>
//           <View style={styles.subjectIconContainer}>
//             <Icon name="book" size={wp('5%')} color="#007BFF" />
//           </View>
//           <View style={styles.subjectInfo}>
//             <Text style={styles.subject}>{item.subject}</Text>
//             <Text style={styles.subjectCode}>{item.subjectCode}</Text>
//           </View>
//         </View>

//         <View style={styles.detailsContainer}>
//           <View style={styles.detailItem}>
//             <Icon name="calendar" size={wp('4%')} color="#666" />
//             <Text style={styles.detailText}>{item.date}</Text>
//           </View>
//           <View style={styles.detailItem}>
//             <Icon name="clock-o" size={wp('4%')} color="#666" />
//             <Text style={styles.detailText}>{item.session}</Text>
//           </View>
//         </View>

//         {item.link && (
//             <>
//           <TouchableOpacity
//             style={styles.linkButton}
//             onPress={() => handleLinkPress(item.link)}
//             activeOpacity={0.7}>
//             <Icon name="download" size={wp('4%')} color="#fff" />
//             <Text style={styles.linkButtonText}>Download Paper</Text>
//           </TouchableOpacity>
//           </>
//         )}
//       </Animated.View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
//       <Animated.FlatList
//         data={exam.papers}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={renderItem}
//         ListHeaderComponent={renderHeader}
//         contentContainerStyle={styles.listContainer}
//         showsVerticalScrollIndicator={false}
//         onScroll={Animated.event(
//           [{nativeEvent: {contentOffset: {y: scrollY}}}],
//           {useNativeDriver: true},
//         )}
//         scrollEventThrottle={16}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f8f8',
//   },
//   headerContainer: {
//     padding: wp('4%'),
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//     marginBottom: hp('2%'),
//   },
//   examInfoContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: hp('1%'),
//   },
//   examTextContainer: {
//     marginLeft: wp('3%'),
//     flex: 1,
//   },
//   examName: {
//     fontSize: wp('5%'),
//     fontWeight: 'bold',
//     color: '#1a1a1a',
//     marginBottom: hp('0.5%'),
//   },
//   examDate: {
//     fontSize: wp('3.5%'),
//     color: '#666',
//   },
//   subtitle: {
//     fontSize: wp('4%'),
//     color: '#666',
//     marginTop: hp('1%'),
//   },
//   listContainer: {
//     padding: wp('4%'),
//   },
//   paperContainer: {
//     backgroundColor: '#fff',
//     borderRadius: wp('3%'),
//     padding: wp('4%'),
//     marginBottom: hp('2%'),
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: {width: 0, height: 2},
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//       },
//       android: {
//         elevation: 4,
//       },
//     }),
//   },
//   subjectHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: hp('2%'),
//   },
//   subjectIconContainer: {
//     width: wp('10%'),
//     height: wp('10%'),
//     borderRadius: wp('5%'),
//     backgroundColor: 'rgba(0, 123, 255, 0.1)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: wp('3%'),
//   },
//   subjectInfo: {
//     flex: 1,
//   },
//   subject: {
//     fontSize: wp('4%'),
//     fontWeight: '600',
//     color: '#1a1a1a',
//     marginBottom: hp('0.5%'),
//   },
//   subjectCode: {
//     fontSize: wp('3.5%'),
//     color: '#666',
//   },
//   detailsContainer: {
//     flexDirection: 'row',
//     marginBottom: hp('2%'),
//   },
//   detailItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: wp('4%'),
//   },
//   detailText: {
//     fontSize: wp('3.5%'),
//     color: '#666',
//     marginLeft: wp('2%'),
//   },
//   linkButton: {
//     backgroundColor: '#007BFF',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: wp('3%'),
//     borderRadius: wp('2%'),
//   },
//   linkButtonText: {
//     color: '#fff',
//     fontSize: wp('3.5%'),
//     fontWeight: '500',
//     marginLeft: wp('2%'),
//   },
// });

// export default PapersScreen;

import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Animated,
  Platform,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';

const PapersScreen = ({route}) => {
  const {exam} = route.params;
  const scrollY = new Animated.Value(0);
  const navigation = useNavigation();

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.examInfoContainer}>
        <Icon name="graduation-cap" size={wp('8%')} color="#007BFF" />
        <View style={styles.examTextContainer}>
          <Text style={styles.examName}>{exam.examName}</Text>
          <Text style={styles.examDate}>{exam.date}</Text>
        </View>
      </View>
      <Text style={styles.subtitle}>Available Papers</Text>
    </View>
  );

  const handleLinkPress = async url => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        alert("Can't open this URL");
      }
    } catch (error) {
      alert('Something went wrong');
    }
  };

  const handleViewPDF = item => {
    navigation.navigate('PDFViewer', {
      pdfUrl: item.link,
      examName: exam.examName,
      subject: item.subject,
    });
  };

  const renderItem = ({item, index}) => {
    const inputRange = [-1, 0, hp(18) * index, hp(18) * (index + 1)];

    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [1, 1, 1, 0.97],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
          styles.paperContainer,
          {
            transform: [{scale}],
          },
        ]}>
        <View style={styles.subjectHeader}>
          <View style={styles.subjectIconContainer}>
            <Icon name="book" size={wp('5%')} color="#007BFF" />
          </View>
          <View style={styles.subjectInfo}>
            <Text style={styles.subject}>{item.subject}</Text>
            <Text style={styles.subjectCode}>{item.subjectCode}</Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Icon name="calendar" size={wp('4%')} color="#666" />
            <Text style={styles.detailText}>{item.date}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="clock-o" size={wp('4%')} color="#666" />
            <Text style={styles.detailText}>{item.session}</Text>
          </View>
        </View>

        {item.link && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.linkButton, styles.downloadButton]}
              onPress={() => handleLinkPress(item.link)}
              activeOpacity={0.7}>
              <Icon name="download" size={wp('4%')} color="#fff" />
              <Text style={styles.linkButtonText}>Download Paper</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.linkButton, styles.viewButton]}
              onPress={() => handleViewPDF(item)}
              activeOpacity={0.7}>
              <Icon name="file-pdf-o" size={wp('4%')} color="#fff" />
              <Text style={styles.linkButtonText}>View PDF</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
      <Animated.FlatList
        data={exam.papers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: true},
        )}
        scrollEventThrottle={16}
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: hp('2%'),
  },
  examInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  examTextContainer: {
    marginLeft: wp('3%'),
    flex: 1,
  },
  examName: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: hp('0.5%'),
  },
  examDate: {
    fontSize: wp('3.5%'),
    color: '#666',
  },
  subtitle: {
    fontSize: wp('4%'),
    color: '#666',
    marginTop: hp('1%'),
  },
  listContainer: {
    padding: wp('4%'),
  },
  paperContainer: {
    backgroundColor: '#fff',
    borderRadius: wp('3%'),
    padding: wp('4%'),
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
  subjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  subjectIconContainer: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'),
  },
  subjectInfo: {
    flex: 1,
  },
  subject: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: hp('0.5%'),
  },
  subjectCode: {
    fontSize: wp('3.5%'),
    color: '#666',
  },
  detailsContainer: {
    flexDirection: 'row',
    marginBottom: hp('2%'),
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: wp('4%'),
  },
  detailText: {
    fontSize: wp('3.5%'),
    color: '#666',
    marginLeft: wp('2%'),
  },
  linkButton: {
    backgroundColor: '#007BFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp('3%'),
    borderRadius: wp('2%'),
  },
  linkButtonText: {
    color: '#fff',
    fontSize: wp('3.5%'),
    fontWeight: '500',
    marginLeft: wp('2%'),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: wp('2%'),
  },
  downloadButton: {
    flex: 1,
    backgroundColor: '#007BFF',
  },
  viewButton: {
    flex: 1,
    backgroundColor: '#28a745',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp('3%'),
    borderRadius: wp('2%'),
  },
  linkButtonText: {
    color: '#fff',
    fontSize: wp('3.5%'),
    fontWeight: '500',
    marginLeft: wp('2%'),
  },
});

export default PapersScreen;
