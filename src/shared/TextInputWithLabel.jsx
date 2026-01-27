function TextInputWithLabel({ elementId, labelText, onChange, value }) {
	return (
		<div>
			<label className="label" htmlFor={elementId}>{labelText}</label>
			<input
				type="text"
				id={elementId}
				value={value}
				onChange={onChange}
				className="input"
			/>
		</div>
	);
}

export default TextInputWithLabel;
