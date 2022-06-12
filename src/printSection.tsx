import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

interface PrintSectionProps {
	image: string;
	caption: string;
	header: string;
}

function PrintSection(props: PrintSectionProps) {
	const component = useRef(null);
	useReactToPrint({
		content: () => component.current,
	});

	return <></>;
}
