def get_other_contextActivity(obj_id, obj_type, def_name, def_type):
    ret = {}
    definition = {'name': def_name}
    definition['type'] = def_type
    ret['obj_id'] = obj_id
    ret['obj_type'] = obj_type
    ret['definition'] = definition
    return ret

def user_exists_in_toolkit(usersm_id, unit, platform):
    print "UNIT: %s" % unit
    # matches given usersm_id with all platform users in unit['userPlatforms'][i][userSMId]
    return next((up['username'] for up in unit if up['userSMId'] == usersm_id), None)

    #next(up['userSMId'] == usersm_id for up in unit['userPlatforms']):




    #print "UNIT: %s" % unit
    #for user_platform in unit['attached_user_platforms']:
    #    print 'userplatform["user_sm_id"] == usersm_id: %s == %s: %s' % (user_platform['identifier'], usersm_id, str(user_platform['identifier']) == str(usersm_id))
    #    if str(user_platform['user_sm_identifier']) == str(usersm_id) and user_platform['platform'] == str(platform):
    #        return user_platform['belongs_to']
#
    #return None

    #try:
#
    #    # membership = UnitOfferingMembership.objects.get(user=user, unit=unit)
    #except Exception: #(UserProfile.DoesNotExist, UnitOfferingMembership.DoesNotExist):
    #    return False
