import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import ColorDragDrop from './screens/ColorDragDrop';
import ReorderableList from './screens/ReorderableList';
import KnightMoves from './screens/KnightMoves';

const { Navigator, Screen } = createBottomTabNavigator();

const App = () => {
	return (
		<>
			<StatusBar barStyle="dark-content" />
			<NavigationContainer>
				<Navigator>
					<Screen
						name="colorDragDrop"
						component={ColorDragDrop}
						options={{
							tabBarLabel: 'Color Drag/Drop',
							tabBarIcon: ({ color, size }) => (
								<Icon name="water" color={color} size={size} />
							),
						}}
					/>
					<Screen
						name="reorderableList"
						component={ReorderableList}
						options={{
							tabBarLabel: 'Reorderable List',
							tabBarIcon: ({ color, size }) => (
								<Icon name="format-list-bulleted" color={color} size={size} />
							),
						}}
					/>
					<Screen
						name="knightMoves"
						component={KnightMoves}
						options={{
							tabBarLabel: 'Knight Moves',
							tabBarIcon: ({ color, size }) => (
								<Icon name="chess-knight" color={color} size={size} />
							),
						}}
					/>
				</Navigator>
			</NavigationContainer>
		</>
	);
};

export default App;
