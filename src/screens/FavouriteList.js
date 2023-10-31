import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {openDatabase} from 'react-native-sqlite-storage';
import {Swipeable} from 'react-native-gesture-handler';
const db = openDatabase({name: 'UserDatabase.db'});

const FavouriteList = () => {
  const navigation = useNavigation();
  const [favouriteContacts, setFavouriteContacts] = useState([]);
  // const [refreshTrigger, setRefreshTrigger] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    getData();
    // if (refreshTrigger) {
    //   setRefreshTrigger(false);
    //   // Fetch contacts from the database again or update the contacts array manually
    // }
  }, [isFocused]);

  const getData = () => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * FROM contactTable WHERE favorite = 1',
        [],
        (tx, result) => {
          const rows = result.rows.raw();
          setFavouriteContacts(rows);
        },
        error => {
          console.log('Error fetching favourite contacts:', error);
        },
      );
    });
  };

  const rightSwipe = item => {
    // console.log(item);
    return (
      <View
        style={{
          backgroundColor: 'white',
          height: 80,
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => handleEditContact(item)}>
          <Image source={require('../images/edit.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => handleDeleteContact(item.id)}>
          <Image source={require('../images/delete.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
    );
  };

  const handleEditContact = contact => {
    navigation.navigate('Edit Contacts', {contact});
  };

  const handleDeleteContact = contactId => {
    db.transaction(txn => {
      txn.executeSql(
        'DELETE FROM contactTable WHERE id = ?',
        [contactId],
        (tx, result) => {
          console.log('Contact deleted successfully');
          // setRefreshTrigger(true);
          // Perform any additional actions if needed
          getData();
        },
        error => {
          console.log('Error deleting contact:', error);
        },
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.list}>
        {favouriteContacts.map(contact => (
          <View key={contact.id}>
            <Swipeable renderRightActions={() => rightSwipe(contact)}>
              <View style={styles.listItem}>
                <View style={styles.contactInfo}>
                  {contact.image ? (
                    <Image
                      source={{uri: contact.image}}
                      style={styles.contactImage}
                    />
                  ) : (
                    <View style={styles.contactImagePlaceholder}>
                      <Text style={styles.contactImageText}>No Image</Text>
                    </View>
                  )}
                  <View style={styles.contactDetails}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <Text>{contact.mobileNumber}</Text>
                    <Text>{contact.email}</Text>
                  </View>
                </View>
              </View>
            </Swipeable>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {},
  listItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    width: '90%',
    height: 80,
    borderRadius: 35,
    marginBottom: 15,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    marginLeft: 10,
  },
  contactImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactImageText: {
    color: 'black',
    fontSize: 16,
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  iconContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
});
export default FavouriteList;
