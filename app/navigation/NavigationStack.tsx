import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {navigationRef} from './NavigationService';
import {AuthContext} from '../auth/AuthContext';
import Login from '../screens/Login';
import Home from '../screens/Home';
import Favorite from '../screens/Favorite';
import History from '../screens/History';
import Product from '../screens/Product';
import {BottomNavigation, Text} from 'react-native-paper';
// import ThemeController from '../components/ThemeController';
import {StatusBar} from 'react-native';
import {useContext, useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

const Stack = createStackNavigator();

// const homeOptions = {
//   title: 'Home',
//   headerTitleStyle: {
//     fontWeight: 'bold',
//   },
//   headerRight: () => <ThemeController />,
// };

const MusicRoute = () => <Text>Music</Text>;

const AlbumsRoute = () => <Text>Albums</Text>;

const RecentsRoute = () => <Text>Recents</Text>;

function App(props) {
  const {theme} = props;
  const {auth, setAuth} = useContext(AuthContext);
  const [index, setIndex] = useState(0);
  // console.log('async', AsyncStorage);
  const [routes] = useState([
    {key: 'home', title: 'Home', icon: 'home'},
    {key: 'music', title: 'Music', icon: 'music'},
    {key: 'albums', title: 'Albums', icon: 'album'},
    {key: 'recents', title: 'Recents', icon: 'history'},
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeStack,
    music: Favorite,
    albums: History,
    recents: RecentsRoute,
  });

  const getData = async () => {
    let value = null;
    try {
      const jsonValue = await AsyncStorage.getItem('@storage_Key');
      if (jsonValue !== null) {
        value = JSON.parse(jsonValue);
        return value;
      }
    } catch (e) {
      // error reading value
    }
    return value;
  };

  if (!auth) {
    getData().then(function (val) {
      setAuth(val);
      console.log(val, 'isiGetData');
    });
    // setAuth(authData);
  }

  function HomeStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          options={{headerShown: false}}
          name="Home"
          component={Home}
        />
        <Stack.Screen
          name="Product"
          options={{
            headerTransparent: true,
            headerStyle: {borderBottomWidth: 0},
          }}
          component={Product}
        />
      </Stack.Navigator>
    );
  }

  // console.log('auth', auth);

  return (
    <NavigationContainer ref={navigationRef} theme={theme}>
      {/* <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} /> */}

      {auth ? (
        <BottomNavigation
          navigationState={{index, routes}}
          onIndexChange={setIndex}
          renderScene={renderScene}
          barStyle={{
            backgroundColor: '#fff',
            bottom: 20,
            zIndex: 2,
            position: 'absolute',
            padding: 8,
            borderRadius: 10,
            marginHorizontal: 15,
          }}
        />
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Product" component={Product} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default App;
