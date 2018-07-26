import requests,json,random,string
GATEWAY_URL="http://localhost:3000"
CLASSROOM_URL="http://localhost:13337"

usr_sm_ids = {
    'twitter': ["433871586", "962973737065709569"],
    'trello': ["54e2e34794740adffc5c9072", "592d222fcd1cadf2f14a06f1"]
}

course_sm_platforms = {
    'twitter': [
        {
            "identifier" : "xlatest",
            "type" : "hashtag",
            "platform" : "twitter",
            "belongs_to" : "5a7afe2df0e81047c419a0ae"
        }
    ],
}

course_user_sm_platforms = {
    'twitter': [
        {
            "identifier" : None,
            "user_sm_identifier": "962973737065709569",
            "type" : "user",
            "platform" : "twitter",
            "belongs_to" : "5a7e5a5f88f10d99de264f23"
        }
    ],
    'trello': [
        {
            "identifier" : "5a8a2ca80b9d2c47402f2d16",
            "type" : "trelloBoardId",
            "platform" : "trello",
            "belongs_to" : "5a7e5a5f88f10d99de264f23"
        },
    ],
}

user_sm_tokens = {
    'twitter': [
        {
            "kind" : "twitter",
            "accessToken" : "433871586-jO2sFEODoL3OpVEuMyLX5KbV81RWTTLvxhf3DfLU",
            "accessSecret" : "LehlsQ8sga5tG7si1TS8hPW0jaBguKgYQ63vlxKVsr4b1"
        },
        {
            "kind": "twitter",
            "accessToken": "962973737065709569-klFEzQ5nuqWsFSx7XpyAyXBjJYlm8fA",
            "accessSecret": "w11Hn3uGO61wrUJaDOIdEixQuW9m3G7T66MpZ8CduJQad"
        }
    ],
    'trello': [
        {
            "kind" : "trello",
            "accessToken" : "1e287352e69a044599c71a032f8b9ce3de96d9e4f57472ea0c1d6185bc3e1275",
            "accessSecret" : "e85fe3aa5382d458f07792119b31c8b8"
        },
        {
            "kind" : "trello",
            "accessToken" : "3d5c56ec673c7380898bade0413c10618e92ad40bf5494fd76a090b7b1bc20a6",
            "accessSecret" : "d68b5a9e5eee674a2e469ee59b26fbe9"
        }
    ]
}

users = [
    {
        "email": "testuser1@gmail.com",
        "password": "testcla1"
    },
    {
        "email": 'testuser2@gmail.com',
        "password": "testcla1"
    }
]

tasks = {}

def get_user_id(email):
    headers = {'x-clatoolkit-user': user_tokens[email]}
    r = requests.get(GATEWAY_URL+'/get_user_id', params={"user": email}, headers=headers)
    resp = json.loads(r.text)

    return resp['user']

