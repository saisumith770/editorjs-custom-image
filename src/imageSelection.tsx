import Box from "@material-ui/core/Box";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Resizer from "react-image-file-resizer";

interface ResizableAndRotatableImageProps {
	data: Record<string, any>;
	onDataChange: (newData: Record<string, any>) => void;
	images: string[];
	imageScale: number;
	rotation: number;
}

function ResizableAndRotatableImage(props: ResizableAndRotatableImageProps) {
	const [imageSelected, setSelectedImage] = useState<File | null>(null);
	const [displayImage, setDisplayImage] = useState<string | null>(null);

	const resizeFile = (file: File) =>
		new Promise((resolve) => {
			Resizer.imageFileResizer(
				file,
				300 * (props.imageScale / 100 + 0.5),
				300 * (props.imageScale / 100 + 0.5),
				"PNG",
				100,
				props.rotation,
				(uri) => {
					resolve(uri);
				},
				"file",
				300 * (props.imageScale / 100 + 0.5),
				300 * (props.imageScale / 100 + 0.5)
			);
		});

	useEffect(() => {
		console.log(props.rotation);
		imageSelected &&
			resizeFile(imageSelected)
				.then((data) => {
					setDisplayImage(URL.createObjectURL(data as File));
				})
				.catch(() => console.log("error in resizeFile"));
	}, [imageSelected, props.imageScale, props.rotation]);

	useEffect(() => {
		displayImage &&
			props.onDataChange({
				originalImage: displayImage,
			});
	}, [displayImage]);

	return imageSelected ? (
		displayImage ? (
			<ImageView displayImage={displayImage} />
		) : (
			<></>
		)
	) : (
		<ImageSelection images={props.images} setSelectedImage={setSelectedImage} />
	);
}

function ImageView(props: { displayImage: string }) {
	return <img src={props.displayImage} alt="image file that was selected" />;
}

function ImageSelection(props: { images: string[]; setSelectedImage: React.Dispatch<React.SetStateAction<File | null>> }) {
	return ReactDOM.createPortal(
		<Box
			style={{
				position: "absolute",
				top: "50%",
				left: "50%",
				transform: "translate(-50%,-50%)",
				width: "100%",
				height: "100%",
				backgroundColor: "rgba(0,0,0,0.8)",
				zIndex: 2,
			}}
		>
			<Box
				style={{
					width: "800px",
					height: "500px",
					backgroundColor: "#202124",
					position: "relative",
					top: "50%",
					left: "50%",
					transform: "translate(-50%,-50%)",
					borderRadius: "5px",
					padding: "10px",
					display: "flex",
				}}
			>
				{props.images.map((image, index) => (
					<ImageCard image={image} setSelectedImage={props.setSelectedImage} key={index} />
				))}
			</Box>
		</Box>,
		document.getElementById("root")!
	);
}

function ImageCard(props: { image: string; setSelectedImage: React.Dispatch<React.SetStateAction<File | null>> }) {
	const [hover, setHover] = useState(false);
	return (
		<Box
			style={{
				margin: "5px",
				cursor: "pointer",
				width: "110px",
				height: "110px",
				borderRadius: "5px",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				position: "relative",
				overflow: "hidden",
			}}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			onClick={() => {
				fetch(props.image)
					.then((data) => data.blob())
					.then((blob) => new File([blob], "new-file.png"))
					.then((imageFile) => {
						props.setSelectedImage(imageFile);
					});
			}}
		>
			<img
				src={props.image}
				alt="selection files for editor-js"
				style={{
					width: "100px",
					height: "100px",
					objectFit: "contain",
				}}
			/>
			{hover && (
				<Box
					style={{
						position: "absolute",
						top: "0",
						left: "0",
						width: "100%",
						height: "100%",
						backgroundColor: "rgba(0,0,0,0.6)",
					}}
				></Box>
			)}
		</Box>
	);
}

export default ResizableAndRotatableImage;
