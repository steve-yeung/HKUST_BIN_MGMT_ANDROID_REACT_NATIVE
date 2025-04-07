import React, {useState} from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
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
} from 'react-native';
import {ProgressBar, Button as PaperButton} from 'react-native-paper';

const Stack = createNativeStackNavigator();

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
};

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
};

function verifyLogin(username: string, password: string): boolean {
  // Empty verification function that always returns true
  return true;
}

function LoginScreen({navigation, route}): React.JSX.Element {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    // Simulate network request
    setTimeout(() => {
      if (verifyLogin(username, password)) {
        route.params.setLoginInfo({username, password});
        setIsLoading(false);
        navigation.replace('Home');
      }
    }, 800);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.primary}
        translucent={true}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loginContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require('./assets/watermark.png')}
              style={styles.schoolLogo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.loginHeader}>Log In</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>{ICONS.user}</Text>
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
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
                (!username || !password) && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={!username || !password || isLoading}>
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

          <Text style={styles.appVersion}>Waste Management System v1.0</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

function HomeScreen({navigation, route}): React.JSX.Element {
  const menuItems = [
    {id: 'A', name: 'Bin Status', icon: ICONS.bin},
    {id: 'B', name: 'Shortest Route', icon: ICONS.map},
    {id: 'C', name: 'QR Code', icon: ICONS.qrcode},
    {id: 'D', name: 'Load Prediction', icon: ICONS.prediction},
    {id: 'E', name: 'Data Analytics', icon: ICONS.analytics},
    {id: 'F', name: 'Stamps', icon: ICONS.alert},
    {id: 'G', name: 'Settings', icon: ICONS.settings},
    {id: 'H', name: 'Logout', icon: ICONS.logout}, // Changed from Help to Logout
  ];

  // Handle logout function
  const handleLogout = () => {
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
                Welcome, {route.params.loginInfo?.username || 'User'}
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
            {menuItems.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.dashboardCard}
                onPress={() => {
                  // Direct logout for the Logout button (H)
                  if (item.id === 'H') {
                    handleLogout();
                  } else {
                    navigation.navigate(`Page${item.id}`);
                  }
                }}>
                <Text style={styles.cardIcon}>{item.icon}</Text>
                <Text style={styles.cardText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.logoutContainer}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}>
              <Text style={styles.logoutIcon}>{ICONS.logout}</Text>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

function PageScreen({route, navigation}): React.JSX.Element {
  // Ensure PageA navigates to BinStatusScreen
  if (route.name === 'PageA') {
    return <BinStatusScreen navigation={navigation} />;
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
  );
}

function BinStatusScreen({navigation}): React.JSX.Element {
  // Simulated pipeline data for bins
  const bins = [
    {name: 'Recycling Bin A1', load: 30, location: 'North Campus'},
    {name: 'Waste Bin B2', load: 70, location: 'Main Building'},
    {name: 'Compost Bin C3', load: 50, location: 'Cafeteria'},
    {name: 'Paper Bin D4', load: 90, location: 'Library'},
    {name: 'Glass Bin E5', load: 20, location: 'Science Building'},
  ];

  const getStatusColor = load => {
    if (load <= 30) return COLORS.success; // Green for low
    if (load <= 70) return COLORS.warning; // Amber for medium
    return COLORS.danger; // Red for high
  };

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
            <TouchableOpacity>
              <Text style={styles.headerIcon}>{ICONS.refresh}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.pageDescription}>
            Monitor fill levels of waste bins in real-time
          </Text>

          <ScrollView style={styles.binListContainer}>
            {bins.map((bin, index) => (
              <TouchableOpacity key={index} style={styles.binCard}>
                <View style={styles.binCardHeader}>
                  <Text style={styles.binName}>{bin.name}</Text>
                  <View
                    style={[
                      styles.statusIndicator,
                      {backgroundColor: getStatusColor(bin.load)},
                    ]}
                  />
                </View>

                <Text style={styles.binLocation}>
                  <Text>{ICONS.location}</Text> {bin.location}
                </Text>

                <View style={styles.binProgressContainer}>
                  <ProgressBar
                    progress={bin.load / 100}
                    color={getStatusColor(bin.load)}
                    style={styles.progressBar}
                  />
                  <Text
                    style={[styles.binLoad, {color: getStatusColor(bin.load)}]}>
                    {bin.load}%
                  </Text>
                </View>

                <View style={styles.binActionRow}>
                  <TouchableOpacity style={styles.binAction}>
                    <Text style={styles.binActionIcon}>{ICONS.map}</Text>
                    <Text style={styles.binActionText}>Locate</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.binAction}>
                    <Text style={styles.binActionIcon}>{ICONS.history}</Text>
                    <Text style={styles.binActionText}>History</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.binAction}>
                    <Text style={styles.binActionIcon}>{ICONS.alert}</Text>
                    <Text style={styles.binActionText}>Alert</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.floatingButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.floatingButtonIcon}>{ICONS.home}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

function App(): React.JSX.Element {
  const [loginInfo, setLoginInfo] = useState<{
    username: string;
    password: string;
  } | null>(null);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          contentStyle: {backgroundColor: COLORS.white},
        }}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          initialParams={{setLoginInfo}}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          initialParams={{loginInfo}}
        />
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const STATUSBAR_HEIGHT = StatusBar.currentHeight || 0;

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
});

export default App;
