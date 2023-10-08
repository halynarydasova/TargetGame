import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import RandomNumber from './RandomNumber';

const Game = ({ randomNumberCount,initialSeconds }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [gameStatus, setGameStatus] = useState('PLAYING');
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds)
  const [randomNumbers, setRandomNumbers] = useState(Array.from({length : randomNumberCount})
  .map(() => 1 + Math.floor(10 * Math.random())));
  
  let intervalId;

  const stuffledNumbers = useMemo(() => {
    let i = randomNumbers.length;
    const array = [...randomNumbers];
    let j = 0;
    let temp = 0;
    
    while (i--) {
      j = Math.floor(Math.random() * (i + 1));

      temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    return array;
  }, [randomNumbers])
  
  const target = useMemo(() => randomNumbers.slice(0, randomNumberCount - 2)
  .reduce((acc, curr) => acc + curr, 0), [randomNumbers])

  const restart = () => {
    setSelectedIds([]);
    setGameStatus('PLAYING');
    setRemainingSeconds(initialSeconds);
    setRandomNumbers(Array.from({length : randomNumberCount})
    .map(() => 1 + Math.floor(10 * Math.random())));
  }
  const isNumberSelected = (numberIdx) => {
    return selectedIds.indexOf(numberIdx) >= 0;
  }
  const selectNumber = (numberIdx) => {
    setSelectedIds(prev => {
    const sum = [...prev, numberIdx].reduce((acc, curr) => {
      return acc + stuffledNumbers[curr]}, 0);
    
    if (sum > target) {
      setGameStatus('LOST');
      clearInterval(intervalId);
      setRemainingSeconds(0);
    }
    if (sum === target) {
      setGameStatus('WON');
      clearInterval(intervalId);
      setRemainingSeconds(0);
    }
    
    return [...prev, numberIdx];
  });
  }

  useEffect(() => {
    intervalId = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev === 1) {
          setGameStatus('LOST');
        }

        if (prev === 1 || gameStatus !== 'PLAYING') {
          clearInterval(intervalId);
          return 0;
        }

        return prev - 1;
      });
      
    }, 1000);

    return () => {clearInterval(intervalId)};
  }, [gameStatus])

  return (
    <View style={styles.container}>
        <Text style={styles.timer}>Time: {remainingSeconds}</Text>
      <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>{target}</Text>
      <View style={styles.randomContainer}>
      {stuffledNumbers.map((randomNumber, idx) => (
      <RandomNumber 
        key={idx} 
        id={idx}
        number={randomNumber} 
        isDisabled={isNumberSelected(idx) || gameStatus !== 'PLAYING'} 
        onPress={selectNumber}
      />
      ))}
      </View>
      {gameStatus !== 'PLAYING' && <TouchableOpacity onPress={restart}>
        <Text style={styles.reloadBtn}>New game</Text>
      </TouchableOpacity>}
    </View>
  );
};

export default Game;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ddd",
    flex: 1,
    paddingTop: 30,
  },
  target: {
    fontSize: 50,
    lineHeight: 150,
    borderRadius: 10,
    margin: 40,
    textAlign: "center",
  },
  randomContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
    

  },
  random: {
    width: 200,
    height: 100,
    marginBottom: 10,
    borderRadius: 10,
    textAlign: 'center',
    lineHeight: 100,
    backgroundColor: '#bbb',
    fontSize: 36,
  },

  STATUS_PLAYING: {
    backgroundColor: "#aaa",
  }, 
  STATUS_WON: {
    backgroundColor: "green",
  }, 
  STATUS_LOST: {
    backgroundColor: "red",
  }, 
  timer: {
    fontSize: 30,
    textAlign: 'center',
    lineHeight: 40,
  },
  reloadBtn: {
    textAlign: 'center',
    marginBottom: 40,
    fontSize: 35,
  }

});
