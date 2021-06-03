"""
This file defines the database models
"""

import datetime
from .common import db, Field, auth, T
from pydal.validators import *


def get_user():
    return auth.current_user.get("id") if auth.current_user else None

def get_user_email():
    return auth.current_user.get('email') if auth.current_user else None

def get_time():
    return datetime.datetime.utcnow()


### Define your table below
#
# db.define_table('thing', Field('name'))
#
## always commit your models to avoid problems later

db.define_table(
    'dbuser',
    Field('auth', 'reference auth_user', ondelete="CASCADE"),
    Field('first_name', requires=IS_NOT_EMPTY()),
    Field('last_name', requires=IS_NOT_EMPTY()),
    Field('user_email', default=get_user_email ),
    Field('curr_dog_index', default=1),
)

db.define_table(
    'user_pref',
    Field('user_owned', 'reference dbuser', ondelete="CASCADE"),
    Field('breed'),
    Field('size'),
    Field('fur_color'),
    Field('age'),
    Field('house_trained'),
    Field('kid_safe'),
    Field('distance', requires=IS_INT_IN_RANGE(0,500)),
    Field('location'),
)

db.define_table(
    'curr_dogs',
    Field('user_owned', 'reference dbuser', ondelete="CASCADE"),
    Field('dog_index'),
    # Field('dog_payload', 'reference dog', ondelete="CASCADE"),
)

db.define_table(
    'dog',
    Field('list_in', 'reference curr_dogs', ondelete="CASCADE"),
    Field('dog_id', requires=IS_NOT_EMPTY()),
    Field('dog_name'),
    Field('dog_breed'),
    Field('dog_age'),
    Field('dog_gender'),
    Field('dog_size'),
    Field('dog_fur'),
    Field('dog_potty'),
    Field('dog_kid'),
    Field('dog_location'),
    Field('dog_url'),
    Field('dog_compscore', 'integer', default=0, requires=IS_INT_IN_RANGE(0,10)),
    Field('dog_photos'),
)

db.define_table(
    'recent_matches',
    Field('user_owned', 'reference dbuser', ondelete="CASCADE"),
    Field('dog_index'),
    Field('dog_name'),
    Field('dog_images'),
)

db.define_table(
    'favorites',
    Field('user_owned', 'reference dbuser', ondelete="CASCADE"),
    Field('table_index'),
    Field('payload_dog', 'reference dog', ondelete="CASCADE"),
)

db.dbuser.id.readable = False
db.dbuser.id.writable = False
db.dbuser.first_name.label = "User First"
db.dbuser.last_name.label = "User Last"

db.commit()
