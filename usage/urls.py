from django.conf.urls import patterns, url

urlpatterns = patterns(
    'usage.views',
    url( r'^usage-by-projects/$', 'project_usage', name='project_usage' ),
    url( r'^utilization/$', 'utilization', name='utilization' ),
    url( r'^user/$', 'user_select', name='user_select' ),
    url(r'^template/(?P<resource>[-_.\w]+?)\.html/$', 'usage_template', name='usage_template'),
    url( r'^denied/$', 'denied', name='denied' ),
    #json endpoints below
    url( r'^projects/$', 'get_projects_json', name='get_projects_json' ),
    url( r'^projects/user/(?P<username>[-_.\w]+)/$', 'get_projects_json', name='get_projects_json' ),
    url( r'^projects/(?P<project_id>\d+)/users/$', 'get_project_users_json', name='get_project_users_json' ),
    url( r'^usage-by-users/(?P<allocation_id>\d+)/$', 'get_usage_by_users_json', name='get_usage_by_users_json' ),
    url( r'^downtimes/$', 'get_downtimes_json', name='get_downtimes_json' ),
    url( r'^daily-usage/$', 'get_daily_usage_json', name='get_daily_usage_json' ),
    url(r'^user-info/(?P<username>[-_.\w]+)/$', 'get_user_info', name='get_user_info'),
    url(r'^daily-usage-user-breakdown/$', 'get_daily_usage_user_breakdown_json', name='get_daily_usage_user_breakdown_json'),
    url( r'^allocation/(?P<allocation_id>\d+)/$', 'get_allocation_usage_json', name='get_allocation_usage_json' ),
    url( r'^allocation/(?P<allocation_id>\d+)/username/(?P<username>[-_.\w]+)/$', 'get_allocation_usage_json', name='get_allocation_user_usage_json' ),
    url( r'^allocation/(?P<allocation_id>\d+)/username/(?P<username>[-_.\w]+)/queue/(?P<queue>[-_@\w]+)/$', 'get_allocation_usage_json', name='get_allocation_user_queue_usage_json' ),
    url( r'^allocation/(?P<allocation_id>\d+)/queue/(?P<queue>[-_@\w]+)/$', 'get_allocation_usage_json', name='get_allocation_queue_usage_json' ),
)
