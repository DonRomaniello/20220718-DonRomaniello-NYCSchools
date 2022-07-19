import React from 'react';

/* My preference is to split imports across lines, it makes it
easier to alphabetize and keep clean. */
import {
   StyleSheet,
   Text,
   } from 'react-native';



/* This is the SAT data component */
export default Sats = (props) => {

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

const styles = StyleSheet.create({
  data: {
    paddingTop: 20,
  }
});
