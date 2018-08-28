__author__ = 'zak'
import uuid
from statement_builder import socialmedia_builder, pretty_print_json
from settings import xapi_settings
from lrs import LRS
import os
import sqlite3
import hashlib
import bencode

# lrsClient = LRS('uts_cic_clattoolkit', 'uts_cic_clattoolkit_2018##', lrs_host='https://clatoolkit.lrs.io/xapi/statements/')


"""
importer.py

A collection of functions that build an xAPI statement for a target xAPI verb/object, currently implemented:

    - insert_share
    - insert_post
    - insert_like
    - insert_comment
    - insert_commit
    - insert_file
    - insert_issue
    - insert_task
    - insert_added_object
    - insert_updated_object
    - insert_closedopen_object
    - insert_mention
    - insert_attach
    - insert_bookmark
    - insert_remove
"""
def store_scrape(stmt):

  md5 = hashlib.md5(bencode.bencode(stmt)).hexdigest()
  print "STORE SCRAPE"
  with sqlite3.connect(os.getcwd() + "/previousimports.db") as conn:
    c = conn.cursor()
    c.execute("INSERT INTO imports VALUES ('"+md5+"')")
    # c.execute("UPDATE imports SET last_time = '"+timestamp+"' WHERE platform = '"+platform+"' AND unit_code = '"+unit+"'")
    conn.commit()

    print "AFTER COMMIT: %s" % c.execute("SELECT * FROM imports").fetchall()

def check_ifnotinlocallrs(stmt):

    md5 = hashlib.md5(bencode.bencode(stmt)).hexdigest()

    with sqlite3.connect(os.getcwd() + "/previousimports.db") as conn:
      c = conn.cursor()
      # print "SELECT last_time FROM imports WHERE unit_code = '"+unit+"' AND platform = '"+platform+"'"
      c.execute("SELECT * FROM imports WHERE hash = '" + md5 + "'")
      res = c.fetchall()

      print "RES: %s" % res

      return len(res) == 0

def get_uuid4():
    return str(uuid.uuid4())

def insert_share(lrsClient, user, post_id, share_id, comment_message, comment_created_time, unit, object_type, parent_object_type,
                 platform, platform_url, tags=(), parent_user=None, parent_external_user=None, other_contexts = []):
    # if check_ifnotinlocallrs(unit, platform, comment_created_time):
        # Setup statement builder parameters and lrs using default lrs. TODO: Institutions required in xapi maybe?
        #lrs_client = LRS_Auth(provider_id=unit.get_lrs_id())
    account_name = user.userprofile.get_username_for_platform(platform)
    _parent_user = parent_user if parent_user else parent_external_user
    statement_id = get_uuid4()

    stm = socialmedia_builder(verb=xapi_settings.VERB_SHARED, platform=platform,
      account_name=account_name, account_homepage=platform_url, object_type=object_type,
      object_id=share_id, message=comment_message, parent_id=post_id, parent_object_type=parent_object_type,
      timestamp=comment_created_time, unit=unit, tags=tags, other_contexts = other_contexts)
    jsn = stm.to_json()
        # Transfer xapi to lrs TODO: add lrs

def insert_post(lrsClient, user, post_id, message, created_time, unit, platform, platform_url, tags=()):
    # verb = 'created'
    verb = xapi_settings.VERB_CREATED

    # Setup statment builder with param and build lrs using defualt rs
    # lrs_client = LRS_Auth(provider_id=unit.get_lrs_id())
    account_name = user
    statement_id = get_uuid4()

    # Transfer xapi to lrs of cache for later
    stm = socialmedia_builder(verb=verb, platform=platform, account_name=account_name,
                              account_homepage=platform_url, object_type=xapi_settings.OBJECT_NOTE,
                              object_id=post_id, message=message, timestamp=created_time, unit=unit, tags=tags)
    jsn = stm.to_json()


    if check_ifnotinlocallrs(jsn):
        print "STMT: %s" % jsn
        store_scrape(jsn)
        return lrsClient.send_statement(jsn)
        # SOCIAL RELATIONSHIP STUFF
        #for tag in tags:
        #    if tag[0] == "@":
        #        # If the user exists, use their user object else reference them as an external user
        #        #if username_exists(tag[1:], unit, platform):
        #            to_user = get_user_from_screen_name(tag[1:], platform)
        #            external_user = None
        #        else:
        #            to_user = None
        #            external_user = tag[1:]


