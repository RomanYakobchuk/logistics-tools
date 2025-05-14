'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCampaign } from '@/lib/campaign/campaign-context';
import { getSmsMessages } from '@/lib/api/sms-service';
import {
    SmsMessage,
    SmsMessagesListResponse
} from '@/interfaces/messages';
import SmsMessagesList from "@/components/krews/messages/SmsMessagesList";
import SmsMessageDetailModal from "@/components/krews/messages/SmsMessageDetailModal";

export default function SmsMessagesPage() {
    const router = useRouter();
    const { campaign } = useCampaign();
    const searchParams = useSearchParams();

    const [messages, setMessages] = useState<SmsMessage[]>([]);
    const [selectedMessage, setSelectedMessage] = useState<SmsMessage | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalLoading, setIsModalLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [modalError, setModalError] = useState<string | null>(null);
    const [messageSid, setMessageSid] = useState<string | null>(null);

    useEffect(() => {
        const sid = searchParams.get('message');
        setMessageSid(sid);
    }, [searchParams]);

    const fetchMessages = useCallback(async () => {
        if (!campaign) return;

        try {
            setIsLoading(true);
            setError(null);

            const response = await getSmsMessages(campaign.friendlyName);

            if ('messages' in response) {
                const listResponse = response as SmsMessagesListResponse;
                setMessages(listResponse.messages);
            } else {
                setMessages([response as SmsMessage]);
            }
        } catch (err) {
            setError('Failed to fetch messages');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [campaign]);

    const fetchMessageDetails = useCallback(async (sid: string) => {
        if (!campaign) return;

        try {
            setIsModalLoading(true);
            setModalError(null);

            const response = await getSmsMessages(campaign.friendlyName, { message: sid });

            if ('sid' in response) {
                setSelectedMessage(response as SmsMessage);
            } else {
                setModalError('Could not find message details');
            }
        } catch (err) {
            setModalError('Failed to fetch message details');
            console.error(err);
        } finally {
            setIsModalLoading(false);
        }
    }, [campaign]);

    useEffect(() => {
        if (messages.length > 0 && messageSid) {
            const foundMessage = messages.find(m => m.sid === messageSid);

            if (foundMessage) {
                setSelectedMessage(foundMessage);
            } else {
                fetchMessageDetails(messageSid);
            }
        }
    }, [messages, messageSid, fetchMessageDetails]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const handleMessageSelect = (message: SmsMessage) => {
        setSelectedMessage(message);
        setModalError(null);

        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('message', message.sid);
        router.replace(`?${newSearchParams.toString()}`, { scroll: false });
    };

    const handleCloseModal = () => {
        setSelectedMessage(null);
        setModalError(null);

        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete('message');
        router.replace(`?${newSearchParams.toString()}`, { scroll: false });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-50 text-red-800 rounded-md">
                {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">
                SMS Messages {campaign ? `for ${campaign.friendlyName}` : ''}
            </h1>

            <SmsMessagesList
                messages={messages}
                onMessageSelect={handleMessageSelect}
            />

            {(selectedMessage || isModalLoading || modalError) && (
                <SmsMessageDetailModal
                    message={selectedMessage}
                    isLoading={isModalLoading}
                    error={modalError}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}