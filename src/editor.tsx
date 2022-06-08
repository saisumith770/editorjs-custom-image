/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import EditorJS, { LogLevels } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import CustomImage from "./image";

const DEFAULT_INITIAL_DATA = () => {
	return {
		time: new Date().getTime(),
		blocks: [],
	};
};

const EDITTOR_HOLDER_ID = "editorjs";

const Editor: React.FC = (_: any) => {
	const ejInstance = useRef<any>(null);
	const [editorData, setEditorData] = React.useState(DEFAULT_INITIAL_DATA);
	const render = useRef(0);

	// This will run only once
	useEffect(() => {
		if (!ejInstance.current && render.current === 0) {
			initEditor();
		}
		render.current += 1;
		return () => {
			ejInstance.current?.destroy();
			ejInstance.current = null;
		};
	}, []);

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
	};

	return (
		<React.Fragment>
			<div id={EDITTOR_HOLDER_ID} style={{ textAlign: "left" }}></div>
		</React.Fragment>
	);
};

export default Editor;
