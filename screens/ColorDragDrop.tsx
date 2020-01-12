import React, { useState } from 'react';
import {
	StyleSheet,
	View,
	Text,
	ViewStyle,
} from 'react-native';
import {
	DraxProvider,
	DraxView,
	DraxViewDragStatus,
} from 'react-native-drax';

interface ColorBlockProps {
	name: string;
	style: ViewStyle;
}

const ColorBlock = ({ name, style }: ColorBlockProps) => (
	<DraxView
		style={[styles.centeredContent, styles.draggableBox, style]}
		draggingStyle={styles.dragging}
		dragReleasedStyle={styles.dragging}
		hoverDraggingStyle={styles.hoverDragging}
		dragPayload={{ text: name[0] }}
		longPressDelay={0}
	>
		<Text>{name}</Text>
	</DraxView>
);

const ColorDragDrop = () => {
	const [received, setReceived] = useState<string[]>([]);
	const [staged, setStaged] = useState<string[]>([]);
	return (
		<DraxProvider>
			<View style={styles.container}>
				<DraxView
					style={[styles.centeredContent, styles.receivingZone, styles.magenta]}
					receivingStyle={styles.receiving}
					renderContent={({ viewState }) => {
						const receivingDrag = viewState?.receivingDrag;
						const incomingText = receivingDrag?.payload?.text;
						return (
							<>
								<Text>Receiving Zone</Text>
								<Text style={styles.incomingText}>{incomingText || '-'}</Text>
								<Text style={styles.received}>{received.join(' ')}</Text>
							</>
						);
					}}
					onReceiveDragDrop={(event) => {
						setReceived([
							...received,
							event.dragged.payload?.text || '?',
						]);
					}}
				/>
				<View style={styles.palette}>
					<ColorBlock name="Red" style={styles.red} />
					<ColorBlock name="Green" style={styles.green} />
					<ColorBlock name="Blue" style={styles.blue} />
					<ColorBlock name="Yellow" style={styles.yellow} />
				</View>
				<DraxView
					dragPayload={{ text: staged.join(' ') }}
					draggable={staged.length > 0}
					renderContent={({ viewState }) => {
						const receivingDrag = viewState?.receivingDrag;
						const incomingText = receivingDrag?.payload?.text;
						const active = viewState?.dragStatus !== DraxViewDragStatus.Inactive;
						const combinedStyles: ViewStyle[] = [
							styles.centeredContent,
							styles.receivingZone,
							styles.cyan,
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
								<Text style={styles.received}>{staged.join(' ')}</Text>
							</View>
						);
					}}
					renderHoverContent={({ viewState }) => {
						const combinedStyles: ViewStyle[] = [
							styles.centeredContent,
							styles.draggableBox,
							styles.cyan,
						];
						if (viewState.grabOffset) {
							combinedStyles.push({
								marginLeft: viewState.grabOffset.x - 30,
								marginTop: viewState.grabOffset.y - 30,
							});
						}
						if (viewState.dragStatus === DraxViewDragStatus.Dragging) {
							combinedStyles.push(styles.hoverDragging);
						}
						return (
							<View style={combinedStyles}>
								<Text style={styles.stagedCount}>{staged.length}</Text>
							</View>
						);
					}}
					onReceiveDragDrop={(event) => {
						setStaged([
							...staged,
							event.dragged.payload?.text || '?',
						]);
					}}
					onDragDrop={() => setStaged([])}
				/>
			</View>
		</DraxProvider>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 12,
		paddingTop: 40,
		justifyContent: 'space-evenly',
	},
	centeredContent: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	receivingZone: {
		height: 200,
		borderRadius: 10,
	},
	receiving: {
		borderColor: 'red',
		borderWidth: 2,
	},
	incomingText: {
		marginTop: 10,
		fontSize: 24,
	},
	received: {
		marginTop: 10,
		fontSize: 18,
	},
	palette: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
	},
	draggableBox: {
		width: 60,
		height: 60,
		borderRadius: 10,
	},
	green: {
		backgroundColor: '#aaffaa',
	},
	blue: {
		backgroundColor: '#aaaaff',
	},
	red: {
		backgroundColor: '#ffaaaa',
	},
	yellow: {
		backgroundColor: '#ffffaa',
	},
	cyan: {
		backgroundColor: '#aaffff',
	},
	magenta: {
		backgroundColor: '#ffaaff',
	},
	dragging: {
		opacity: 0.2,
	},
	hoverDragging: {
		borderColor: 'magenta',
		borderWidth: 2,
	},
	stagedCount: {
		fontSize: 18,
	},
});

export default ColorDragDrop;
