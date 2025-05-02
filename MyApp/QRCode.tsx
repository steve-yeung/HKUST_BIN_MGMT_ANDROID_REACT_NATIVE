import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, SafeAreaView, ActivityIndicator, Image } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import axios from 'axios';
import { useAuth } from './App'; // Import the AuthContext hook
import { API_CONFIG } from './App';

const QRCodeScreen = ({ navigation }) => {
  const { loginInfo } = useAuth(); // Get the idToken from AuthContext
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stampScores, setStampScores] = useState([
    { stampName: 'Eco-friendly Stamp', score: 0 },
    { stampName: 'Recycling Stamp', score: 0 },
    { stampName: 'Energy Saving Stamp', score: 0 },
  ]); // Default stamps with scores of 0

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await axios.get(`${API_CONFIG.baseUrl}/user/info`, {
          headers: {
            Authorization: `Bearer ${loginInfo.idToken}`, // Pass the authentication token
          },
        });

        if (response.data.success && response.data.data) {
          setUserId(response.data.data.userId); // Set the userId for the QR code

          // Merge received stamp scores with default stamps
          const receivedStamps = response.data.data.stampScores || [];
          const updatedStamps = stampScores.map((defaultStamp) => {
            const matchingStamp = receivedStamps.find(
              (stamp) => stamp.stampName === defaultStamp.stampName
            );
            return matchingStamp || defaultStamp; // Use received score or default score of 0
          });

          setStampScores(updatedStamps);
        } else {
          throw new Error('Failed to fetch user info');
        }
      } catch (err) {
        console.error('Error fetching user info:', err.response?.data || err.message);
        setError('Failed to load user info. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [loginInfo]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF" // White background
        translucent={true}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.screenContainer}>
          <Text style={styles.pageTitle}>QR Code</Text>
          <Text style={styles.pageDescription}>
            {loading ? 'Loading QR Code...' : error || 'Scan the QR code below to earn stamp:'}
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color="#003366" />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <>
              <QRCode
                value={userId || 'No User ID'} // Use userId as the QR code value
                size={200} // Size of the QR code
                color="#000000" // QR code color (black)
                backgroundColor="#FFFFFF" // Background color (white)
              />
              {/* Display Stamp Scores */}
              <View style={styles.stampContainer}>
                {stampScores.map((stamp, index) => (
                  <View key={index} style={styles.stampColumn}>
                    <Image
                      source={require('./recycling_stamp_image.jpeg')} // Add the image
                      style={styles.stampImage}
                      resizeMode="contain"
                    />
                    <Text style={styles.stampName}>{stamp.stampName}</Text>
                    <Text style={styles.stampScore}>{stamp.score}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.backButtonText}>Back to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF', // White background
    },
    safeArea: {
      flex: 1,
      backgroundColor: '#FFFFFF', // White background
    },
    screenContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    pageTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#003366', // Use COLORS.primary if available
      marginBottom: 16,
    },
    pageDescription: {
      fontSize: 16,
      color: '#5F666D', // Use COLORS.grey if available
      textAlign: 'center',
      marginBottom: 24,
    },
    errorText: {
      fontSize: 16,
      color: '#F44336', // Use COLORS.danger if available
      textAlign: 'center',
      marginBottom: 16,
    },
    stampContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
      width: '100%',
      paddingHorizontal: 16,
    },
    stampColumn: {
      alignItems: 'center',
      justifyContent: 'space-between', // Ensure even spacing between elements
      flex: 1,
      minHeight: 140, // Ensure all columns have the same height
    },
    stampImage: {
      width: 50, // Adjust the width of the image
      height: 50, // Adjust the height of the image
      marginBottom: 8, // Add spacing below the image
    },
    stampName: {
      fontSize: 14,
      color: '#003366', // Use COLORS.primary if available
      textAlign: 'center',
      marginBottom: 4,
    },
    stampScore: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#003366', // Use COLORS.primary if available
      textAlign: 'center',
    },
    backButton: {
      backgroundColor: '#003366', // Use COLORS.primary if available
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      marginTop: 24,
    },
    backButtonText: {
      color: '#FFFFFF', // Use COLORS.white if available
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
export default QRCodeScreen;