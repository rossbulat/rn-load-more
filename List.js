import styles from './styles';
import { fetchResults } from './data';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { FlatList, View, Text, SafeAreaView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import delay from 'delay';

export default function App () {

  const dispatch = useDispatch();
  const listItems = useSelector(state => state.list.items);
  const totalItems = Array.isArray(listItems) ? listItems.length : 0;
  const [loadingMore, setLoadingMore] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);


  useEffect(() => {
    initialiseList();
  }, []);


  const initialiseList = async () => {

    await AsyncStorage.removeItem('saved_list');

    // get current persisted list items
    const curItems = await AsyncStorage.getItem('saved_list');

    // format as a JSON object
    if (curItems === null) {

      // fetch initial items
      json = fetchResults(0);

    } else {
      json = JSON.parse(curItems);
    }

    json = fetchResults(0);

    // set initial list in AsyncStorage
    AsyncStorage.setItem('saved_list', JSON.stringify(json));

    // update Redux store
    dispatch({
      type: 'UPDATE_LIST_RESULTS',
      items: json
    });
  }


  persistResultsAsync = async (newItems) => {

    // get current persisted list items
    const curItems = await AsyncStorage.getItem('saved_list');

    // format as a JSON object
    let json = curItems === null
      ? {}
      : JSON.parse(curItems);

    // add new items to json object
    for (let item of newItems) {
      json.push(item);
    }

    // // persist updated item list
    await AsyncStorage.setItem('saved_list', JSON.stringify(json));

    // update Redux store
    dispatch({
      type: 'UPDATE_LIST_RESULTS',
      items: json
    });
  }


  const loadMoreResults = async info => {

    if (loadingMore || allLoaded)
      return

    setLoadingMore(true);

    // get next results
    const newItems = fetchResults(totalItems);

    await delay(1000);

    await persistResultsAsync(newItems);

    if (newItems.length === 0) {
      setAllLoaded(true);
    }

    setLoadingMore(false);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Displaying {totalItems} Items</Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.footer}>
            {loadingMore &&
              <Text style={styles.footerText}>Loading More...</Text>
            }
          </View>
        }
        scrollEventThrottle={250}
        onEndReached={info => {
          loadMoreResults(info);
        }}
        onEndReachedThreshold={0.01}
        data={listItems}
        keyExtractor={(item) => "item_" + item._id}
        renderItem={({ item, index }) => {
          return (
            <React.Fragment key={index}>
              <View style={styles.item}>
                <Text>Item {item._id}</Text>
              </View>
            </React.Fragment>
          )
        }}
      />
    </SafeAreaView>
  );
}