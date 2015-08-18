from django.conf import settings
from django.contrib import messages
from django.contrib.auth import authenticate, login, get_user_model
from django.contrib.auth.forms import AuthenticationForm
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.shortcuts import render

import logging

from openid.consumer import consumer
from openid.consumer.discover import DiscoveryFailure
from openid.extensions import ax, pape, sreg
from openid.store.filestore import FileOpenIDStore

from .models import OpenIDUserIdentity
from .utils import JSONSafeSession, DBOpenIDStore

logger = logging.getLogger(__name__)

def _get_openid_store():
    return DBOpenIDStore()


def _get_consumer(request):
    return consumer.Consumer(JSONSafeSession(request.session), _get_openid_store())

# Create your views here.
def openid_login(request):
    if request.method == 'POST':
        openid_url = request.POST.get('openid_url')
        logger.debug('Attempting OpenID login at %s' % openid_url)
        c = _get_consumer(request)
        try:
            auth_request = c.begin(openid_url)

            sreg_request = sreg.SRegRequest(required=['email', 'nickname'],)
            auth_request.addExtension(sreg_request)

            ax_request = ax.FetchRequest()
            ax_request.add(ax.AttrInfo('http://geni.net/projects',
                                       required=False,
                                       count=ax.UNLIMITED_VALUES))
            ax_request.add(ax.AttrInfo('http://geni.net/user/prettyname', required=False))
            auth_request.addExtension(ax_request)

            trust_root = request.build_absolute_uri(reverse('chameleon_openid:openid_login'))
            return_to = request.build_absolute_uri(reverse('chameleon_openid:openid_callback'))
            url = auth_request.redirectURL(trust_root, return_to)
            return HttpResponseRedirect(url)

        except DiscoveryFailure, e:
            logger.error("OpenID discovery error: %s" % (str(e),))

    return render(request, 'chameleon_openid/login.html')


def openid_callback(request):

    request_args = dict(request.GET.items())
    if request.method == 'POST':
        request_args = dict(request.POST.items())

    if request_args:
        c = _get_consumer(request)
        return_to = request.build_absolute_uri(reverse('chameleon_openid:openid_callback'))
        response = c.complete(request_args, return_to)

        sreg_response = {}
        ax_items = {}
        if response.status == consumer.SUCCESS:
            sreg_response = sreg.SRegResponse.fromSuccessResponse(response)

            ax_response = ax.FetchResponse.fromSuccessResponse(response)
            if ax_response:
                ax_items = {
                    'projects': ax_response.get('http://geni.net/projects'),
                    'full_name': ax_response.get('http://geni.net/user/prettyname'),
                }


            result = {}
            result['status'] = response.status
            result['url'] = response.getDisplayIdentifier()
            result['sreg'] = sreg_response and dict(sreg_response.items())
            result['ax'] = ax_items
            request.session['openid'] = result

            user = authenticate(openid_identity=result['url'])
            if user:
                login(request, user)
                messages.success(request, 'Login success using OpenID.')
                return HttpResponseRedirect(settings.LOGIN_REDIRECT_URL)
            else:
                return HttpResponseRedirect(reverse('chameleon_openid:openid_connect'))

        elif response.status == consumer.CANCEL:
            messages.warning(request, 'OpenID authentication cancelled by user.')
        elif response.status == consumer.FAILURE:
            messages.error(request, 'OpenID authentication failed.')

        if isinstance(response, consumer.FailureResponse):
            logger.error(response.message)

    return HttpResponseRedirect(reverse('chameleon_openid:openid_login'))


def openid_connect(request):
    if 'openid' not in request.session:
        return HttpResponseRedirect(reverse('chameleon_openid:openid_login'))


    openid = request.session['openid']

    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            openid_identity = OpenIDUserIdentity()
            openid_identity.uid = openid['url']
            openid_identity.user = form.get_user()
            openid_identity.save()

            user = authenticate(openid_identity=openid['url'])
            if user:
                login(request, user)
                messages.success(request,
                    'You have successfully connected your OpenID account with your '
                    'Chameleon account. You are now logged in.'
                    )
                return HttpResponseRedirect(settings.LOGIN_REDIRECT_URL)

    else:
        form = AuthenticationForm(request)

    try:
        user = get_user_model().objects.filter(email=openid['sreg']['email'])
    except Exception, e:
        user = None
        logger.error(e)

    context = {
        'form': form,
        'openid': openid,
    }
    if user:
        return render(request, 'chameleon_openid/connect.html', context)
    else:
        return render(request, 'chameleon_openid/connect_or_register.html', context)


def openid_register(request):
    context = {}
    return render(request, 'chameleon_openid/register.html', context)