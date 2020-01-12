import React, { useState } from 'react';
import {
	Dimensions,
	StyleSheet,
	View,
} from 'react-native';
import {
	DraxProvider,
	DraxView,
	DraxSnapbackTargetPreset,
} from 'react-native-drax';
import Icon from 'react-native-vector-icons/FontAwesome5';

interface BoardPosition {
	row: number;
	column: number;
}

interface ChessSquareProps {
	width: number;
	position: BoardPosition;
	receptive: boolean;
}

Dimensions.addEventListener('change', () => {
	console.log('dimensions changed');
});

const ChessSquare = ({ width, position, receptive }: ChessSquareProps) => {
	const { row, column } = position;
	const colorStyle = (row % 2 === column % 2) ? styles.light : styles.dark;
	return (
		<DraxView
			style={[
				styles.square,
				colorStyle,
				receptive ? styles.receptive : undefined,
				{ width },
			]}
			receivingStyle={styles.receiving}
			receptive={receptive}
			onReceiveDragDrop={({ dragged: { payload } }) => {
				payload?.setKnightPos?.(position);
				return DraxSnapbackTargetPreset.None;
			}}
		/>
	);
};

const KnightMoves = () => {
	const [knightPos, setKnightPos] = useState<BoardPosition>({ row: 5, column: 5 });
	const [moving, setMoving] = useState(false);
	const { width, height } = Dimensions.get('window');
	const squareWidth = (Math.min(width, height) * 0.75) / 8;
	const rowViews: JSX.Element[] = [];
	for (let row = 0; row < 8; row += 1) {
		const squareViews: JSX.Element[] = [];
		for (let column = 0; column < 8; column += 1) {
			const rowOffset = Math.abs(row - knightPos.row);
			const columnOffset = Math.abs(column - knightPos.column);
			const receptive = moving
				&& (
					(rowOffset === 2 && columnOffset === 1)
					|| (rowOffset === 1 && columnOffset === 2)
				);
			squareViews.push((
				<ChessSquare
					width={squareWidth}
					key={`r${row}c${column}`}
					position={{ row, column }}
					receptive={receptive}
				/>
			));
		}
		rowViews.push((
			<View key={`r${row}`} style={styles.row}>{squareViews}</View>
		));
	}
	return (
		<DraxProvider>
			<View style={styles.container}>
				<View style={styles.board}>
					{rowViews}
					<DraxView
						style={[
							styles.knight,
							{
								width: squareWidth,
								height: squareWidth,
								top: knightPos.row * squareWidth,
								left: knightPos.column * squareWidth,
							},
						]}
						draggingStyle={styles.dragging}
						dragPayload={{ setKnightPos }}
						onDragStart={() => {
							setMoving(true);
						}}
						onDragEnd={() => {
							setMoving(false);
						}}
						onDragDrop={() => {
							setMoving(false);
						}}
						longPressDelay={0}
					>
						<Icon
							name="chess-knight"
							size={squareWidth * 0.8}
							color="black"
						/>
					</DraxView>
				</View>
			</View>
		</DraxProvider>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10,
	},
	board: {
		borderColor: 'black',
		borderWidth: 3,
	},
	row: {
		flexDirection: 'row',
	},
	dark: {
		backgroundColor: '#999999',
	},
	light: {
		backgroundColor: '#dddddd',
	},
	square: {
		aspectRatio: 1,
	},
	receptive: {
		borderColor: '#0000ff',
		borderWidth: 2,
	},
	receiving: {
		borderColor: '#ff00ff',
		borderWidth: 2,
	},
	knight: {
		position: 'absolute',
		justifyContent: 'center',
		alignItems: 'center',
	},
	dragging: {
		opacity: 0.2,
	},
});

export default KnightMoves;
