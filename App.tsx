import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationNativeContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';

import ColorDragDrop from './screens/ColorDragDrop';
import ReorderableList from './screens/ReorderableList';
import KnightMoves from './screens/KnightMoves';

const Tab = createBottomTabNavigator();

const App = () => {
	return (
		<>
			<StatusBar barStyle="dark-content" />
			<NavigationNativeContainer>
				<Tab.Navigator>
					<Tab.Screen
						name="colorDragDrop"
						component={ColorDragDrop}
						options={{
							tabBarLabel: 'Color Drag/Drop',
							tabBarIcon: ({ color, size }) => (
								<Icon name="tint" color={color} size={size} />
							),
						}}
					/>
					<Tab.Screen
						name="reorderableList"
						component={ReorderableList}
						options={{
							tabBarLabel: 'Reorderable List',
							tabBarIcon: ({ color, size }) => (
								<Icon name="list-ol" color={color} size={size} />
							),
						}}
					/>
					<Tab.Screen
						name="knightMoves"
						component={KnightMoves}
						options={{
							tabBarLabel: 'Knight Moves',
							tabBarIcon: ({ color, size }) => (
								<Icon name="chess-knight" color={color} size={size} />
							),
						}}
					/>
				</Tab.Navigator>
			</NavigationNativeContainer>
		</>
	);
};

export default App;
