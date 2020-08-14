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

    // this is done for testing purposes - reset AsyncStorage on every app refresh
    await AsyncStorage.removeItem('saved_list');

    // get current persisted list items (will be null if above line is not removed)
    const curItems = await AsyncStorage.getItem('saved_list');

    if (curItems === null) {
      // no current items in AsyncStorage - fetch initial items
      json = fetchResults(0);
    } else {
      // current items exist - format as a JSON object
      json = JSON.parse(curItems);
    }

    // set initial list in AsyncStorage
    AsyncStorage.setItem('saved_list', JSON.stringify(json));

    // update Redux store (Redux will ignore if `json` is same as current list items)
    dispatch({
      type: 'UPDATE_LIST_RESULTS',
      items: json
    });
  }


  persistResults = async (newItems) => {

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

    // if already loading more, or all loaded, return
    if (loadingMore || allLoaded)
      return

    // set loading more (also updates footer text)
    setLoadingMore(true);

    // get next results
    const newItems = fetchResults(totalItems);

    // mimic server-side API request and delay execution for 1 second
    await delay(1000);

    if (newItems.length === 0) {
      // if no new items were fetched, set all loaded to true to prevent further requests
      setAllLoaded(true);
    } else {
      // process the newly fetched items
      await persistResults(newItems);
    }

    // load more complete, set loading more to false
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