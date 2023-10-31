import {createDrawerNavigator} from '@react-navigation/drawer';
import FavouriteList from './screens/FavouriteList';
import ContactList from './screens/ContactList';

const Drawer = createDrawerNavigator();
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Contact List" component={ContactList} />
      <Drawer.Screen name="Favourite List" component={FavouriteList} />
    </Drawer.Navigator>
  );
};
export default DrawerNavigator;
