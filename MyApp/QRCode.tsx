import React, {useEffect, useState} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  Image,
  Animated,
} from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import axios from 'axios'
import {useAuth} from './App' // Import the AuthContext hook
import {API_CONFIG} from './App'

const QRCodeScreen = ({navigation}) => {
  const {loginInfo} = useAuth() // Get the idToken from AuthContext
  const [userId, setUserId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stampScores, setStampScores] = useState([
    {stampName: 'Eco-friendly Stamp', score: 0, emoji: '🌿'},
    {stampName: 'Recycling Stamp', score: 0, emoji: '♻️'},
    {stampName: 'Energy Saving Stamp', score: 0, emoji: '💡'},
  ]) // Default stamps with scores of 0

  // Animation values for stamps
  const [animations] = useState(stampScores.map(() => new Animated.Value(0)))

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await axios.get(`${API_CONFIG.baseUrl}/user/info`, {
          headers: {
            Authorization: `Bearer ${loginInfo.idToken}`, // Pass the authentication token
          },
        })

        if (response.data.success && response.data.data) {
          setUserId(response.data.data.userId) // Set the userId for the QR code

          // Merge received stamp scores with default stamps
          const receivedStamps = response.data.data.stampScores || []
          const updatedStamps = stampScores.map(defaultStamp => {
            const matchingStamp = receivedStamps.find(
              stamp => stamp.stampName === defaultStamp.stampName,
            )
            return matchingStamp
              ? {...defaultStamp, ...matchingStamp}
              : defaultStamp // Use received score or default score of 0
          })

          setStampScores(updatedStamps)
        } else {
          throw new Error('Failed to fetch user info')
        }
      } catch (err) {
        setError('Failed to load user information. Please try again.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserInfo()
  }, [loginInfo])

  // Animate stamps when they load
  useEffect(() => {
    if (!loading) {
      stampScores.forEach((stamp, index) => {
        if (stamp.score > 0) {
          Animated.spring(animations[index], {
            toValue: 1,
            friction: 5,
            tension: 40,
            useNativeDriver: true,
          }).start()
        }
      })
    }
  }, [loading, stampScores])

  const getStampColor = score => {
    if (score >= 10) return '#FFD700' // Gold
    if (score >= 5) return '#C0C0C0' // Silver
    if (score > 0) return '#CD7F32' // Bronze
    return '#CCCCCC' // Gray for 0 score
  }

  const getStampBorderColor = score => {
    if (score >= 10) return '#B8860B' // Darker gold
    if (score >= 5) return '#A9A9A9' // Darker silver
    if (score > 0) return '#8B4513' // Darker bronze
    return '#AAAAAA' // Darker gray for 0 score
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={true}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.screenContainer}>
          <Text style={styles.pageTitle}>Your Digital Passport</Text>
          <Text style={styles.pageDescription}>
            {loading
              ? 'Loading your stamps...'
              : error || 'Scan the QR code below to earn stamps:'}
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color="#003366" />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <>
              <View style={styles.qrCodeContainer}>
                <QRCode
                  value={userId || 'No User ID'} // Use userId as the QR code value
                  size={200} // Size of the QR code
                  color="#000000" // QR code color (black)
                  backgroundColor="#FFFFFF" // Background color (white)
                />
              </View>

              {/* Display Stamp Scores */}
              <Text style={styles.stampSectionTitle}>
                Your Eco Achievement Stamps
              </Text>
              <View style={styles.stampContainer}>
                {stampScores.map((stamp, index) => (
                  <Animated.View
                    key={index}
                    style={[
                      styles.stampColumn,
                      {
                        transform: [
                          {scale: stamp.score > 0 ? animations[index] : 1},
                          {
                            rotate:
                              stamp.score > 0
                                ? animations[index].interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['-5deg', '0deg'],
                                  })
                                : '0deg',
                          },
                        ],
                      },
                    ]}>
                    <View
                      style={[
                        styles.stampCircle,
                        {
                          backgroundColor: getStampColor(stamp.score),
                          borderColor: getStampBorderColor(stamp.score),
                        },
                        stamp.score === 0 && styles.inactiveStamp,
                      ]}>
                      <Text style={styles.stampIcon}>{stamp.emoji}</Text>
                    </View>
                    <Text style={styles.stampName}>{stamp.stampName}</Text>
                    <View style={styles.scoreContainer}>
                      <Text
                        style={[
                          styles.stampScore,
                          stamp.score === 0 && styles.inactiveScore,
                          stamp.score >= 10 && styles.goldScore,
                          stamp.score >= 5 &&
                            stamp.score < 10 &&
                            styles.silverScore,
                          stamp.score > 0 &&
                            stamp.score < 5 &&
                            styles.bronzeScore,
                        ]}>
                        {stamp.score}
                      </Text>
                    </View>
                  </Animated.View>
                ))}
              </View>

              <View style={styles.legendContainer}>
                <Text style={styles.legendTitle}>Stamp Level Guide:</Text>
                <View style={styles.legendRow}>
                  <View style={styles.legendItem}>
                    <View
                      style={[styles.legendDot, {backgroundColor: '#FFD700'}]}
                    />
                    <Text style={styles.legendText}>Gold (10+)</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View
                      style={[styles.legendDot, {backgroundColor: '#C0C0C0'}]}
                    />
                    <Text style={styles.legendText}>Silver (5-9)</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View
                      style={[styles.legendDot, {backgroundColor: '#CD7F32'}]}
                    />
                    <Text style={styles.legendText}>Bronze (1-4)</Text>
                  </View>
                </View>
              </View>
            </>
          )}

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Home')}>
            <Text style={styles.backButtonText}>Back to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FB', // Light blue-ish background
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F8FB',
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 8,
    textAlign: 'center',
  },
  pageDescription: {
    fontSize: 16,
    color: '#5F666D',
    textAlign: 'center',
    marginBottom: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 16,
  },
  qrCodeContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 24,
  },
  stampSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003366',
    marginBottom: 16,
    textAlign: 'center',
  },
  stampContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
    width: '100%',
    paddingHorizontal: 16,
  },
  stampColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    width: '30%',
  },
  stampCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 3,
  },
  inactiveStamp: {
    opacity: 0.5,
    shadowOpacity: 0.1,
  },
  stampIcon: {
    fontSize: 28,
  },
  stampName: {
    fontSize: 12,
    color: '#003366',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
    width: '100%',
    height: 36, // Fixed height for 2 lines
  },
  scoreContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  stampScore: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inactiveScore: {
    color: '#888888',
  },
  goldScore: {
    color: '#B8860B',
  },
  silverScore: {
    color: '#708090',
  },
  bronzeScore: {
    color: '#8B4513',
  },
  legendContainer: {
    marginTop: 24,
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    width: '90%',
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#003366',
    marginBottom: 8,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#5F666D',
  },
  backButton: {
    backgroundColor: '#003366',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default QRCodeScreen
