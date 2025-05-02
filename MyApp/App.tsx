import React, {useState, useEffect, createContext, useContext} from 'react'
import 'react-native-gesture-handler'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import QRCodeScreen from './QRCode';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  LogBox,
} from 'react-native'
import {ProgressBar, Button as PaperButton} from 'react-native-paper'
import axios from 'axios'

// 創建身份驗證上下文
const AuthContext = createContext(null)

const Stack = createNativeStackNavigator()

// HKUST Color Palette
const COLORS = {
  primary: '#003366', // HKUST Dark Blue
  secondary: '#007C89', // HKUST Teal
  accent: '#CE0058', // HKUST Burgundy
  lightBlue: '#00A5DF', // HKUST Light Blue
  gold: '#F7A81B', // HKUST Gold
  grey: '#5F666D',
  lightGrey: '#E5E5E5',
  white: '#FFFFFF',
  black: '#000000',
  success: '#4CAF50',
  warning: '#FFC107',
  danger: '#F44336',
}

// Simple icon text fallbacks
const ICONS = {
  user: '👤',
  lock: '🔒',
  home: '🏠',
  back: '←',
  logout: '🚪',
  refresh: '🔄',
  bin: '🗑️',
  map: '🗺️',
  analytics: '📊',
  settings: '⚙️',
  help: '❓',
  qrcode: '📱',
  prediction: '📈',
  location: '📍',
  alert: '⚠️',
  history: '🕒',
}

// API configuration
export const API_CONFIG = {
  baseUrl: 'http://192.168.110.200:8080', // This can be changed later
  firebaseAuthUrl:
    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDN41zFMPOZKSjrSKTcwiEG657whMJLhnE',
}

// Function to login with Firebase
const loginWithFirebase = async (email, password) => {
  try {
    const response = await axios.post(API_CONFIG.firebaseAuthUrl, {
      email,
      password,
      returnSecureToken: true,
    })
    return response.data
  } catch (error) {
    console.error('Firebase auth error:', error.response?.data || error.message)
    throw error
  }
}

// Function to fetch bin data
const fetchBinData = async idToken => {
  try {
    const response = await axios.get(`${API_CONFIG.baseUrl}/bin_status`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    })
    return response.data
  } catch (error) {
    console.error(
      'Error fetching bin data:',
      error.response?.data || error.message,
    )
    throw error
  }
}

// 使用 AuthContext 的 Hook
export function useAuth() {
  return useContext(AuthContext)
}

