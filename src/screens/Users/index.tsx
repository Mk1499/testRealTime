import {View, Text, Alert, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import makeStyle from './styles';
import database from '@react-native-firebase/database';

// const userId = database().ref().push().key;
const userId = 'O49x7hkMXZ_huGvmBTD'; // Replace with your own user ID
const reference = database().ref(`/users/${userId}`);

export default function Users() {
  const styles = makeStyle();
  const [user, setUser] = useState();

  useEffect(() => {
    reference.on('value', snapshot => {
      console.log('snapshot', snapshot);
      const data = snapshot.val();
      setUser(data);

      console.log('users', snapshot.val());
    });

    return () => reference.off(); // Unsubscribe on cleanup
  }, []);

  const addUser = () => {
    // Generate a unique key for the user
    const user = {
      username: 'Mohamed',
      email: 'Mohamed@mail.com',
      createdAt: database.ServerValue.TIMESTAMP,
    };

    database()
      .ref(`/users/${userId}`)
      .set(user)
      .then(() => {
        Alert.alert('Success', 'User added successfully!');
      })
      .catch(error => {
        Alert.alert('Error', error.message);
      });
  };

  return (
    <View>
      <Text>User: {user?.username}</Text>
      <TouchableOpacity onPress={addUser}>
        <Text>Add User</Text>
      </TouchableOpacity>
    </View>
  );
}
