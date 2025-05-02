import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, SafeAreaView, ActivityIndicator } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import axios from 'axios';
import { useAuth } from './App'; // Import the AuthContext hook
import { API_CONFIG } from './App';

const QRCodeScreen = ({ navigation }) => {
  const { loginInfo } = useAuth(); // Get the idToken from AuthContext
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
            <QRCode
              value={userId || 'No User ID'} // Use userId as the QR code value
              size={200} // Size of the QR code
              color="#000000" // QR code color (black)
              backgroundColor="#FFFFFF" // Background color (white)
            />
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