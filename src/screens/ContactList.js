import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {openDatabase} from 'react-native-sqlite-storage';
import {Swipeable} from 'react-native-gesture-handler';

const db = openDatabase({name: 'UserDatabase.db'});

const ContactList = () => {
  const navigation = useNavigation();
  const [contacts, setContacts] = useState([]);
  // const [refreshTrigger, setRefreshTrigger] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    getData();
  }, [isFocused]);

  const getData = () => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * FROM contactTable',
        [],
        (tx, result) => {
          const fetchedContacts = [];
          for (let i = 0; i < result.rows.length; i++) {
            const contacts = result.rows.item(i);
            console.log(contacts.image);
            fetchedContacts.push(result.rows.item(i));
          }
          setContacts(fetchedContacts);
        },
        error => {
          console.log('Error fetching contacts:', error);
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
      {/* <Swipeable renderRightActions={rightSwipe}> */}
      <View style={styles.list}>
        {contacts.map(contact => (
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
      {/* </Swipeable> */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => {
          navigation.navigate('Add Contacts');
        }}>
        <Text style={styles.btnText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {},
  listItem: {
    width: '90%',
    height: 80,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
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
  addBtn: {
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 35,
    position: 'absolute',
    alignSelf: 'center',
    bottom: 30,
  },
  btnText: {
    color: 'white',
    fontSize: 40,
    fontWeight: '400',
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
export default ContactList;
