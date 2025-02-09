import {faker} from '@faker-js/faker';
import {IAddress, IOrder, MoveSize, MoveType, Status, Source} from "@/types";
import {EMAIL_DOMAINS, STATES, US_FIRST_NAMES, US_LAST_NAMES} from "@/lib/lists";

const VOLUME_RANGES = {
    'Studio': {min: 400, max: 800},
    '1 Bedroom Apartment': {min: 300, max: 500},
    '1 Bedroom House': {min: 400, max: 700},
    '2 Bedroom Apartment': {min: 500, max: 1000},
    '2 Bedroom House': {min: 600, max: 1200},
    '3 Bedroom Apartment': {min: 700, max: 1500},
    '3 Bedroom House': {min: 800, max: 1600},
    '4+ Bedroom Apartment': {min: 900, max: 2000},
    '4+ Bedroom House': {min: 1000, max: 2400},
    'Few Items': {min: 200, max: 800}
};

const CREW_SIZES = {
    'Studio': {min: 2, max: 6},
    '1 Bedroom Apartment': {min: 2, max: 5},
    '1 Bedroom House': {min: 2, max: 5},
    '2 Bedroom Apartment': {min: 2, max: 6},
    '2 Bedroom House': {min: 2, max: 6},
    '3 Bedroom Apartment': {min: 2, max: 8},
    '3 Bedroom House': {min: 2, max: 8},
    '4+ Bedroom Apartment': {min: 3, max: 12},
    '4+ Bedroom House': {min: 3, max: 12},
    'Few Items': {min: 2, max: 4}
};

const ESTIMATED_RANGES = {
    'Studio': {min: 1100, max: 7200},
    '1 Bedroom Apartment': {min: 1000, max: 7000},
    '1 Bedroom House': {min: 1200, max: 7500},
    '2 Bedroom Apartment': {min: 1500, max: 8000},
    '2 Bedroom House': {min: 1700, max: 8500},
    '3 Bedroom Apartment': {min: 1800, max: 9000},
    '3 Bedroom House': {min: 1900, max: 9500},
    '4+ Bedroom Apartment': {min: 2000, max: 10000},
    '4+ Bedroom House': {min: 2500, max: 12000},
    'Few Items': {min: 700, max: 2000}
};

const TRUCKS_REQUIRED = {
    'Studio': 1,
    '1 Bedroom Apartment': 1,
    '1 Bedroom House': 1,
    '2 Bedroom Apartment': 1,
    '2 Bedroom House': 1,
    '3 Bedroom Apartment': 1,
    '3 Bedroom House': 1,
    '4+ Bedroom Apartment': 2,
    '4+ Bedroom House': 2,
    'Few Items': 1
};

const STATUS_DISTRIBUTION = [
    {status: 'Booked', weight: 40},
    {status: 'Dead', weight: 20},
    {status: 'Follow Up', weight: 30},
    {status: 'New', weight: 10}
];

const FOLLOW_UP_OPTIONS = [
    'Follow Up 1', 'Follow Up 2', 'Follow Up 3', 'Follow Up 4',
    'Follow Up 5', 'Follow Up 6', 'Follow Up 7', 'Follow Up 8', 'Follow Up 9'
] as const;

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


