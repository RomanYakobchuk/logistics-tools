import {
    IAvailableNumbersResponse,
    ICampaignForm,
    ICampaignsResponse,
    ICampaignServicesResponse,
    INumbersResponse,
    IServiceNumbers,
    ICampaignNumbers,
    IPhoneNumberPurchaseResponse,
    IPurchasePhoneNumberRequest
} from "@/interfaces/sms";
import apiClient from "@/lib/api/api-client";
import {GetSmsMessagesParams, SmsMessage, SmsMessagesResponse} from "@/interfaces/messages";


export const getAvailableNumbers = async (areaCode: string, countryCode: string, page: number, pageSize: number): Promise<IAvailableNumbersResponse> => {
    const response = await apiClient.get(`/api/sms/numbers/available?areaCode=${areaCode}&countryCode=${countryCode}&page=${page}&pageSize=${pageSize}`);
    return response.data;
}

export const getCampaignNumbers = async (campaignId: string): Promise<ICampaignNumbers> => {
    try {
        const response = await apiClient.get(`/api/sms/numbers/${encodeURIComponent(campaignId)}`);
        const data = response.data;

        return {
            type: 'campaign',
            campaignName: data.campaignName,
            count: data.count,
            stats: data.stats,
            items: data.items || data.numbers || [],
            services: data.services || data.servicesSummary || []
        } as ICampaignNumbers;
    } catch (error) {
        console.error('Error fetching campaign numbers:', error);
        throw error;
    }
}

export const getServiceNumbers = async (campaignId: string, serviceId: string): Promise<IServiceNumbers> => {
    try {
        const response = await apiClient.get(
            `/api/sms/numbers/${encodeURIComponent(campaignId)}?service=${encodeURIComponent(serviceId)}`
        );
        const data = response.data;

        return {
            type: 'service',
            service: data.service,
            count: data.count,
            items: data.items || []
        } as IServiceNumbers;
    } catch (error) {
        console.error('Error fetching service numbers:', error);
        throw error;
    }
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
    const response = await apiClient.get(`/api/sms/companies/campaigns`);
    return response.data;
}

export const createCampaign = async (data: ICampaignForm) => {
    const response = await apiClient.post(`/api/sms/campaigns`, data);
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

interface SendSmsParams {
    from: string;
    to: string;
    message: string;
    campaignId: string;
    serviceSid: string;
}
/*eslint-disable*/
export const sendSms = async (params: SendSmsParams): Promise<any> => {
/*eslint-enable*/
    const {from, to, message, campaignId, serviceSid} = params;

    const response = await apiClient.post(`/api/sms/campaigns/${campaignId}/send`, {
        from,
        to,
        message,
        service: serviceSid
    });

    return response.data;
};

export const getSmsMessages = async (
    campaignName: string,
    params?: GetSmsMessagesParams
): Promise<SmsMessagesResponse> => {
    try {
        const response = await apiClient.get(`/api/sms/messages/${campaignName}`, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching SMS messages:', error);
        throw error;
    }
};

export const getSingleSmsMessage = async (
    campaignName: string,
    messageSid: string
): Promise<SmsMessage | null> => {
    try {
        const response = await apiClient.get(`/api/sms/messages/${campaignName}`, {
            params: { message: messageSid }
        });

        const data = response.data;

        // Check if the response is a single message
        if (data && data.sid) {
            return data as SmsMessage;
        }

        return null;
    } catch (error) {
        console.error('Error fetching single SMS message:', error);
        throw error;
    }
};