function LoginScreen({navigation}): React.JSX.Element {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [keyboardVisible, setKeyboardVisible] = useState(false)
  const {setLoginInfo} = useAuth() // 使用 Context 取代 route.params

  // Add keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true)
      },
    )
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false)
      },
    )

    // Clean up listeners
    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [])

  const handleLogin = async () => {
    setIsLoading(true)
    setError('')

    try {
      const authData = await loginWithFirebase(email, password)
      setLoginInfo({
        // 使用 Context 中的 setLoginInfo
        username: email,
        idToken: authData.idToken,
        displayName: authData.displayName || email,
      })
      navigation.replace('Home')
    } catch (error) {
      setError('Login failed. Please check your credentials.')
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.primary}
        translucent={true}
      />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled">
          <View
            style={[
              styles.loginContainer,
              keyboardVisible && styles.loginContainerKeyboardOpen,
            ]}>
            <View
              style={[
                styles.logoContainer,
                keyboardVisible && styles.logoContainerSmall,
              ]}>
              <Image
                source={require('./assets/watermark.png')}
                style={[
                  styles.schoolLogo,
                  keyboardVisible && styles.schoolLogoSmall,
                ]}
                resizeMode="contain"
              />
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.loginHeader}>Log In</Text>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <View style={styles.inputContainer}>
                <Text style={styles.inputIcon}>{ICONS.user}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  placeholderTextColor={COLORS.grey}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputIcon}>{ICONS.lock}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholderTextColor={COLORS.grey}
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.loginButton,
                  (!email || !password) && styles.loginButtonDisabled,
                ]}
                onPress={handleLogin}
                disabled={!email || !password || isLoading}>
                {isLoading ? (
                  <ProgressBar
                    indeterminate
                    color={COLORS.white}
                    style={styles.loginProgress}
                  />
                ) : (
                  <Text style={styles.loginButtonText}>Login</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {!keyboardVisible && (
              <Text style={styles.appVersion}>
                Waste Management System v1.0
              </Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

function HomeScreen({ navigation }): React.JSX.Element {
  const { loginInfo, setLoginInfo } = useAuth(); // Use Context instead of route.params

  // Updated menuItems array with only 4 buttons
  const menuItems = [
    { id: 'A', name: 'Bin Status', icon: ICONS.bin },
    { id: 'C', name: 'QR Code', icon: ICONS.qrcode },
    { id: 'G', name: 'Settings', icon: ICONS.settings },
    { id: 'H', name: 'Logout', icon: ICONS.logout },
  ];

  // Handle logout function
  const handleLogout = () => {
    setLoginInfo(null);
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.primary}
        translucent={true}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.homeContainer}>
          <View style={styles.homeHeader}>
            <View>
              <Text style={styles.welcomeText}>
                Welcome, {loginInfo?.displayName || 'User'}
              </Text>
              <Text style={styles.dateText}>
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
            <Image
              source={require('./assets/watermark.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.sectionTitle}>Dashboard</Text>

          <View style={styles.gridContainer}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.dashboardCard}
                onPress={() => {
                  if (item.id === 'C') {
                    navigation.navigate('QRCode'); // Navigate to QRCodeScreen
                  } else if (item.id === 'H') {
                    handleLogout();
                  } else {
                    navigation.navigate(`Page${item.id}`);
                  }
                }}
              >
                <Text style={styles.cardIcon}>{item.icon}</Text>
                <Text style={styles.cardText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

function PageScreen({route, navigation}): React.JSX.Element {
  // Ensure PageA navigates to BinStatusScreen
  if (route.name === 'PageA') {
    return <BinStatusScreen navigation={navigation} />
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.primary}
        translucent={true}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.screenContainer}>
          <View style={styles.pageHeader}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.headerIcon}>{ICONS.back}</Text>
            </TouchableOpacity>
            <Text style={styles.pageTitle}>
              {route.params?.title ||
                (route.name === 'PageB'
                  ? 'Shortest Route'
                  : route.name === 'PageC'
                  ? 'QR Code'
                  : route.name === 'PageD'
                  ? 'Load Prediction'
                  : route.name === 'PageE'
                  ? 'Data Analytics'
                  : route.name === 'PageF'
                  ? 'Stamps'
                  : route.name === 'PageG'
                  ? 'Settings'
                  : route.name === 'PageH'
                  ? 'Logout'
                  : route.name.replace('Page', ''))}
            </Text>
            <Image
              source={require('./assets/watermark.png')}
              style={styles.headerIconSmall}
              resizeMode="contain"
            />
          </View>

          <View style={styles.pageContent}>
            <Text style={styles.pageText}>
              {route.params?.title ||
                (route.name === 'PageB'
                  ? 'Shortest Route'
                  : route.name === 'PageC'
                  ? 'QR Code'
                  : route.name === 'PageD'
                  ? 'Load Prediction'
                  : route.name === 'PageE'
                  ? 'Data Analytics'
                  : route.name === 'PageF'
                  ? 'Stamps'
                  : route.name === 'PageG'
                  ? 'Settings'
                  : route.name === 'PageH'
                  ? 'Logout'
                  : route.name.replace('Page', ''))}
            </Text>
            <Text style={styles.pageDescription}>
              Content for this page will be displayed here.
            </Text>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonIcon}>{ICONS.home}</Text>
              <Text style={styles.backButtonText}>Return to Dashboard</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  )
}

function BinStatusScreen({navigation}): React.JSX.Element {
  const {loginInfo} = useAuth() // 使用 Context 取代 route.params
  const [bins, setBins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadBinData = async () => {
    setLoading(true)
    setError('')

    try {
      if (!loginInfo || !loginInfo.idToken) {
        throw new Error('Authentication token not found')
      }

      const result = await fetchBinData(loginInfo.idToken)

      if (result.success && result.data && result.data.bins) {
        setBins(result.data.bins)
      } else {
        throw new Error('Failed to retrieve bin data')
      }
    } catch (error) {
      console.error('Error loading bin data:', error)
      setError(
        'Failed to load bin status. Please try again.' + loginInfo.idtoken,
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBinData()
  }, [])

  const getStatusColor = usages => {
    const loadPercentage = Math.min(100, ((28 - usages) / 28) * 100);
    if (loadPercentage <= 30) return COLORS.success // Green for low
    if (loadPercentage <= 70) return COLORS.warning // Amber for medium
    return COLORS.danger // Red for high
  }

  const calculatePercentage = usages => {
    return Math.min(100, ((28 - usages) / 28) * 100);
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.primary}
        translucent={true}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.screenContainer}>
          <View style={styles.pageHeader}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.headerIcon}>{ICONS.back}</Text>
            </TouchableOpacity>
            <Text style={styles.pageTitle}>Bin Status</Text>
            <TouchableOpacity onPress={loadBinData}>
              <Text style={styles.headerIcon}>{ICONS.refresh}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.pageDescription}>
            Monitor fill levels of waste bins in real-time
          </Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Loading bin data...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorMessage}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={loadBinData}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView style={styles.binListContainer}>
              {bins.map((bin, index) => {
                const loadPercentage = calculatePercentage(bin.usages)
                return (
                  <TouchableOpacity
                    key={bin.binStatusId}
                    style={styles.binCard}>
                    <View style={styles.binCardHeader}>
                      <Text style={styles.binName}>{bin.binName}</Text>
                      <View
                        style={[
                          styles.statusIndicator,
                          {backgroundColor: getStatusColor(bin.usages)},
                        ]}
                      />
                    </View>

                    <Text style={styles.binLocation}>
                      <Text>{ICONS.location}</Text> ID: {bin.binStatusId}
                    </Text>

                    <View style={styles.binProgressContainer}>
                      <ProgressBar
                        progress={loadPercentage / 100}
                        color={getStatusColor(bin.usages)}
                        style={styles.progressBar}
                      />
                      <Text
                        style={[
                          styles.binLoad,
                          {color: getStatusColor(bin.usages)},
                        ]}>
                        {loadPercentage.toFixed(1)}%
                      </Text>
                    </View>

                    <View style={styles.binDetails}>
                      <Text style={styles.binUsages}>
                        <Text style={styles.usageLabel}>Usage Count: </Text>
                        {bin.usages.toFixed(1)}
                      </Text>
                    </View>

                    <View style={styles.binActionRow}>
                      <TouchableOpacity style={styles.binAction}>
                        <Text style={styles.binActionIcon}>{ICONS.map}</Text>
                        <Text style={styles.binActionText}>Locate</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.binAction}>
                        <Text style={styles.binActionIcon}>
                          {ICONS.history}
                        </Text>
                        <Text style={styles.binActionText}>History</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.binAction}>
                        <Text style={styles.binActionIcon}>{ICONS.alert}</Text>
                        <Text style={styles.binActionText}>Alert</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                )
              })}
            </ScrollView>
          )}

          <TouchableOpacity
            style={styles.floatingButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.floatingButtonIcon}>{ICONS.home}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  )
}