const generateAddress = (
    specificState?: string,
    useSpecificCity?: string,
    excludeCity?: string,
    excludeAddress?: string
): IAddress => {
    const state = specificState != 'undefined' && specificState || faker.helpers.objectKey(STATES);
    const stateData = STATES[state as keyof typeof STATES];

    let cityData;
    if (useSpecificCity) {
        cityData = stateData.cities.find(city => city.name === useSpecificCity);
    } else if (excludeCity) {
        const availableCities = stateData.cities.filter(city => city.name !== excludeCity);
        cityData = faker.helpers.arrayElement(availableCities);
    } else {
        cityData = faker.helpers.arrayElement(stateData?.cities || []);
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

const shouldUseSameCity = (moveType: string): boolean => {
    if (moveType === 'Local Move') {
        return true;
    } else if (moveType === 'Intrastate Move') {
        return false;
    }
    return faker.datatype.boolean();
};
const weightedRandomSelection = <T extends string>(distribution: Distribution): T => {
    const totalWeight = Object.values(distribution).reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;

    for (const [value, weight] of Object.entries(distribution)) {
        if (random < weight) return value as T;
        random -= weight;
    }

    return Object.keys(distribution)[0] as T;
};

const weightedRandomMoveType = (customDistribution?: Distribution): MoveType => {
    if (customDistribution) {
        return weightedRandomSelection<MoveType>(customDistribution);
    }

    const distribution = Object.fromEntries(MOVE_TYPE_DISTRIBUTION);
    return weightedRandomSelection<MoveType>(distribution);
};

const weightedRandomStatus = (customDistribution?: Distribution): Status => {
    if (customDistribution) {
        return weightedRandomSelection<Status>(customDistribution);
    }

    const distribution = Object.fromEntries(
        STATUS_DISTRIBUTION.map(({status, weight}) => [status, weight])
    );
    return weightedRandomSelection<Status>(distribution);
};

const distributeItemsByPercentage = <T extends string>(
    count: number,
    distribution: Record<T, number>
): T[] => {
    const result: T[] = [];
    const items = Object.entries(distribution) as [T, number][];

    let remaining = count;
    const itemCounts = items.map(([item, percentage]) => {
        const exactCount = Math.round((percentage / 100) * count);
        remaining -= exactCount;
        return { item, count: exactCount };
    });

    if (remaining !== 0) {
        const sortedItems = [...itemCounts].sort((a, b) => b.count - a.count);
        const adjustment = remaining > 0 ? 1 : -1;
        const remainingAbs = Math.abs(remaining);

        for (let i = 0; i < remainingAbs; i++) {
            itemCounts.find(ic => ic.item === sortedItems[i % sortedItems.length].item)!.count += adjustment;
        }
    }

    itemCounts.forEach(({item, count}) => {
        for (let i = 0; i < count; i++) {
            result.push(item);
        }
    });

    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
};


const generateOrder = (
    pickupState?: string,
    specificMoveType?: MoveType,
    specificStatus?: Status
): IOrder => {
    const firstName = faker.helpers.arrayElement(US_FIRST_NAMES);
    const lastName = faker.helpers.arrayElement(US_LAST_NAMES);
    const moveType = specificMoveType || weightedRandomMoveType();
    const moveSize = getMoveSize();
    const status = specificStatus || weightedRandomStatus();

    const pickupAddress = generateAddress(pickupState);
    let deliveryAddress: IAddress;

    const isLocalMove = moveType === 'Local Move' || moveType === 'Intrastate Move' ||
        moveType === 'Labor Only' || moveType === 'Junk Removal';

    if (isLocalMove) {
        if (shouldUseSameCity(moveType)) {
            deliveryAddress = generateAddress(pickupAddress.state, pickupAddress.city);
        } else {
            deliveryAddress = generateAddress(pickupAddress.state, undefined, pickupAddress.city);
        }
    } else {
        deliveryAddress = generateAddress();
    }

    const created_at = faker.date.past({years: 1}).toISOString().split('T')[0];
    const move_date = faker.date.between({
        from: new Date(created_at),
        to: faker.date.future({years: 0.5, refDate: new Date(created_at)})
    }).toISOString().split('T')[0];

    const estimated = faker.number.int({
        min: ESTIMATED_RANGES[moveSize].min,
        max: ESTIMATED_RANGES[moveSize].max
    });

    const order: IOrder = {
        first_name: firstName,
        last_name: lastName,
        email: generateEmail(firstName, lastName),
        phone: generatePhone(),
        pickup_zip: pickupAddress.zip_code,
        pickup_city: pickupAddress.city,
        pickup_state: pickupAddress.state,
        delivery_zip: deliveryAddress.zip_code,
        delivery_city: deliveryAddress.city,
        delivery_state: deliveryAddress.state,
        move_type: moveType,
        move_size: moveSize,
        status,
        source: faker.helpers.arrayElement(['Angi', 'Direct Mail', 'Google Ads', 'Google (Organic)',
            'Home Advisor', 'Saw Our Truck', 'Thumbtack', 'Yahoo', 'Yelp']) as Source,
        volume: faker.number.int({
            min: VOLUME_RANGES[moveSize].min,
            max: VOLUME_RANGES[moveSize].max
        }),
        crew_size: faker.number.int({
            min: CREW_SIZES[moveSize].min,
            max: CREW_SIZES[moveSize].max
        }),
        trucks: TRUCKS_REQUIRED[moveSize],
        created_at,
        move_date,
        estimated,
        balance: status === 'Booked'
            ? Math.floor(estimated * faker.number.float({min: 0, max: 0.85}))
            : status === 'Follow Up'
                ? Math.floor(estimated * faker.number.float({min: 0.85, max: 1}))
                : estimated
    };

    if (status === 'Follow Up') {
        order.follow_up = faker.helpers.arrayElement(FOLLOW_UP_OPTIONS);
        order.follow_up_date = faker.date.between({
            from: new Date(created_at),
            to: new Date(move_date)
        }).toISOString().split('T')[0];
    }

    if (status === 'Booked') {
        const follow_up_date = faker.date.between({
            from: new Date(created_at),
            to: new Date(move_date)
        }).toISOString().split('T')[0];

        order.booked_date = faker.date.between({
            from: new Date(follow_up_date),
            to: new Date(move_date)
        }).toISOString().split('T')[0];
    }

    return order;
};

const MOVE_TYPE_DISTRIBUTION: [MoveType, number][] = [
    ['Local Move', 40],
    ['Long Distance Move', 40],
    ['Intrastate Move', 5],
    ['Commercial Move', 5],
    ['Junk Removal', 5],
    ['Labor Only', 5]
];


const getMoveSize = (): MoveSize => {
    const sizes: MoveSize[] = [
        'Studio', '1 Bedroom Apartment', '1 Bedroom House',
        '2 Bedroom Apartment', '2 Bedroom House', '3 Bedroom Apartment',
        '3 Bedroom House', '4+ Bedroom Apartment', '4+ Bedroom House',
        'Few Items'
    ];
    return faker.helpers.arrayElement(sizes);
};
interface Distribution {
    [key: string]: number;
}
export const generateOrders = (
    count: number,
    pickupState?: string,
    moveTypeDistribution?: Distribution,
    statusDistribution?: Distribution
): IOrder[] => {
    const moveTypes = moveTypeDistribution
        ? distributeItemsByPercentage(count, moveTypeDistribution)
        : distributeItemsByPercentage(
            count,
            Object.fromEntries(MOVE_TYPE_DISTRIBUTION)
        );

    const statuses = statusDistribution
        ? distributeItemsByPercentage(count, statusDistribution)
        : distributeItemsByPercentage(
            count,
            Object.fromEntries(STATUS_DISTRIBUTION.map(({status, weight}) => [status, weight]))
        );

    return Array.from({length: count}, (_, index) => {
        const moveType = moveTypes[index] as MoveType | undefined;
        const status = statuses[index] as Status | undefined;
        return generateOrder(pickupState, moveType, status);
    });
};