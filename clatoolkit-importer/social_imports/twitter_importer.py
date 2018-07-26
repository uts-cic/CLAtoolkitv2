from twython import Twython

from xapi.settings import xapi_settings
from xapi.importer import *
from .utils.user_utils import user_exists_in_toolkit

import dateutil.parser

class TwitterImporter(object):
    """
    TwitterImporter

    Imports tweets with specified hashtag(s) from registered CLAtoolkit users
    """

    platform = xapi_settings.PLATFORM_TWITTER
    platform_url = 'https://twitter.com'

    xapi_verbs = [ xapi_settings.VERB_CREATED, xapi_settings.VERB_SHARED,
                  xapi_settings.VERB_LIKED, xapi_settings.VERB_COMMENTED]

    """
    Constructor
    
    :param message: a decrypted json message that contains:
                    - twitter application key
                    - twitter application secret
                    - retreival_param (list<dict>): with a list of hashtags to retrieve over (currently only supports one hashtag)
                    - unit (dict): the JSON representation of a unit/course within the CLAtoolkit
    """
    def __init__(self, message):
        print message
        self.twitter = Twython(message['app_key'], message['app_secret'], oauth_version=2)
        self.access_token = self.twitter.obtain_access_token()
        self.twitter = Twython(message['app_key'], access_token=self.access_token)

        self.retreival_hashtag = message['retreival_param'][0]['identifier'] # TODO: Support multiple hashtags
        self.unit = message['unit']

    """
    perform_import
    
    Begins the process of importing user tweets with retrieval hastag for a specific course in the CLAtoolkit
    """
    def perform_import(self):
        count = 0
        next_max_id = None
        results = None

        while True:
            try:
                if count == 0:
                    results = self.twitter.search(q=self.retreival_hashtag,count=100, result_type='recent')
                else:
                    results = self.twitter.search(q=self.retreival_hashtag,count=100,max_id=next_max_id, result_type='recent')

                #print "STATUSES: %s" % results['statuses']
                for tweet in results['statuses']:
                    self.insert_tweet(tweet, self.unit)

                if 'next_results' not in results['search_metadata']:
                        break
                else:
                    next_results_url_params = results['search_metadata']['next_results']
                    next_max_id = next_results_url_params.split('max_id=')[1].split('&')[0]
                count += 1
            except KeyError:
                    # When there are no more pages (['paging']['next']), break from the
                    # loop and end the script.
                    break
    """
    insert_tweet
    
    :param tweet: a dict representing tweet and metadata obtained from twitter API
    :param unit: a dict representing a unit/course within the CLAtoolkit
    """
    def insert_tweet(self, tweet, unit):
        message = tweet['text']
        timestamp = dateutil.parser.parse(tweet['created_at'])
        username = tweet['user']['id']
        screen_name = tweet['user']['screen_name']
        fullname = tweet['user']['name']
        post_id = self.platform_url + screen_name + '/status/' + str(tweet['id'])
        retweeted = False
        retweeted_id = None
        retweeted_username = None
        if 'retweeted_status' in tweet:
            retweeted = True
            retweeted_id = self.platform_url + screen_name + '/status/' + str(tweet['retweeted_status']['id'])
            retweeted_username = tweet['retweeted_status']['user']['screen_name']
            # get hashtags
        tags = []
        hashtags = tweet['entities']['hashtags']
        for hashtag in hashtags:
            tag = hashtag['text']
            tags.append(tag)
        # get @mentions
        # favorite_count
        mentions = []
        atmentions = tweet['entities']['user_mentions']
        for usermention in atmentions:
            mention = "@" + str(usermention['screen_name'])
            tags.append(mention)

        user = user_exists_in_toolkit(username, unit, self.platform)
        if user is not None:
            if retweeted:
                retweeted_user = user_exists_in_toolkit(retweeted_username, unit, self.platform)
                if retweeted_user is not None:
                    print("insert share")
                    #insert_share(user, post_id, retweeted_id, message, timestamp, unit, self.platform, self.platform_url, tags=tags, parent_user=retweeted_user)
                else:
                    print("insert share")
                    #insert_share(user, post_id, retweeted_id, message, timestamp, unit, self.platform, self.platform_url, tags=tags, parent_external_user=retweeted_username)
            else:
                print("insert post")
                insert_post(user, post_id, message, timestamp, unit, self.platform, self.platform_url, tags=tags)
