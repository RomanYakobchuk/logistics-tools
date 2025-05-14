import {CompanyBaseInfo} from "@/lib/api/types/auth-types";

export interface IAvailableNumber {
    phoneNumber: string;
    friendlyName: string;
    locality: string;
    region: string;
    capabilities: {
        voice: boolean;
        'SMS': boolean;
        'MMS': boolean;
    };
    pricing: {
        basePrice: string;
        currentPrice?: string;
        priceUnit: string;
        terms: string;
    }
}

export interface IAvailableNumbersResponse {
    items: IAvailableNumber[];
    count: number;
    hasMore: boolean;
    page: number;
    pageSize: number;
    areaCode: string;
    countryCode: string;
}

export interface ICampaign {
    dateCreated: string;
    dateUpdated: string;
    status: string;
    friendlyName: string;
    sid: string;
    authToken?: string;
}

export interface ICampaignsResponse {
    count: number;
    items: ICampaignResponse[];
    timestamp: string;
}
export interface ICampaignResponse {
    company: CompanyBaseInfo | null;
    campaign: ICampaign | null;
}

export interface ICampaignForm {
    companyId: string;
    friendlyName: string;
    useCase: string;
}

export interface IService {
    sid: string;
    friendlyName: string;
    inboundRequestUrl: string | null;
    dateCreated: string;
    useCase?: string;
    dateUpdated: string;
    hasSenders: boolean;
    senders: ISender[];
}

export interface ICampaignServicesResponse {
    count: number;
    items: IService[];
    campaign: ICampaign;
    timestamp: string;
}

export interface ISender {
    type: string;
    value: string;
    sid: string;
}

export interface IServiceNumbers {
    type: 'service';
    serviceId: string;
    count: number;
    items: IPhoneNumber[];
}

export interface ICampaignNumbersStats {
    totalNumbers: number;
    attachedToServices: number;
    unattachedNumbers: number;
    totalServices: number;
    numbersByCapability: {
        sms: number;
        mms: number;
        voice: number;
    };
}

export interface IServiceSummary {
    sid: string;
    friendlyName: string;
    useCase: string;
    phoneCount: number;
    phoneNumbers: string[];
    error?: boolean;
}

export interface ICampaignNumbers {
    type: 'campaign';
    campaignName: string;
    count: number;
    stats: ICampaignNumbersStats;
    items: IPhoneNumber[];
    servicesSummary?: IServiceSummary[];
}

export type INumbersResponse = IServiceNumbers | ICampaignNumbers;


// Add these interfaces to your @/interfaces/sms.ts file

export interface IPurchasePhoneNumberRequest {
    items: string[] | { phone: string; sid: string }[];
    service?: string;
}

export interface IPhoneNumberPurchaseResult {
    phoneNumber: string;
    sid?: string;
    error?: string;
}

export interface IPhoneNumberAssignResult {
    phoneNumber: string;
    sid: string;
    error?: string;
}

export interface IInvalidNumberResult {
    phoneNumber: string;
    sid: string;
    error: string;
}

export interface IPhoneNumberPurchaseSummary {
    requested: number;
    available?: number;
    unavailable?: number;
    purchased?: number;
    assigned?: number;
    failed?: number;
    valid?: number;
    invalid?: number;
}

export interface IReserveOnlyResponse {
    operation: 'reserve';
    summary: IPhoneNumberPurchaseSummary;
    details: {
        unavailableNumbers: string[];
        failedPurchases: IPhoneNumberPurchaseResult[];
        successfullyPurchased: IPhoneNumberPurchaseResult[];
    };
}

export interface IReserveAndAssignResponse {
    operation: 'reserve_and_assign';
    service: string;
    summary: IPhoneNumberPurchaseSummary;
    details: {
        unavailableNumbers: string[];
        failedPurchases: IPhoneNumberPurchaseResult[];
        failedAssignments: IPhoneNumberAssignResult[];
        successfullyAssigned: IPhoneNumberAssignResult[];
    };
}

export interface IAssignOnlyResponse {
    operation: 'assign';
    service: string;
    summary: IPhoneNumberPurchaseSummary;
    details: {
        invalidNumbers: IInvalidNumberResult[];
        failedAssignments: IPhoneNumberAssignResult[];
        successfullyAssigned: IPhoneNumberAssignResult[];
    };
}

export type IPhoneNumberPurchaseResponse = IReserveOnlyResponse | IReserveAndAssignResponse | IAssignOnlyResponse;

// src/interfaces/sms.ts
export interface PhoneNumberCapabilities {
    sms: boolean;
    mms: boolean;
    voice: boolean;
}

export interface ServiceInfo {
    sid: string;
    friendlyName: string;
    useCase?: string;
    serviceSid?: string;
    serviceName?: string;
}

export interface IPhoneNumber {
    sid: string;
    phoneNumber: string;
    friendlyName: string;
    capabilities: PhoneNumberCapabilities;
    dateCreated: string;
    status?: string;
    locality?: string;
    region?: string;
    countryCode?: string;
    service: ServiceInfo | null;
    attached: boolean;
}

export interface NumberStats {
    totalNumbers: number;
    attachedToServices: number;
    unattachedNumbers: number;
    totalServices: number;
    numbersByCapability: {
        sms: number;
        mms: number;
        voice: number;
    };
}

export interface ICampaignNumbers {
    type: 'campaign';
    campaignName: string;
    count: number;
    stats: NumberStats;
    items: IPhoneNumber[];
    services: ServiceInfo[];
}

export interface IServiceNumbers {
    type: 'service';
    service: ServiceInfo;
    count: number;
    items: IPhoneNumber[];
}

export type PhoneNumbersResponse = ICampaignNumbers | IServiceNumbers;