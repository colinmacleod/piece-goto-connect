import { PieceAuth, OAuth2AuthorizationMethod } from '@activepieces/pieces-framework';
import axios from 'axios';

interface TokenRequest {
    tokenUrl: string;
    clientId: string;
    clientSecret: string;
    code: string;
    redirectUri: string;
    grantType?: string;
}

export const gotoConnectAuth = PieceAuth.OAuth2({
    description: 'OAuth2 Authentication for GoTo Connect',
    authUrl: 'https://authentication.logmeininc.com/oauth/authorize',
    tokenUrl: 'https://authentication.logmeininc.com/oauth/token',
    required: true,
    scope: [],
    authorizationMethod: OAuth2AuthorizationMethod.HEADER
});

export interface OAuth2Props {
    description: string;
    authUrl: string;
    tokenUrl: string;
    required?: boolean;
    scope?: string[];
    pkce?: boolean;
    validate?: (props: OAuth2Props) => Promise<void>;
    extra?: Record<string, unknown>;
}

export const obtainAccessToken = async (
    tokenUrl: string,
    params: Record<string, string>,
    basicAuth?: { username: string; password: string }
) => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/x-www-form-urlencoded',
    }

    if (basicAuth) {
        const basicAuthToken = Buffer.from(
            `${basicAuth.username}:${basicAuth.password}`
        ).toString('base64')
        headers['Authorization'] = `Basic ${basicAuthToken}`
    }

    const response = await axios.post(tokenUrl, params, { headers })
    return response.data
}