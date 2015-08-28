"use strict";angular.module("underscore",[]).factory("_",function(){return window._}),angular.module("moment",[]).factory("moment",function(){return window.moment}),angular.module("discoveryApp",["underscore","moment","ui.bootstrap","ngClipboard","toggle-switch"]).config(["$interpolateProvider","$httpProvider",function(a,b){a.startSymbol("[[").endSymbol("]]"),b.defaults.headers.common["X-Requested-With"]="XMLHttpRequest",b.defaults.headers.post["Content-Type"]="application/x-www-form-urlencoded",b.defaults.xsrfCookieName="csrftoken",b.defaults.xsrfHeaderName="X-CSRFToken"}]),angular.module("discoveryApp").factory("UtilFactory",["_","moment",function(a,b){var c={},d={smp_size:"# CPUs",smt_size:"# Cores",ram_size:"RAM Size",cache_l1:"Cache L1",cache_l2:"Cache L2",cache_l3:"Cache L3",cache_l1d:"Cache L1d",cache_l1i:"Cache L1i",clock_speed:"Clock Speed",rate:"Rate",size:"Size",humanized_size:"Size",gpu:"GPU",besteffort:"Best Effort","true":"Yes","false":"No"},e={"12 GiB":12587876352,"64 GiB":67445407744,"128 GiB":134956859392,"146 GB":14681573376,"250 GB":250059350016,"400 GB":400088457216,"500 GB":500107862016,"1 TB":0xe8e0db6000,"2 TB":2000398934016},f={"architecture~smt_size:48":"Compute Nodes","storage_devices~16~device:sdq":"Storage Nodes","gpu~gpu":"With GPU",infiniband:"With Infiniband Support","network_adapters~4~interface:InfiniBand":"With Infiniband Support"};return d=a.extend(d,f),c.isShowValTag=function(a,b){return b&&b.length>0&&(a+=":"+b),f[a]?!1:!0},c.isEmpty=function(b){return"undefined"!=typeof b&&b?angular.isArray(b)&&0===b.length?!0:angular.isObject(b)&&a.isEmpty(b)?!0:!1:!0},c.humanizedToBytes=function(a){var b=e[a];return b?b:!a||a.length<4?a:a.indexOf("KiB")>-1?a=1024*parseFloat(a.substring(0,a.length-4),10):a.indexOf("MiB")>-1?a=1024*parseFloat(a.substring(0,a.length-4),10)*1024:a.indexOf("GiB")>-1?a=1024*parseFloat(a.substring(0,a.length-4),10)*1024*1024:a.indexOf("TiB")>-1?a=1024*parseFloat(a.substring(0,a.length-4),10)*1024*1024*1024:a.indexOf("PiB")>-1?a=1024*parseFloat(a.substring(0,a.length-4),10)*1024*1024*1024*1024:a.indexOf("KHz")>-1?a=1e3*parseFloat(a.substring(0,a.length-4),10):a.indexOf("MHz")>-1?a=1e3*parseFloat(a.substring(0,a.length-4),10)*1e3:a.indexOf("GHz")>-1?a=1e3*parseFloat(a.substring(0,a.length-4),10)*1e3*1e3:a.indexOf("THz")>-1?a=1e3*parseFloat(a.substring(0,a.length-4),10)*1e3*1e3*1e3:a.indexOf("PHz")>-1?a=1e3*parseFloat(a.substring(0,a.length-4),10)*1e3*1e3*1e3:a},c.snakeToReadable=function(a,b){var c=a;b&&b.length>0&&(a+=":"+b);var e=d[a];return e?e:(a=c,a+="",a=a.replace(/([_~][a-z\d])/g,function(a){return a=isNaN(parseInt(a[1]))?" "+a[1].toUpperCase():" #"+a[1]}),a.charAt(0).toUpperCase()+a.slice(1))},c.getFormattedDate=function(a,c){if((!c||!c instanceof Date)&&(c=a),!a||!a instanceof Date)return null;var d=b(a).format("YYYY-MM-DD"),e=b(c).format("HH:mm"),f=b(d+" "+e+":00").utc();return b(f).format("YYYY-MM-DD HH:mm")},c}]).factory("ResourceFactory",["$q","$http","_","UtilFactory",function(a,b,c,d){var e={};e.scaleMemory=function(a){for(var b=["Bytes","KiB","MiB","GiB","TiB","PiB"],c=0;a>1024;)a=(a/1024).toFixed(2),c++;return a+" "+b[c]},e.scaleFrequency=function(a){for(var b=["Hz","KHz","MHz","GHz","THz","PHz"],c=0;a>=1e3;)a=(a/1e3).toFixed(2),c++;return a+" "+b[c]},e.formatNode=function(a){delete a.links,delete a.type;try{"undefined"!=typeof a.supported_job_types.besteffort&&null!==a.supported_job_types.besteffort&&(a.supported_job_types.besteffort=a.supported_job_types.besteffort?"yes":"no")}catch(b){}try{"undefined"!=typeof a.supported_job_types.deploy&&null!==a.supported_job_types.deploy&&(a.supported_job_types.deploy=a.supported_job_types.deploy?"yes":"no")}catch(b){}try{"undefined"!=typeof a.gpu.gpu&&null!==a.gpu.gpu&&(a.gpu.gpu=a.gpu.gpu?"yes":"no")}catch(b){}try{"undefined"!=typeof a.monitoring.wattmeter&&null!==a.monitoring.wattmeter&&(a.monitoring.wattmeter=a.monitoring.wattmeter?"yes":"no")}catch(b){}try{"undefined"!=typeof a.processor.cache_l1&&null!==a.processor.cache_l1&&(a.processor.cache_l1=e.scaleMemory(a.processor.cache_l1))}catch(b){}try{"undefined"!=typeof a.processor.cache_l2&&null!==a.processor.cache_l2&&(a.processor.cache_l2=e.scaleMemory(a.processor.cache_l2))}catch(b){}try{"undefined"!=typeof a.processor.cache_l3&&null!==a.processor.cache_l3&&(a.processor.cache_l3=e.scaleMemory(a.processor.cache_l3))}catch(b){}try{"undefined"!=typeof a.processor.cache_l1d&&null!==a.processor.cache_l1d&&(a.processor.cache_l1d=e.scaleMemory(a.processor.cache_l1d))}catch(b){}try{"undefined"!=typeof a.processor.cache_l1i&&null!==a.processor.cache_l1i&&(a.processor.cache_l1i=e.scaleMemory(a.processor.cache_l1i))}catch(b){}try{"undefined"!=typeof a.processor.clock_speed&&null!==a.processor.clock_speed&&(a.processor.clock_speed=e.scaleFrequency(a.processor.clock_speed))}catch(b){}try{var d=a.network_adapters;!c.isEmpty(d)&&d.length>0&&c.each(d,function(a){"undefined"!=typeof a.rate&&null!==a.rate&&(a.rate=e.scaleFrequency(a.rate)),"undefined"!=typeof a.mounted&&null!==a.mounted&&(a.mounted=a.mounted?"yes":"no"),"undefined"!=typeof a.management&&null!==a.management&&(a.management=a.management?"yes":"no"),"undefined"!=typeof a.bridged&&null!==a.bridged&&(a.bridged=a.bridged?"yes":"no")})}catch(b){}},e.sites=[],e.allNodes=[],e.filters={},e.prunedAppliedFilters={},e.flatAppliedFilters={};var f=[];e.getResources=function(d,g,h){d.loading=!0,d.loadingError=!1;var i=b({method:"GET",url:"sites.json",cache:"true"}).then(function(i){return e.sites=i.data.items,c.each(e.sites,function(i,j){var k=i.links,l=c.findWhere(k,{rel:"clusters"});if(l){var m=l.href.substring(1)+".json",n=b({method:"GET",url:m,cache:"true"}).then(function(k){return i.clusters=k.data.items,c.each(i.clusters,function(k,l){var m=k.links,n=c.findWhere(m,{rel:"nodes"});if(n){var o=n.href.substring(1)+".json",p=b({method:"GET",url:o,cache:"true"}).then(function(b){return k.nodes=b.data.items,c.each(k.nodes,function(b,c){b.site=i.uid,b.cluster=k.uid,e.formatNode(b),e.allNodes.push(b),j===e.sites.length-1&&l===i.clusters.length-1&&c===k.nodes.length-1&&a.all(f).then(function(){d.loading=!1,g()})}),b},function(a){return d.loadingError=!0,d.loading=!1,h("There was an error fetching nodes."),a});f.push(p)}else d.loadingError=!0,d.loading=!1,h("Node link is missing.")}),k},function(a){return d.loadingError=!0,d.loading=!1,h("There was an error fetching clusters."),a});f.push(n)}else d.loadingError=!0,d.loading=!1,h("Cluster link is missing.")}),i},function(a){return d.loadingError=!0,d.loading=!1,h("There was an error fetching sites."),a});f.push(i)},e.pruneFilters=function(a,b){var f=a;a="undefined"==typeof a?e.filters:a[b];for(var g in a)if(!c.isObject(a[g])||c.isArray(a[g])||d.isEmpty(a[g]))if(c.isArray(a[g])&&!d.isEmpty(a[g])){if(c.isObject(a[g][0]))for(var h=0;h<a[g].length;h++)e.pruneFilters(a[g],h)}else d.isEmpty(a[g])&&delete a[g];else e.pruneFilters(a,g);d.isEmpty(a)&&"undefined"!=typeof b&&delete f[b]},e.flatten=function(a,b){b=b||"";for(var d in a)if(c.isArray(a[d]))for(var f=a[d],g=0;g<f.length;g++){var h=b+d+"~"+g+"~";e.flatten(f[g],h)}else if(c.isObject(a[d])){var i=b+d+"~";e.flatten(a[d],i)}else a[d]===!0&&(b=b.substring(0,b.length-1),e.flatAppliedFilters[b]=d)};var g=function(a,b,d){d="undefined"==typeof d?e.filters:d;for(var f in a)if(a.hasOwnProperty(f))if(c.isArray(a[f])){"undefined"==typeof d[f]&&(d[f]=[]);for(var h=0;h<a[f].length;h++)"undefined"==typeof d[f][h]&&(d[f][h]={}),g(a[f][h],b,d[f][h])}else if(c.isObject(a[f]))"undefined"==typeof d[f]&&(d[f]={}),g(a[f],b,d[f]);else if("type"!==f&&"uid"!==f&&"guid"!==f&&"mac"!==f&&"serial"!==f){var i="";d.hasOwnProperty(f)?(i=a[f],null!==i&&""!==i&&("undefined"==typeof d[f][i]&&(d[f][i]=[]),d[f][i].push(b))):(d[f]={},i=a[f],null!==i&&""!==i&&(d[f][i]=[],d[f][i].push(b)))}};return e.processNodes=function(a){e.filters={},d.isEmpty(a)||(c.each(a,function(a){g(a,a.uid)}),e.pruneFilters())},e}]).factory("UserSelectionsFactory",["moment",function(a){var b={},c=null,d=a();return d.hours(15),d.minutes(0),d=a(d).format("YYYY-MM-DDTHH:mm:ss")+"Z",b.userSelectionsInit=function(){c={startDate:"",startTime:d,endDate:"",endTime:d,minNode:"",maxNode:""}},b.getUserSelections=function(){return null===c&&b.userSelectionsInit(),c},b}]),angular.module("discoveryApp").controller("MainController",["$scope","$http","_","$q","$timeout","ResourceFactory","UtilFactory","UserSelectionsFactory",function(a,b,c,d,e,f,g,h){a.snakeToReadable=g.snakeToReadable,a.isArray=function(a){return c.isArray(a)},a.isObject=function(a){return c.isObject(a)},a.contains=function(a,b){return c.contains(a,b)},a.isShowValTag=g.isShowValTag,a.isEmpty=g.isEmpty,a.changeView=function(){a.showNodes=!a.showNodes},a.isNestedObject=function(a){if(c.isArray(a))return!1;if(c.isObject(a))for(var b in a)return c.isArray(a[b])?!1:c.isObject(a[b])?!0:!1},a.isEmptyArrayNested=function(a){if(!a||!c.isArray(a)||a.length<1)return!0;for(var b=0;b<a.length;b++)if(!c.isEmpty(a[b]))return!1;return!0},a.isArrayOfObjects=function(a){return!c.isArray(a)||c.isEmpty(a)?!1:c.isObject(a[0])?!0:!1},a.shouldDisable=function(b,c){for(var d=null,e=0;e<b.length;e++){var f=b[e];d=null===d?a.appliedFilters[f]:d[f]}return d===!1&&"undefined"!=typeof c&&c!==a.filteredNodesOrg.length&&(d=!0),!d},a.booleanizeFilter=function(b){for(var d in b)if(a.isArrayOfObjects(b[d]))for(var e=b[d].length,f=0;e>f;f++)d+="",a.booleanizeFilter(b[d][f]);else c.isArray(b[d])?b[d]=!1:c.isObject(b[d])&&a.booleanizeFilter(b[d])},a.prune=function(b,d,e){var f=b;b=null===d?b:b[d];for(var h in b)if(!c.isObject(b[h])||c.isArray(b[h])||g.isEmpty(b[h]))if(c.isArray(b[h])&&!g.isEmpty(b[h])){if(c.isObject(b[h][0])){for(var i=b[h].length-1,j=i;j>=0;j--)a.prune(b[h],j,e);c.isEmpty(b[h])&&delete b[h]}}else(g.isEmpty(b[h])||b[h]===!1)&&(c.isArray(b)?e||b.splice(h,1):delete b[h]);else a.prune(b,h,e);g.isEmpty(b)&&"undefined"!=typeof d&&(c.isArray(f)?e||f.splice(d,1):delete f[d])};var i=function(){a.filterSite=a.filters.site,delete a.filters.site,a.filterCluster=a.filters.cluster,delete a.filters.cluster,a.filterArchitecture=a.filters.architecture,delete a.filters.architecture,a.filterGpu=a.filters.gpu,delete a.filters.gpu,delete a.filters.infiniband,a.filterRamSize=a.filters.main_memory.humanized_ram_size,delete a.filters.main_memory.humanized_ram_size,delete a.filters.main_memory.ram_size,c.each(a.filters.storage_devices,function(a){delete a.size}),a.advancedFiltersOrg=angular.copy(a.filters)};f.getResources(a,function(){a.allNodes=f.allNodes,a.filteredNodes=f.allNodes,a.filteredNodesOrg=f.allNodes,f.processNodes(a.allNodes),a.filtersOrg=angular.copy(f.filters),a.filters=angular.copy(f.filters),a.appliedFiltersOrg=angular.copy(f.filters),a.booleanizeFilter(a.appliedFiltersOrg),a.appliedFilters=angular.copy(a.appliedFiltersOrg),i(),a.advancedFilters=angular.copy(a.advancedFiltersOrg)},function(a){console.error(a)}),a.intersectArray=[],a.createIntersectArray=function(b,d,e){b="undefined"==typeof b?a.prunedAppliedFilters:b[d],e="undefined"==typeof d?a.filtersOrg:e[d];for(var f in b)if(!c.isObject(b[f])||c.isArray(b[f])||g.isEmpty(b[f]))if(c.isArray(b[f])&&!g.isEmpty(b[f])){if(c.isObject(b[f][0]))for(var h=b[f].length-1,i=h;i>=0;i--)a.createIntersectArray(b[f],i,e[f])}else b[f]===!0&&(f+="",a.intersectArray.push(e[f]));else a.createIntersectArray(b,f,e)},a.advancedFilter={search:"",allKeys:!1};var j=function(a,b,d){for(var e in a){for(var f=g.snakeToReadable(e).toLowerCase(),h=!1,i=0;i<d.length&&!(h=f.indexOf(d[i])>-1);i++);if(h){if(c.isArray(a[e])&&!g.isEmpty(a[e])&&c.isString(a[e][0])){b=c.extend(b,a);break}b[e]=a[e]}else if(!c.isObject(a[e])||c.isArray(a[e])||g.isEmpty(a[e])){if(c.isArray(a[e])&&!g.isEmpty(a[e])&&c.isObject(a[e][0])){var k=a[e].length-1;b[e]=[];for(var l=k;l>=0;l--)b[e][l]={},j(a[e][l],b[e][l],d)}}else b[e]={},j(a[e],b[e],d)}};a.filterSearch=function(){var b=[];if(c.each(a.advancedFilter.search.split(" "),function(a){a=a.replace(/^\s+ \s+$/g,""),c.isString(a)&&(a=a.toLowerCase()),b.push(a)}),b&&b.length>0){var d={};if(a.advancedFilter.allKeys)for(var e=a.advancedFiltersOrg,f=0;f<b.length;f++){d={};var g=b[f];j(e,d,[g]),a.prune(d,null,!0),e=d}else j(a.advancedFiltersOrg,d,b),a.prune(d,null,!0);a.advancedFilters=d}else a.advancedFilters=angular.copy(a.advancedFiltersOrg)};var k=function(a,b){for(var d in a){var e=a[d];if(!g.isEmpty(e))if(c.isObject(e)&&!c.isArray(e))k(e,b);else if(c.isArray(e)){if(c.isObject(e[0]))for(var f=e.length-1,h=f;h>=0;h--)k(e[h],b)}else if(!c.isObject(e)){c.isString(e)?e=e.toLowerCase():e+="";for(var i=0;i<b.length;i++)if(e.indexOf(b[i])>-1)return!0}}return!1};a.nodeView={search:"",allKeys:!1},a.nodeViewSearch=function(){var b=a.nodeView.search;if(b&&b.length>0){b=b.trim();var d=[];if(c.each(a.nodeView.search.split(" "),function(a){a=a.replace(/^\s+ \s+$/g,""),c.isString(a)?a=a.toLowerCase():a+="",d.push(a)}),a.filteredNodes=a.filteredNodesOrg,a.nodeView.allKeys)for(var e=0;e<d.length;e++){var f=d[e];a.filteredNodes=c.filter(a.filteredNodes,function(a){return k(a,[f])})}else a.filteredNodes=c.filter(a.filteredNodes,function(a){return k(a,d)})}else a.filteredNodes=a.filteredNodesOrg},a.resetFilters=function(){a.filters=angular.copy(a.filtersOrg),a.appliedFilters=angular.copy(a.appliedFiltersOrg),a.prunedAppliedFilters=angular.copy(a.appliedFilters),a.prune(a.prunedAppliedFilters,null,!0),f.prunedAppliedFilters=angular.copy(a.prunedAppliedFilters),a.filteredNodes=f.allNodes,a.filteredNodesOrg=f.allNodes,a.advancedFilter.search="",h.userSelectionsInit(),i(),a.advancedFilters=angular.copy(a.advancedFiltersOrg)},a.removeFilter=function(b,d){var e=b.split("~")||[];c.isNumber(d)&&(d=d.toString());for(var f=a.appliedFilters,g=0;g<e.length;g++){var h=e[g].toLowerCase();f=f[h]}f[d]=!1,a.applyFilter()},a.applyFilter=function(){a.prunedAppliedFilters=angular.copy(a.appliedFilters),a.prune(a.prunedAppliedFilters,null,!0);var b=angular.copy(a.prunedAppliedFilters);f.prunedAppliedFilters=angular.copy(a.prunedAppliedFilters),f.flatAppliedFilters={},f.flatten(b),a.flatAppliedFilters=f.flatAppliedFilters,a.intersectArray=[],a.createIntersectArray();var d=null;a.intersectArray.length>0&&c.each(a.intersectArray,function(a){null===d?d=a:d.length>0&&(d=c.intersection(d,a))}),a.prune(b,null,!1),c.isEmpty(b)?a.filteredNodes=f.allNodes:a.filteredNodes=c.filter(f.allNodes,function(a){return c.contains(d,a.uid)}),f.processNodes(a.filteredNodes),f.filteredNodes=a.filteredNodes,a.filteredNodesOrg=angular.copy(a.filteredNodes),a.filters=angular.copy(f.filters),i(),a.filterSearch()}}]),angular.module("discoveryApp").controller("ModalController",["$scope","$modal","$log","moment","UserSelectionsFactory",function(a,b,c,d,e){a.open=function(){a.userSelections=e.getUserSelections();var c=b.open({animation:!0,templateUrl:"template/reserve_modal.html/",controller:"ModalInstanceCtrl",resolve:{userSelections:function(){return a.userSelections}}});c.result.then(function(b){a.userSelections=b},function(){})}}]),angular.module("discoveryApp").controller("ModalInstanceCtrl",["$scope","$filter","ResourceFactory","UtilFactory","$modalInstance","userSelections",function(a,b,c,d,e,f){a.userSelections=f;var g=c.filteredNodes||c.allNodes;a.maxNodes=g.length,a.showScript=!1,a.scrpt="",a.generateScript=function(){var b=c.prunedAppliedFilters;h(b),a.scrpt?(a.scrpt=a.scrpt.substring(0,a.scrpt.length-2),a.scrpt="climate lease-create --physical-reservation min="+a.userSelections.minNode+",max="+a.userSelections.maxNode+",resource_properties='["+a.scrpt+"]' --start-date \""+d.getFormattedDate(a.userSelections.startDate,a.userSelections.endTime)+'" --end-date "'+d.getFormattedDate(a.userSelections.endDate,a.userSelections.startTime)+'" my-custom-lease'):a.scrpt="climate lease-create --physical-reservation min="+a.userSelections.minNode+",max="+a.userSelections.maxNode+' --start-date "'+d.getFormattedDate(a.userSelections.startDate,a.userSelections.endTime)+'" --end-date "'+d.getFormattedDate(a.userSelections.endDate,a.userSelections.startTime)+'" my-custom-lease',a.showScript=!0};var h=function(b,c){c=c||"";for(var e in b)if(_.isArray(b[e]))for(var f=b[e],g=0;g<f.length;g++){var i=c+e+"."+g+".";h(f[g],i)}else if(_.isObject(b[e])){var j=c+e+".";h(b[e],j)}else b[e]&&b[e]===!0&&(c=c.substring(0,c.length-1),a.scrpt+='"=", "$'+c+'", "'+d.humanizedToBytes(e)+'", ')};a.getScript=function(){return a.scrpt},a.fallback=function(a){console.log("copy",a)},a.ok=function(){e.close(a.userSelections)},a.cancel=function(){e.dismiss("cancel")},a.getMin=function(){return a.userSelections.minNode||1},a.minDate=new Date,a.open={start:!1,end:!1},a.open=function(b,c){b.preventDefault(),b.stopPropagation(),c=c.toLowerCase(),"start"===c?(a.open.start&&(a.open.start=!1),a.open.start=!0):"end"===c&&(a.open.end&&(a.open.end=!1),a.open.end=!0)},a.dateOptions={formatYear:"yy",startingDay:1},a.format="yyyy-MM-dd"}]);