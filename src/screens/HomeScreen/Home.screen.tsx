import {
  View,
  Text,
  FlatList,
  Alert,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import database from '@react-native-firebase/database';
import styles from './styles';
import {User} from '../../types/User.type';
import useDatabase from '../../hooks/useDatabase.hook';
import {Challenge} from '../../types/Challenge.type';

export default function HomeScreen() {
  const [challenges, setChallenges] = useState([]);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [registered, setRegistered] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>();
  const [userId] = useState(database().ref().push().key);
  const [challengeId] = useState(database().ref().push().key);
  const [userName, setUserName] = useState<string>('');
  const [challengeName, setChallengeName] = useState<string>('');

  const challengesRef = database().ref(`/challenges/${challengeId}`);
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
      const challenges = snapshot.val();
      const challengesArr: Challenge[] =
        (Object.values(challenges) as Challenge[]) || [];

      setChallenges(challengesArr);

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
        const usersArr: User[] = (Object.values(usersObj) as User[]) || [];
        const users: User[] = usersArr.filter(user => user?.id !== userId);
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

  function renderChallengeCard({item}) {
    return (
      <View style={styles.challengeItem}>
        <Text style={{color: 'red'}}>{item.title}</Text>
      </View>
    );
  }

  function renderUserCard({item}: {item: User}) {
    return (
      <View style={styles.challengeItem}>
        <Text>{item?.username}</Text>
      </View>
    );
  }

  function register() {
    const user: User = {
      id: userId || '',
      username: userName,
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

  function createChallenge() {
    const challenge: Challenge = {
      id: challengeId || '',
      title: challengeName,
      status: 'active',
      participants: currentUser ? [currentUser] : [],
      createdAt: database.ServerValue.TIMESTAMP,
    };

    challengesRef
      .set(challenge)
      .then(() => {
        Alert.alert('Success', 'Challenge added successfully!');
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
          {registered ? (
            <Text>{currentUser?.username}</Text>
          ) : (
            <TextInput
              placeholder="Enter your name"
              onChangeText={setUserName}
              style={styles.input}
            />
          )}
        </View>
        {registered && (
          <View>
            <Text>Create new Challenge</Text>
            <TextInput
              placeholder="Enter challenge name"
              onChangeText={setChallengeName}
              style={styles.input}
            />
          </View>
        )}

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
        {registered ? (
          <TouchableOpacity style={styles.signupBtn} onPress={createChallenge}>
            <Text style={styles.registerText}>{'Create Challenge'}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.signupBtn} onPress={register}>
            <Text style={styles.registerText}>{'Register'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
