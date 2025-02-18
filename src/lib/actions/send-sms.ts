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
                if (!props.auth) {
                    return [{
                        label: 'Please select a connection first',
                        value: 'no_connection'
                    }];
                }

                console.debug('[GoToConnect] Dropdown props:', {
                    auth_type: typeof props.auth,
                    auth_keys: props.auth ? Object.keys(props.auth) : 'auth is undefined',
                    props_keys: Object.keys(props)
                });

                try {
                    // Call GoTo API to get available numbers
                    const response = await httpClient.sendRequest({
                        method: HttpMethod.GET,
                        url: 'https://api.goto.com/admin/rest/v1/me/numbers',  // Updated endpoint
                        headers: {
                            'Authorization': `Bearer ${(props.auth as OAuth2PropertyValue).access_token}`,
                            'Accept': 'application/json'
                        }
                    });

                    console.debug('[GoToConnect] API Response:', response.body);

                    if (response.status === 404) {
                        return [{
                            label: 'Error: Phone numbers endpoint not found',
                            value: 'error_404'
                        }];
                    }

                    // Check if response.body exists and has numbers
                    if (!response.body || !Array.isArray(response.body.numbers)) {
                        console.error('[GoToConnect] Unexpected API response format:', response.body);
                        return [{
                            label: 'Error: Unexpected API response format',
                            value: 'error_format'
                        }];
                    }

                    return response.body.numbers.map((number: any) => ({
                        label: number.phoneNumber,
                        value: number.phoneNumber
                    }));
                } catch (error: unknown) {
                    console.error('[GoToConnect] Error fetching numbers:', error);
                    return [{
                        label: `Error: ${error instanceof Error ? error.message : 'Failed to fetch phone numbers'}`,
                        value: 'error'
                    }];
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
