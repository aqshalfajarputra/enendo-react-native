import React, {useState} from 'react';
import {View} from 'react-native';
import {
  Text,
  Button,
  TextInput,
  Card,
  Title,
  Paragraph,
} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';

import * as loginActions from 'app/actions/loginActions';
import styles from './styles';

export default function Login() {
  const id = useSelector((state) => state.loginReducer.id);
  const dispatch = useDispatch();
  const onLogin = (email, password) => {
    if (email !== '' && password !== '') {
      dispatch(loginActions.requestLogin(email, password));
    }
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Title title="Login" />
          <Card.Content>
            <TextInput
              name="email"
              style={styles.textInput}
              label="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
              mode="outlined"
            />
            <TextInput
              name="password"
              style={styles.textInput}
              value={password}
              label="Password"
              onChangeText={(text) => setPassword(text)}
              mode="outlined"
            />
            {/* <Text style={styles.login}>Login Status : {id}</Text> */}
          </Card.Content>
          <Card.Actions
            style={{alignItems: 'center', justifyContent: 'center'}}>
            <Button
              icon="login"
              mode="outlined"
              onPress={() => {
                onLogin(email, password);
              }}>
              Login
            </Button>
          </Card.Actions>
        </Card>
      </View>
    </View>
  );
}
