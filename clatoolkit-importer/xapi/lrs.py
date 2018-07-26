import base64
import requests
import json


class LRS(object):

    def __init__(self, lrs_key, lrs_secret, lrs_basic_auth=None, lrs_host=None):
        self.lrs_key = lrs_key
        self.lrs_secret = lrs_secret
        self.lrs_basic_auth = lrs_basic_auth if lrs_basic_auth else base64.b64encode(self.lrs_key + ":" + self.lrs_secret)
        self.lrs_host = lrs_host if lrs_host else 'http://54.206.83.184/data/xAPI/statements'


    def get_auth(): 
        return self.lrs_basic_auth

    def send_statement(self, statement):
        headers = {}

        headers['Authorization'] = 'Basic ' + self.lrs_basic_auth
        headers['X-Experience-API-Version'] = '1.0.3'
        headers['Content-Type'] = 'application/json'
        #print headers
        data = json.loads(statement)
        statement_id = json.loads(statement)['id']
        print("STATEMENT ID:")
        print statement_id
        # params = { 'statementId': statement_id }

        print("DATA:")
        print('Basic ' + self.lrs_basic_auth)
        r = requests.post(self.lrs_host, headers=headers, json=data)

        if r.status_code >= 200 and r.status_code < 300:
            return r.text
        else:
            raise Exception("Send statement to LRS failed with status code %s and message %s " % (r.status_code, r.text))