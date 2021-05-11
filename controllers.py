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
from .models import get_user_email
from py4web.utils.form import Form, FormStyleBulma

url_signer = URLSigner(session)

@action('index')
@action.uses(db, auth.user, 'index.html')
def index():
    return dict()

@action('matches', method=["GET", "POST"])
@action.uses(db, session, auth.user, 'matches.html')
def matches():
    return dict()

@action('like_dog/<dog_id:int>')
@action.uses(db, session, auth.user)
def liked_currdog(dog_id=None):
    assert dog_id is not None
    # 1. get currdog from the id and userID
    # 2. store currdog into match-history
    # 3. if match-history.len is > 20, pop off #20 and store currdog as #1
    # 4. if next-up db is empty,
    #   5. loop through match-history and calculate prefrneces of the user, and store them into user-pref db
    #   6. make an API call to fill it with 20 new dogs that fufill the prefrences just calculated 
    # 7. pop off #1, and store it as currdog
    print("liked")
    redirect(URL('index'))

@action('dislike_dog/<dog_id:int>')
@action.uses(db, session, auth.user)
def disliked_currdog(dog_id=None):
    assert dog_id is not None
    # 1. get currdog from the id and userID
    # 2. if next-up db is empty,
    #   3. loop through match-history and calculate prefrneces of the user, and store them into user-pref db
    #   4. make an API call to fill it with 20 new dogs that fufill the prefrences just calculated 
    # 5. pop off #1, and store it as currdog
    print("disliked")
    redirect(URL('index'))

