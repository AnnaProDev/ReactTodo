import controls from "../shared/styles/controls.module.css"

function TextInputWithLabel({ elementId, labelText, onChange, value }) {
	return (
		<div>
			<label className={controls.label} htmlFor={elementId}>{labelText}</label>
			<input
				type="text"
				id={elementId}
				value={value}
				name={elementId}
				onChange={onChange}
				className={controls.input}
			/>
		</div>
	);
}

export default TextInputWithLabel;
