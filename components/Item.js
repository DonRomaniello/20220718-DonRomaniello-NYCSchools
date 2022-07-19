import React, {
      useState,
    } from "react";


import {
      StyleSheet,
      Text,
      View,
      } from 'react-native';

export default Item = (props) => {

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


const styles = StyleSheet.create({
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
