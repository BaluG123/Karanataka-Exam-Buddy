// import React from 'react';
// import {View, StyleSheet, Dimensions, ActivityIndicator} from 'react-native';
// import Pdf from 'react-native-pdf';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';

// const PDFViewerScreen = ({route}) => {
//   const {pdfUrl, examName, subject} = route.params;

//   return (
//     <View style={styles.container}>
//       <Pdf
//         source={{uri: pdfUrl}}
//         style={styles.pdf}
//         loading={
//           <ActivityIndicator
//             size="large"
//             color="#007BFF"
//             style={styles.loader}
//           />
//         }
//         enablePaging={true}
//         onError={error => {
//           console.log(error);
//           alert('Error loading PDF');
//         }}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f8f8',
//   },
//   pdf: {
//     flex: 1,
//     width: Dimensions.get('window').width,
//     height: Dimensions.get('window').height,
//   },
//   loader: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: [{translateX: -wp('5%')}, {translateY: -wp('5%')}],
//   },
// });

// export default PDFViewerScreen;

import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  Text,
} from 'react-native';
import Pdf from 'react-native-pdf';
import RNFS from 'react-native-fs';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const PDFViewerScreen = ({route}) => {
  const {pdfUrl, examName, subject} = route.params;
  const [loading, setLoading] = useState(true);
  const [pdfPath, setPdfPath] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    downloadAndOpenPDF();
  }, []);

  const getLocalPath = () => {
    // Generate a unique filename based on exam and subject
    const fileName = `${examName}_${subject}_${Date.now()}.pdf`.replace(
      /\s+/g,
      '_',
    );
    return `${RNFS.DocumentDirectoryPath}/${fileName}`;
  };

  const downloadAndOpenPDF = async () => {
    try {
      setLoading(true);
      const localPath = getLocalPath();

      // Check if file already exists
      const exists = await RNFS.exists(localPath);
      if (exists) {
        setPdfPath(localPath);
        setLoading(false);
        return;
      }

      // Download the file
      const options = {
        fromUrl: pdfUrl,
        toFile: localPath,
        background: true,
        begin: res => {
          console.log('Download started:', res);
        },
        progress: res => {
          const progress = (res.bytesWritten / res.contentLength) * 100;
          console.log(`Downloaded: ${progress.toFixed(2)}%`);
        },
      };

      const response = await RNFS.downloadFile(options).promise;

      if (response.statusCode === 200) {
        setPdfPath(localPath);
      } else {
        setError('Failed to download PDF');
      }
    } catch (err) {
      console.error('Download error:', err);
      setError('Error downloading PDF');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Loading PDF...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {pdfPath && (
        <Pdf
          trustAllCerts={false}
          source={{
            uri: Platform.OS === 'ios' ? pdfPath : `file://${pdfPath}`,
            cache: true,
          }}
          style={styles.pdf}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`PDF loaded: ${numberOfPages} pages`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`Current page: ${page}`);
          }}
          onError={error => {
            console.log('PDF Error:', error);
            setError('Error loading PDF');
          }}
          onPressLink={uri => {
            console.log(`Link pressed: ${uri}`);
          }}
          enablePaging={true}
          horizontal={false}
          enableAnnotationRendering={true}
          spacing={0}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  loadingText: {
    marginTop: hp('2%'),
    fontSize: wp('4%'),
    color: '#666',
  },
  errorText: {
    fontSize: wp('4%'),
    color: 'red',
    textAlign: 'center',
    padding: wp('4%'),
  },
});

export default PDFViewerScreen;
