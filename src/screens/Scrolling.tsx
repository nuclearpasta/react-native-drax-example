import React, { useCallback, useRef, useState } from 'react';
import {
	StyleSheet,
	View,
	Button,
	ScrollView,
	Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
	DraxProvider,
	DraxScrollView,
	DraxView,
	DraxSnapbackTargetPreset,
} from 'react-native-drax';

const Scrolling = () => {
	const [sum, setSum] = useState(0);
	const scrollViewRef = useRef<ScrollView | null>(null);
	const scrollToStart = useCallback(
		() => { scrollViewRef.current?.scrollTo({ x: 0, y: 0 }); },
		[],
	);
	const scrollToEnd = useCallback(
		() => { scrollViewRef.current?.scrollToEnd(); },
		[],
	);
	return (
		<DraxProvider>
			<SafeAreaView
				edges={['top', 'left', 'right']}
				style={styles.container}
			>
				<View style={styles.actions}>
					<Button title="Scroll to Start" onPress={scrollToStart} />
					<Button title="Scroll to End" onPress={scrollToEnd} />
				</View>
				<DraxScrollView
					horizontal
					ref={scrollViewRef}
					style={styles.scrollView}
				>
					<DraxView
						style={[styles.item, styles.item1]}
						dragPayload={1}
					>
						<Text style={styles.itemText}>1</Text>
					</DraxView>
					<DraxView
						style={[styles.item, styles.item2]}
						dragPayload={2}
					>
						<Text style={styles.itemText}>2</Text>
					</DraxView>
					<DraxView
						style={[styles.item, styles.item3]}
						dragPayload={3}
					>
						<Text style={styles.itemText}>3</Text>
					</DraxView>
					<DraxView
						style={[styles.item, styles.item4]}
						dragPayload={4}
					>
						<Text style={styles.itemText}>4</Text>
					</DraxView>
				</DraxScrollView>
				<View style={styles.footer}>
					<Text style={styles.description}>
						The area above is a horizontal DraxScrollView containing
						4 draggable number items. The buttons at the top of the screen
						demonstrate the use of imperative scroll functions accessed via
						ref to the underlying ScrollView. The number items can be dragged
						into the sum bucket below.
					</Text>
					<DraxView
						style={styles.bucket}
						receivingStyle={styles.bucketReceiving}
						onReceiveDragDrop={(event) => {
							setSum((s) => s + event.dragged.payload);
							return DraxSnapbackTargetPreset.None;
						}}
					>
						<Text style={styles.itemText}>
							{`Sum: ${sum}`}
						</Text>
					</DraxView>
				</View>
			</SafeAreaView>
		</DraxProvider>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	actions: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		padding: 12,
		borderBottomColor: '#d0d0d0',
		borderBottomWidth: 1,
	},
	scrollView: {
		flex: 1,
	},
	item: {
		padding: 12,
		margin: 24,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: '#606060',
		justifyContent: 'center',
		alignItems: 'center',
	},
	item1: {
		width: 200,
		height: 100,
		backgroundColor: '#8080ff',
	},
	item2: {
		width: 100,
		height: 250,
		backgroundColor: '#80ff80',
		marginTop: 50,
	},
	item3: {
		width: 120,
		height: 120,
		backgroundColor: '#ff8080',
		marginTop: 120,
	},
	item4: {
		width: 80,
		height: 120,
		backgroundColor: '#ff80ff',
		marginLeft: 80,
	},
	itemText: {
		fontSize: 32,
	},
	footer: {
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		borderTopColor: '#d0d0d0',
		borderTopWidth: 1,
		padding: 20,
	},
	description: {
		fontSize: 16,
		fontStyle: 'italic',
		marginBottom: 20,
	},
	bucket: {
		width: 180,
		height: 120,
		backgroundColor: '#d0d0d0',
		borderColor: '#000000',
		borderWidth: 3,
		borderRadius: 4,
		justifyContent: 'center',
		alignItems: 'center',
	},
	bucketReceiving: {
		backgroundColor: '#ffffd0',
	},
});

export default Scrolling;
