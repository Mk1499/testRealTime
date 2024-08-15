import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import database from '@react-native-firebase/database';

export default function useDatabase() {
  const userId: string = database().ref().push().key || '';

  useEffect(() => {
    console.log('USER ID Changed: ' + userId);
  }, [userId]);

  return {
    userId,
  };
}
