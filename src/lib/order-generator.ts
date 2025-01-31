import {faker} from '@faker-js/faker';
import {IAddress, IOrder, MoveSize, MoveTypeValue} from "@/types";
import {EMAIL_DOMAINS, STATES, US_FIRST_NAMES, US_LAST_NAMES} from "@/lib/lists";


const generateEmail = (firstName: string, lastName: string): string => {
    const domain = faker.helpers.arrayElement(EMAIL_DOMAINS);
    const formats = [
        () => `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
        () => `${firstName.toLowerCase()}${lastName.toLowerCase()}@${domain}`,
        () => `${firstName.toLowerCase()[0]}${lastName.toLowerCase()}@${domain}`,
        () => `${firstName.toLowerCase()}_${lastName.toLowerCase()}@${domain}`,
    ];
    return faker.helpers.arrayElement(formats)();
};

const generatePhone = (): string => {
    const areaCode = faker.number.int({min: 200, max: 999}).toString();
    const prefix = faker.number.int({min: 200, max: 999}).toString();
    const lineNumber = faker.number.int({min: 1000, max: 9999}).toString();
    return `+1${areaCode}${prefix}${lineNumber}`;
};

const generateAddress = (specificState?: string): IAddress => {
    const state = specificState || faker.helpers.objectKey(STATES);
    const stateData = STATES[state as keyof typeof STATES];

    const cityData = faker.helpers.arrayElement(stateData.cities);

    const addressData = faker.helpers.arrayElement(cityData.addresses);

    const streetAddress = addressData.street.match(/^\d+/)
        ? addressData.street
        : `${faker.number.int({min: 1, max: 9999})} ${addressData.street}`;

    return {
        address: streetAddress,
        zip_code: addressData.zip,
        city: cityData.name,
        state,
        country: 'US',
    };
};

const getMoveType = () => {
    const ranges = {
        'local_move': {min: 40, max: 45},
        'long_distance_move': {min: 25, max: 30},
        'intrastate_move': {min: 12, max: 15},
        'commercial_move': {min: 8, max: 10},
        'junk_removal': {min: 3, max: 5},
        'labor_only': {min: 2, max: 3}
    };

    let remaining = 100;
    const result: Record<MoveTypeValue, number> = {} as Record<MoveTypeValue, number>;

    const types = Object.entries(ranges).sort((a, b) => b[1].max - a[1].max);

    for (let i = 0; i < types.length - 1; i++) {
        const [type, range] = types[i];
        const maxPossible = Math.min(range.max, remaining - (types.length - i - 1));
        const minPossible = Math.max(range.min, 1);

        if (maxPossible < minPossible) {
            result[type as MoveTypeValue] = minPossible;
            remaining -= minPossible;
        } else {
            const value = Math.floor(Math.random() * (maxPossible - minPossible + 1)) + minPossible;
            result[type as MoveTypeValue] = value;
            remaining -= value;
        }
    }

    const [lastType] = types[types.length - 1];
    result[lastType as MoveTypeValue] = remaining;

    return result;
};

const getMoveSize = (): MoveSize => {
    const sizes: MoveSize[] = [
        'Studio', '1 Bedroom Apartment', '1 Bedroom House',
        '2 Bedroom Apartment', '2 Bedroom House', '3 Bedroom Apartment',
        '3 Bedroom House', '4+ Bedroom Apartment', '4+ Bedroom House',
        'Few Items'
    ];
    return faker.helpers.arrayElement(sizes);
};


const generateOrder = (pickupState?: string) => {
    const firstName = faker.helpers.arrayElement(US_FIRST_NAMES);
    const lastName = faker.helpers.arrayElement(US_LAST_NAMES);
    const deliveryState = faker.helpers.objectKey(STATES);

    return {
        customer: {
            first_name: firstName,
            last_name: lastName,
            email: generateEmail(firstName, lastName),
            phone: generatePhone(),
        },
        pickup_address: generateAddress(pickupState),
        delivery_address: generateAddress(deliveryState),
        move_type: getMoveType(),
        move_size: getMoveSize(),
    };
};

export const generateOrders = (count: number, pickupState?: string): IOrder[] => {
    return Array.from({length: count}, () => generateOrder(pickupState));
};