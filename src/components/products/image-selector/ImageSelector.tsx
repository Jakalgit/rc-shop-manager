import React, { useRef, type ChangeEvent } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import ImageItem from "./ImageItem.tsx";

interface IProps {
	previews: {imageId?: number, filename: string}[];
	setPreviews: React.Dispatch<React.SetStateAction<{imageId?: number, filename: string}[]>>
	files: File[];
	setFiles: React.Dispatch<React.SetStateAction<File[]>>
}

const ImageSelector: React.FC<IProps> = ({ previews, setPreviews, files, setFiles }) => {
	const inputFileRef = useRef<HTMLInputElement>(null);

	const handleAddClick = () => {
		inputFileRef.current?.click();
	};

	const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return;
		const newFiles = Array.from(e.target.files);
		setFiles(prev => [...prev, ...newFiles]);
		setPreviews(prev => [...prev, ...newFiles.map(el => ({filename: el.name}))]);
		e.target.value = '';
	};

	const swapItems = (array: any[], index: number, move: -1 | 1) => {
		const newArray = [...array];
		[newArray[index + move], newArray[index]] = [newArray[index], newArray[index + move]];
		return newArray;
	}

	const moveLeft = (index: number) => {
		if (index === 0) return;
		setPreviews(prev => swapItems(prev, index, -1));
	};

	const moveRight = (index: number) => {
		if (index === previews.length - 1) return;
		setPreviews(prev => swapItems(prev, index, 1));
	};

	const removeItem = (filename: string) => {
		setPreviews(prevState => prevState.filter(el => el.filename !== filename));
		setFiles(prevState => prevState.filter(el => el.name !== filename));
	}

	return (
		<div>
			<Button variant="primary" onClick={handleAddClick} className="mb-3">
				Select new image
			</Button>
			<input
				type="file"
				accept="image/*"
				multiple
				ref={inputFileRef}
				onChange={handleFilesChange}
				style={{display: 'none'}}
			/>
			<div
				style={{
					overflowX: 'auto',
					whiteSpace: 'nowrap',
					padding: '10px',
					border: '1px solid #ddd',
					borderRadius: '5px',
				}}
			>
				<div style={{ display: 'flex' }}>
					{previews.map((preview, idx) => (
						<div
							key={idx}
							style={{
								display: 'inline-flex',
								flexDirection: 'column',
								marginRight: 10,
								textAlign: 'center',
							}}
						>
							<ImageItem files={files} preview={preview} />
							<ButtonGroup>
								<Button
									variant="secondary"
									size="sm"
									onClick={() => moveLeft(idx)}
									disabled={idx === 0}
								>
									←
								</Button>
								<Button
									variant="secondary"
									size="sm"
									onClick={() => moveRight(idx)}
									disabled={idx === previews.length - 1}
								>
									→
								</Button>
							</ButtonGroup>
							<Button
								variant="danger"
								size="sm"
								onClick={() => removeItem(preview.filename)}
							>
								Delete
							</Button>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default ImageSelector;