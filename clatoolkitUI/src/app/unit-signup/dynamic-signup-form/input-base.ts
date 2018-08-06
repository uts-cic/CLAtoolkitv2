export class InputBase<T> {
	value: T;
	key: string;
	label: string;
	required: boolean;
	order: number;
	controlType: string;

	constructor(options: {
		value?: T,
		key?: string,
		label?: string,
		required?: boolean,
		order?: number,
		controlType?: string
	} = {}) {
		this.value = options.value;
		this.key = options.key || '';
		this.label = options.label || '';
		this.required = !!options.required;
		this.order = options.order === undefined ? 1 : options.order;
		this.controlType = options.controlType || '';
	}
}

export class TextInput extends InputBase<string> {
	controlType = 'textInput';
	type: string;

	constructor(options: {} = {}) {
		super(options);
		this.type = options['type'] || '';
	}
}

export class DropDownInput extends InputBase<string> {
	controlType = 'dropdownInput';
	options: { key: string, value: string}[] = [];

	constructor(options: {} = {}) {
		super(options);
		this.options = options['options'] || ['Add your ' + options['key'] + ' account'];
	}
}
