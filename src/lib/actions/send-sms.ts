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
            options: async (propsValue) => {
                // Call GoTo API to get available numbers
                const response = await httpClient.sendRequest({
                    method: HttpMethod.GET,
                    url: 'https://api.goto.com/connect/v1/phone-numbers',
                    headers: {
                        'Authorization': `Bearer ${(propsValue.auth as OAuth2PropertyValue).access_token}`
                    }
                });
                return response.body.numbers.map((number: any) => ({
                    label: number.phoneNumber,
                    value: number.phoneNumber
                }));
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
