import React, { useState } from 'react';
import {
	Dimensions,
	StyleSheet,
	View,
	Text,
} from 'react-native';
import {
	DraxProvider,
	DraxView,
	DraxSnapbackTargetPreset,
} from 'react-native-drax';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface BoardPosition {
	row: number;
	column: number;
}

interface ChessSquareProps {
	width: number;
	position: BoardPosition;
	receptive: boolean;
}

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
	const boardWidth = Math.min(width, height) * 0.75;
	const squareWidth = boardWidth / 8;
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
				<View style={styles.containerRow}>
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
						>
							<Icon
								name="chess-knight"
								size={squareWidth * 0.8}
								color="black"
							/>
						</DraxView>
					</View>
					<View style={{ width: boardWidth }}>
						<Text style={styles.instructionText}>
							Start dragging the knight, and the legal move positions will
							be highlighted with blue borders. When dragging the knight over
							one of those positions, the square will be highlighted with a
							magenta border instead. Release the drag in a legal position to
							move the knight; release it anywhere else, and it will snap back
							to its original position.
						</Text>
					</View>
				</View>
			</View>
		</DraxProvider>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	containerRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
		alignItems: 'center',
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
	instructionText: {
		margin: 12,
		fontSize: 16,
		fontStyle: 'italic',
	},
});

export default KnightMoves;
