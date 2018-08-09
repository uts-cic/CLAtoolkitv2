# Connected Learning Toolkit V2

*NOTE*: This codebase is not complete and in Active development. Install instructions and further information to come in the following weeks.

Connected Learning Analytics - new architecture version 2

This version of the toolkit decouples class/course/unit setup, social media scraping, and xAPI statement creation from dashboards and analytics functionality of the
prior CLAToolkit. In this way, the Connected Learning toolkit is to become a genuine xAPI Learning Record Provider (LRP), where analytics can be created seperately utilising other tool sets.

# Road Map
- Complete CLAToolkit UI:
  - ~~Implement Login (complete)~~
  - Implement AAF SSO 
  - Implement Class creation "wizard" and social media setup (in progress - working - needs styling)
  	- Implement Dynamic creation form based on already set-up social media backend endpoints 
  - Add Unit Registration and Social Sign-ups (in progress)
  - Add Edit Unit functionality
  - Adjust style to comply with Existing dashboard style
- Complete CLAtoolkit-backend:
  - Implement endpoints to support front-end functionality (in progress)
  - ~~Implement social media api Authentication/Token Storage (in progress - working for Trello)~~
  - Implement configurable data scraping messaging to queue
- Complete CLAtoolkit-importer:
  - Refine Codebase (upgrade xAPI output to comply with latest xAPI specification)
  - Begin migration to GraphQL based Social Media API data mapping to xAPI

- General
	- Clean up codebase
	- Imeplement unit tests 

