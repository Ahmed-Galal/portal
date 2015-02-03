from cms.sitemaps import CMSSitemap
from django.conf.urls import patterns, include, url
from django.core.urlresolvers import reverse_lazy
from django.views.generic import RedirectView
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.contrib import admin
from django.conf import settings

import chameleon.views

urlpatterns = patterns('',

    # admin urls
    url(r'^admin/', include(admin.site.urls)),

    # contrib urls
    url(r'^ckeditor/', include('ckeditor.urls')),
    url(r'^captcha/', include('captcha.urls')),
    url(r'^terms/', include('termsandconditions.urls')),
    url(r'^sitemap\.xml$', 'django.contrib.sitemaps.views.sitemap', {'sitemaps': {'cmspages': CMSSitemap}}),

    # custom urls
    url(r'^login/', 'django.contrib.auth.views.login', name='login'),
    url(r'^logout/', 'django.contrib.auth.views.logout', { 'next_page': '/' }, name='logout'),
    url(r'^register/', RedirectView.as_view(url=reverse_lazy('register'))),
    url(r'^email-confirmation', 'tas.views.email_confirmation'),
    url(r'^password-reset', 'tas.views.password_reset'),
    url(r'^user/', include('tas.urls')),
    url(r'^user/projects/', include('projects.urls')),
    url(r'^help/', include('djangoRT.urls')),

    # cms urls
    url(r'^', include('cms.urls')),
)

if settings.DEBUG:
    urlpatterns = patterns('',
        url(r'^media/(?P<path>.*)$', 'django.views.static.serve',  # NOQA
            {'document_root': settings.MEDIA_ROOT, 'show_indexes': True}),
        ) + staticfiles_urlpatterns() + urlpatterns  # NOQA
