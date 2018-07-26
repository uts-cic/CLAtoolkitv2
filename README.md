# Connected Learning Toolkit V2

*NOTE*: This is not complete and in Active development. Install instructions and further information to come in the following weeks.

Connected Learning Analytics - new architecture version 2

This version of the toolkit decouples class/course/unit setup, social media scraping, and xAPI statement creation from dashboards and analytics functionality of the
prior CLAToolkit. In this way, the Connected Learning toolkit is to become an xAPI Activity provider, where analytics can be created seperately utilising other tool sets.

# Road Map
- Complete CLAToolkit UI:
..- Implement Login (complete)
..- Implement AAF SSO 
..- Implement Class creation "wizard" and social media setup (in progress)
..- Adjust style to comply with Existing dashboard style
- Complete CLAtoolkit-backend:
..- Implement endpoints to support front-end functionality (in progress)
..- Implement social media api Authentication/Token Storage
..- Implement configurable data scraping messaging to queue
- Complete CLAtoolkit-importer:
..- Refine Codebase (upgrade xAPI output to comply with latest xAPI specification)
..- Begin migration to GraphQL based Social Media API data mapping to xAPI 

