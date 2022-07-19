// Using this example from the React Native documentation
// https://reactnative.dev/docs/flatlist

// Using Axios to access NYC API
import axios from 'axios';

import React, {
       useEffect,
       useState,
       } from 'react';

// My preference is to alphabetize and split imports across lines, it makes it
// easier to alphabetize and keep clean
import {
        FlatList,
        SafeAreaView,
        StatusBar,
        StyleSheet,
        Text,
        View,
        } from 'react-native';



const Item = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

export default List = () => {
  const renderItem = ({ item }) => (
    <Item title={item.name} />
  );

  // The school information will be a list
  const [schoolData, setSchoolData] = useState([]);

  useEffect(() => {

    const schoolUrl = 'https://data.cityofnewyork.us/resource/s3k6-pzi2.json'


    const fetchSchools = async () => {
      await axios.get(schoolUrl)
      .then((response) => {
        let schoolsObject = []
        response.data.forEach((school) => {

          /* There is a lot of data available, but for the purposes of this
          project we really only need the name and the DBN. The DBN (database
          number?) is also used in the SAT data, so this provides a handy way
          to match SAT data with school names.*/
          let newSchool = {
              dbn: school?.dbn,
              name: school?.school_name,
              website: school?.website
            }
          schoolsObject.push(newSchool)
        })

        // The array returned from the API call is not sorted alphabetically.
        schoolsObject.sort((a, b) => a.name.localeCompare(b.name))
        setSchoolData(schoolsObject)
      }).catch((error) => {})
    }
    fetchSchools();
  }, [])




  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={schoolData}
        renderItem={renderItem}
        keyExtractor={item => item.dbn} // Switched this to item.dbn
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: 'rgba(1, 111, 141 .2)',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});