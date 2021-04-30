import React, { useState } from 'react';
import {
	StyleSheet,
	View,
	Text,
	ViewStyle,
	TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
	DraxProvider,
	DraxView,
	DraxViewDragStatus,
	DraxSnapbackTargetPreset,
} from 'react-native-drax';

interface ColorWeights {
	red: number;
	green: number;
	blue: number;
}

interface ColorBlockProps {
	name: string;
	weights: ColorWeights;
}

const getStyleForWeights = ({ red, green, blue }: ColorWeights) => {
	const total = red + green + blue;
	let backgroundColor = '#dddddd';
	if (total > 0) {
		const r = Math.ceil(128 + 127 * (red / total));
		const g = Math.ceil(128 + 127 * (green / total));
		const b = Math.ceil(128 + 127 * (blue / total));
		backgroundColor = `rgb(${r}, ${g}, ${b})`;
	}
	return { backgroundColor };
};

const getEmptyWeights = () => ({ red: 0, green: 0, blue: 0 });

const ColorBlock = ({ name, weights }: ColorBlockProps) => (
	<DraxView
		style={[
			styles.centeredContent,
			styles.colorBlock,
			getStyleForWeights(weights),
		]}
		draggingStyle={styles.dragging}
		dragReleasedStyle={styles.dragging}
		hoverDraggingStyle={styles.hoverDragging}
		dragPayload={{ weights, text: name[0] }}
	>
		<Text>{name}</Text>
	</DraxView>
);

