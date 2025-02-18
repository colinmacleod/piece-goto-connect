# GoTo Connect Piece for ActivePieces

This piece _attempts_  to provide integration with GoTo Connect's API, allowing you to send SMS messages through your GoTo Connect account. 

It is still a WIP and not functional.

## Authentication

The piece uses OAuth2 authentication with GoTo Connect. You will need:
1. A GoTo Connect account
2. An OAuth2 application registered with GoTo Connect
   - Client ID
   - Client Secret
   - Redirect URI (configured to your ActivePieces instance)

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

I tested it on a self-hosted instance, running ActivePieces v0.44.0.

### Known Issues
1. The from number selection dropdown is not working, so the piece is not functional.

### Version History
- 0.1.x: Added "from" number selection dropdown
- 0.0.x: Initial implementation with basic ActivePieces piece framework (not functional)

## Support
For issues or questions, please contact:
- Author: Colin MacLeod
- Repository: [https://github.com/colinmacleod/piece-goto-connect] 