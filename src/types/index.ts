export interface ILocation {
    title: string;
    address: string;
    city: string;
    state: string;
    country: string;
    latitude: string;
    longitude: string;
}

export interface ILocationDetails {
    city: string;
    state: string;
    country: string;
    latitude: string;
    longitude: string;
}

export interface IRouteService {
    distanceMiles: number;
    duration: string;
    executionTime: number;
    error?: string;
    details?: string;
    allData: any;
}

export interface IRouteResults {
    graph?: IRouteService;
    here?: IRouteService;
    google?: IRouteService;
    geoApify?: IRouteService;
    totalExecutionTime?: number;
}

export type TransportMode = 'truck' | 'small_truck' | 'car';

export interface TransportOption {
    value: TransportMode;
    label: string;
}

export interface IDriveDistanceItem {
    distanceMiles: number;
    duration: string;
    executionTime: number;
    allData: any;
}

export interface IResponseDriveDistance {
    geoApify: IDriveDistanceItem;
    google: IDriveDistanceItem;
    graph: IDriveDistanceItem;
    here: IDriveDistanceItem;
    totalExecutionTime: number;
}
export interface ICustomer {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
}

export interface IAddress {
    address: string;
    zip_code: string;
    city: string;
    state: string;
    country: string;
}

export type MoveType =
    | 'Commercial Move'
    | 'Intrastate Move'
    | 'Junk Removal'
    | 'Labor Only'
    | 'Local Move'
    | 'Long Distance Move';

export type MoveSize =
    | 'Studio'
    | '1 Bedroom Apartment'
    | '1 Bedroom House'
    | '2 Bedroom Apartment'
    | '2 Bedroom House'
    | '3 Bedroom Apartment'
    | '3 Bedroom House'
    | '4+ Bedroom Apartment'
    | '4+ Bedroom House'
    | 'Few Items';

export type Status = 'Booked' | 'Dead' | 'Follow Up' | 'New';
export type FollowUp = 'Follow Up 1' | 'Follow Up 2' | 'Follow Up 3' | 'Follow Up 4' | 'Follow Up 5' | 'Follow Up 6' | 'Follow Up 7' | 'Follow Up 8' | 'Follow Up 9';
export type Source = 'Angi' | 'Direct Mail' | 'Google Ads' | 'Google (Organic)' | 'Home Advisor' | 'Saw Our Truck' | 'Thumbtack' | 'Yahoo' | 'Yelp';

export interface IOrder extends ICustomer {
    pickup_zip: string;
    pickup_city: string;
    pickup_state: string;
    delivery_zip: string;
    delivery_city: string;
    delivery_state: string;
    move_type: MoveType;
    move_size: MoveSize;
    status: Status;
    source: Source;
    follow_up?: FollowUp;
    volume: number;
    crew_size: number;
    trucks: number;
    created_at: string;
    move_date: string;
    follow_up_date?: string;
    booked_date?: string;
    estimated: number;
    balance: number;
}