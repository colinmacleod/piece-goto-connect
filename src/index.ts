import { createPiece } from '@activepieces/pieces-framework';
import { gotoConnectAuth } from './lib/auth';
import { sendSms } from './lib/actions/send-sms';

export const gotoConnect = createPiece({
    displayName: 'GoTo Connect',
    minimumSupportedRelease: '0.1.26',
    logoUrl: 'https://raw.githubusercontent.com/colinmacleod/piece-goto-connect/main/src/assets/goto-connect-icon.png',
    authors: ['Colin MacLeod'],
    auth: gotoConnectAuth,
    actions: [sendSms],
    triggers: [],
});