def insert_like(lrsClient, user, object_id, message, unit, platform, platform_url, parent_id, parent_object_type,
                created_time=None,
                parent_user=None, parent_user_external=None):
    verb = xapi_settings.VERB_LIKED

    #if check_ifnotinlocallrs(unit, platform, created_time):
        #lrs_client = LRS_Auth(provider_id=unit.get_lrs_id())
    account_name = user
    statement_id = get_uuid4()
#
    # lrs = LearningRecord(unit=unit, verb=verb, platform=platform, user=user,
    #                      platformid=object_id, message=message, platformparentid=object_id, parent_user=parent_user,
    #                      parent_user_external=parent_user_external, datetimestamp=created_time)
    #lrs = LearningRecord(unit=unit, verb=verb, platform=platform, user=user,
    #                     platformid=object_id, platformparentid=object_id, parent_user=parent_user,
    #                     datetimestamp=created_time)
    #lrs.save()
#
    #sr = SocialRelationship(verb=verb, from_user=user, to_user=parent_user,
    #                        to_external_user=parent_user_external, platform=platform, message=message,
    #                        datetimestamp=created_time, unit=unit, platformid=object_id)
    #sr.save()

    # Send xAPI to LRS
    stm = socialmedia_builder(verb=verb, platform=platform,
                              account_name=account_name, account_homepage=platform_url,
                              object_type=xapi_settings.OBJECT_NOTE, object_id=object_id, message=message,
                              parent_id=parent_id, parent_object_type=parent_object_type,
                              timestamp=created_time, unit=unit)
    jsn = stm.to_json()
        #status, content = lrs_client.transfer_statement(user.id, statement=jsn)

def insert_comment(lrsClient, user, post_id, comment_id, comment_message, comment_created_time, unit, platform, platform_url,
                   parent_user=None, parent_user_external=None, other_contexts=[]):
    
    
    # if check_ifnotinlocallrs(unit, platform, comment_created_time):
        ##lrs_client = LRS_Auth(provider_id=unit.get_lrs_id())

    account_name = user
    statement_id = get_uuid4()

    stm = socialmedia_builder(verb=xapi_settings.VERB_COMMENTED, platform=platform,
                              account_name=account_name, account_homepage=platform_url,
                              object_type=xapi_settings.OBJECT_NOTE,
                              object_id=comment_id, message=comment_message, parent_id=post_id,
                              parent_object_type=xapi_settings.OBJECT_NOTE,
                              timestamp=comment_created_time, unit=unit, other_contexts=other_contexts)

    jsn = stm.to_json()
    if check_ifnotinlocallrs(jsn):
        store_scrape(jsn)
        return lrsClient.send_statement(jsn)
        #status, content = lrs_client.transfer_statement(user.id, statement=jsn)

def insert_commit(lrsClient, user, parent_id, commit_id, message, committed_time, unit, platform, platform_url,
                  tags=[], other_contexts=[]):
    #if check_ifnotinlocallrs(unit, platform, created_time):
    verb = xapi_settings.VERB_CREATED
    object_type = xapi_settings.OBJECT_COLLECTION
    parent_obj_type = xapi_settings.OBJECT_COLLECTION

    #lrs_client = LRS_Auth(provider_id=unit.get_lrs_id())
    account_name = user
    statement_id = get_uuid4()

    stm = socialmedia_builder(verb=verb, platform=platform,
                              account_name=account_name, account_homepage=platform_url, object_type=object_type,
                              object_id=commit_id, message=message, parent_id=parent_id,
                              parent_object_type=parent_obj_type,
                              timestamp=committed_time, unit=unit, tags=tags, other_contexts=other_contexts)

    jsn = stm.to_json()

    if check_ifnotinlocallrs(jsn):
        store_scrape(jsn)
        return lrsClient.send_statement(jsn)
        #status, content = lrs_client.transfer_statement(user.id, statement=jsn)

