export type LrsModel = {
	name: string;
	endpoint: any;
	config: {
		basic_auth: {
			key: string | undefined;
			secret: string | undefined;
		};
		token: string | undefined;
	};
	auth_type: string;
	lrs_type: string;
};