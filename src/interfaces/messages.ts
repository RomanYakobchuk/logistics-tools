import {IService} from "@/interfaces/sms";

export interface SmsMedia {
    sid: string;
    contentType: string;
    uri: string;
    url: string;
}

export interface SmsMessage {
    sid: string;
    from: string;
    to: string;
    body: string;
    status: string;
    direction: string;
    numSegments: string;
    numMedia: string;
    price: string | null;
    priceUnit: string | null;
    errorCode: number | null;
    errorMessage: string | null;
    messagingServiceSid: string | null;
    service: IService | null;
    dateCreated: string;
    dateSent: string | null;
    dateUpdated: string;
    media?: SmsMedia[];
    apiVersion?: string;
    timestamp?: string;
}

export interface SmsMessagesFilters {
    to?: string;
    from?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
}

export interface SmsMessagesMetadata {
    page: number;
    limit: number;
    count: number;
    hasMore: boolean;
    filters: SmsMessagesFilters;
}

export interface SmsMessagesListResponse {
    messages: SmsMessage[];
    metadata: SmsMessagesMetadata;
    timestamp: string;
}

export interface GetSmsMessagesParams {
    limit?: number;
    page?: number;
    to?: string;
    from?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    message?: string;
}

export type SmsMessagesResponse =
    | SmsMessagesListResponse
    | SmsMessage;