import { createPiece } from '@activepieces/pieces-framework';
import { gotoConnectAuth } from './lib/auth';
import { sendSms } from './lib/actions/send-sms';
import { GOTO_CONNECT_ICON } from './lib/common';

export const gotoConnect = createPiece({
    displayName: 'GoTo Connect',
    minimumSupportedRelease: '0.1.26',
    logoUrl: GOTO_CONNECT_ICON,
    authors: ['Colin MacLeod'],
    auth: gotoConnectAuth,
    actions: [sendSms],
    triggers: [],
});