if __name__ == "__main__":
    # Step 1: Sign up accounts to gateway
    tasks['Step 1: Sign up accounts to gateway'] = "success"
    for user in users:
        data = {'email': user['email'], 'confirmEmail': user['email'], 'password': user['password'], 'confirmPassword': user['password']}
        #headers = { 'Content-Type': 'application/json' }
        r = requests.post(GATEWAY_URL+"/auth/signup/", data=data)#, headers=headers)
        if r.status_code > 300:
            print "Error Occurred creating users (status code: %s): %s" % (r.status_code, r.text)
            tasks['Step 1: Sign up accounts to gateway'] = "failed"

    print "Created %s users: %s" % (len(users), [user for user in users])

    # Step 2: Get Gateway auth tokens for users
    user_tokens = {}
    tasks['Step 2: Get Gateway auth tokens for users'] = 'success'
    for user in users:
        data = { 'email': user['email'], 'password': user['password'] }
        #headers = {}
        r = requests.post(GATEWAY_URL+"/auth/login/", data=data)
        #print(r.text)
        resp = json.loads(r.text)
        if r.status_code > 300:
            print "Error Occurred retreiving user gateway auth tokens (status code: %s): %s" % (r.status_code, r.text)
            tasks['Step 2: Get Gateway auth tokens for users'] = 'failed'

        user_tokens[user['email']] = resp['token']

    print "Retreived %s tokens for %s users: \n %s" % (len(user_tokens), len(users), [user_tokens[user['email']] for user in users])

    # Step 3: Associate usr_sm_ids with user accounts
    tasks['Step 3: Associate usr_sm_ids with user accounts'] = 'success'
    for i, user in enumerate(users):
        headers = {'x-clatoolkit-user': user_tokens[user['email']]}
        # Get twitter
        user_token = user_sm_tokens['twitter'][i]
        data = {'accessToken': user_token['accessToken'], 'accessSecret': user_token['accessSecret'], 'kind': user_token['kind'], 'sm_id': usr_sm_ids['twitter'][i]}
        r = requests.post(GATEWAY_URL+"/add_user_token/", headers=headers, data=data)
        # print r.text
        resp = json.loads(r.text)
        if r.status_code > 300:
            print "Error Occurred adding user sm auth tokens (status code: %s): %s" % (r.status_code, r.text)
            tasks['Step 3: Associate usr_sm_ids with user accounts'] = 'failed'

        # Get Trello
        user_token = user_sm_tokens['trello'][i]
        data = {'accessToken': user_token['accessToken'], 'accessSecret': user_token['accessSecret'], 'kind': user_token['kind'], 'sm_id': usr_sm_ids['trello'][i]}
        r = requests.post(GATEWAY_URL+"/add_user_token/", headers=headers, data=data)
        resp = json.loads(r.text)
        if r.status_code > 300:
            print "Error Occurred adding user sm auth tokens (status code: %s): %s" % (r.status_code, r.text)
            tasks['Step 3: Associate usr_sm_ids with user accounts'] = 'failed'

    print "Added auth tokens for %s users" % (len(users))

    # Step 3: Create a course for every user
    courses = []
    tasks['Step 3: Create a course for every user'] = 'success'
    for user in users:
        headers = {'x-clatoolkit-user': user_tokens[user['email']] }
        data = { "course_name": "course created by %s" % user['email'],
                 "course_code": "%s%s%s" % (random.choice(string.ascii_uppercase), random.choice(string.ascii_uppercase), random.choice(string.ascii_uppercase)),
                 "semester": "sem2",
                 "criterion_twitter": "hashTag",
                 "criterion_trello": "userTrelloBoard" }
        r = requests.post(GATEWAY_URL + "/services/classroom/create_course/", headers=headers, data=data)

        print r.text

        resp = json.loads(r.text)
        if r.status_code > 399:
            print "Error Occurred adding courses (status code: %s): %s" % (r.status_code, r.text)
            tasks['Step 3: Create a course for every user'] = 'failed'

        courses.append(resp['course']['_id'])

    print "Added %s courses in classroom with ids: %s" % (len(courses), courses)

    # Step 4: Add members to eachothers courses
    tasks['Step 4: Add members to eachothers courses'] = 'success'
    for user in users:
        headers = {'x-clatoolkit-user': user_tokens[user['email']]}
        data = {'course_user': get_user_id(user['email'])}
        for course in courses:
            r = requests.post(GATEWAY_URL + "/services/classroom/" + course + "/add_member/", headers=headers, data=data)
            resp = json.loads(r.text)
            if r.status_code > 399:
                print "Error Occurred adding user to course (status code: %s): %s" % (r.status_code, r.text)
                tasks['Step 4: Add members to eachothers courses'] = 'failed'

    print "Successfully added users to courses"

    # Step 5: Add sm user platforms to course
    tasks['Step 5: Add sm user platforms to course'] = 'success'
    for i, user in enumerate(users):
        headers = {'x-clatoolkit-user': user_tokens[user['email']]}
        user_id = get_user_id(user['email'])
        # Twitter
        data = {'identifier': None,
                'user_sm_identifier': usr_sm_ids['twitter'][i],
                "type": "userTwitter",
                "belongs_to": user_id,
                "platform": 'twitter'}

        for course in courses:
            r = requests.post(GATEWAY_URL + "/services/classroom/" + course + "/add_user_platform/", headers=headers, data=data)
            if r.status_code > 399:
                print "Error Occurred adding user platform to course (status code: %s): %s" % (r.status_code, r.text)
                tasks['Step 5: Add sm user platforms to course'] = 'failed'

        # Trello
        data = {'identifier': '5a8a2ca80b9d2c47402f2d16',
                'user_sm_identifier': usr_sm_ids['trello'][i],
                "type": "userTrelloBoard",
                "belongs_to": user_id,
                "platform": 'trello'}

        for course in courses:
            print "add trello board"
            r = requests.post(GATEWAY_URL + "/services/classroom/" + course + "/add_user_platform/", headers=headers, data=data)
            if r.status_code > 399:
                print "Error Occurred adding user platform to course (status code: %s): %s" % (r.status_code, r.text)
                tasks['Step 5: Add sm user platforms to course'] = 'failed'

    print "Added user sm platforms to course"

    # Step 6: Add twitter hashtag to courses
    for course in courses:
        headers = {'x-clatoolkit-user': user_tokens[users[0]['email']]}

        data = {'identifier': 'xlatest',
                'user_sm_identifier': course,
                "type": "hashTag",
                "belongs_to": course,
                "platform": 'twitter'}
        r = requests.post(GATEWAY_URL + "/services/classroom/" + course + "/add_platform/", headers=headers, data=data)
        if r.status_code > 399:
            print "Error Occurred adding course platform to course (status code: %s): %s" % (r.status_code, r.text)
            tasks['Step 6: Add twitter hashtag to courses'] = 'failed'

    tasks['Step 6: Add twitter hashtag to courses'] = 'success'
    print "Added twitter hashtag to course"

    print "-----------------------------------------------------"
    print "Setup completed:"
    for key in sorted(tasks.keys()):
        print "%s - %s" % (key, tasks[key])
    print "-----------------------------------------------------"
