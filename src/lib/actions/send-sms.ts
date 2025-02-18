import { createAction, Property, OAuth2PropertyValue } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { gotoConnectAuth } from '../auth';

export const sendSms = createAction({
    auth: gotoConnectAuth,
    name: 'send_sms',
    displayName: 'Send SMS',
    description: 'Send an SMS message using GoTo Connect',
    props: {
        from: Property.Dropdown({
            displayName: 'From',
            description: 'Phone number to send SMS from',
            required: true,
            refreshers: [],
            options: async (props) => {
                // Debug what we receive
                const debugInfo = {
                    auth_type: typeof props.auth,
                    auth_keys: props.auth ? Object.keys(props.auth) : 'auth is undefined',
                    props_keys: Object.keys(props)
                };
                
                console.debug('[GoToConnect] Dropdown props:', debugInfo);

                // Handle case when no connection is selected
                if (!props.auth) {
                    return {
                        disabled: false,
                        options: [{
                            label: 'Please select a connection first',
                            value: 'no_connection'
                        }]
                    };
                }

                // Now we can try to fetch the phone numbers
                try {
                    // Debug the token contents
                    const token = (props.auth as OAuth2PropertyValue).access_token;
                    const tokenParts = token.split('.');
                    const tokenPayload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
                    console.debug('[GoToConnect] Token payload:', tokenPayload);

                    // Then get the phone numbers
                    const response = await httpClient.sendRequest({
                        method: HttpMethod.GET,
                        url: 'https://api.goto.com/voice-admin/v1/phone-numbers?pageSize=100',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json'
                        }
                    });

                    console.debug('[GoToConnect] API Response:', response.body);
                    
                    return {
                        disabled: false,
                        options: response.body.numbers.map((number: any) => ({
                            label: number.phoneNumber,
                            value: number.phoneNumber
                        }))
                    };
                } catch (error: unknown) {
                    console.error('[GoToConnect] Error:', error);
                    return {
                        disabled: false,
                        options: [{
                            label: `Error: ${error instanceof Error ? error.message : 'Failed to fetch phone numbers'}`,
                            value: 'error'
                        }]
                    };
                }
            }
        }),
        to: Property.ShortText({
            displayName: 'To',
            description: 'Phone number to send SMS to',
            required: true,
        }),
        message: Property.LongText({
            displayName: 'Message',
            description: 'Message content',
            required: true,
        }),
    },
    async run(context) {
        return await httpClient.sendRequest({
            method: HttpMethod.POST,
            url: 'https://api.goto.com/connect/v1/sms',
            headers: {
                'Authorization': `Bearer ${context.auth.access_token}`,
                'Content-Type': 'application/json'
            },
            body: {
                from: context.propsValue.from,
                to: context.propsValue.to,
                message: context.propsValue.message
            }
        });
    }
});
