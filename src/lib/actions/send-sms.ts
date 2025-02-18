import { createAction, Property, OAuth2PropertyValue, DropdownState } from '@activepieces/pieces-framework';
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
            options: async (props): Promise<DropdownState<string>> => {
                // Debug what we receive
                const debugInfo = {
                    auth_type: typeof props.auth,
                    auth_keys: props.auth ? Object.keys(props.auth) : 'auth is undefined',
                    props_keys: Object.keys(props)
                };
                
                console.debug('[GoToConnect] Dropdown props:', debugInfo);

                // First get the account info
                try {
                    const token = (props.auth as OAuth2PropertyValue).access_token;
                    const accountResponse = await httpClient.sendRequest({
                        method: HttpMethod.GET,
                        url: 'https://api.getgo.com/admin/rest/v1/me',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json'
                        }
                    });

                    console.debug('[GoToConnect] Account Response:', accountResponse.body);

                    if (!accountResponse.body.accountKey) {
                        console.error('[GoToConnect] No accountKey in response:', accountResponse.body);
                        return {
                            disabled: false,
                            options: [{
                                label: 'Error: Could not get account key',
                                value: 'error_no_account_key'
                            }]
                        };
                    }

                    // Then get the phone numbers
                    const response = await httpClient.sendRequest({
                        method: HttpMethod.GET,
                        url: `https://api.goto.com/voice-admin/v1/phone-numbers?pageSize=100&accountKey=${accountResponse.body.accountKey}`,
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json'
                        }
                    });

                    console.debug('[GoToConnect] API Response:', response.body);
                    
                    return {
                        disabled: false,
                        options: response.body.items.map((number: any) => ({
                            label: number.number,
                            value: number.number
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
        const token = (context.auth as OAuth2PropertyValue).access_token;
        return await httpClient.sendRequest({
            method: HttpMethod.POST,
            url: 'https://api.jive.com/messaging/v1/messages',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: {
                ownerPhoneNumber: context.propsValue.from,
                contactPhoneNumbers: context.propsValue.to,
                body: context.propsValue.message
            }
        });
    }
});
