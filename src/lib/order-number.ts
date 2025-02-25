import fs from 'fs/promises';
import path from 'path';

interface CounterData {
    lastOrderNumber: number;
}

const counterFilePath = path.join(process.cwd(), 'data', 'counter.json');
const DEFAULT_NUMBER = 75487;

export async function setNewOrderNumber(newNumber: number): Promise<void> {
    try {
        await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true });

        const counterData: CounterData = { lastOrderNumber: newNumber };

        await fs.writeFile(
            counterFilePath,
            JSON.stringify(counterData, null, 2)
        );
    } catch (error) {
        console.error('Error setting new order number:', error);
        throw error;
    }
}
export async function getCurrentOrderNumber(): Promise<number> {
    try {
        const fileContent = await fs.readFile(counterFilePath, 'utf8');
        const counterData = JSON.parse(fileContent);
        return counterData.lastOrderNumber || DEFAULT_NUMBER;
    } catch (error) {
        console.error('Error managing order number:', error);
        return DEFAULT_NUMBER;
    }
}

export async function resetOrderNumber(): Promise<void> {
    const counterData: CounterData = { lastOrderNumber: 0 };
    await fs.writeFile(counterFilePath, JSON.stringify(counterData, null, 2));
}