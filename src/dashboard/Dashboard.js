import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Modal,
  Button,
  Alert,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import {Calendar} from 'react-native-calendars';
import {
  useNavigation,
  useFocusEffect,
  useRoute,
} from '@react-navigation/native';
import Iconsss from 'react-native-vector-icons/AntDesign';
import handleEmployeeApi from '../handleEmployeeApi/handleEmployeeApi';
import handlePunchApi from '../handlePunchApi/handlePunchApi';
import Iconssss from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import punchData from '../punchData/punchData';
import deviceDetails from '../deviceDetails/DeviceDetails';
import DisplayImages from '../testCamera/DisplayImages';

const Dashboard = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  // const [allData, setAllData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [calendarOpened, setCalendarOpened] = useState(false);
  const [isPunchDisabled, setIsPunchDisabled] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [duration, setDuration] = useState(0);
  const [employeeData, setEmployeeData] = useState([]);
  const [thisWeekData, setThisWeekData] = useState(true);
  const [lastWeekData, setLastWeekData] = useState(false);
  const [thirtyDaysData, setThirtyDaysData] = useState(false);
  const [showMenuDropDown, setShowMenuDropDown] = useState(false);
  const [userLoginResponse, setUserLoginResponse] = useState({});
  const [showLoading, setShowLoading] = useState(false);
  const [storedImages, setStoredImages] = useState([]);

  console.log('storedImages---', storedImages);

  const route = useRoute();

  const {userLoginData} = route.params;

  console.log('userLoginData=========', userLoginData);

  // const data = punchData();
  // console.log('dataaaaaaaaaaaa', data)
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      fetchStoredImages();
      // Specify a cleanup function for when the screen loses focus
      let interValId;
      if (interValId) {
        interValId = setInterval(() => {
          const endTime = new Date();
          const diff = endTime.getTime() - startTime.getTime();
          const seconds = Math.floor(diff / 1000);
          setDuration(seconds);
        }, 1000);
      } else {
        // Clear the interval if the start time is null
        clearInterval(interValId);
      }
      return () => {
        // Cleanup logic here
        clearInterval(interValId);
      };
    }, []),
  );

  const getDisplayDate = dateString => {
    const currentDate = new Date();
    const inputDate = new Date(dateString);

    if (
      inputDate.getDate() === currentDate.getDate() &&
      inputDate.getMonth() === currentDate.getMonth() &&
      inputDate.getFullYear() === currentDate.getFullYear()
    ) {
      //If the input date is today , return "Today" along with the time

      const hours = inputDate.getHours();
      const minutes = inputDate.getMinutes();
      const timeString = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
      return `Today  ${timeString}`;
    } else if (
      inputDate.getDate() === currentDate.getDate() - 1 &&
      inputDate.getMonth() === currentDate.getMonth() &&
      inputDate.getFullYear() === currentDate.getFullYear()
    ) {
      const hours = inputDate.getHours();
      const minutes = inputDate.getMinutes();
      const timeString = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
      return `Yesterday ${timeString}`;
    } else {
      return dateString;
    }
  };

  const fetchData = async () => {
    const employeeResponse = await handleEmployeeApi(userLoginData.data.name);
    setEmployeeData(employeeResponse.data);
    const userLoginAsyncData = await AsyncStorage.getItem('userLoginData');
    const parsedUserLoginDataAsyncData = JSON.parse(userLoginAsyncData);
    if (parsedUserLoginDataAsyncData) {
      setUserLoginResponse(parsedUserLoginDataAsyncData);
      console.log(
        'parsedUserLoginDataAsyncData stored in userLoginResponse state',
      );
    } else {
      setUserLoginResponse(userLoginData);
      console.log('userLoginData stored in userLoginResponse state');
    }
  };

  const filterDataByDate = async date => {
    setSelectedDate(date);
    setShowCalendar(false);

    try {
      const formattedDate = date.split('-').reverse().join('-');
      const response = await fetch(
        `http://172.17.15.218/etvtracker/Api/punch_in_wise_data?punch_in=${formattedDate}&user_name=${userLoginData.data.name}`,
      );
      //http://172.17.15.218/etvtracker/Api/punch_in_wise_data?punch_in=2024-04-05&user_name=ambaji
      //http://172.17.15.218/etvtracker/Api/punch_in_wise_data?punch_in=${formattedDate}
      const jsonData = await response.json();
      console.log('Filtered data:', jsonData);

      if (Array.isArray(jsonData.data)) {
        setFilteredData(jsonData.data);
      } else {
        setFilteredData([]); // Set empty array if data is not an array
      }

      setModalVisible(true);
    } catch (error) {
      console.log('Error fetching data:', error);
      setFilteredData([]); // Set empty array if there's an error
    }
  };

  const handleCalendarClose = async date => {
    setShowCalendar(false);
    setCalendarOpened(false);
    setShowMenuDropDown(false);
  };

  const handlePunch = async () => {
    setIsPunchDisabled(true);
    const user_name = userLoginResponse.data.name;
    const phone = userLoginResponse.data.phone;
    try {
      // Show loading icon
      setShowLoading(true);

      // Call handlePunchApi()
      // await handlePunchApi(userLoginResponse);
      navigation.navigate('testCamera', {userLoginResponse: userLoginResponse});

      fetchData();

      // Hide loading icon
      setShowLoading(false);

      // Update state to indicate successful punch
      // setLastWeekData(true);
      // Alert.alert('You have punched successfully');
    } catch (error) {
      console.error('Error while punching:', error);
      Alert.alert('Failed to punch, please try again');
    } finally {
      // Re-enable the punch button after 5 seconds
      setTimeout(() => {
        setIsPunchDisabled(false);
      }, 3000);
    }
  };

  const fetchStoredImages = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const images = await AsyncStorage.multiGet(keys);
      setStoredImages(images);
    } catch (error) {
      console.log('Error fetching stored images:', error);
    }
  };

  console.log('startTime :-', startTime);
  console.log('employeeData :-', employeeData);
  console.log('filteredData:-', filteredData);
  console.log('selectedDate:-', selectedDate);
  console.log('userLoginResponse--', userLoginResponse);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        handleCalendarClose();
      }}>
      <View style={styles.container}>
        <View
          style={{position: 'absolute', bottom: '8%', right: '9%', zIndex: 1}}>
          <TouchableOpacity
            onPress={() => {
              handlePunch();
            }}
            disabled={isPunchDisabled}
            style={[
              styles.button,
              isPunchDisabled ? styles.disabledButton : null,
            ]}>
            <Iconssss
              name="fingerprint"
              size={42}
              color="#fff"
              style={{
                alignSelf: 'center',
              }}
            />
          </TouchableOpacity>
        </View>

        <View style={{height: '15%', backgroundColor: '#FDFCFA'}}>
          <Image
            source={require('../Assets/Etv_logo.jpg')}
            style={styles.image}
          />
          <View style={{marginTop: 7, marginLeft: 7}}>
            <Text>𝐏𝐡𝐨𝐭𝐨𝐠𝐫𝐚𝐩𝐡𝐞𝐫</Text>
          </View>

          <View style={{marginTop: '-10%'}}>
            <TouchableOpacity
              style={styles.menuIconContainer}
              onPress={() => {
                setShowMenuDropDown(!showMenuDropDown);
              }}>
              <Icon
                name="menu"
                size={35}
                color="#B67352"
                // color="white"
              />
            </TouchableOpacity>
          </View>
        </View>

        {showCalendar && (
          <Calendar
            onDayPress={day => {
              filterDataByDate(day.dateString);
              // handleCalendarClose(day.dateString)
            }}
            markedDates={{
              [selectedDate]: {selected: true, selectedColor: '#eb5e34'},
            }}
            style={{
              width: '95%',
              height: '45%',
              alignSelf: 'center',
              top: '-31%',
            }}
          />
        )}

        {calendarOpened ? null : (
          <View>
            <View style={{}}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                <View
                  style={{
                    //backgroundColor: 'pink',
                    flexGrow: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    // flex: 1,
                    width: '85%',
                    height: '80%',
                    margin: 17,
                    marginLeft: 24,
                    // borderWidth: 1.5,
                    borderColor: '#FE7A36',
                    borderRadius: 10,
                    backgroundColor: '#ADD8E6',
                    elevation: 40,
                  }}>
                  {/*Last Week Data */}
                  <TouchableOpacity
                    style={[
                      {
                        width: '30%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 5,
                        flexDirection: 'row',
                      },
                    ]}
                    onPress={() => {
                      setThisWeekData(true);
                      setThirtyDaysData(false);
                      setLastWeekData(false);
                    }}>
                    <Text
                      style={[
                        {
                          color: '#000',
                          fontSize: 16,
                          width: '70%',
                          // left: 5,
                          textAlign: 'center',

                          // fontStyle: 'italic',
                        },
                        thisWeekData
                          ? {color: 'green', fontWeight: 'bold'}
                          : {color: '#000', fontWeight: 'bold'},
                      ]}>
                      This week data
                    </Text>
                  </TouchableOpacity>

                  <View style={{borderLeftWidth: 1, borderColor: 'grey'}} />

                  {/*Last Week Data */}
                  <TouchableOpacity
                    style={[
                      {
                        width: '30%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 5,
                        flexDirection: 'row',
                      },
                    ]}
                    onPress={() => {
                      setLastWeekData(true);
                      setThirtyDaysData(false);
                      setThisWeekData(false);
                    }}>
                    <Text
                      style={[
                        {
                          color: '#000',
                          fontSize: 16,
                          width: '70%',
                          // left: 5,
                          textAlign: 'center',
                          // fontStyle: 'italic',
                        },
                        lastWeekData
                          ? {color: 'green', fontWeight: 'bold'}
                          : {color: '#000', fontWeight: 'bold'},
                      ]}>
                      Last week data
                    </Text>
                  </TouchableOpacity>

                  <View style={{borderLeftWidth: 1, borderColor: 'grey'}} />

                  {/*Last 30 days Data */}
                  <TouchableOpacity
                    style={{
                      //backgroundColor: 'black',
                      width: '30%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 5,
                      //marginHorizontal: '-1.5%',
                      flexDirection: 'row',
                      // margin: 3,
                    }}
                    onPress={() => {
                      setThirtyDaysData(true);
                      setLastWeekData(false);
                      setThisWeekData(false);
                    }}>
                    <Text
                      style={[
                        {
                          color: '#000',
                          fontSize: 16,
                          width: '70%',
                          // left: 5,
                          textAlign: 'center',
                          // fontStyle: 'italic',
                        },
                        thirtyDaysData
                          ? {color: 'green', fontWeight: 'bold'}
                          : {color: '#000', fontWeight: 'bold'},
                      ]}>
                      Last 30 days data
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={{alignSelf: 'center', marginTop: 15}}
                  onPress={() => {
                    setShowCalendar(true);
                    setCalendarOpened(true);
                  }}>
                  <Iconsss
                    name="filter"
                    size={40}
                    color="#5C4B99"
                    // backgroundColor='#eb5e34'
                    style={{alignSelf: 'center', marginRight: 5}}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <FlatList
              data={employeeData}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{flexGrow: 1}}
              horizontal={false}
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
              onEndReached={this._handleLoadMore}
              onEndReachedThreshold={0.5}
              // scrollEnabled={bottomSheetIndex == 1 ? true : false}
              renderItem={({item, index}) => {
                // Get the current date
                const currentDate = new Date();
                const currentWeekStart = new Date(
                  currentDate.setDate(
                    currentDate.getDate() - currentDate.getDay(),
                  ),
                );
                const currentWeeekEnd = new Date(
                  currentDate.setDate(currentWeekStart.getDate() + 6),
                );
                // Convert item's punch_in date to a Date object
                const punchInDate = new Date(item.punch_in);

                // calculate the start and end dates of the last week
                const lastWeekStartDate = new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  currentDate.getDate() - currentDate.getDay() - 6,
                );

                const lastWeekEndDate = new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  currentDate.getDate() - currentDate.getDay() - 1,
                );

                // Calculate the start date of the last 30 days

                const last30DaysStartDate = new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  currentDate.getDate() - 30,
                );
                if (thisWeekData) {
                  // Check if the punch_in date is within the current week
                  if (
                    punchInDate >= currentWeekStart &&
                    punchInDate <= currentWeeekEnd
                  ) {
                    // setLastWeekData(true);
                    return (
                      <View key={index} style={[styles.dataCardItem]}>
                        <Text style={styles.dataCardDate}>
                          {/* {getDisplayDate(item.punch_in)} */}
                          {item.punch_in}
                        </Text>
                        <View style={styles.dataCardBody}>
                          <Text style={styles.dataCardLabel}>Address:</Text>
                          <Text style={styles.dataCardValue}>
                            {item.address}
                          </Text>

                          {/*  Displaying User Photo
                          
                          <View>
                            <Image
                              source={{uri: item.image_url}} // Use a valid image URI here
                              style={{
                                width: 100,
                                height: 100,
                                borderRadius: 100,
                                borderWidth: 0.5,
                                borderColor: '#000',
                                alignSelf: 'center',
                                //resizeMode: 'cover',
                              }} // Set the width and height of the image
                            />
                          </View> */}
                        </View>
                      </View>
                    );
                  }
                } else if (lastWeekData) {
                  // Check if the punch_in date is within the last week
                  if (
                    punchInDate >= lastWeekStartDate &&
                    punchInDate <= lastWeekEndDate
                  ) {
                    // setLastWeekData(true);
                    return (
                      <View key={index} style={[styles.dataCardItem]}>
                        <Text style={styles.dataCardDate}>
                          {/* {getDisplayDate(item.punch_in)} */}
                          {item.punch_in}
                        </Text>
                        <View style={styles.dataCardBody}>
                          <Text style={styles.dataCardLabel}>Address:</Text>
                          <Text style={styles.dataCardValue}>
                            {item.address}
                          </Text>
                        </View>
                      </View>
                    );
                  }
                } else if (thirtyDaysData) {
                  // Check if the punch_in date is within the last 30 days
                  if (
                    punchInDate >= last30DaysStartDate &&
                    punchInDate <= currentDate
                  ) {
                    // setLastWeekData(true);
                    return (
                      <View key={index} style={[styles.dataCardItem]}>
                        <Text style={styles.dataCardDate}>{item.punch_in}</Text>
                        <View style={styles.dataCardBody}>
                          <Text style={styles.dataCardLabel}>Address:</Text>
                          <Text style={styles.dataCardValue}>
                            {item.address}
                          </Text>
                        </View>
                      </View>
                    );
                  }
                }
              }}
              ListEmptyComponent={() => (
                <View
                  collapsable={false}
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                  }}>
                  <Text style={{color: 'red', textAlign: 'center'}}>
                    Loading...
                  </Text>
                </View>
              )}
            />
          </View>
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}>
          {filteredData.length > 0 ? (
            <View style={styles.modalContainer}>
              {filteredData.length > 0 ? (
                <ScrollView style={styles.modalContent}>
                  {filteredData &&
                    filteredData.map((item, index) => (
                      <View key={index} style={[styles.dataCardItem]}>
                        <View style={styles.dataCardBody}>
                          {/* <Text style={styles.dataCardLabel}>punch_in:</Text> */}
                          <Text style={styles.dataCardValue}>
                            {item.punch_in}
                          </Text>
                        </View>
                        <View style={styles.dataCardBody}>
                          <Text style={styles.dataCardLabel}>Address:</Text>
                          <Text style={styles.dataCardValue}>
                            {item.address}
                          </Text>
                        </View>
                      </View>
                    ))}
                  <View style={{marginBottom: '10%'}}>
                    <Button
                      title="Close"
                      onPress={() => {
                        setModalVisible(false);
                        setCalendarOpened(false);
                      }}
                    />
                  </View>
                </ScrollView>
              ) : (
                <View
                  collapsable={false}
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                  }}>
                  <Text style={{color: 'red', textAlign: 'center'}}>
                    Loading...
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.modalContainer}>
              <ScrollView style={styles.modalContent}>
                <View style={[styles.dataCardItem]}>
                  <View style={styles.dataCardBody}>
                    {/* <Text style={styles.dataCardLabel}>punch_in:</Text> */}
                    <Text style={styles.dataCardValue}>No data found</Text>
                  </View>
                </View>

                <View style={{marginBottom: '10%'}}>
                  <Button
                    title="Close"
                    onPress={() => {
                      setModalVisible(false);
                      setCalendarOpened(false);
                    }}
                  />
                </View>
              </ScrollView>
            </View>
          )}
        </Modal>

        <View style={{flex: 1, backgroundColor: 'white'}}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={showMenuDropDown}
            onRequestClose={() => {
              setShowMenuDropDown(false);
            }}
            // style={{backgroundColor:'white',zIndex:4}}
          >
            <TouchableOpacity
              onPress={() => setShowMenuDropDown(false)}
              style={{flex: 1}}
            />
            <View
              style={{
                width: '95%',
                height: '18%',
                top: '-40%',
                backgroundColor: '#BED1CF',
                borderRadius: 10,
                margin: 10,
              }}>
              <View style={{backgroundColor: ' #febf00', height: '20%'}}>
                <TouchableOpacity
                  style={{
                    justifyContent: 'center',
                    top: '100%',
                    borderRadius: 10,
                    flexDirection: 'column',
                  }}>
                  <Text
                    style={{
                      left: '30%',
                      top: '25%',
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: 'black',
                      // textAlign: 'center',
                    }}>
                    Emp.id: {userLoginResponse?.data?.id ?? 'N/A'}
                  </Text>
                  <Text
                    style={{
                      left: '30%',
                      top: '25%',
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: 'black',
                    }}>
                    Name: {userLoginResponse?.data?.name ?? 'N/A'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
        <Modal animationType="slide" transparent={true} visible={showLoading}>
          <View style={{}}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'grey',
                width: '80%',
                height: '40%',
                alignContent: 'center',
                top: '90%',
                left: '10%',
              }}>
              <Text style={{color: 'white', fontWeight: 'bold', fontSize: 19}}>
                punch in progress...please wait
              </Text>
            </View>
          </View>
        </Modal>
        <View style={styles.poweredMc}>
          <Text
            style={{
              fontSize: 14,
              color: '#8B8989',
              fontWeight: 'bold',
              backgroundColor: 'white',
              textAlign: 'center',
            }}>
            Powered by Margadarsi Computers
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#747264',
    // opacity: 0.5
    // top:-80
    backgroundColor: '#FEECE2',
  },
  image: {
    width: '26%',
    height: '50%',
    resizeMode: 'cover',
    left: '0.6%',
    top: '10%',
  },
  menuIconContainer: {
    alignSelf: 'flex-end',
    top: '-35%',
    marginRight: '15%',
    right: '-8%',
  },
  welcometxtContainer: {
    alignSelf: 'center',
    top: '-12%',
  },
  welcomeTxt: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#eb5e34',
  },
  dataCardItem: {
    flex: 1,
    marginBottom: 15,
    margin: 15,
    marginTop: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 8,
    elevation: 100,
  },
  dataCardDate: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#088395',
    // fontStyle: 'italic',
  },
  dataCardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  dataCardLabel: {
    fontWeight: 'bold',
    marginRight: 5,
    fontSize: 16,
    color: '#FC6736',
    // fontStyle: 'italic',
  },
  dataCardValue: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F2C59',
    //textAlign: 'center',
    // fontStyle: 'italic',
  },

  filterButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '70%',
  },
  modalItem: {
    marginBottom: 10,
  },
  disabledButton: {
    // backgroundColor: 'gray',
    borderColor: 'gray',
    opacity: 0.6, // Adjust the opacity to make the button appear disabled
  },
  button: {
    height: 50,
    width: 50,
    borderRadius: 50,
    // backgroundColor: '#3D06F9',
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
  poweredMc: {
    // bottom: '-11%',
    // left:'10%',
    // width:'90%'
  },
});

export default Dashboard;
