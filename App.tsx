import React from 'react';
import {
	SafeAreaView,
	StyleSheet,
	StatusBar,
} from 'react-native';
import { DraxProvider } from 'react-native-drax';

const App = () => {
	return (
		<DraxProvider>
			<StatusBar barStyle="dark-content" />
			<SafeAreaView>

			</SafeAreaView>
		</DraxProvider>
	);
};

const styles = StyleSheet.create({
});

export default App;
