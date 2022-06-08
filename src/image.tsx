import Box from "@material-ui/core/Box";
import Slider from "@material-ui/core/Slider";
import React, { ReactElement } from "react";
import ReactDOM from "react-dom";
import ResizableAndRotatableImage from "./imageSelection";
import Resizer from "react-image-file-resizer";

export default class CustomImage {
	public data: Record<string, any>;
	public config: Record<string, any>;
	public nodes: Record<string, any>;
	public CSS: { wrapper: string };
	public settings: any[];

	constructor({ data, config }: { data: Record<string, any>; config: Record<string, any> }) {
		this.data = {
			events: data.events || [],
		};
		this.config = { imageScale: 50, rotation: 0, ...config };
		this.nodes = {
			holder: null,
		};
		this.CSS = {
			wrapper: "custom-image",
		};
		this.settings = [
			{
				name: "resize",
				icon: () => (
					<Slider
						defaultValue={50}
						aria-label="Default"
						valueLabelDisplay="auto"
						onChange={(e, val) => {
							this.config.imageScale = val as number;
							this._resizeOrRotateImage(this.data.originalImage).then((imageFile) => {
								this.nodes.holder.getElementsByTagName("img")[0].src = URL.createObjectURL(imageFile as File);
							});
						}}
					/>
				),
				addCSS: false,
			},
			{
				name: "rotate left",
				icon: () => (
					<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
						<path d="M0 0h24v24H0z" fill="none" />
						<path d="M7.11 8.53L5.7 7.11C4.8 8.27 4.24 9.61 4.07 11h2.02c.14-.87.49-1.72 1.02-2.47zM6.09 13H4.07c.17 1.39.72 2.73 1.62 3.89l1.41-1.42c-.52-.75-.87-1.59-1.01-2.47zm1.01 5.32c1.16.9 2.51 1.44 3.9 1.61V17.9c-.87-.15-1.71-.49-2.46-1.03L7.1 18.32zM13 4.07V1L8.45 5.55 13 10V6.09c2.84.48 5 2.94 5 5.91s-2.16 5.43-5 5.91v2.02c3.95-.49 7-3.85 7-7.93s-3.05-7.44-7-7.93z" />
					</svg>
				),
				addCSS: true,
			},
			{
				name: "rotate right",
				icon: () => (
					<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
						<path d="M0 0h24v24H0z" fill="none" />
						<path d="M15.55 5.55L11 1v3.07C7.06 4.56 4 7.92 4 12s3.05 7.44 7 7.93v-2.02c-2.84-.48-5-2.94-5-5.91s2.16-5.43 5-5.91V10l4.55-4.45zM19.93 11c-.17-1.39-.72-2.73-1.62-3.89l-1.42 1.42c.54.75.88 1.6 1.02 2.47h2.02zM13 17.9v2.02c1.39-.17 2.74-.71 3.9-1.61l-1.44-1.44c-.75.54-1.59.89-2.46 1.03zm3.89-2.42l1.42 1.41c.9-1.16 1.45-2.5 1.62-3.89h-2.02c-.14.87-.48 1.72-1.02 2.48z" />
					</svg>
				),
				addCSS: true,
			},
		];
	}

	static get toolbox() {
		return {
			icon: `<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>`,
			title: "Image",
		};
	}

	reRender(rotation: number) {
		this.config.rotation = rotation;
		// this.render();
		console.log(rotation);
	}

	render() {
		const rootNode = document.createElement("div");
		rootNode.setAttribute("class", this.CSS.wrapper);
		this.nodes.holder = rootNode;

		const onDataChange = (newData: typeof this.data) => {
			this.data = {
				...newData,
			};
		};

		ReactDOM.render(
			<ResizableAndRotatableImage
				onDataChange={onDataChange}
				data={this.data}
				images={this.config.images}
				imageScale={this.config.imageScale}
				rotation={this.config.rotation}
			/>,
			rootNode
		);

		return this.nodes.holder;
	}

	renderSettings() {
		const wrapper = document.createElement("div");

		this.settings.forEach((tune) => {
			let button = document.createElement("div");
			tune.addCSS && button.classList.add("cdx-settings-button");
			ReactDOM.render(tune.icon(), button);
			wrapper.appendChild(button);

			button.addEventListener("click", () => {
				this._toggleTune(tune.name);
				console.log(tune.name);
			});
		});

		return wrapper;
	}

	_resizeOrRotateImage(image: string) {
		return fetch(image)
			.then((data) => data.blob())
			.then((blob) => new File([blob], "new-file.png"))
			.then((file) => {
				return new Promise((resolve) => {
					Resizer.imageFileResizer(
						file,
						300 * (this.config.imageScale / 100 + 0.5),
						300 * (this.config.imageScale / 100 + 0.5),
						"PNG",
						100,
						this.config.rotation,
						(uri) => {
							resolve(uri);
						},
						"file",
						300 * (this.config.imageScale / 100 + 0.5),
						300 * (this.config.imageScale / 100 + 0.5)
					);
				});
			});
	}

	_toggleTune(tune: string) {
		switch (tune) {
			case "rotate left":
				this.config.rotation = this.config.rotation === 0 ? 360 - 90 : this.config.rotation - 90;
				this._resizeOrRotateImage(this.data.originalImage).then((imageFile) => {
					this.nodes.holder.getElementsByTagName("img")[0].src = URL.createObjectURL(imageFile as File);
				});
				break;
			case "rotate right":
				this.config.rotation = this.config.rotation === 360 ? 90 : this.config.rotation + 90;
				this._resizeOrRotateImage(this.data.originalImage).then((imageFile) => {
					this.nodes.holder.getElementsByTagName("img")[0].src = URL.createObjectURL(imageFile as File);
				});
				break;
		}
		console.log(this.config.rotation);
	}

	save() {
		return this.data;
	}
}
