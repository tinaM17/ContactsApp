import {View, Text, StyleSheet} from 'react-native';
import {useEffect} from 'react';

const Splash = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Home');
    }, 2000);
  }, []);
  return (
    <View style={styles.container}>
      {/* <Image source={require('../images/logo.jpg')} style={styles.img} /> */}
      <Text style={styles.logo}>ContactsApp</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
  },
  logo: {
    color: 'white',
    fontSize: 30,
    fontWeight: '800',
  },
  img: {
    height: 90,
    width: 90,
    borderRadius: 50,
  },
});
export default Splash;
