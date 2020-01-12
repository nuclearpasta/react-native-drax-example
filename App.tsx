import 'react-native-gesture-handler';
import React from 'react';
import { NavigationNativeContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'react-native';

import DragDrop from './screens/DragDrop';
import ReorderableList from './screens/ReorderableList';

const Tab = createBottomTabNavigator();

const App = () => {
	return (
		<>
			<StatusBar barStyle="dark-content" />
			<NavigationNativeContainer>
				<Tab.Navigator>
					<Tab.Screen
						name="dragDrop"
						component={DragDrop}
						options={{
							title: 'Drag/Drop',
						}}
					/>
					<Tab.Screen
						name="reorderableList"
						component={ReorderableList}
						options={{
							title: 'DraxList',
						}}
					/>
				</Tab.Navigator>
			</NavigationNativeContainer>
		</>
	);
};

export default App;
