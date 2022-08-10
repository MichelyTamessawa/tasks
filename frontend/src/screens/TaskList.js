import React, {Component} from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import 'moment/locale/pt-br';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import commonStyle from '../commonStyle';
import Task from '../components/Task';
import todayImage from '../../assets/imgs/today.jpg';
import tomorrowImage from '../../assets/imgs/tomorrow.jpg';
import weekImage from '../../assets/imgs/week.jpg';
import monthImage from '../../assets/imgs/month.jpg';
import AddTask from './AddTask';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {server, showError} from '../common';

const initialState = {
  showDoneTask: true,
  showAddTask: false,
  visibleTasks: [],
  tasks: [],
};

export default class TaskList extends Component {
  state = {
    ...initialState,
  };

  componentDidMount = async () => {
    const stateString = await AsyncStorage.getItem('tasksState');
    const savedState = JSON.parse(stateString) || initialState;
    this.setState(
      {
        showDoneTask: savedState.showDoneTask,
      },
      this.filterTasks(),
    );

    this.loadTasks();
  };

  loadTasks = async () => {
    try {
      const maxDate = moment()
        .add({days: this.props.daysAhead})
        .format('YYYY-MM-DD 23:59:59');
      const res = await axios.get(`${server}/tasks?date=${maxDate}`);
      this.setState({tasks: res.data}, this.filterTasks);
    } catch (error) {
      showError(error);
    }
  };

  toggleFilter = () => {
    this.setState({showDoneTask: !this.state.showDoneTask}, this.filterTasks);
  };

  filterTasks = () => {
    let visibleTasks = null;

    if (this.state.showDoneTask) visibleTasks = [...this.state.tasks];
    else {
      const isPending = task => task.doneAt === null;

      visibleTasks = this.state.tasks.filter(isPending);
    }

    this.setState({visibleTasks});

    AsyncStorage.setItem(
      'tasksState',
      JSON.stringify({
        showDoneTask: this.state.showDoneTask,
      }),
    );
  };

  toggleTask = async taskId => {
    try {
      await axios.put(`${server}/tasks/${taskId}/toggle`);
      this.loadTasks();
    } catch (error) {
      showError(error);
    }
  };

  addTask = async newTask => {
    if (!newTask.desc || !newTask.desc.trim()) {
      Alert.alert('Dados Inválidos', 'Descrição não informada!');
      return;
    }

    console.log(newTask);

    try {
      await axios.post(`${server}/tasks`, {
        desc: newTask.desc,
        estimateAt: newTask.date,
      });

      this.setState({showAddTask: false}, this.loadTasks);
    } catch (error) {
      showError(error);
    }
  };

  deleteTask = async taskId => {
    try {
      await axios.delete(`${server}/tasks/${taskId}`);
      this.loadTasks();
    } catch (error) {
      showError(error);
    }
  };

  getImage = () => {
    switch (this.props.daysAhead) {
      case 0:
        return todayImage;
      case 1:
        return tomorrowImage;
      case 7:
        return weekImage;
      default:
        return monthImage;
    }
  };

  getColor = () => {
    switch (this.props.daysAhead) {
      case 0:
        return commonStyle.colors.today;
      case 1:
        return commonStyle.colors.tomorrow;
      case 7:
        return commonStyle.colors.week;
      default:
        return commonStyle.colors.month;
    }
  };

  render() {
    const today = moment().locale('pt-br').format('ddd, D [de] MMM');

    return (
      <SafeAreaView style={styles.container}>
        <AddTask
          isVisible={this.state.showAddTask}
          onCancel={() => this.setState({showAddTask: false})}
          onSave={this.addTask}
        />
        <ImageBackground style={styles.background} source={this.getImage()}>
          <View style={styles.iconBar}>
            <TouchableOpacity onPress={this.toggleFilter}>
              <Icon
                name={this.state.showDoneTask ? 'eye' : 'eye-slash'}
                size={20}
                color={commonStyle.colors.secondary}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.titleBar}>
            <Text style={styles.title}>{this.props.title}</Text>
            <Text style={styles.subtitle}>{today}</Text>
          </View>
        </ImageBackground>
        <View style={styles.taskList}>
          <FlatList
            data={this.state.visibleTasks}
            keyExtractor={item => `${item.id}`}
            renderItem={({item}) => (
              <Task
                {...item}
                onToggleTask={this.toggleTask}
                onDelete={this.deleteTask}
              />
            )}
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.addButton, {backgroundColor: this.getColor()}]}
          onPress={() => this.setState({showAddTask: true})}>
          <Icon name="plus" size={20} color={commonStyle.colors.secondary} />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 3,
  },
  taskList: {
    flex: 7,
  },
  iconBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginHorizontal: 20,
    marginTop: Platform.OS === 'ios' ? 40 : 10,
  },
  titleBar: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    fontFamily: commonStyle.fontFamily,
    fontSize: 50,
    color: commonStyle.colors.secondary,
    marginLeft: 20,
    marginBottom: 20,
  },
  subtitle: {
    fontFamily: commonStyle.fontFamily,
    fontSize: 20,
    color: commonStyle.colors.secondary,
    marginLeft: 20,
    marginBottom: 30,
  },
  addButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
