import React from 'react';
import {Avatar, Card, Text} from 'react-native-paper';
import {useRoute} from '@react-navigation/native';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import colors from '../components/colors';


const NotiDetail = () => {
  const route = useRoute();
  const {item} = route.params;

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.contentContainer}>
          
        </View>
        <Text
          style={[
            styles.title,
            {marginHorizontal: 20, marginVertical: 20, fontSize: 20},
          ]}>
          {item.title}
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
              {item.description}
            </Text>
      
      </Card>
      <View style={{marginVertical: 50}}>
      
      </View>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10,
    alignItems: 'center',
    backgroundColor: 'white'
  },
  card: {
    width: '95%',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 10,
    backgroundColor: 'white'
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  cover: {
    height: 50,
    width: 50,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.primary,
    marginVertical: 10,
    marginHorizontal: 8,
    backgroundColor: 'white'
  },
  textContainer: {
    marginLeft: 10,
    textAlign: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    color: 'black',
    marginHorizontal: 20,
    marginBottom:20,
    textAlign: 'center'
  },
  button: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '60%',
    marginVertical: 30,
    justifyContent: 'center',
    marginHorizontal: 90,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  education: {
    display: 'flex',
    flexDirection: 'column',
    marginHorizontal: 20,
  },
});

export default NotiDetail;
