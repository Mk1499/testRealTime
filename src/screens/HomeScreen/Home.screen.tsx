import {
  View,
  Text,
  FlatList,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import database from '@react-native-firebase/database';
import styles from './styles';

export default function HomeScreen() {
  const [challenges, setChallenges] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [registered, setRegistered] = useState(false);
  const [currentUser, setCurrentUser] = useState();

  const challengesRef = database().ref(`/challenges`);
  const userId = database().ref().push().key;
  const usersRef = database().ref(`/users/${userId}`);
  const usersListRef = database().ref(`/users`);

  useEffect(() => {
    challengeListener();
    usersListener();
    usersListListener();
    return () => unsubscribeListeners(); // Unsubscribe on cleanup
  }, []);

  function challengeListener() {
    challengesRef.on('value', snapshot => {
      console.log('snapshot', snapshot);
      const challenges = snapshot.val();
      setChallenges(challenges);

      console.log('challenges', challenges);
    });
  }

  function usersListener() {
    usersRef.on('value', snapshot => {
      const user = snapshot.val();
      console.log('users', user);
    });
  }

  function usersListListener() {
    usersListRef.on('value', snapshot => {
      const usersObj = snapshot.val();
      console.log('usersObj ', usersObj);
      if (usersObj) {
        delete usersObj[userId];
        const users = Object.values(usersObj) || [];
        setActiveUsers(users);
      } else {
        setActiveUsers([]);
      }
    });
  }

  function unsubscribeListeners() {
    challengesRef.off();
    usersRef.off();
    usersListRef.off();
  }

  function renderChallengeCard() {
    return (
      <View style={styles.challengeItem}>
        <Text>Challenge Card</Text>
      </View>
    );
  }

  function renderUserCard({item}) {
    return (
      <View style={styles.challengeItem}>
        <Text>{item?.username}</Text>
      </View>
    );
  }

  function register() {
    const user = {
      username: 'Mohamed-' + userId,
      email: 'Mohamed@mail.com',
      createdAt: database.ServerValue.TIMESTAMP,
    };

    setCurrentUser(user);
    usersRef
      .set(user)
      .then(() => {
        Alert.alert('Success', 'User added successfully!');
        setRegistered(true);
      })
      .catch(error => {
        console.log('Err : ', error);
        Alert.alert('Error', error.message);
      });
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text>{currentUser?.username}</Text>
        </View>
        <View style={styles.section}>
          <Text>Challenges : </Text>
          <FlatList
            data={challenges}
            renderItem={renderChallengeCard}
            contentContainerStyle={styles.challenges}
          />
        </View>
        <View style={styles.section}>
          <Text>Users : </Text>
          <FlatList
            data={activeUsers}
            renderItem={renderUserCard}
            contentContainerStyle={styles.challenges}
          />
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.signupBtn} onPress={register}>
          <Text style={styles.registerText}>
            {registered ? 'Create Challenge' : 'Register'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
