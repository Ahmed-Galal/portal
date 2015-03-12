from django.conf.urls import patterns, include, url
from g5k_discovery.views import DiscoveryView, g5k_json, g5k_html
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
urlpatterns = patterns('',
    url(r'^$', DiscoveryView.as_view(), name='discovery'),
    url(r'^(?P<resource>.+?)\.json$', g5k_json, name='discovery_json'),
    url(r'^template/(?P<resource>.+?)\.html/$', g5k_html, name='discovery_html'),
    #url(r'^(?P<resource>.+?)?/?$', DiscoveryView.as_view(), name='discovery'),
)
urlpatterns += staticfiles_urlpatterns()