import {
    IAvailableNumbersResponse,
    ICampaignForm,
    ICampaignsResponse,
    ICampaignServicesResponse, INumbersResponse, IServiceNumbers, ICampaignNumbers, IPhoneNumberPurchaseResponse, IPurchasePhoneNumberRequest
} from "@/interfaces/sms";
import apiClient from "@/lib/api/api-client";


export const getAvailableNumbers = async (areaCode: string, countryCode: string, page: number, pageSize: number): Promise<IAvailableNumbersResponse> => {
    const response =  await apiClient.get(`/api/sms/numbers/available?areaCode=${areaCode}&countryCode=${countryCode}&page=${page}&pageSize=${pageSize}`);
    return response.data;
}

export const getCampaignNumbers = async (campaignId: string): Promise<ICampaignNumbers> => {
    const response = await apiClient.get(`/api/sms/numbers/${encodeURIComponent(campaignId)}`);
    return response.data as ICampaignNumbers;
}

export const getServiceNumbers = async (campaignId: string, serviceId: string): Promise<IServiceNumbers> => {
    const response = await apiClient.get(`/api/sms/numbers/${encodeURIComponent(campaignId)}?service=${encodeURIComponent(serviceId)}`);
    return response.data as IServiceNumbers;
}

export const getNumbers = async (campaignId: string, serviceId?: string): Promise<INumbersResponse> => {
    let url = `/api/sms/numbers/${encodeURIComponent(campaignId)}`;
    if (serviceId) {
        url += `?service=${encodeURIComponent(serviceId)}`;
    }

    const response = await apiClient.get(url);
    return response.data;
}

export const getCampaigns = async (campaign?: string): Promise<ICampaignsResponse> => {
    let url = '/api/sms/campaigns';

    if (campaign) {
        url += `?campaign=${encodeURIComponent(campaign)}`;
    }

    const response = await apiClient.get(url);
    return response.data;
}

export const getCampaignServices = async (id: string, serviceId?: string): Promise<ICampaignServicesResponse> => {
    let url = `/api/sms/campaigns/${encodeURIComponent(id)}/services`;

    if (serviceId) {
        url += `?service=${encodeURIComponent(serviceId)}`;
    }

    const response = await apiClient.get(url);
    return response.data;
}

export const getCompaniesNonCampaigns = async () => {
    const response =  await apiClient.get(`/api/sms/companies/campaigns`);
    return response.data;
}

export const createCampaign = async (data: ICampaignForm) => {
    const response =  await apiClient.post(`/api/sms/campaigns`, data);
    return response.data;
}

export const purchaseAndAssignPhoneNumbers = async (
    campaignId: string,
    phoneNumbers: string[],
    serviceSid: string,
    countryCode: string = 'US'
): Promise<IPhoneNumberPurchaseResponse> => {
    const requestBody: IPurchasePhoneNumberRequest = {
        items: phoneNumbers,
        service: serviceSid
    };

    let url = `/api/sms/numbers/${encodeURIComponent(campaignId)}`;
    if (countryCode && countryCode !== 'US') {
        url += `?countryCode=${encodeURIComponent(countryCode)}`;
    }

    const response = await apiClient.post(url, requestBody);
    return response.data;
}

export const purchasePhoneNumbers = async (
    campaignId: string,
    phoneNumbers: string[],
    countryCode: string = 'US'
): Promise<IPhoneNumberPurchaseResponse> => {
    const requestBody: IPurchasePhoneNumberRequest = {
        items: phoneNumbers
    };

    let url = `/api/sms/numbers/${encodeURIComponent(campaignId)}`;
    if (countryCode && countryCode !== 'US') {
        url += `?countryCode=${encodeURIComponent(countryCode)}`;
    }

    const response = await apiClient.post(url, requestBody);
    return response.data;
}

export const assignExistingNumbers = async (
    campaignId: string,
    phoneNumbers: { phone: string; sid: string }[],
    serviceSid: string
): Promise<IPhoneNumberPurchaseResponse> => {
    const requestBody: IPurchasePhoneNumberRequest = {
        items: phoneNumbers,
        service: serviceSid
    };

    const url = `/api/sms/numbers/${encodeURIComponent(campaignId)}`;
    const response = await apiClient.post(url, requestBody);
    return response.data;
}