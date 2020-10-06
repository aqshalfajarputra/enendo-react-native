/**
 * React Native App
 * Everything starts from the entrypoint
 */
import React, { useState, useMemo } from 'react';
import {ActivityIndicator} from 'react-native';
import {
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import {DefaultTheme as NavigationDefaultTheme} from '@react-navigation/native';
import {ApolloProvider, ApolloClient, InMemoryCache} from '@apollo/client';
import AsyncStorage from '@react-native-community/async-storage';
import NavigationStack from './navigation/';
import {AuthContext} from './auth/AuthContext';
import Config from 'react-native-config';

// console.log(Config, 'asdasdasdasda');
const CombinedDefaultTheme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
};

const theme = {
  ...PaperDefaultTheme,
  roundness: 2,
  colors: {
    ...PaperDefaultTheme.colors,
  },
};

const getToken = async () => {
  try {
    const value = await AsyncStorage.getItem('token');
    console.log('ini token', value);
    if (value !== null) {
      return value;
    }
  } catch (e) {
    // error reading value
    console.log(e);
  }
};

const cache = new InMemoryCache();

const URI = Config.API_URL;

export const client = new ApolloClient({
  cache: cache,
  uri: URI + 'graphql/',
  onError: ({networkError, graphQLErrors}) => {
    console.log('graphQLErrors', graphQLErrors);
    console.log('networkError', networkError);
  },
  headers: {
    authorization: getToken || '',
  },
  connectToDevTools: true,
});

export function RootNavigation() {
  //   const isDark = useSelector((state) => state.themeReducer.isDark);
  // const theme = CombinedDefaultTheme;
  const [auth, setAuth] = useState(null);
  const providerValue = useMemo(() => ({auth, setAuth}), [auth, setAuth]);

  return (
    <PaperProvider theme={theme}>
      <AuthContext.Provider value={providerValue}>
        <NavigationStack theme={theme} />
      </AuthContext.Provider>
    </PaperProvider>
  );
}

export default function Entrypoint() {
  return (
    <ApolloProvider client={client}>
      <RootNavigation />
    </ApolloProvider>
  );
}
