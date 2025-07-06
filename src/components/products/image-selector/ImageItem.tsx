import React from 'react';
import { Image } from "react-bootstrap";

interface IProps {
	preview: {imageId?: number, filename?: string};
	files: File[]
}

const ImageItem: React.FC<IProps> = ({ preview, files }) => {

	let imageUrl = "";

	const file = files.find(f => f.name === preview.filename);

	if (typeof preview.imageId !== "undefined") {
		imageUrl = `${import.meta.env.VITE_CLOUD_URL}/${preview.filename}`;
	} else if (file) {
		imageUrl = URL.createObjectURL(file);
	}

	return (
		<>
			<p>{preview.filename}</p>
			<Image
				src={imageUrl}
				alt={preview.filename}
				rounded
				style={{
					maxHeight: 150,
					width: 'auto',
					marginBottom: 5,
					objectFit: 'contain',
				}}
			/>
		</>
	);
};

export default ImageItem;