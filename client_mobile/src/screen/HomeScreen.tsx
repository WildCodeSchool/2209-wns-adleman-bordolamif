import {
  Button, StatusBar, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@apollo/client';
import { LOGIN_MUTATION, LOGOUT_MUTATION } from '../../graphQL/mutation/UserMutation';
import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { GET_PROFILE } from '../../graphQL/query/UserQuery';

function HomeScreen() {
  const [error, setError] = useState('');
  const [login, { loading }] = useMutation(LOGIN_MUTATION);
  const [logout] = useMutation(LOGOUT_MUTATION);
  const { data: currentUser, client } = useQuery(GET_PROFILE, { errorPolicy: 'ignore' });

  const {
    reset, control, handleSubmit, formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onLogin = (formData: any) => {
    login({ variables: { data: formData } })
      .then((res) => {
        client.resetStore();
        if (res.data?.login) SecureStore.setItemAsync('token', res.data?.login);
      })
      .catch(() => setError('invalid credentials'));
    reset();
  };

  const onLogout = async () => {
    await logout();
    client.resetStore();
    SecureStore.setItemAsync('token', '');
  };

  return (
    <View style={styles.container}>
      {/* eslint-disable-next-line no-nested-ternary */ }
      { loading
        ? <Text>Loading...</Text>
        : currentUser?.profile
          ? (
            <>
              <Text style={{
                color: 'lightblue', fontSize: 20, fontWeight: 'bold', marginBottom: 20,
              }}
              >
                connected as { currentUser?.profile.firstname } { currentUser?.profile.lastname }
              </Text>
              <Button title="LogOut" onPress={onLogout} />
            </>
          )
          : (
            <>
              <StatusBar
                animated
                backgroundColor="#61dafb"
              />
              <Text style={{ color: 'lightblue', fontSize: 40, fontWeight: 'bold' }}>LET'S LOGGED</Text>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Email"
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="email"
              />
              { errors.email && <Text>This is required.</Text> }

              <Controller
                control={control}
                rules={{
                  maxLength: 100,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    secureTextEntry
                    placeholder="Password"
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="password"
              />
              { error && <Text style={{ color: 'red' }}>{ error }</Text> }
              <Button title="LogIn" onPress={handleSubmit(onLogin)} />
            </>
          ) }

    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;
