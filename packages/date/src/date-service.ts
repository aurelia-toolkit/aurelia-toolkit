export class DateService {
  differenceWithServer: number;
  initialised: boolean = false;

  async init(serverDate: Date): Promise<void> {
    this.differenceWithServer = Date.now() - serverDate.getTime();
    this.initialised = true;
  }

	now(): Date {
		if (this.differenceWithServer === undefined) {
			throw Error('Date service is not initialised');
		}
		return new Date(Date.now() - this.differenceWithServer);
	}

	serverToLocal(date: Date): Date {
		return new Date(date.getTime() + this.differenceWithServer);
	}
}
