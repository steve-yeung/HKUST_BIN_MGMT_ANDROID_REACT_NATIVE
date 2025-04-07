import React, {useState} from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Button, StyleSheet, Text, TextInput, View, TouchableOpacity, ImageBackground, ScrollView} from 'react-native';
import {ProgressBar} from 'react-native-paper'; // Replace ProgressBarAndroid with ProgressBar from react-native-paper

const Stack = createNativeStackNavigator();

function verifyLogin(username: string, password: string): boolean {
  // Empty verification function that always returns true
  return true;
}

function LoginScreen({navigation, route}): React.JSX.Element {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (verifyLogin(username, password)) {
      route.params.setLoginInfo({username, password});
      navigation.replace('Home');
    }
  };

  return (
    <ImageBackground
      source={require('./assets/watermark.png')}
      style={styles.backgroundImage}
      imageStyle={{opacity: 0.4}}
    >
      <View style={styles.container}>
        <Text style={styles.pageText}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button title="Login" onPress={handleLogin} />
      </View>
    </ImageBackground>
  );
}

function HomeScreen({navigation, route}): React.JSX.Element {
  return (
    <ImageBackground
      source={require('./assets/watermark.png')}
      style={styles.backgroundImage}
      imageStyle={{opacity: 0.4}}
    >
      <View style={styles.container}>
        <View style={styles.gridContainer}>
          {['Bin Status', 'Shortest Route', 'QR Code', 'Load Prediction', 'Data Analytics', 'Stamps', 'G', 'H'].map((page, index) => (
            <TouchableOpacity
              key={page}
              style={styles.customButton}
              onPress={() => navigation.navigate(`Page${String.fromCharCode(65 + index)}`)}>
              <Text style={styles.buttonText}>{page}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.logoutContainer}>
          <Button
            title="Logout"
            onPress={() => navigation.replace('Login')}
            color="red"
          />
        </View>
      </View>
    </ImageBackground>
  );
}

function PageScreen({route, navigation}): React.JSX.Element {
  // Ensure PageA navigates to BinStatusScreen
  if (route.name === 'PageA') {
    return <BinStatusScreen navigation={navigation} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.pageText}>This is Page {route.name.replace('Page', '')}</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
}

function BinStatusScreen({navigation}): React.JSX.Element {
  // Simulated pipeline data for bins
  const bins = [
    {name: 'Bin 1', load: 30},
    {name: 'Bin 2', load: 70},
    {name: 'Bin 3', load: 50},
    {name: 'Bin 4', load: 90},
    {name: 'Bin 5', load: 20},
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {bins.map((bin, index) => (
        <View key={index} style={styles.binContainer}>
          <Text style={styles.binName}>{bin.name}</Text>
          <ProgressBar
            progress={bin.load / 100}
            color={bin.load > 80 ? 'red' : 'green'}
            style={styles.progressBar}
          />
          <Text style={styles.binLoad}>{bin.load}%</Text>
        </View>
      ))}
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
}

function App(): React.JSX.Element {
  const [loginInfo, setLoginInfo] = useState<{username: string; password: string} | null>(null);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
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
                  : `Page ${page}`, // Set header title for specific pages
            }}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    height: '80%',
    paddingHorizontal: 16,
  },
  customButton: {
    width: '40%', // Button width
    height: 120,  // Increased height for taller buttons
    margin: 10,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center',    // Center content horizontally
    backgroundColor: '#007BFF', // Button background color
    borderRadius: 10, // Rounded corners
  },
  buttonText: {
    color: '#FFFFFF', // Text color
    fontSize: 18, // Font size
    fontWeight: 'bold', // Bold text
  },
  logoutContainer: {
    marginTop: 20,
    width: '80%',
  },
  pageText: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  scrollContainer: {
    padding: 16,
  },
  binContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    elevation: 2,
  },
  binName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  binLoad: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'right',
  },
  progressBar: {
    height: 10, // Set a custom height for the progress bar
    borderRadius: 5, // Rounded corners for the progress bar
    marginTop: 8,
  },
});

export default App;


