/**
 * Utility class to replace placeholders in AI-generated prompts
 * with realistic customer data
 */
export class PlaceholderReplacer {
  static firstNames = ['John', 'Jane', 'Emily', 'Michael', 'Sophia', 'David', 'Sarah', 'James'];
  static lastNames = ['Doe', 'Smith', 'Johnson', 'Brown', 'Williams', 'Taylor', 'Anderson', 'Miller'];
  static airlines = ['AI', 'BA', 'LH', 'UA', 'EK', 'SQ', 'AF', 'KL'];
  static cities = ['London', 'New York', 'Berlin', 'Dubai', 'Singapore', 'Tokyo', 'Paris', 'Amsterdam'];

  static getRandomAge(): number {
    return Math.floor(Math.random() * 41) + 25;
  }

  static getRandomPhone(): string {
    return `+1-202-${Math.floor(1000000 + Math.random() * 9000000)}`;
  }

  static getRandomEmail(firstName = 'customer'): string {
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${firstName.toLowerCase()}${Math.floor(Math.random() * 100)}@${domain}`;
  }

  static getRandomName(): { firstName: string; lastName: string; fullName: string } {
    const firstName = this.firstNames[Math.floor(Math.random() * this.firstNames.length)];
    const lastName = this.lastNames[Math.floor(Math.random() * this.lastNames.length)];
    return { firstName, lastName, fullName: `${firstName} ${lastName}` };
  }

  static getRandomFlight(): string {
    const airline = this.airlines[Math.floor(Math.random() * this.airlines.length)];
    const flightNum = Math.floor(100 + Math.random() * 900);
    const city = this.cities[Math.floor(Math.random() * this.cities.length)];
    return `${airline}${flightNum} from ${city} International Airport`;
  }

  static getRandomPassport(): string {
    return `P${Math.floor(1000000 + Math.random() * 9000000)}`;
  }

  static getRandomAddress(): string {
    const streets = ['Main St', 'High St', 'Maple Ave', 'Broadway', 'Elm St'];
    const street = streets[Math.floor(Math.random() * streets.length)];
    return `${Math.floor(Math.random() * 999)} ${street}, ${this.cities[Math.floor(Math.random() * this.cities.length)]}`;
  }

  /**
   * Replace placeholders in text with realistic data
   */
  static async replace(text: string): Promise<string> {
    const { firstName, lastName, fullName } = this.getRandomName();

    return text
      .replace(/\[?\s*your name\s*\]?/gi, fullName)
      .replace(/\[?\s*your first name\s*\]?/gi, firstName)
      .replace(/\[?\s*your last name\s*\]?/gi, lastName)
      .replace(/\[?\s*your email\s*\]?/gi, this.getRandomEmail(firstName))
      .replace(/\[?\s*your phone( number)?\s*\]?/gi, this.getRandomPhone())
      .replace(/\[?\s*your age\s*\]?/gi, String(this.getRandomAge()))
      .replace(/\[?\s*(insert flight details|flight details)\s*\]?/gi, this.getRandomFlight())
      .replace(/\[?\s*(passport number|your passport)\s*\]?/gi, this.getRandomPassport())
      .replace(/\[?\s*(your address|insert address)\s*\]?/gi, this.getRandomAddress())
      .replace(/\[?\s*insert( information| details)?\s*\]?/gi, 'Provided as requested');
  }
}

export default PlaceholderReplacer;

