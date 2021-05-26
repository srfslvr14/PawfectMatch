"""
This file defines actions, i.e. functions the URLs are mapped into
The @action(path) decorator exposed the function at URL:

    http://127.0.0.1:8000/{app_name}/{path}

If app_name == '_default' then simply

    http://127.0.0.1:8000/{path}

If path == 'index' it can be omitted:

    http://127.0.0.1:8000/

The path follows the bottlepy syntax.

@action.uses('generic.html')  indicates that the action uses the generic.html template
@action.uses(session)         indicates that the action uses the session
@action.uses(db)              indicates that the action uses the db
@action.uses(T)               indicates that the action uses the i18n & pluralization
@action.uses(auth.user)       indicates that the action requires a logged in user
@action.uses(auth)            indicates that the action requires the auth object

session, db, T, auth, and tempates are examples of Fixtures.
Warning: Fixtures MUST be declared with @action.uses({fixtures}) else your app will result in undefined behavior
"""

from py4web import action, request, abort, redirect, URL
from yatl.helpers import A
from .common import db, session, T, cache, auth, logger, authenticated, unauthenticated, flash
from py4web.utils.url_signer import URLSigner
from .models import get_user_email, get_user
from py4web.utils.form import Form, FormStyleBulma

url_signer = URLSigner(session)

@action('index', method=["GET", "POST"])
@action.uses(url_signer, auth, auth.user, 'index.html')
def index():

    returning_user = db(db.dbuser.auth == get_user() ).select().first()
    if returning_user is None: # user has no entry
        db.dbuser.insert(
            auth = get_user(),
            first_name = auth.current_user.get('first_name'),
            last_name = auth.current_user.get('last_name'),
            user_email = get_user_email(),
            curr_dog_index = 1,
        )

    return dict(
        # This is the signed URL for the callback.
        update_idx_url = URL('update_idx', signer=url_signer),
        get_user_idx_url = URL('get_user_idx', signer=url_signer),
        set_curr_dogs_url = URL('set_curr_dogs', signer=url_signer),
        get_curr_dogs_url = URL('get_curr_dogs', signer=url_signer),
        add_match_url = URL('add_match',signer=url_signer),
        get_curr_matches_url = URL('get_curr_matches',signer=url_signer),
    )

@action('matches', method=["GET", "POST"])
@action.uses(db, session, auth.user, 'matches.html')
def matches(userID=None):
    return dict()

# Shingo 5/25 
# ====================================================


@action('get_curr_matches', method="GET")
@action.uses(url_signer.verify(), db, session, auth.user)
def get_curr_matches():
    match_id = request.json.get('match_id')
    pup_id = request.params.get('pup_id')
    assert pup_id is not None

    # get user's curr_dogs list, and dog in that list with pup_id id
    user = db(db.dbuser.auth == get_user()).select().first()
    users_currdogs = db(db.curr_dogs.user_owned == user).select()
    fished_pup = db((db.dog.dog_id == pup_id) & (
        db.dog.list_in in users_currdogs)).select().first()
    assert fished_pup is not None
    return dict()
# ====================================================

@action('profile', method="GET")
@action.uses(db, session, auth.user, 'profile.html')
def profile(userID=None):
    return dict()

@action('update_idx', method="POST")
@action.uses(url_signer.verify(), db, session, auth.user)
def update_idx():
    idx = request.json.get('disp_cards_idx')
    assert idx is not None
    # if(idx is None):
    #     print("idx is none: ", idx)
    db( db.dbuser.auth == get_user() ).update(
        curr_dog_index = idx
    )
    return "ok"

# Shingo 5/25
# ====================================================
@action('add_match', method="POST")
@action.uses(url_signer.verify(), db, session, auth.user)
def add_match():
    match = request.json.get('match')
    assert match is not None
    match_id = match["id"]
    match_photo = match["image"]
    match_name = match["name"]
    user = db(db.dbuser.auth == get_user()).select().first()
    assert user is not None
    db.recent_matches.insert(
            user_owned=user,
            dog_index=match_id,
            dog_name=match_name,
            dog_images=match_photo,
    )
    matched = db(db.recent_matches.dog_index == match_id)
    return "ok"
# ====================================================

@action('get_user_idx', method="GET")
@action.uses(url_signer.verify(), db, session, auth.user)
def get_user_idx():
    
    user = db((db.dbuser.auth == get_user() )).select().first()
    assert user is not None
    return dict(user_index=user.curr_dog_index)
 
@action('set_curr_dogs', method='POST')
@action.uses(url_signer.verify(), db, session, auth.user)
def set_curr_dogs():

    # Should take in 20 current pup card information 
    # should also take in the current index 
    # insert 20 dogs into the dog db
    # in turn, adding those 20 dogs into the curr_dogs data base

    user = db(db.dbuser.auth == get_user()).select().first()

    new_pup_cards = request.json.get('new_pup_cards')
    assert new_pup_cards is not None
    # print(new_pup_cards)

    # delete the current curr_dogs list owned by the user
    # TODO DOES NOT DELETE DOGS IN DATABASE, CASCADE NO GO
    db(db.curr_dogs.user_owned == user).delete()
    db(db.dog).delete()

    pup_index = 1
    for pup in new_pup_cards:
        curr_entry = db.curr_dogs.insert(
            user_owned=user,
            dog_index=pup_index,
        )
        # print (pup)
        db.dog.insert(
            list_in=curr_entry,
            dog_id=pup["id"],
            dog_name=pup["name"],
            dog_photos=pup["image"],
            dog_breed=pup["breed"],
            dog_age=pup["age"],
            dog_gender=pup["gender"],
            dog_size=pup["size"],
            dog_fur=pup["fur"],
            dog_potty=pup["potty"],
            dog_kid=pup["kid"],
            dog_location=pup["location"],
            dog_url=pup["url"],
            dog_compscore=0,
        )
        pup_index = pup_index+1

    # db(db.curr_dogs.user_owned == user).delete()    
    # db(db.dog).delete()


@action('get_curr_dogs')
@action.uses(url_signer.verify(), db, session, auth.user)
def get_curr_dogs():
    
    # 1. get currdog from the id and userID
    # 2. if next-up db is empty,
    #   3. loop through match-history and calculate prefrneces of the user, and store them into user-pref db
    #   4. make an API call to fill it with 20 new dogs that fufill the prefrences just calculated 
    # 5. pop off #1, and store it as currdog

    pup_id = request.params.get('pup_id')
    assert pup_id is not None

    # get user's curr_dogs list, and dog in that list with pup_id id
    user = db(db.dbuser.auth == get_user()).select().first()
    users_currdogs = db(db.curr_dogs.user_owned == user).select()
    fished_pup = db( (db.dog.dog_id == pup_id) & (db.dog.list_in in users_currdogs) ).select().first()
    assert fished_pup is not None

    return dict(
        dog_id      =fished_pup.dog_id,
        dog_name    =fished_pup.dog_name,
        dog_breed   =fished_pup.dog_breed,
        dog_age     =fished_pup.dog_age,
        dog_gender  =fished_pup.dog_gender,
        dog_size    =fished_pup.dog_size,
        dog_fur     =fished_pup.dog_fur,
        dog_potty   =fished_pup.dog_potty,
        dog_kid     =fished_pup.dog_kid,
        dog_location=fished_pup.dog_location,
        dog_url     =fished_pup.dog_url,
        dog_compscore=fished_pup.dog_compscore,
        dog_photos  =fished_pup.dog_photos
        )
