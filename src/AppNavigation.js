import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {View, Text} from 'react-native';
import Home from './screens/Home';
import Splash from './screens/Splash';
import AddContacts from './screens/AddContacts';
import EditContacts from './screens/EditContacts';

const Stack = createStackNavigator();
const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Add Contacts" component={AddContacts} />
        <Stack.Screen name="Edit Contacts" component={EditContacts} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default AppNavigation;
