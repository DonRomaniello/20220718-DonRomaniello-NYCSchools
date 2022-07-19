/* Using this example from the React Native documentation
https://reactnative.dev/docs/flatlist

Using Axios to access NYC API */
import axios from 'axios';

import React, {
       useEffect,
       useState,
       } from 'react';

/* My preference is to alphabetize and split imports across lines, it makes it
 easier to alphabetize and keep clean. */
import {
        FlatList,
        SafeAreaView,
        StatusBar,
        StyleSheet,
        Text,
        View,
        } from 'react-native';


/* This is the SAT data component */
const Sats = (props) => {

  const {satData, school} = props

  const dbn = school?.dbn

  /* This returns a percentage of SAT tests per year vs total students */
  const percentageTakingSAT = () => {
    const rawFloat = (satData[dbn]?.testTakers / school?.students)
    const percentage = (rawFloat * 100).toFixed(2)
    return percentage
  }

 /* Some of the data returns 's' as the scores... */
  if (satData[dbn]?.math === 's') {
    return (
      <>
      <Text>
        No SAT data available.
      </Text>
      </>
    )
  }

  /* Otherwise, we want to do return the information. */
  return(
    <>
      {satData[dbn] ? /* Check to see if DBN exists in dictionary */
      <>
      <Text
      style={styles.data}
      >
        Average Math Score: {satData[dbn]?.math} / 800
      </Text>
      <Text
      style={styles.data}
      >
        Average Writing Score: {satData[dbn]?.writing} / 800
      </Text>
      <Text
      style={styles.data}
      >
      Average Critical Reading: {satData[dbn]?.critical_reading} / 800
      </Text>
      <Text
      style={styles.data}
      >
        {percentageTakingSAT()}% of the student body takes the SAT each year.
      </Text>
      </>
      : 'No SAT data available.'}
    </>
  )
}


const Item = (props) => {

  const { item, satData } = props;

  /* State that represents whether an item in the list
  has been opened.*/
  const [isOpened, setIsOpened] = useState(false);

  return (
    <View
    style={isOpened ? openedFlattenedStyle : styles.item}
    >
    <Text
    onPress={() => {
      setIsOpened(!isOpened)}}
    style={styles.title}
    >
      {item.name}
    </Text>
    {isOpened ?
    <Sats
    satData={satData}
    school={item}
    />
      : null}
  </View>
    )
  };

export default List = () => {

  /* The school information will be a list */
  const [schoolData, setSchoolData] = useState([]);

  /* Because both the School and SAT data use unique but consisitent DBNs,
  the SAT data will be a dictionary with DBNs as the keys. */
  const [satData, setSatData] = useState({})

  /* API calls placed in a useEffect, called when the component mounts */
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
            website: school?.website,
            students: school?.total_students,
          }
          schoolsObject.push(newSchool)
      })

          /* The array returned from the API call is not sorted alphabetically. */
          schoolsObject.sort((a, b) => a.name.localeCompare(b.name))
          setSchoolData(schoolsObject)
        }).catch((error) => {
          /* If there is an error fetching the school data,
          the user should get some sort of warning so they aren't
          left with a blank screen. */
          setSchoolData([{name: 'Error retrieving schools...',
          dbn: '1',
          website: null}])
        })
      }

      fetchSchools();

      const satURL = 'https://data.cityofnewyork.us/resource/f9bf-2cp4.json'
      const fetchSats = async () => {
        await axios.get(satURL)
        .then((response) => {
          let satsObject = {}
          response.data.forEach((satsSchool) => {
            /* The DBN will be the key */
            let satsSchoolKey = satsSchool?.dbn

            /* These seem like the most relevant pieces of data. */
            let newSat = {
              testTakers: satsSchool?.num_of_sat_test_takers,
              critical_reading: satsSchool?.sat_critical_reading_avg_score,
              math: satsSchool?.sat_math_avg_score,
              writing: satsSchool?.sat_writing_avg_score,
            }
            satsObject[satsSchoolKey] = newSat
          })
          setSatData(satsObject)
        }).catch((error) => {
        })
      }

      fetchSats();

    }, [])

    const renderItem = ({ item }) => (
      <Item item={item} satData={satData}/>
    );

    return (
      <SafeAreaView style={styles.container}>
      <FlatList
        data={schoolData}
        renderItem={renderItem}
        keyExtractor={item => item.dbn} /* Switched this to item.dbn */
        satData={satData} /* SAT data needs to be passed to the FlatList. */
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
    backgroundColor: 'rgba(154, 233, 254, .2)',
    borderRadius: 3,
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 20,
  },
  title: {
    fontSize: 16,
  },
  data: {
    paddingTop: 20,
  }
});

/* To avoid having to rewrite the style sheet, this simply
changes the background to indicate something is selected.*/
const openStyles = StyleSheet.create({
  item: {
    backgroundColor:  'rgba(154, 233, 254, .6)',
  },
})

/* This function combines the two styles */
const openedFlattenedStyle = StyleSheet.flatten([
    styles.item,
    openStyles.item
  ])
