import {faker} from '@faker-js/faker';
import {IAddress, IOrder, MoveSize, MoveTypeValue} from "@/types";
import {EMAIL_DOMAINS, STATES, US_FIRST_NAMES, US_LAST_NAMES} from "@/lib/lists";

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3963;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function getZipCoordinates(zip: string): { lat: number; lon: number } {
    const lat = faker.location.latitude({ min: 25, max: 48 });
    const lon = faker.location.longitude({ min: -123, max: -71 });
    return { lat, lon };
}

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

const generateAddress = (specificState?: string, isDelivery: boolean = false, pickupAddress?: IAddress, moveType?: string): IAddress => {
    let state = specificState;
    let attempts = 0;
    const maxAttempts = 10;

    if (!state) {
        state = faker.helpers.objectKey(STATES);
    }

    if (isDelivery && pickupAddress && moveType && ['local_move', 'intrastate_move'].includes(moveType)) {
        while (attempts < maxAttempts) {
            const stateData = STATES[state as keyof typeof STATES];
            const cityData = faker.helpers.arrayElement(stateData.cities);
            const addressData = faker.helpers.arrayElement(cityData.addresses);

            const address: IAddress = {
                address: addressData.street,
                zip_code: addressData.zip,
                city: cityData.name,
                state: state,
                country: 'US',
            };

            const pickupCoords = getZipCoordinates(pickupAddress.zip_code);
            const deliveryCoords = getZipCoordinates(address.zip_code);
            const distance = calculateDistance(
                pickupCoords.lat, pickupCoords.lon,
                deliveryCoords.lat, deliveryCoords.lon
            );

            if (moveType === 'local_move' && distance < 40) {
                return address;
            }
            if (moveType === 'intrastate_move' && distance >= 40) {
                return address;
            }

            attempts++;
        }
    }

    const stateData = STATES[state as keyof typeof STATES];
    const cityData = faker.helpers.arrayElement(stateData.cities);
    const addressData = faker.helpers.arrayElement(cityData.addresses);

    return {
        address: addressData.street,
        zip_code: addressData.zip,
        city: cityData.name,
        state: state,
        country: 'US',
    };
};

const getMoveType = () => {
    const ranges = {
        'local_move': {min: 35, max: 45},
        'long_distance_move': {min: 35, max: 45},
        'intrastate_move': {min: 3, max: 7},
        'commercial_move': {min: 3, max: 7},
        'junk_removal': {min: 3, max: 7},
        'labor_only': {min: 3, max: 7}
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

const determineDeliveryState = (pickupState: string, moveTypes: Record<MoveTypeValue, number>): string => {
    const primaryMoveType = Object.entries(moveTypes)
        .reduce((a, b) => a[1] > b[1] ? a : b)[0] as MoveTypeValue;

    if (['local_move', 'intrastate_move'].includes(primaryMoveType)) {
        return pickupState;
    }

    return faker.helpers.objectKey(STATES);
};

const generateOrder = (pickupState?: string) => {
    const firstName = faker.helpers.arrayElement(US_FIRST_NAMES);
    const lastName = faker.helpers.arrayElement(US_LAST_NAMES);
    const actualPickupState = pickupState || faker.helpers.objectKey(STATES);
    const moveTypes = getMoveType();

    const pickupAddress = generateAddress(actualPickupState);

    const primaryMoveType = Object.entries(moveTypes)
        .reduce((a, b) => a[1] > b[1] ? a : b)[0];

    const deliveryAddress = generateAddress(
        determineDeliveryState(actualPickupState, moveTypes),
        true,
        pickupAddress,
        primaryMoveType
    );

    return {
        customer: {
            first_name: firstName,
            last_name: lastName,
            email: generateEmail(firstName, lastName),
            phone: generatePhone(),
        },
        pickup_address: pickupAddress,
        delivery_address: deliveryAddress,
        move_type: moveTypes,
        move_size: getMoveSize(),
    };
};

export const generateOrders = (count: number, pickupState?: string): IOrder[] => {
    return Array.from({length: count}, () => generateOrder(pickupState));
};