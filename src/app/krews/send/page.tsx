'use client';

import {useState, useEffect} from 'react';
import RequireAuth from '@/components/auth/require-auth';
import {getCampaigns, getCampaignServices, getServiceNumbers, sendSms} from '@/lib/api/sms-service';
import CustomDropdown from '@/components/krews/send/CustomDropDown';
import PhoneInput from '@/components/krews/send/PhoneInput';
import MessageInput from '@/components/krews/send/MessageInput';
import SuccessModal from '@/components/krews/send/SuccessModal';
import ErrorMessage from '@/components/krews/send/ErrorMessage';

interface Campaign {
    id: string;
    name: string;
}

interface Service {
    id: string;
    name: string;
    description: string;
}

interface PhoneNumber {
    id: string;
    name: string;
    description: string;
}

interface SentMessageResponse {
    twilioMessageSid: string;
    status: string;
    to: string;
    from: string | null;
    messagingServiceSid: string | null;
    dateCreated: string;
    direction: string;
}

export default function SendSmsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);

    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedFromNumber, setSelectedFromNumber] = useState<PhoneNumber | null>(null);

    const [toNumber, setToNumber] = useState('');
    const [isToNumberValid, setIsToNumberValid] = useState(false);
    const [message, setMessage] = useState('');

    const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(false);
    const [isLoadingServices, setIsLoadingServices] = useState(false);
    const [isLoadingPhoneNumbers, setIsLoadingPhoneNumbers] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [sentMessageDetails, setSentMessageDetails] = useState<SentMessageResponse | null>(null);

    useEffect(() => {
        loadCampaigns();
    }, []);

    useEffect(() => {
        if (selectedCampaign) {
            loadServices(selectedCampaign.id);
            setSelectedService(null);
            setSelectedFromNumber(null);
            setPhoneNumbers([]);
        } else {
            setServices([]);
        }
    }, [selectedCampaign]);

    useEffect(() => {
        if (selectedCampaign && selectedService) {
            loadPhoneNumbers(selectedCampaign.id, selectedService.id);
            setSelectedFromNumber(null);
        } else {
            setPhoneNumbers([]);
        }
    }, [selectedService]);

    const loadCampaigns = async () => {
        setIsLoadingCampaigns(true);
        setError(null);

        try {
            const response = await getCampaigns();

            if (response.items && response.items.length > 0) {
                const campaignsList = response.items.map(item => ({
                    id: item?.campaign?.friendlyName as string,
                    name: item?.campaign?.friendlyName as string
                }));
                setCampaigns(campaignsList);
            } else {
                setCampaigns([]);
            }
        } catch (err) {
            console.error('Error loading campaigns:', err);
            setError('Failed to load campaigns. Please try again.');
        } finally {
            setIsLoadingCampaigns(false);
        }
    };

    const loadServices = async (campaignId: string) => {
        setIsLoadingServices(true);
        setError(null);

        try {
            const response = await getCampaignServices(campaignId);

            if (response.items && response.items.length > 0) {
                const servicesList = response.items.map(item => ({
                    id: item.sid,
                    name: item.friendlyName,
                    description: item.sid
                }));
                setServices(servicesList);
            } else {
                setServices([]);
            }
        } catch (err) {
            console.error('Error loading services:', err);
            setError('Failed to load services. Please try again.');
        } finally {
            setIsLoadingServices(false);
        }
    };

    const loadPhoneNumbers = async (campaignId: string, serviceId: string) => {
        setIsLoadingPhoneNumbers(true);
        setError(null);

        try {
            const response = await getServiceNumbers(campaignId, serviceId);

            if (response.items && response.items.length > 0) {
                const numbersList = response.items.map(item => ({
                    id: item.phoneNumber,
                    name: item.friendlyName || item.phoneNumber,
                    description: item.phoneNumber
                }));
                setPhoneNumbers(numbersList);
            } else {
                setPhoneNumbers([]);
            }
        } catch (err) {
            console.error('Error loading phone numbers:', err);
            setError('Failed to load phone numbers. Please try again.');
        } finally {
            setIsLoadingPhoneNumbers(false);
        }
    };

    const handleToNumberChange = (value: string, formattedValue: string, isValid: boolean) => {
        setToNumber(value);
        setIsToNumberValid(isValid);
    };

    const handleMessageChange = (value: string) => {
        setMessage(value);
    };

    const handleSendSms = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedCampaign || !selectedService || !selectedFromNumber || !toNumber || !message) {
            setError('Please fill in all fields');
            return;
        }

        if (!isToNumberValid) {
            setError('Please enter a valid phone number');
            return;
        }

        setIsSending(true);
        setError(null);

        try {
            const response = await sendSms({
                from: selectedFromNumber.description,
                to: toNumber,
                message,
                campaignId: selectedCampaign.id,
                serviceSid: selectedService.id
            });

            setSentMessageDetails(response);
            setShowSuccessModal(true);
            setToNumber('');
            setMessage('');
        } catch (err) {
            console.error('Error sending SMS:', err);
            setError('Failed to send SMS. Please try again.');
        } finally {
            setIsSending(false);
        }
    };

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
    };

    const isFormValid = selectedCampaign && selectedService && selectedFromNumber && toNumber && message && isToNumberValid;

    return (
        <RequireAuth>
            <div className="py-6 px-4 max-w-4xl mx-auto">
                <div
                    className="mb-6 bg-gradient-to-r from-blue-600 to-blue-500 py-8 px-6 rounded-lg shadow-lg relative overflow-hidden">
                    <div
                        className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
                    <div
                        className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-8 -mb-8"></div>

                    <div className="relative">
                        <h1 className="text-2xl md:text-3xl font-bold text-white">
                            Send SMS Message
                        </h1>
                        <p className="mt-2 text-blue-100">
                            Configure and send SMS messages from your campaigns
                        </p>
                        <div className="mt-2 h-1 w-20 bg-white rounded-full"></div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <ErrorMessage message={error}/>

                    <form onSubmit={handleSendSms} className="space-y-6">
                        <CustomDropdown
                            label="Campaign"
                            items={campaigns}
                            selectedItem={selectedCampaign}
                            onSelect={setSelectedCampaign}
                            isLoading={isLoadingCampaigns}
                            placeholder="Select a campaign"
                            emptyMessage="No campaigns available"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                            }
                        />

                        <CustomDropdown
                            label="Service"
                            items={services}
                            selectedItem={selectedService}
                            onSelect={setSelectedService}
                            isLoading={isLoadingServices}
                            disabled={!selectedCampaign}
                            placeholder="Select a service"
                            emptyMessage="No services available for this campaign"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                                </svg>
                            }
                        />

                        <CustomDropdown
                            label="From Number"
                            items={phoneNumbers}
                            selectedItem={selectedFromNumber}
                            onSelect={setSelectedFromNumber}
                            isLoading={isLoadingPhoneNumbers}
                            disabled={!selectedService}
                            placeholder="Select a phone number"
                            emptyMessage="No phone numbers available for this service"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                </svg>
                            }
                        />

                        <PhoneInput
                            value={toNumber}
                            onChange={handleToNumberChange}
                        />

                        <MessageInput
                            value={message}
                            onChange={handleMessageChange}
                        />

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={isSending || !isFormValid}
                                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isSending ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                    strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor"
                                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending...
                                    </span>
                                ) : 'Send SMS'}
                            </button>
                        </div>
                    </form>
                </div>

                {
                    selectedService && selectedCampaign && (
                        <SuccessModal
                            isOpen={showSuccessModal}
                            onClose={closeSuccessModal}
                            messageDetails={sentMessageDetails}
                            serviceSid={selectedService?.id}
                            campaignName={selectedCampaign?.name}
                        />
                    )
                }
            </div>
        </RequireAuth>
    );
}