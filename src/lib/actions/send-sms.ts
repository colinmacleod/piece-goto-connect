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

                throw new Error('Debug info: ' + JSON.stringify(debugInfo, null, 2));

                // Original code commented out for now
                /*
                const response = await httpClient.sendRequest({
                    method: HttpMethod.GET,
                    url: 'https://api.goto.com/connect/v1/phone-numbers',
                    headers: {
                        'Authorization': `Bearer ${(props.auth as OAuth2PropertyValue).access_token}`
                    }
                });
                */
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
