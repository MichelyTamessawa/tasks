import {DrawerItemList} from '@react-navigation/drawer';
import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {Gravatar} from 'react-native-gravatar';
import commonStyle from '../commonStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';

export default props => {
  const logout = () => {
    delete axios.defaults.headers.common['Authorization'];
    AsyncStorage.removeItem('userData');
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Auth',
          },
        ],
      }),
    );
  };

  return (
    <ScrollView>
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
        <Gravatar
          style={styles.avatar}
          options={{email: props.email, secure: true}}
        />
        <View style={styles.userInfo}>
          <Text style={styles.name}>{props.name}</Text>
          <Text style={styles.email}>{props.email}</Text>
        </View>
        <TouchableOpacity onPress={logout}>
          <View style={styles.logoutIcon}>
            <Icon name="sign-out" size={30} color="#800" />
          </View>
        </TouchableOpacity>
      </View>

      <DrawerItemList {...props} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    borderColor: '#DDD',
  },
  title: {
    color: '#000',
    fontFamily: commonStyle.fontFamily,
    fontSize: 30,
    paddingTop: Platform.OS === 'ios' ? 70 : 30,
    padding: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderWidth: 3,
    borderRadius: 30,
    margin: 10,
    backgroundColor: '#222',
  },
  userInfo: {
    marginLeft: 10,
  },
  name: {
    fontFamily: commonStyle.fontFamily,
    fontSize: 20,
    marginBottom: 5,
    color: commonStyle.colors.mainText,
  },
  email: {
    fontFamily: commonStyle.fontFamily,
    fontSize: 15,
    marginBottom: 10,
    color: commonStyle.colors.subText,
  },
  logoutIcon: {
    marginLeft: 10,
    marginBottom: 10,
  },
});
