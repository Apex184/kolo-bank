import axios from 'axios';
import dotenv from 'dotenv'

dotenv.config()

const Flutterwave = require('flutterwave-node-v3');

const publicKey = process.env.FLW_PUBLIC_KEY || 'public'
const secretKey = process.env.FLW_SECRET_KEY || 'secret'

const flw = new Flutterwave(publicKey, secretKey);

const BASE_API_URL = 'https://api.flutterwave.com/v3';

const bankUrl = `${BASE_API_URL}/banks/NG`;

const options = {
    method: 'GET',
    headers: {
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
    },
};

export const getAllBanksNG = async () => {
    const response = await axios.get(bankUrl, options);
    return response.data;
};

export async function withdraw(details: any) {
    const response = await flw.Transfer.initiate(details);
    return response;
}

export const withdrawalStatus = async ({ id: payload }: any) => {
    const status = await flw.Transfer.get_a_transfer({ id: payload });
    return status;
};