def insert_file(lrsClient, user, parent_id, file_id, message, committed_time, unit, platform, platform_url, verb,
                tags=[], other_contexts=[]):
    # if check_ifnotinlocallrs(unit, platform, created_time):
    obj = xapi_settings.OBJECT_FILE
    parent_obj_type = xapi_settings.OBJECT_COLLECTION

    #lrs_client = LRS_Auth(provider_id=unit.get_lrs_id())
    account_name = user
    statement_id = get_uuid4()

    stm = socialmedia_builder(verb=verb, platform=platform,
                              account_name=account_name, account_homepage=platform_url, object_type=obj,
                              object_id=file_id, message=message, parent_id=parent_id,
                              parent_object_type=parent_obj_type,
                              timestamp=committed_time, unit=unit, tags=tags, other_contexts=other_contexts)

    jsn = stm.to_json()

    if check_ifnotinlocallrs(jsn):
        store_scrape(jsn)
        return lrsClient.send_statement(jsn)
        #status, content = lrs_client.transfer_statement(user.id, statement=jsn)

def insert_issue(lrsClient, user, issue_id, verb, object_type, parent_object_type, message, from_name, from_uid, created_time,
                 unit, parent_id, platform, platform_id, account_homepage, shared_displayname=None, tags=[],
                 other_contexts=[]):
    #if check_ifnotinlocallrs(unit, platform, created_time):
        #lrs_client = LRS_Auth(provider_id=unit.get_lrs_id())
    account_name = user
    statement_id = get_uuid4()

    stm = socialmedia_builder(verb=verb, platform=platform,
                              account_name=from_uid, account_homepage=account_homepage, object_type=object_type,
                              object_id=issue_id, message=message, parent_id=parent_id,
                              parent_object_type=parent_object_type,
                              timestamp=created_time, unit=unit, tags=tags, other_contexts=other_contexts)

    jsn = stm.to_json()

def insert_task(lrsClient, user, task_id, task_name, task_created_time, unit, platform, platform_url, parent_id=None,
                other_contexts=[]):
    #if check_ifnotinlocallrs(unit, platform, task_created_time):
        #lrs_client = LRS_Auth(provider_id=unit.get_lrs_id())
        account_name = user
        statement_id = get_uuid4()

        stm = socialmedia_builder(verb=xapi_settings.VERB_CREATED, platform=platform,
                                  account_name=account_name, account_homepage=platform_url,
                                  object_type=xapi_settings.OBJECT_TASK,
                                  object_id=task_id, message=task_name, parent_id=parent_id,
                                  timestamp=task_created_time, unit=unit,
                                  other_contexts=other_contexts)

        jsn = stm.to_json()
        if check_ifnotinlocallrs(jsn):
            print("Sending statement:")
            print(pretty_print_json(jsn))
            store_scrape(jsn)
            return lrsClient.send_statement(jsn)
        #status, content = lrs_client.transfer_statement(user.id, statement=jsn)

        # maybe we can capture commenting behaviours between user/card somehow?

def insert_added_object(lrsClient, user, target_id, object_id, object_text, obj_created_time, unit, platform, platform_url,
                        obj_type, parent_user_external=None, other_contexts=[]):
    # if check_ifnotinlocallrs(unit, platform, obj_created_time):
        #lrs_client = LRS_Auth(provider_id=unit.get_lrs_id())
    account_name = user
    statement_id = get_uuid4()

    stm = socialmedia_builder(verb=xapi_settings.VERB_ADDED, platform=platform,
                              account_name=account_name, account_homepage=platform_url,
                              object_type=obj_type, object_id=object_id, message=object_text, parent_id=target_id,
                              parent_object_type=xapi_settings.OBJECT_TASK, timestamp=obj_created_time,
                              unit=unit, other_contexts=other_contexts)

    jsn = stm.to_json()
        #status, content = lrs_client.transfer_statement(user.id, statement=jsn)

def insert_updated_object(lrsClient, user, object_id, object_message, obj_update_time, unit, platform, platform_url,
                          obj_type, parent_id=None, obj_parent_type=None, other_contexts=[]):
    #if check_ifnotinlocallrs(unit, platform, obj_updated_time):
        #lrs_client = LRS_Auth(provider_id=unit.get_lrs_id())
    account_name = user
    statement_id = get_uuid4()

    stm = socialmedia_builder(verb=xapi_settings.VERB_UPDATED, platform=platform,
                              account_name=account_name, account_homepage=platform_url,
                              object_type=obj_type, object_id=object_id, message=object_message,
                              parent_id=parent_id,
                              parent_object_type=obj_parent_type, timestamp=obj_update_time,
                              unit=unit, other_contexts=other_contexts)

    jsn = stm.to_json()
        #status, content = lrs_client.transfer_statement(user.id, statement=jsn)

