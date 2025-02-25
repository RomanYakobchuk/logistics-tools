import { NextRequest, NextResponse } from 'next/server';
import { generateOrders } from '@/lib/order-generator';

import { MoveType, Status } from "@/types";

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

interface Distribution {
    [key: string]: number;
}

interface ErrorResponse {
    message: string;
    info?: Record<string, string>;
}

interface ValidationResult<T> {
    isValid: boolean;
    value?: T;
    error?: ErrorResponse;
}

const REQUIRED_MOVE_TYPES: MoveType[] = [
    'Commercial Move',
    'Intrastate Move',
    'Junk Removal',
    'Labor Only',
    'Local Move',
    'Long Distance Move'
];

const REQUIRED_STATUSES: Status[] = [
    'Booked',
    'Dead',
    'Follow Up',
    'New'
];


const validateCount = (count: string | null): ValidationResult<number> => {
    if (!count) {
        return {
            isValid: false,
            error: {
                message: 'Missing required parameter',
                info: {
                    count: 'Number of orders is required'
                }
            }
        };
    }

    const numCount = Number(count);
    if (isNaN(numCount)) {
        return {
            isValid: false,
            error: {
                message: 'Invalid parameter value',
                info: {
                    count: 'Value must be a valid number'
                }
            }
        };
    }

    if (numCount <= 0 || numCount > 20000) {
        return {
            isValid: false,
            error: {
                message: 'Invalid parameter value',
                info: {
                    count: 'Value must be between 1 and 20,000'
                }
            }
        };
    }

    return {
        isValid: true,
        value: numCount
    };
};


const validateDistributionFormat = (
    moveTypeDistribution: string | null,
    statusDistribution: string | null
): ValidationResult<{ parsedMoveType?: Distribution; parsedStatus?: Distribution }> => {
    try {
        const parsedDistributions: { parsedMoveType?: Distribution; parsedStatus?: Distribution } = {};

        if (moveTypeDistribution) {
            const parsedMove = JSON.parse(moveTypeDistribution) as Distribution;
            const missingMoveTypes = REQUIRED_MOVE_TYPES.filter(type => !(type in parsedMove));

            if (missingMoveTypes.length > 0) {
                return {
                    isValid: false,
                    error: {
                        message: 'Missing required move types',
                        info: {
                            moveType: `Distribution must include all move types: ${missingMoveTypes.join(', ')}`
                        }
                    }
                };
            }
            parsedDistributions.parsedMoveType = parsedMove;
        }

        if (statusDistribution) {
            const parsedStatus = JSON.parse(statusDistribution) as Distribution;
            const missingStatuses = REQUIRED_STATUSES.filter(status => !(status in parsedStatus));

            if (missingStatuses.length > 0) {
                return {
                    isValid: false,
                    error: {
                        message: 'Missing required statuses',
                        info: {
                            status: `Distribution must include all statuses: ${missingStatuses.join(', ')}`
                        }
                    }
                };
            }
            parsedDistributions.parsedStatus = parsedStatus;
        }

        return {
            isValid: true,
            value: parsedDistributions
        };
    } catch (e) {
        console.error(e);
        return {
            isValid: false,
            error: {
                message: 'Invalid distribution format',
                info: e instanceof SyntaxError && moveTypeDistribution
                    ? { moveType: 'Distribution values must be valid JSON format and include all required types' }
                    : { status: 'Distribution values must be valid JSON format and include all required statuses' }
            }
        };
    }
};

const validateDistributionValues = (
    parsedMoveType?: Distribution,
    parsedStatus?: Distribution
): ValidationResult<true> => {
    if (parsedMoveType) {
        const invalidValues = Object.entries(parsedMoveType)
            .filter(([_, value]) => typeof value !== 'number' || value < 0 || value > 100);

        if (invalidValues.length > 0) {
            return {
                isValid: false,
                error: {
                    message: 'Invalid distribution values',
                    info: {
                        moveType: `All values must be numbers between 0 and 100. Invalid values found for: ${invalidValues.map(([key]) => key).join(', ')}`
                    }
                }
            };
        }

        const total = Object.values(parsedMoveType).reduce((sum, value) => sum + value, 0);
        if (Math.abs(total - 100) >= 0.01) {
            return {
                isValid: false,
                error: {
                    message: 'Invalid distribution values',
                    info: {
                        moveType: `Distribution percentages must sum to 100%. Current sum: ${total.toFixed(2)}%. Values: ${
                            Object.entries(parsedMoveType)
                                .map(([key, value]) => `${key}: ${value}%`)
                                .join(', ')
                        }`
                    }
                }
            };
        }
    }

    if (parsedStatus) {
        const invalidValues = Object.entries(parsedStatus)
            .filter(([_, value]) => typeof value !== 'number' || value < 0 || value > 100);

        if (invalidValues.length > 0) {
            return {
                isValid: false,
                error: {
                    message: 'Invalid distribution values',
                    info: {
                        status: `All values must be numbers between 0 and 100. Invalid values found for: ${invalidValues.map(([key]) => key).join(', ')}`
                    }
                }
            };
        }

        const total = Object.values(parsedStatus).reduce((sum, value) => sum + value, 0);
        if (Math.abs(total - 100) >= 0.01) {
            return {
                isValid: false,
                error: {
                    message: 'Invalid distribution values',
                    info: {
                        status: `Distribution percentages must sum to 100%. Current sum: ${total.toFixed(2)}%. Values: ${
                            Object.entries(parsedStatus)
                                .map(([key, value]) => `${key}: ${value}%`)
                                .join(', ')
                        }`
                    }
                }
            };
        }
    }

    return {
        isValid: true,
        value: true
    };
};

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const count = searchParams.get('count');
        const pickupState = searchParams.get('pickupState');
        const moveType = searchParams.get('moveType');
        const status = searchParams.get('status');

        const countValidation = validateCount(count);
        if (!countValidation.isValid) {
            return NextResponse.json(countValidation.error, { status: 400 });
        }

        const distributionFormatValidation = validateDistributionFormat(moveType, status);
        if (!distributionFormatValidation.isValid) {
            return NextResponse.json(distributionFormatValidation.error, { status: 400 });
        }

        const { parsedMoveType, parsedStatus } = distributionFormatValidation.value!;
        const distributionValuesValidation = validateDistributionValues(parsedMoveType, parsedStatus);
        if (!distributionValuesValidation.isValid) {
            return NextResponse.json(distributionValuesValidation.error, { status: 400 });
        }

        const orders = await generateOrders(
            countValidation.value!,
            pickupState?.toUpperCase() || undefined,
            parsedMoveType,
            parsedStatus
        );

        return NextResponse.json(orders);
    } catch (error) {
        console.error('Error generating orders:', error);
        return NextResponse.json(
            {
                message: 'Failed to generate orders',
                info: {
                    details: error instanceof Error ? error.message : 'An unexpected error occurred'
                }
            },
            { status: 500 }
        );
    }
}