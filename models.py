"""
This file defines the database models
"""

import datetime
from .common import db, Field, auth, T
from pydal.validators import *


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
    'bird',
    ### TODO: define the fields that are in the json.
    Field('bird_name', requires=IS_NOT_EMPTY()),
    Field('bird_weight', 'integer', default=0, requires=IS_INT_IN_RANGE(0, 1e6)),
    Field('bird_diet', requires=IS_NOT_EMPTY()),
    Field('bird_habitat', requires=IS_NOT_EMPTY()),
    Field('bird_count', 'integer', default=0, requires=IS_INT_IN_RANGE(0, 1e6)),
    Field('seen_by', default=get_user_email),
)

db.bird.id.readable = False
db.bird.seen_by.readable = db.bird.seen_by.writable = False
db.bird.bird_name.label = T('Bird')
db.bird.bird_weight.label = T('Weight')
db.bird.bird_diet.label = T('Diet')
db.bird.bird_habitat.label = T('Habitat')

db.commit()
