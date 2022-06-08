import "./App.css";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Editor from "./editor";

function App() {
	return (
		<div className="App">
			<Container style={{ backgroundColor: "#EDF4F9", minHeight: "100vh" }} maxWidth="xl">
				<Box
					p={5}
					style={{
						display: "flex",
						justifyContent: "center",
					}}
				>
					<Box
						style={{
							backgroundColor: "#ffffff",
							border: "1px solid #cccccc",
							width: "800px",
							marginTop: "50px",
						}}
					>
						<Editor />
					</Box>
				</Box>
			</Container>
		</div>
	);
}

export default App;
