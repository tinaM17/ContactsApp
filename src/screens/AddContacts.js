import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';

import {openDatabase} from 'react-native-sqlite-storage';

const db = openDatabase({name: 'UserDatabase.db'});

const AddContacts = () => {
  const navigation = useNavigation();
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    db.transaction(txn => {
      txn.executeSql(
        'CREATE TABLE IF NOT EXISTS contactTable(id INTEGER PRIMARY KEY AUTOINCREMENT, image TEXT, name TEXT, mobileNumber TEXT, email TEXT,favorite INTEGER)',
        [],
        (tx, result) => {
          console.log('Table created successfully');
        },
        error => {
          console.log('Error creating table:', error);
        },
      );
    });
  }, []);

  // Function to handle image selection from gallery
  const handleSelectImage = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      console.log(response);
      if (response.didCancel) {
        console.log('Image selection canceled');
      } else if (response.error) {
        console.log('ImagePicker Error:', response.error);
      } else {
        const source = {uri: response.assets[0].uri}; // Convert uri to string
        console.log(source);
        setImage(source);
      }
    });
  };

  // const handleSubmit = () => {
  //   // const imageString = JSON.stringify(image);
  //   // console.log(imageString);
  //   // setImage(imageString);
  //   db.transaction(txn => {
  //     txn.executeSql(
  //       'INSERT INTO contact (image, name, mobileNumber, email) VALUES (?, ?, ?, ?)',
  //       [image ? image.uri : null, name, mobileNumber, email],
  //       (tx, result) => {
  //         console.log('Contact inserted successfully');
  //         setImage('');
  //         setName('');
  //         setMobileNumber('');
  //         setEmail('');
  //       },
  //       error => {
  //         console.log('Error inserting contact:', error);
  //       },
  //     );
  //   });
  //   navigation.navigate('Home');
  // };

  const handleSubmit = () => {
    db.transaction(txn => {
      txn.executeSql(
        'INSERT INTO contactTable (image, name, mobileNumber, email, favorite) VALUES (?, ?, ?, ?, ?)',
        [
          image ? image.uri : null,
          name,
          mobileNumber,
          email,
          isFavorite ? 1 : 0,
        ],
        (tx, result) => {
          console.log('Contact inserted successfully');
          setImage('');
          setName('');
          setMobileNumber('');
          setEmail('');
          setIsFavorite(false); // Reset favorite status after submission
        },
        error => {
          console.log('Error inserting contact:', error);
        },
      );
    });
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Add Contacts</Text>

        <TouchableOpacity
          style={styles.imageContainer}
          onPress={handleSelectImage}>
          {image ? (
            <Image source={image} style={styles.image} />
          ) : (
            <View style={styles.placeholderImage}>
              <Image
                source={require('../images/camera-icon.png')}
                style={styles.cameraIcon}
              />
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => setIsFavorite(!isFavorite)}>
          <Image
            source={
              isFavorite
                ? require('../images/star-filled.png')
                : require('../images/star-empty.png')
            }
            style={styles.starIcon}
          />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          value={mobileNumber}
          onChangeText={setMobileNumber}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  starIcon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
});

export default AddContacts;
