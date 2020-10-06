import React, {useContext} from 'react';
import {useState} from 'react';
import {View} from 'react-native';
import {
  Button,
  TextInput,
  Card,
  Snackbar,
  useTheme,
  Text,
} from 'react-native-paper';
import {useMutation} from '@apollo/client';
import {AuthContext} from '../../auth/AuthContext';
import AsyncStorage from '@react-native-community/async-storage';
import styles from './styles';
import {gql} from '@apollo/client';

export default function Login() {
  const {
    colors: {background},
  } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState(false);
  const [visible, setVisible] = useState(false);
  const {auth, setAuth} = useContext(AuthContext);

  const loginQuery = gql`
    mutation($email: String!, $password: String!) {
      loginUser(data: {email: $email, password: $password}) {
        token
        status
        message
      }
    }
  `;

  const storeAuth = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('@storage_Key', jsonValue);
    } catch (e) {
      // saving error
    }
  };

  // const getData = async () => {
  //   try {
  //     const jsonValue = await AsyncStorage.getItem('@authData');
  //     return jsonValue != null ? JSON.parse(jsonValue) : null;
  //   } catch (e) {
  //     // error reading value
  //   }
  // };

  const [loginUser, {data, loading, error}] = useMutation(loginQuery, {
    onError(e) {
      console.log('errorr', e);
    },
    onCompleted({loginUser}) {
      console.log('ini login', loginUser);
      if (loginUser.status == false) {
        setVisible(true);
      } else {
        let authenticated = loginUser;
        console.log('auth', authenticated);
        setAuth(authenticated);
        // authenticated = JSON.stringify(authenticated);
        storeAuth(authenticated);
      }
      setResponse(loginUser.message);
    },
  });

  const submit = () => {
    loginUser({
      variables: {email, password},
    });
  };

  return (
    <View style={[styles.container, {backgroundColor: background}]}>
      <Card style={styles.card}>
        <Card.Title title="Login" />
        <Card.Content>
          <TextInput
            name="email"
            style={styles.textInput}
            label="Email"
            onChangeText={(text) => setEmail(text)}
            mode="outlined"
          />
          <TextInput
            name="password"
            style={styles.textInput}
            label="Password"
            onChangeText={(text) => setPassword(text)}
            mode="outlined"
          />
        </Card.Content>
        <Card.Actions style={{alignItems: 'center', justifyContent: 'center'}}>
          <Button
            icon="login"
            mode="outlined"
            onPress={() => submit()}
            loading={loading}>
            Login
          </Button>
        </Card.Actions>
      </Card>
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={Snackbar.DURATION_MEDIUM}>
        {response}
      </Snackbar>
    </View>
  );
}
