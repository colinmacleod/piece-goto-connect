# GoTo Connect Piece for ActivePieces

This piece provides integration with GoTo Connect's API, allowing you to send SMS messages through your GoTo Connect account. 

It should be possible to extend this to use other parts of the GoTo Connect API, such as the voice API or receiving SMS messages.

## Authentication

The piece uses OAuth2 authentication with GoTo Connect. You will need:
1. A GoTo Connect account
2. An OAuth2 application registered with GoTo Connect Developer Console (https://developer.goto.com)
   - Client ID
   - Client Secret
   - Redirect URI (configured to your ActivePieces instance)
   - Required OAuth Scopes:
     * GoToConnect - For sending SMS messages
     * Admin Center - For accessing account's phone numbers

## Available Actions

### Send SMS
Sends an SMS message through your GoTo Connect account.

Required parameters:
- **From**: Phone number to send from (must be a number in your GoTo Connect account)
- **To**: Recipient's phone number
- **Message**: The text message to send

## Development Notes

This piece is built for ActivePieces and requires:
- @activepieces/pieces-framework
- @activepieces/pieces-common

Tested on a self-hosted instance, running ActivePieces v0.44.0.

### Version History
- 0.1.x: Added working SMS functionality with phone number selection
- 0.0.x: Initial implementation with basic ActivePieces piece framework

## Support
For issues or questions, please contact:
- Author: Colin MacLeod
- Repository: [https://github.com/colinmacleod/piece-goto-connect] 