/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import EditorJS, { LogLevels } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import CustomImage from "./image";
import { useReactToPrint } from "react-to-print";

const DEFAULT_INITIAL_DATA = () => {
	return {
		time: new Date().getTime(),
		blocks: [],
	};
};

const EDITTOR_HOLDER_ID = "editorjs";
let instance: any;

const Editor: React.FC = (_: any) => {
	const ejInstance = useRef<any>(null);
	const [editorData, setEditorData] = React.useState(DEFAULT_INITIAL_DATA);
	const render = useRef(0);
	const [print, setPrintState] = useState(false);
	const component = useRef(null);

	const printHandler = useReactToPrint({
		content: () => component.current,
		onAfterPrint: () => {
			(document.querySelector(".ce-toolbar") as any).style.display = "";
			setPrintState(false);
		},
	});

	// This will run only once
	useEffect(() => {
		if (!ejInstance.current && render.current === 0) {
			instance = initEditor();
		}
		if (print) {
			(document.querySelector(".ce-toolbar") as any).style.display = "none";
			instance.save().then((data: any) => printHandler());
		}
		render.current += 1;
	}, [print]);

	const initEditor = () => {
		const editor = new EditorJS({
			holder: EDITTOR_HOLDER_ID,
			logLevel: "ERROR" as LogLevels,
			data: editorData,
			onReady: () => {
				ejInstance.current = editor;
			},
			onChange: async () => {
				let content = await (this as any)?.editorjs.saver.save();
				// Put your logic here to save this data to your DB
				setEditorData(content);
			},
			autofocus: true,
			tools: {
				header: Header,
				image: {
					class: CustomImage as any,
					config: {
						images: [
							"/logo192.png",
							"/favicon.ico",
							"https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dmlld3xlbnwwfHwwfHw%3D&w=1000&q=80",
						],
					},
				},
			},
		});

		return editor;
	};

	return (
		<React.Fragment>
			<div id={EDITTOR_HOLDER_ID} style={{ textAlign: "left" }} ref={component}></div>
			<button onClick={() => setPrintState(true)}>Print</button>
		</React.Fragment>
	);
};

export default Editor;
