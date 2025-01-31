import { FC } from 'react';
import { ILocationDetails as LocationDetailsType } from '@/types';

interface LocationDetailsProps {
    details: LocationDetailsType | null;
    isVisible?: boolean;
}

const LocationDetails: FC<LocationDetailsProps> = ({
                                                       details,
                                                   }) => {

    return (
        <div className="mt-2 space-y-2 text-xs text-gray-600">
            <div className="grid grid-cols-3 gap-2">
                <div className="bg-blue-50 p-2 rounded-md">
                    <strong>City:</strong>
                    <p className="truncate text-sm">{details?.city || '-'}</p>
                </div>
                <div className="bg-blue-50 p-2 rounded-md">
                    <strong>State:</strong>
                    <p className="truncate text-sm">{details?.state || '-'}</p>
                </div>
                <div className="bg-blue-50 p-2 rounded-md">
                    <strong>Country:</strong>
                    <p className="truncate text-sm">{details?.country || '-'}</p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-50 p-2 rounded-md">
                    <strong>Latitude:</strong>
                    <p className="truncate text-sm">{details?.latitude || '-'}</p>
                </div>
                <div className="bg-blue-50 p-2 rounded-md">
                    <strong>Longitude:</strong>
                    <p className="truncate text-sm">{details?.longitude || '-'}</p>
                </div>
            </div>
        </div>
    );
};

export default LocationDetails;