def insert_closedopen_object(lrsClient, user, object_id, object_message, obj_update_time, unit, platform, platform_url,
                             obj_type, verb, parent_id=None, obj_parent_type=None, other_contexts=[], platform_id=None):
    check_id = object_id
    if platform_id:
        check_id = platform_id

    #if check_ifnotinlocallrs(unit, platform, obj_updated_time):
        #lrs_client = LRS_Auth(provider_id=unit.get_lrs_id())
    account_name = user
    statement_id = get_uuid4()

    stm = socialmedia_builder(verb=verb, platform=platform,
                              account_name=account_name, account_homepage=platform_url,
                              object_type=obj_type, object_id=object_id, message=object_message,
                              parent_id=parent_id,
                              parent_object_type=obj_parent_type, timestamp=obj_update_time,
                              unit=unit, other_contexts=other_contexts)

    jsn = stm.to_json()

def insert_mention(lrsClient, user, parent_id, mention_id, message, mentioned_datetime, unit, object_type, parent_object_type,
                   platform, platform_url, tags=(), parent_user=None, parent_external_user=None, other_contexts=[]):
    verb = xapi_settings.VERB_MENTIONED
    
    #if check_ifnotinlocallrs(unit, platform, mentioned_datetime):
        # Setup statement builder parameters and lrs using default lrs. TODO: Institutions required in xapi maybe?


    account_name = user
    statement_id = get_uuid4()

    # Send xapi to lrs or cache for later
    stm = socialmedia_builder(verb=verb, platform=platform,
                              account_name=account_name, account_homepage=platform_url, object_type=object_type,
                              object_id=mention_id, message=message, parent_id=parent_id,
                              parent_object_type=parent_object_type,
                              timestamp=mentioned_datetime, unit=unit, tags=tags, other_contexts=other_contexts)

    jsn = stm.to_json()

def insert_attach(lrsClient, user, parent_id, object_id, message, mentioned_datetime, unit, object_type, parent_object_type,
                  platform, platform_url, tags=(), parent_user=None, parent_external_user=None, other_contexts=[]):
    verb = xapi_settings.VERB_ATTACHED
    #if check_ifnotinlocallrs(unit, platform, mentioned_datetime):
    account_name = user
    statement_id = get_uuid4()

    stm = socialmedia_builder(verb=verb, platform=platform,
                              account_name=account_name, account_homepage=platform_url, object_type=object_type,
                              object_id=object_id, message=message, parent_id=parent_id,
                              parent_object_type=parent_object_type,
                              timestamp=mentioned_datetime, unit=unit, tags=tags, other_contexts=other_contexts)

    jsn = stm.to_json()

def insert_bookmark(lrsClient, user, parent_id, object_id, message, bookmark_datetime, unit, object_type, parent_object_type,
                    platform, platform_url, other_contexts=[]):
    verb = xapi_settings.VERB_BOOKMARKED
    #if check_ifnotinlocallrs(unit, platform, bookmark_datetime):

    account_name = user
    statement_id = get_uuid4()

    stm = socialmedia_builder(verb=verb, platform=platform,
                              account_name=account_name, account_homepage=platform_url, object_type=object_type,
                              object_id=object_id, message=message, parent_id=parent_id,
                              parent_object_type=parent_object_type,
                              timestamp=bookmark_datetime, unit=unit, other_contexts=other_contexts)

    jsn = stm.to_json()

def insert_remove(lrsClient, user, object_id, message, datetime, unit, object_type, platform, platform_url,
                  other_contexts=[]):
    verb = xapi_settings.VERB_REMOVED
    #if check_ifnotinlocallrs(unit, platform, datetime):

    account_name = user
    statement_id = get_uuid4()

    stm = socialmedia_builder(verb=verb, platform=platform,
                              account_name=account_name, account_homepage=platform_url, object_type=object_type,
                              object_id=object_id, message=message, timestamp=bookmark_datetime, unit=unit,
                              other_contexts=other_contexts)

    jsn = stm.to_json()
