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
  PermissionsAndroid,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import RNFetchBlob from 'rn-fetch-blob';

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

  //   const checkPermission = async () => {
  //     if (Platform.OS === 'ios') {
  //       return true;
  //     }

  //     // For Android
  //     try {
  //       if (Platform.Version >= 33) {
  //         // Android 13 or higher
  //         const result = await PermissionsAndroid.requestMultiple([
  //           PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
  //           PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
  //           PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
  //         ]);

  //         return Object.values(result).every(
  //           permission => permission === PermissionsAndroid.RESULTS.GRANTED,
  //         );
  //       } else {
  //         // Android 12 or lower
  //         const granted = await PermissionsAndroid.request(
  //           PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //           {
  //             title: 'Storage Permission',
  //             message: 'App needs access to memory to download the file',
  //             buttonNeutral: 'Ask Me Later',
  //             buttonNegative: 'Cancel',
  //             buttonPositive: 'OK',
  //           },
  //         );

  //         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //           return true;
  //         } else {
  //           // Permission denied
  //           Alert.alert(
  //             'Permission Required',
  //             'Please grant storage permission from app settings to download files',
  //             [
  //               {
  //                 text: 'Cancel',
  //                 style: 'cancel',
  //               },
  //               {
  //                 text: 'Open Settings',
  //                 onPress: () => {
  //                   // Open app settings
  //                   if (Platform.OS === 'android') {
  //                     Linking.openSettings();
  //                   }
  //                 },
  //               },
  //             ],
  //           );
  //           return false;
  //         }
  //       }
  //     } catch (err) {
  //       console.warn('Permission request error:', err);
  //       Alert.alert('Error', 'Failed to request storage permission');
  //       return false;
  //     }
  //   };

  const checkPermission = async () => {
    if (Platform.OS === 'ios') {
      return true;
    }

    try {
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        );

        if (granted) {
          return true;
        }

        const result = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
        ]);

        return Object.values(result).every(
          permission => permission === PermissionsAndroid.RESULTS.GRANTED,
        );
      } else {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );

        if (granted) {
          return true;
        }

        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to memory to download the file',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        return result === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.warn('Permission request error:', err);
      Alert.alert('Error', 'Failed to request storage permission');
      return false;
    }
  };

  const handleLinkPress = async url => {
    // First check and request permissions
    const hasPermission = await checkPermission();
    console.log('Permission status:', hasPermission);

    if (!hasPermission) {
      Alert.alert(
        'Permission Required',
        'Storage permission is required to download files. Please grant permission and try again.',
      );
      return;
    }

    try {
      console.log('Starting download from URL:', url);

      // Get filename from URL
      const fileName = url.split('/').pop() || `exam_paper_${Date.now()}.pdf`;

      // Set download path
      const downloadPath = Platform.select({
        ios: RNFetchBlob.fs.dirs.DocumentDir,
        android: RNFetchBlob.fs.dirs.DownloadDir,
      });

      const filePath = `${downloadPath}/${fileName}`;
      console.log('Downloading to:', filePath);

      // Show download starting alert
      Alert.alert(
        'Download Started',
        'The file download has begun. Please wait...',
      );

      // Configure download
      const config = {
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: filePath,
          description: 'Downloading PDF file',
          mime: 'application/pdf',
          mediaScannable: true,
          title: fileName,
        },
        IOSBackgroundTask: true,
        path: filePath,
      };

      // Add headers
      const headers = {
        Accept: 'application/pdf',
        'Content-Type': 'application/pdf',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Cache-Control': 'no-cache',
      };

      const response = await RNFetchBlob.config(config).fetch(
        'GET',
        url,
        headers,
      );

      console.log('Download response:', response);

      if (response.info().status === 200) {
        if (Platform.OS === 'ios') {
          await RNFetchBlob.ios.openDocument(response.path());
          Alert.alert('Success', 'File downloaded successfully!');
        } else {
          Alert.alert(
            'Success',
            'File downloaded successfully! Check your Downloads folder.',
          );
        }
      } else {
        throw new Error(`Server returned status ${response.info().status}`);
      }
    } catch (error) {
      //   console.error('Download error:', error);
      //   Alert.alert(
      //     'Download Failed',
      //     'There was an error downloading the file. Please try again later.',
      //   );
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