function App(): React.JSX.Element {
  const [loginInfo, setLoginInfo] = useState(null)

  return (
    // 提供 AuthContext 以便可以在整個應用程序中使用 loginInfo 和 setLoginInfo
    <AuthContext.Provider value={{loginInfo, setLoginInfo}}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
            contentStyle: {backgroundColor: COLORS.white},
          }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((page, index) => (
            <Stack.Screen
              key={page}
              name={`Page${page}`}
              component={PageScreen}
              options={{
                title:
                  page === 'A'
                    ? 'Bin Status'
                    : page === 'B'
                    ? 'Shortest Route'
                    : page === 'C'
                    ? 'QR Code'
                    : page === 'D'
                    ? 'Load Prediction'
                    : page === 'E'
                    ? 'Data Analytics'
                    : page === 'F'
                    ? 'Stamps'
                    : page === 'G'
                    ? 'Settings'
                    : 'Logout', // Changed from Help to Logout
              }}
            
            />

          ))}
          <Stack.Screen
            name="QRCode"
            component={QRCodeScreen}
            options={{
              title: 'QR Code',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  )
}

// 樣式部分保持不變
const STATUSBAR_HEIGHT = StatusBar.currentHeight || 0

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === 'android' ? STATUSBAR_HEIGHT : 0,
  },
  // Login Screen
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: COLORS.white,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  schoolLogo: {
    width: 200,
    height: 80,
  },
  formContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 24,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
  },
  loginHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLORS.primary,
    textAlign: 'center',
  },
  errorText: {
    color: COLORS.danger,
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGrey,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  inputIcon: {
    marginRight: 12,
    fontSize: 20,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: COLORS.black,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginButtonDisabled: {
    backgroundColor: COLORS.lightGrey,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginProgress: {
    height: 24,
    width: 100,
    backgroundColor: 'transparent',
  },
  forgotPassword: {
    color: COLORS.secondary,
    textAlign: 'center',
    fontSize: 14,
  },
  appVersion: {
    color: COLORS.grey,
    textAlign: 'center',
    marginTop: 32,
    fontSize: 12,
  }, // New styles for keyboard adjustments
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  loginContainerKeyboardOpen: {
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  logoContainerSmall: {
    marginBottom: 20,
  },
  schoolLogoSmall: {
    width: 150,
    height: 60,
  },

  // Home Screen
  homeContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white,
  },
  homeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  headerLogo: {
    width: 60,
    height: 60,
  },
  headerIconSmall: {
    width: 36,
    height: 36,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  dateText: {
    fontSize: 14,
    color: COLORS.grey,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  dashboardCard: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.primary,
    marginTop: 8,
    textAlign: 'center',
  },
  logoutContainer: {
    marginTop: 24,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
  },
  logoutIcon: {
    fontSize: 20,
    color: COLORS.white,
    marginRight: 8,
  },
  logoutButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Page Screen
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: COLORS.primary,
  },
  headerIcon: {
    fontSize: 24,
    color: COLORS.white,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  pageContent: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
  },
  pageDescription: {
    fontSize: 16,
    color: COLORS.grey,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
    lineHeight: 24,
  },
  backButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonIcon: {
    fontSize: 20,
    color: COLORS.white,
    marginRight: 8,
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
  },

  // Bin Status Screen
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorMessage: {
    fontSize: 16,
    color: COLORS.danger,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  binListContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  binCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
  },
  binCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  binName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  binLocation: {
    fontSize: 14,
    color: COLORS.grey,
    marginBottom: 12,
  },
  binProgressContainer: {
    marginVertical: 8,
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
  },
  binLoad: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'right',
  },
  binDetails: {
    marginVertical: 8,
  },
  binUsages: {
    fontSize: 14,
    color: COLORS.grey,
  },
  usageLabel: {
    fontWeight: 'bold',
  },
  binActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGrey,
    paddingTop: 12,
  },
  binAction: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  binActionIcon: {
    fontSize: 16,
    color: COLORS.primary,
    marginRight: 4,
  },
  binActionText: {
    fontSize: 14,
    color: COLORS.primary,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: COLORS.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  floatingButtonIcon: {
    fontSize: 24,
    color: COLORS.white,
  },
})

export default App
