"use strict";angular.module("underscore",[]).factory("_",function(){return window._}),angular.module("moment",[]).factory("moment",function(){return window.moment}),angular.module("allocationsApp.service",[]),angular.module("allocationsApp",["underscore","moment","allocationsApp.service","ui.bootstrap"]).config(["$interpolateProvider","$httpProvider",function(a,b){a.startSymbol("[[").endSymbol("]]"),b.defaults.headers.common["X-Requested-With"]="XMLHttpRequest",b.defaults.headers.post["Content-Type"]="application/x-www-form-urlencoded",b.defaults.xsrfCookieName="csrftoken",b.defaults.xsrfHeaderName="X-CSRFToken"}]);var app=angular.module("allocationsApp");app.directive("readMore",function(){return{restrict:"A",transclude:!0,replace:!0,template:"<p></p>",scope:{moreText:"@",lessText:"@",words:"@",ellipsis:"@","char":"@",limit:"@",content:"@",textData:"@"},link:function(a,b,c){function d(){var a=i,d=/\s+/gi,j=i.length,k=i.trim().replace(d," ").split(" ").length,l="char",m=j,n=[],o=i,p="";angular.isUndefined(c.words)||(l="words",m=k),"words"===l?(n=i.split(/\s+/),n.length>h&&(i=n.slice(0,h).join(" ")+g,p=n.slice(h,m).join(" "),o=i+e+'<span class="more-text">'+p+f+"</span>")):m>h&&(i=a.slice(0,h)+g,p=a.slice(h,m),o=i+e+'<span class="more-text">'+p+f+"</span>"),b.append(o),b.find(".more-text").hide().removeClass("show-inline"),b.find(".read-more").on("click",function(){$(this).hide(),b.find(".more-text").addClass("show-inline").slideDown()}),b.find(".read-less").on("click",function(){b.find(".read-more").show(),b.find(".more-text").hide().removeClass("show-inline")})}var e=angular.isUndefined(a.moreText)?' <a class="read-more">Read More...</a>':' <a class="read-more">'+a.moreText+"</a>",f=angular.isUndefined(a.lessText)?' <a class="read-less">Less ^</a>':' <a class="read-less">'+a.lessText+"</a>",g=angular.isUndefined(a.ellipsis)?"":a.ellipsis,h=angular.isUndefined(a.limit)?50:a.limit,i=angular.isUndefined(a.textData)?"":a.textData.trim();d()}}}),angular.module("allocationsApp.service").factory("NotificationFactory",["$rootScope","$timeout","_",function(a,b,c){var d={},e={},f={};return d.uuid=function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(a){var b=16*Math.random()|0,c="x"===a?b:3&b|8;return c.toString(16)})},d.addLoading=function(b){f[b]=!0,a.$broadcast("allocation:notifyLoading")},d.removeLoading=function(b){delete f[b],a.$broadcast("allocation:notifyLoading")},d.getMessages=function(){return e},d.getLoading=function(){return f},d.clearMessages=function(b){b=b||"all","all"===b?e={}:e[b]=[],a.$broadcast("allocation:notifyMessage")},d.removeMessage=function(b,d,f){"undefined"!=typeof f&&(b+=f);var g=e[b];!g||g.length<1||(e[b]=c.reject(g,function(a){return a._id===d._id}),a.$broadcast("allocation:notifyMessage"))},d.addMessage=function(c,f,g){var h={};h.body=f,h.type=g,h._id=d.uuid(),"undefined"==typeof e[c]&&(e[c]=[]),e[c].push(h),a.$broadcast("allocation:notifyMessage");var i="danger"===h.type?0:5e3;i>0&&b(function(){d.removeMessage(c,h)},i)},d}]).factory("UtilFactory",["_","moment","NotificationFactory",function(a,b,c){var d={};return d.getClass=function(a){var b=a.status.toLowerCase();return"pending"===b?"label label-warning":"rejected"===b?"label label-danger":"label label-success"},d.isLoading=function(a,b){if(!a||!b)return!1;var d=a+b.id;return"undefined"==typeof c.getLoading()[d]?!1:!0},d.closeMessage=function(a,b,d){d="undefined"==typeof d||null===d?"":d,a+=d,c.removeMessage(a,b)},d.isEmpty=function(b){return"undefined"!=typeof b&&b?angular.isArray(b)&&0===b.length?!0:angular.isObject(b)&&a.isEmpty(b)?!0:!1:!0},d.hasMessage=function(a,b){var c=!1;if("undefined"==typeof a||null===a||a===[]||"undefined"==typeof b||null===b||""===b)return c;for(var d in a)if(a[d].type===b){c=!0;break}return c},d.getMessages=function(a,b){if(!a||!b)return[];var d=a+b.id,e=c.getMessages()[d];return"undefined"!=typeof e&&e.length>0?e:[]},d.search=function(b,c){return c?a.filter(b,function(a){var b=c.toLowerCase(),d=!1,e=a.title||"",f=a.chargeCode||"",g=a.pi||!1;return e.toLowerCase().indexOf(b)>-1?d=!0:f.toLowerCase().indexOf(b)>-1?d=!0:g&&(g.lastName.toLowerCase().indexOf(b)>-1||g.firstName.toLowerCase().indexOf(b)>-1||g.username.toLowerCase().indexOf(b)>-1||g.email.toLowerCase().indexOf(b)>-1)&&(d=!0),d}):angular.copy(b)},d.updateSelected=function(b,c,e){var f=[];for(var g in e)e[g]===!0&&f.push(g.toLowerCase());return c=d.search(b,e.search),0!==f.length?c=a.filter(c,function(b){var c=!1;return a.each(b.allocations,function(b){b.doNotShow=!1;var d=b.status.toLowerCase();a.contains(f,d)?c=!0:b.doNotShow=!0}),c}):a.each(c,function(b){a.each(b.allocations,function(a){a.doNotShow=!1})}),c},d}]).factory("AllocationFactory",["$http","_","moment","NotificationFactory",function(a,b,c,d){var e={};return e.projects=[],e.userProjects=[],e.getAllocations=function(){var b="There was an error loading allocations.";return d.clearMessages("allocations"),d.addLoading("allocations"),a({method:"GET",url:"/admin/allocations/view/",cache:"true"}).then(function(a){d.removeLoading("allocations"),e.projects=a.data},function(){d.addMessage("allocations",b,"danger"),d.removeLoading("allocations")})},e.getUserAllocations=function(b){var c="There was an error loading allocations.";return d.clearMessages("userAllocations"),d.addLoading("userAllocations"),a({method:"GET",url:"/admin/allocations/user/"+b,cache:"true"}).then(function(a){d.removeLoading("userAllocations"),e.userProjects=a.data},function(){d.addMessage("userAllocations",c,"danger"),d.removeLoading("userAllocations")})},e.rejectAllocation=function(b){var c="rejectAllocation"+b.id,e="There was an error rejecting this allocation. Please try again or file a ticket if this seems persistent.";return d.clearMessages(c),d.addLoading(c),a({method:"POST",url:"/admin/allocations/approval/",data:b}).then(function(a){return d.removeLoading(c),"error"===a.data.status?(d.addMessage(c,e,"danger"),null):(d.addMessage(c,"This allocation request is rejected successfully.","success"),a.data.result)},function(){d.removeLoading(c),d.addMessage(c,e,"danger")})},e.approveAllocation=function(b){var c="approveAllocation"+b.id,e="There was an error approving this allocation. Please try again or file a ticket if this seems persistent.";return d.clearMessages(c),d.addLoading(c),a({method:"POST",url:"/admin/allocations/approval/",data:b}).then(function(a){return d.removeLoading(c),"error"===a.data.status?(d.addMessage(c,e,"danger"),null):(d.addMessage(c,"This allocation request is approved successfully.","success"),a.data.result)},function(){d.removeLoading(c),d.addMessage(c,e,"danger")})},e}]),angular.module("allocationsApp").controller("AllocationsController",["$scope","$http","_","$q","$timeout","$modal","$filter",function(a,b,c,d,e,f,g){a.projects=[],a.filteredProjects=[],a.loading={allocations:!0},a.loadingError={allocations:""},a.filter={active:!1,inactive:!1,pending:!1,rejected:!1,search:""},a.reset=function(){a.selectedProjects=a.projects,a.filter.active=!1,a.filter.inactive=!1,a.filter.pending=!1,a.filter.rejected=!1,a.filter.search=""},a.search=function(){return a.filter.search?c.filter(a.projects,function(b){var c=a.filter.search.toLowerCase(),d=!1,e=b.title||"",f=b.chargeCode||"",g=b.pi||!1;return e.toLowerCase().indexOf(c)>-1?d=!0:f.toLowerCase().indexOf(c)>-1?d=!0:g&&(g.lastName.toLowerCase().indexOf(c)>-1||g.firstName.toLowerCase().indexOf(c)>-1||g.username.toLowerCase().indexOf(c)>-1||g.email.toLowerCase().indexOf(c)>-1)&&(d=!0),d}):a.projects},a.updateSelected=function(){var b=[];for(var d in a.filter)a.filter[d]===!0&&b.push(d.toLowerCase());if(a.selectedProjects=a.search(),0!==b.length){var e=c.filter(a.selectedProjects,function(a){var d=!1;return c.each(a.allocations,function(a){a.doNotShow=!1;var e=a.status.toLowerCase();c.contains(b,e)?d=!0:a.doNotShow=!0}),d});a.selectedProjects=e}else c.each(a.selectedProjects,function(a){c.each(a.allocations,function(a){a.doNotShow=!1})})},a.getClass=function(a){var b=a.status.toLowerCase();return"pending"===b?"label label-warning":"rejected"===b?"label label-danger":"label label-success"},b({method:"GET",url:"/admin/allocations/view/",cache:"true"}).then(function(b){a.loading.allocations=!1,a.projects=b.data,a.selectedProjects=b.data},function(b){console.log("There was an error fetching allocations. "+b),a.loadingError.allocations="There was an error loading allocations.",a.loading.allocations=!1});var h=function(a){return Date.UTC(a.getFullYear(),a.getMonth(),a.getDate(),10,0,0,0)};a.approveAllocation=function(a,c){var d=angular.copy(a),e=f.open({templateUrl:"/admin/allocations/template/approval.html/",controller:"modalController",resolve:{data:function(){return{allocation:d,type:"approve"}}}});e.result.then(function(d){c.currentTarget.blur();var e=angular.copy(d.allocation);a.loadingApprove=!0,a.errorApprove=!1,a.successApprove=!1;try{delete e.loadingApprove,delete e.errorApprove,delete e.successApprove,delete e.doNotShow}catch(f){}e.status="Approved",e.start=g("date")(h(e.start),"yyyy-MM-ddTHH:mm:ss")+"Z",e.end=g("date")(h(e.end),"yyyy-MM-ddTHH:mm:ss")+"Z",e.dateReviewed=g("date")(h(new Date),"yyyy-MM-ddTHH:mm:ss")+"Z",b({method:"POST",url:"/admin/allocations/approval/",data:e}).then(function(b){console.log("response.data",b.data),a.loadingApprove=!1,"error"===b.data.status?a.errorApprove=!0:(a.successApprove=!0,a.computeAllocated=e.computeAllocated,a.storageAllocated=e.storageAllocated,a.memoryAllocated=e.memoryAllocated,a.start=e.start,a.end=e.end,a.decisionSummary=e.decisionSummary,a.status=e.status)},function(b){console.log("There was an error approving this allocation. "+b),a.errorApprove=!0,a.loadingApprove=!1})},function(){c.currentTarget.blur()})},a.rejectAllocation=function(a,c){var d=angular.copy(a),e=f.open({templateUrl:"/admin/allocations/template/approval.html/",controller:"modalController",resolve:{data:function(){return{allocation:d,type:"reject"}}}});e.result.then(function(d){c.currentTarget.blur();var e=angular.copy(d.allocation);a.loadingReject=!0,a.errorReject=!1,a.successReject=!1;try{delete e.loadingReject,delete e.errorReject,delete e.successReject,delete e.doNotShow}catch(f){}e.status="Rejected",e.dateReviewed=g("date")(h(new Date),"yyyy-MM-ddTHH:mm:ss")+"Z",b({method:"POST",url:"/admin/allocations/approval/",data:e}).then(function(b){console.log("response.data",b.data),a.loadingReject=!1,"error"===b.data.status?a.errorReject=!0:(a.successReject=!0,a.decisionSummary=e.decisionSummary,a.status=e.status)},function(b){console.log("There was an error rejecting this allocation. "+b),a.errorReject=!0,a.loadingReject=!1})},function(){c.currentTarget.blur()})}}]),angular.module("allocationsApp").controller("AllocationsController",["$scope","$http","$timeout","moment","_","$modal","UtilFactory","AllocationFactory","NotificationFactory",function(a,b,c,d,e,f,g,h,i){a.messages=[],a.$on("allocation:notifyMessage",function(){a.messages=i.getMessages()}),a.loading={},a.$on("allocation:notifyLoading",function(){a.loading=i.getLoading()}),a.close=g.closeMessage,a.isEmpty=g.isEmpty,a.hasMessage=g.hasMessage,a.isLoading=g.isLoading,a.getMessages=g.getMessages,a.getClass=g.getClass,a.filter={active:!1,inactive:!1,pending:!1,rejected:!1,search:""},a.reset=function(){a.selectedProjects=a.projects,a.filter.active=!1,a.filter.inactive=!1,a.filter.pending=!1,a.filter.rejected=!1,a.filter.search=""},a.getAllocations=function(){a.projects=[],h.getAllocations().then(function(){a.projects=h.projects,a.selectedProjects=angular.copy(a.projects)})},a.getAllocations(),a.updateSelected=function(){a.selectedProjects=g.updateSelected(a.projects,a.selectedProjects,a.filter)},a.approveAllocation=function(a,b,c){var g=angular.copy(b),i=f.open({templateUrl:"/admin/allocations/template/approval.html/",controller:"modalController",resolve:{data:function(){return{allocation:g,type:"approve"}}}});i.result.then(function(b){c.currentTarget.blur();var f=angular.copy(b.allocation);try{delete f.doNotShow}catch(g){}f.status="Approved",f.start=d(f.start).format("YYYY-MM-DD"),f.end=d(f.end).format("YYYY-MM-DD"),f.dateReviewed=d(new Date).format("YYYY-MM-DD"),h.approveAllocation(f).then(function(b){null!==b&&(a.allocations=e.reject(a.allocations,function(a){return a.id===b.id}),a.allocations.push(b))})},function(){c.currentTarget.blur()})},a.rejectAllocation=function(a,b,c){var g=angular.copy(b),i=f.open({templateUrl:"/admin/allocations/template/approval.html/",controller:"modalController",resolve:{data:function(){return{allocation:g,type:"reject"}}}});i.result.then(function(b){c.currentTarget.blur();var f=angular.copy(b.allocation);try{delete f.doNotShow}catch(g){}f.status="Rejected",f.dateReviewed=d(new Date).format("YYYY-MM-DD"),h.rejectAllocation(f).then(function(b){null!==b&&(a.allocations=e.reject(a.allocations,function(a){return a.id===b.id}),a.allocations.push(b))})},function(){c.currentTarget.blur()})}}]),angular.module("allocationsApp").controller("modalController",["$scope","$modalInstance","$timeout","data",function(a,b,c,d){a.data=d,a.ok=function(){b.close(d)},a.cancel=function(){b.dismiss("cancel")},a.disabled=function(a,b){return!1},a.minStartDate=new Date,a.maxDate=angular.copy(a.minStartDate),a.maxDate=a.maxDate.setFullYear(a.maxDate.getFullYear()+10),a.open={start:!1,end:!1},a.open=function(b,c){b.preventDefault(),b.stopPropagation(),c=c.toLowerCase(),"start"===c?(a.open.start&&(a.open.start=!1),a.open.start=!0):"end"===c&&(a.open.end&&(a.open.end=!1),a.open.end=!0)},a.dateOptions={formatYear:"yy",startingDay:1},a.format="dd-MMMM-yyyy"}]),angular.module("allocationsApp").controller("UserAllocationsController",["$scope","$location","$http","_","UtilFactory","AllocationFactory","NotificationFactory",function(a,b,c,d,e,f,g){a.messages=[],a.$on("allocation:notifyMessage",function(){a.messages=g.getMessages()}),a.loading={},a.$on("allocation:notifyLoading",function(){a.loading=g.getLoading()}),a.close=e.closeMessage,a.isEmpty=e.isEmpty,a.hasMessage=e.hasMessage,a.isLoading=e.isLoading,a.getMessages=e.getMessages,a.getClass=e.getClass,a.filter={active:!1,inactive:!1,pending:!1,rejected:!1,search:""},a.updateSelected=function(){a.selectedProjects=e.updateSelected(a.projects,a.selectedProjects,a.filter)},a.reset=function(){a.selectedProjects=angular.copy(a.projects),a.filter.active=!1,a.filter.inactive=!1,a.filter.pending=!1,a.filter.rejected=!1,a.filter.search=""},a.selections={usernamemodel:"",username:""},a.submitted=!1,a.getUserAllocations=function(){a.projects=[],a.selections.username=a.selections.usernamemodel,b.url("/"+a.selections.username),a.submitted=!0,a.selections.username&&a.selections.username.length>0&&f.getUserAllocations(a.selections.username).then(function(){a.projects=f.userProjects,a.selectedProjects=angular.copy(a.projects)})},a.handleKeyPress=function(b){var c=b.keyCode||b.which;13===c&&a.getUserAllocations()};var h=b.path();h&&(a.selections.usernamemodel=h.substring(1),a.getUserAllocations())}]);