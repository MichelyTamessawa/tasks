import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import commonStyle from '../commonStyle';
import moment from 'moment';
import 'moment/locale/pt-br';
import {Swipeable, GestureHandlerRootView} from 'react-native-gesture-handler';

export default props => {
  const isDone =
    props.doneAt != null ? {textDecorationLine: 'line-through'} : {};

  const date = props.doneAt ? props.doneAt : props.estimateAt;
  const formattedDate = moment(props.estimateAt)
    .locale('pt-br')
    .format('ddd, D [de] MMM');

  const getRightContent = () => {
    return (
      <TouchableOpacity
        style={styles.right}
        onPress={() => props.onDelete && props.onDelete(props.id)}>
        <Icon name="trash" size={30} color="white" />
      </TouchableOpacity>
    );
  };

  const getLeftContent = () => {
    return (
      <View style={styles.left}>
        <Icon name="trash" size={20} color="white" style={styles.deleteIcon} />
        <Text style={styles.deleteText}>Excluir</Text>
      </View>
    );
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        renderRightActions={getRightContent}
        renderLeftActions={getLeftContent}
        onSwipeableOpen={direction => {
          direction === 'left' && props.onDelete && props.onDelete(props.id);
        }}>
        <View style={styles.container}>
          <TouchableWithoutFeedback
            onPress={() => props.onToggleTask(props.id)}>
            <View style={styles.checkContainer}>
              {getCheckView(props.doneAt)}
            </View>
          </TouchableWithoutFeedback>
          <View>
            <Text style={[styles.desc, isDone]}>{props.desc}</Text>
            <Text style={styles.date}>{formattedDate}</Text>
          </View>
        </View>
      </Swipeable>
    </GestureHandlerRootView>
  );
};

function getCheckView(doneAt) {
  if (doneAt != null) {
    return (
      <View style={styles.done}>
        <Icon name="check" size={20} color="white"></Icon>
      </View>
    );
  } else {
    return <View style={styles.pending}></View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderColor: '#AAA',
    borderBottomWidth: 1,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  checkContainer: {
    width: '20%',
    alignItems: 'center',
  },
  pending: {
    height: 25,
    width: 25,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#555',
  },
  done: {
    height: 25,
    width: 25,
    borderRadius: 13,
    backgroundColor: '#4D7031',
    alignItems: 'center',
    justifyContent: 'center',
  },
  desc: {
    fontFamily: commonStyle.fontFamily,
    color: commonStyle.colors.mainText,
    fontSize: 15,
  },
  date: {
    fontFamily: commonStyle.fontFamily,
    color: commonStyle.colors.subText,
    fontSize: 12,
  },
  right: {
    backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
  },
  left: {
    backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deleteIcon: {
    marginLeft: 10,
  },
  deleteText: {
    fontFamily: commonStyle.fontFamily,
    color: 'white',
    fontSize: 20,
    margin: 10,
  },
});
