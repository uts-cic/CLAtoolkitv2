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
    unix_time = float(unix_time)
    return datetime.fromtimestamp(unix_time)

