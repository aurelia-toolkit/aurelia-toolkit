import { ClientEditor } from './client-editor';
import { ISelectOption } from './i-select-option';

export interface ISettingInfo {
	key?: string | undefined;
	value?: unknown | undefined;
	options?: ISelectOption[];
	name?: string | undefined;
	description?: string | undefined;
	clientEditor: ClientEditor;
	children?: ISettingInfo[] | undefined;
	width?: string;
}
