import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const RandomNumber = React.memo( ({  number, isDisabled, onPress, id }) => {
  const handlePress = () => {
    if (isDisabled) {return;}
    onPress(id);
  }
  return (
    <TouchableOpacity onPress={handlePress}>
      <Text style={[styles.random, isDisabled && styles.disabled]}>{number}</Text>
    </TouchableOpacity>
  )
})

export default RandomNumber;

const styles = StyleSheet.create({ 
  random: {
    width: 190,
    height: 80,
    marginBottom: 10,
    borderRadius: 10,
    textAlign: 'center',
    lineHeight: 80,
    backgroundColor: '#ccc',
    fontSize: 36,
  },
  disabled: {
    opacity: 0.3,
  }
});