from isodate.isodatetime import parse_datetime
from datetime import datetime
import pytz


def convert_to_datetime_object(timestr):
    try:
        if isinstance(timestr, datetime):
            return timestr.replace(tzinfo=pytz.UTC)
        else:
            date_object = parse_datetime(timestr)
            return date_object
    except ValueError as e:
        raise ValueError("An error has occurred. Time format does not match. %s -- Error: %s" % (timestr, e.message))


def convert_unixtime_to_datetime(unix_time):
    unix_time = unix_time.split('.')[0] if len(unix_time.split('.')) > 1 else unix_time
    unix_time = int(unix_time)
    d = datetime.fromtimestamp(unix_time, pytz.UTC)
    #s = d.strftime('%Y-%m-%d %H:%M:%S.%f')
    print "FORMATTED DATETIME: %s " % d

    return d