const ColorDragDrop = () => {
	const [receivedWeights, setReceivedWeights] = useState<ColorWeights>(getEmptyWeights());
	const [receivedText, setReceivedText] = useState<string[]>([]);
	const [stagedWeights, setStagedWeights] = useState<ColorWeights>(getEmptyWeights());
	const [stagedText, setStagedText] = useState<string[]>([]);
	return (
		<DraxProvider>
			<SafeAreaView
				edges={['top', 'left', 'right']}
				style={styles.container}
			>
				<DraxView
					style={[
						styles.centeredContent,
						styles.receivingZone,
						getStyleForWeights(receivedWeights),
					]}
					receivingStyle={styles.receiving}
					renderContent={({ viewState }) => {
						const receivingDrag = viewState?.receivingDrag;
						const incomingText = receivingDrag?.payload?.text;
						return (
							<>
								<Text>Receiving Zone</Text>
								<Text style={styles.incomingText}>{incomingText || '-'}</Text>
								{(receivedText.length > 0) ? (
									<Text style={styles.received}>
										{receivedText.join(' ')}
									</Text>
								) : (
									<Text style={styles.instruction}>
										Drag colors here
									</Text>
								)}
								{receivedText.length > 0 && (
									<View style={styles.overlay}>
										<TouchableOpacity
											onPress={() => {
												setReceivedText([]);
												setReceivedWeights(getEmptyWeights());
											}}
										>
											<View style={styles.trashButton}>
												<Icon
													size={20}
													name="delete"
													color="#333333"
												/>
											</View>
										</TouchableOpacity>
									</View>
								)}
							</>
						);
					}}
					onReceiveDragDrop={(event) => {
						const { text, weights } = event.dragged.payload
							?? { text: '?', weights: getEmptyWeights() };
						setReceivedText([...receivedText, text]);
						setReceivedWeights({
							red: receivedWeights.red + weights.red,
							green: receivedWeights.green + weights.green,
							blue: receivedWeights.blue + weights.blue,
						});
						return DraxSnapbackTargetPreset.None;
					}}
				/>
				<View style={styles.palette}>
					<View style={styles.paletteRow}>
						<ColorBlock
							name="Red"
							weights={{ red: 1, green: 0, blue: 0 }}
						/>
						<ColorBlock
							name="Green"
							weights={{ red: 0, green: 1, blue: 0 }}
						/>
						<ColorBlock
							name="Blue"
							weights={{ red: 0, green: 0, blue: 1 }}
						/>
					</View>
					<View style={styles.paletteRow}>
						<ColorBlock
							name="Cyan"
							weights={{ red: 0, green: 1, blue: 1 }}
						/>
						<ColorBlock
							name="Magenta"
							weights={{ red: 1, green: 0, blue: 1 }}
						/>
						<ColorBlock
							name="Yellow"
							weights={{ red: 1, green: 1, blue: 0 }}
						/>
					</View>
				</View>
				<DraxView
					dragPayload={{ weights: stagedWeights, text: stagedText.join(' ') }}
					draggable={stagedText.length > 0}
					style={styles.stagingLayout}
					hoverDraggingStyle={{
						transform: [
							{ rotate: '10deg' },
						],
					}}
					renderContent={({ viewState }) => {
						const receivingDrag = viewState?.receivingDrag;
						const incomingText = receivingDrag?.payload?.text;
						const active = viewState?.dragStatus !== DraxViewDragStatus.Inactive;
						const combinedStyles: ViewStyle[] = [
							styles.centeredContent,
							styles.stagingZone,
							getStyleForWeights(stagedWeights),
						];
						if (active) {
							combinedStyles.push({ opacity: 0.2 });
						} else if (receivingDrag) {
							combinedStyles.push(styles.receiving);
						}
						return (
							<View style={combinedStyles}>
								<Text>Staging Zone</Text>
								<Text style={styles.incomingText}>{incomingText || '-'}</Text>
								{(stagedText.length > 0) ? (
									<Text style={styles.received}>
										{stagedText.join(' ')}
									</Text>
								) : (
									<Text style={styles.instruction}>
										Drag colors here, then drag this to receiving zone
									</Text>
								)}
								{stagedText.length > 0 && (
									<View style={styles.overlay}>
										<TouchableOpacity
											onPress={() => {
												setStagedText([]);
												setStagedWeights(getEmptyWeights());
											}}
										>
											<View style={styles.trashButton}>
												<Icon
													size={20}
													name="delete"
													color="#333333"
												/>
											</View>
										</TouchableOpacity>
									</View>
								)}
							</View>
						);
					}}
					renderHoverContent={({ viewState }) => {
						const combinedStyles: ViewStyle[] = [
							styles.centeredContent,
							styles.colorBlock,
							getStyleForWeights(stagedWeights),
						];
						if (viewState.grabOffset) {
							combinedStyles.push({
								marginLeft: viewState.grabOffset.x - 40,
								marginTop: viewState.grabOffset.y - 30,
							});
						}
						if (viewState.dragStatus === DraxViewDragStatus.Dragging) {
							combinedStyles.push(styles.hoverDragging);
						}
						return (
							<View style={combinedStyles}>
								<Text style={styles.stagedCount}>{stagedText.length}</Text>
							</View>
						);
					}}
					onReceiveDragDrop={(event) => {
						const { text, weights } = event.dragged.payload
							?? { text: '?', weights: getEmptyWeights() };
						setStagedText([...stagedText, text]);
						setStagedWeights({
							red: stagedWeights.red + weights.red,
							green: stagedWeights.green + weights.green,
							blue: stagedWeights.blue + weights.blue,
						});
						return DraxSnapbackTargetPreset.None;
					}}
					onDragDrop={() => {
						setStagedText([]);
						setStagedWeights(getEmptyWeights());
					}}
					longPressDelay={200}
				/>
			</SafeAreaView>
		</DraxProvider>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	centeredContent: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	receivingZone: {
		flex: 3,
		borderRadius: 10,
		margin: 8,
		borderColor: '#ffffff',
		borderWidth: 2,
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
	},
	trashButton: {
		width: 30,
		height: 30,
		backgroundColor: '#999999',
		borderRadius: 15,
		margin: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	receiving: {
		borderColor: 'red',
	},
	incomingText: {
		marginTop: 10,
		fontSize: 24,
	},
	received: {
		marginTop: 10,
		fontSize: 18,
	},
	instruction: {
		marginTop: 10,
		fontSize: 12,
		fontStyle: 'italic',
	},
	palette: {
		justifyContent: 'center',
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	paletteRow: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		marginVertical: 8,
	},
	colorBlock: {
		width: 80,
		height: 60,
		borderRadius: 10,
		marginHorizontal: 8,
	},
	dragging: {
		opacity: 0.2,
	},
	hoverDragging: {
		borderColor: 'magenta',
		borderWidth: 2,
	},
	stagingLayout: {
		flex: 3,
		margin: 8,
	},
	stagingZone: {
		flex: 1,
		borderRadius: 10,
		borderColor: '#ffffff',
		borderWidth: 2,
	},
	stagedCount: {
		fontSize: 18,
	},
});

export default ColorDragDrop;
