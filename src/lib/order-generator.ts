import { faker } from '@faker-js/faker';
import { IAddress, IOrder, MoveSize, MoveType } from "@/types";
import { EMAIL_DOMAINS, STATES, US_FIRST_NAMES, US_LAST_NAMES } from "@/lib/lists";

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
    const areaCode = faker.number.int({ min: 200, max: 999 }).toString();
    const prefix = faker.number.int({ min: 200, max: 999 }).toString();
    const lineNumber = faker.number.int({ min: 1000, max: 9999 }).toString();
    return `+1${areaCode}${prefix}${lineNumber}`;
};

const shouldUseSameCity = (moveType: MoveType): boolean => {
    if (moveType === 'local_move') {
        return true;
    } else if (moveType === 'intrastate_move') {
        return false;
    }
    return faker.datatype.boolean();
};

const generateAddress = (
    specificState?: string,
    useSpecificCity?: string,
    excludeCity?: string,
    excludeAddress?: string
): IAddress => {
    const state = specificState || faker.helpers.objectKey(STATES);
    const stateData = STATES[state as keyof typeof STATES];

    let cityData;
    if (useSpecificCity) {
        cityData = stateData.cities.find(city => city.name === useSpecificCity);
    } else if (excludeCity) {
        const availableCities = stateData.cities.filter(city => city.name !== excludeCity);
        cityData = faker.helpers.arrayElement(availableCities);
    } else {
        cityData = faker.helpers.arrayElement(stateData.cities);
    }

    if (!cityData) {
        cityData = stateData.cities[0];
    }

    let availableAddresses = cityData.addresses;
    if (excludeAddress) {
        availableAddresses = availableAddresses.filter(addr => addr.street !== excludeAddress);
    }

    const addressData = faker.helpers.arrayElement(availableAddresses);
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

const MOVE_TYPE_DISTRIBUTION: [MoveType, number][] = [
    ['local_move', 40],
    ['long_distance_move', 40],
    ['intrastate_move', 5],
    ['commercial_move', 5],
    ['junk_removal', 5],
    ['labor_only', 5]
];

const weightedRandomMoveType = (): MoveType => {
    const totalWeight = MOVE_TYPE_DISTRIBUTION.reduce((sum, [, weight]) => sum + weight, 0);
    let random = Math.random() * totalWeight;

    for (const [moveType, weight] of MOVE_TYPE_DISTRIBUTION) {
        if (random < weight) {
            return moveType;
        }
        random -= weight;
    }

    return MOVE_TYPE_DISTRIBUTION[0][0];
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

const generateOrder = (pickupState?: string): IOrder => {
    const firstName = faker.helpers.arrayElement(US_FIRST_NAMES);
    const lastName = faker.helpers.arrayElement(US_LAST_NAMES);
    const moveType = weightedRandomMoveType();

    const pickupAddress = generateAddress(pickupState);

    let deliveryAddress: IAddress;
    if (moveType === 'local_move' || moveType === 'intrastate_move') {
        if (shouldUseSameCity(moveType)) {
            deliveryAddress = generateAddress(pickupAddress.state, pickupAddress.city);
        } else {
            deliveryAddress = generateAddress(pickupAddress.state, undefined, pickupAddress.city);
        }
    } else {
        deliveryAddress = generateAddress();
    }

    return {
        customer: {
            first_name: firstName,
            last_name: lastName,
            email: generateEmail(firstName, lastName),
            phone: generatePhone(),
        },
        pickup_address: pickupAddress,
        delivery_address: deliveryAddress,
        move_type: moveType,
        move_size: getMoveSize(),
    };
};

export const generateOrders = (count: number, pickupState?: string): IOrder[] => {
    return Array.from({ length: count }, () => generateOrder(pickupState));
};