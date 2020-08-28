export class PasswordValueConverter {
	toView(value: string): string {
		return (value.length ? Array(value.length + 1).join('•') : '');
	}

	fromView(): number {
		throw new Error('Not implemented');
	}
}
