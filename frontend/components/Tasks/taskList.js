import React, { useState, useContext, useEffect } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
} from 'react-native';
import { TasksContext } from '../../context';
import { SwipeListView } from 'react-native-swipe-list-view';
import CompletedButton from './completeTaskButton';
import DeleteButton from './deleteTaskButton';
import { calculateExpTime, completeTask } from './taskHelpers';
import CountDownView from './CountDownView';

function TaskList({ navigation }) {
  let { taskList, setTaskList, user, setScore } = useContext(TasksContext);
  let [taskListView, setTaskListView] = useState([]);


  //add time param in the db
  useEffect(() => {
    setTaskListView(
      taskList.map((task) => ({
        key: task._id.$oid,
        id: task._id.$oid,
        title: task.title,
        description: task.description,
        completed: task.completed,
        expiryTime: calculateExpTime(task.expiryTime),
      }))
    );
  }, [taskList]);


  return (
    <View style={styles.container}>
      <View>
        <SwipeListView
          data={taskListView.filter((task) => task.completed == false)}
          renderItem={(data, rowMap) =>
            data.item.expiryTime == 0 ? (
              <View style={styles.rowFront}>
                <Text style={styles.taskview}>{data.item.title}</Text>
              </View>
            ) : (
              <CountDownView
                title={data.item.title}
                expiryTime={data.item.expiryTime}
                id={data.item.id}
              />
            )
          }
          renderHiddenItem={(data, rowMap) => (
            <View style={styles.rowBack}>
              <View
                style={[
                  styles.backRightBtn,
                  styles.backLeftBtn,
                  styles.backBtnView,
                ]}
              >
                <CompletedButton
                  user={user}
                  taskId={data.item.id}
                  setTaskList={setTaskList}
                  setScore={setScore}
                />
              </View>
              <View
                style={[
                  styles.backRightBtn,
                  styles.backLeftBtn2,
                  styles.backTextWhite,
                ]}
              >

                <TouchableOpacity
                  onPress={() =>
                    completeTask(
                      user,
                      data.item.id,
                      setTaskList,
                      true,
                      -1,
                      setScore,
                    )
                  }
                  title=""
                >
                  <Image source={require('../../assets/fail.png')} />
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.backTextWhite,
                  styles.backRightBtn,
                  styles.backRightBtnLeft,
                ]}
              >
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Edit Task', {
                      taskTitle: data.item.title,
                      taskDescription: data.item.description,
                      taskId: data.item.id,
                    })
                  }
                  title=""
                >
                  <Image source={require('../../assets/edit.png')} />
                </TouchableOpacity>
              </View>

              <View style={[styles.backRightBtn, styles.backRightBtnRight]}>
                <DeleteButton
                  user={user}
                  taskId={data.item.id}
                  setTaskList={setTaskList}
                  setScore={setScore}
                />
              </View>
            </View>
          )}
          leftOpenValue={150}
          rightOpenValue={-150}
        />
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.doneBtn}
            onPress={() => navigation.navigate('Game')}
          >
            <Image source={require('../../assets/game.png')} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('Add Task')}
          >
            <Image source={require('../../assets/plus.png')} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.doneBtn}
            onPress={() => navigation.navigate('Completed Task List')}
          >
            <Image source={require('../../assets/done.png')} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#003f5c',
    flex: 1,
  },

  // countdown: {
  //   position: 'absolute',
  // },
  taskview: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  buttons: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 550,
    left: 105,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },

  rowFront: {
    alignItems: 'center',
    backgroundColor: '#465881',
    borderBottomColor: '#003f5c',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 75,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backLeftBtn: {
    width: 75,
    backgroundColor: '#52B788',
    left: 0,
  },
  backLeftBtn2: {
    backgroundColor: 'yellow',
    left: 75,
  },
  backRightBtnLeft: {
    backgroundColor: '#003f5c',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: '#fb5b5a',
    right: 0,
  },
  inputText: {
    height: 50,
    color: 'white',
    padding: 17,
  },
  backBtnView: {
    color: 'white',
  },
})


export default TaskList
